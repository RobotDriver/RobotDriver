"use strict";

const i2cBus = require("i2c-bus");
const pca9685 = require("pca9685");

const pigpio = require('pigpio');
const gpio = require('pigpio').Gpio;

const WebSocket = require('ws');
const http = require('http');
const net = require('net');
const url = require('url');
const fs = require('fs');
const path = require('path');
const querystring = require('querystring');
const { spawn } = require('child_process');

const httpVideoStreamKey = 'supersecret';
var movementKillTimer = null;

var logEntries = [];
function log(logLine){
	//logEntries.push(logLine);
	console.log(logLine);
}

var config = {};
const configFile = '/boot/robotdriverconfig.json';
var defaultConfigs = {
	httpPort:80, //https://stackoverflow.com/a/23281401
	outputs:{
		drive:{
			type:'l298n',
			pins:{
				'aen':13,
				'ain1':19,
				'ain2':26,
				'ben':16,
				'bin3':20,
				'bin4':21
			}
		}
	}
};
/*{
  "httpPort": 80,
  "outputs": {
    "drive": {
      "type": "pca9685", //adafruit motor board
      "pins": {
        "aen": 13,	//M2 port
        "ain1": 11,
        "ain2": 12,
        "ben": 8,	//M1 port
        "bin3": 10,
        "bin4": 9
      }
    }
  }
}*/
var gpioPins = {};
var pcapwm = {};

function init(){
	showBanner();
	readConfig();
	initHttpServer();
	initHardware();
}
function initgpio(){
	console.log('initgpio');

	pigpio.initialize();
	pigpio.configureClock(10, pigpio.CLOCK_PCM);

	for(const pin in config.outputs.drive.pins){
		gpioPins[pin] = new gpio(config.outputs.drive.pins[pin], {mode: gpio.OUTPUT});
		console.log(`${pin} = ${config.outputs.drive.pins[pin]}`);
	}
}
function initpca9685(){
	console.log('initpca9685');

	if(pcapwm.dispose){
		pcapwm.dispose();
	}
	// PCA9685 options
	let options = {
		i2c: i2cBus.openSync(1),
		//address: 0x40, // generic PCA9685
		address: 0x60, // Adafruit Motor Driver
		frequency: 50
		//debug: true
	};

	pcapwm = new pca9685.Pca9685Driver(options, function(err) {
		if (err) {
			console.error("Error initializing PCA9685");
			process.exit(-1);
			return;
		}

		console.log("PCA9685 Initialized");
		//pwm.setPulseLength(pwmPanChannel, 1500);
		//pwm.setPulseLength(pwmTiltChannel, 1500);
	});
}
function initHardware(){
	console.log('initHardware');
	pigpio.terminate();

	switch(config.outputs.drive.type){
		case 'l298n':
			initgpio();
			break
		case 'pca9685':
			initpca9685();
	}

}

var movingNow = false;
var currentSteeringValue = 500, currentThrottleValue=500;
var newSteeringValue=500, newThrottleValue=500;

const motorMoveInterval = setInterval(() => {

	//if nothings changed do nothing
	if(newSteeringValue === currentSteeringValue && newThrottleValue === currentThrottleValue ){
		return;
	}

	//var hrstart = process.hrtime();
	motorMoveAction(newSteeringValue, newThrottleValue);
	//var hrend = process.hrtime(hrstart);
	//console.info('motorMoveAction: %ds %dms', hrend[0], hrend[1] / 1000000); //1.2 to 2.0ms on i2c @ 400kbps i2c

	currentSteeringValue = newSteeringValue;
	currentThrottleValue = newThrottleValue;
}, 50);

function motorMove(steeringValue, throttleValue){
	newSteeringValue = steeringValue;
	newThrottleValue = throttleValue;

	//if we dont get any movement messages for 500ms from the last message, stop movement
	clearTimeout(movementKillTimer);
	if(newSteeringValue!==500 && newThrottleValue!==500){
		movementKillTimer = setTimeout(() => {
			motorSetPercent(2, 1, 0);
			motorSetPercent(1, 0, 0);
		},500);
	}
}
function motorMoveAction(steeringValue, throttleValue){

	//if steering hard then spin in place
	if(steeringValue >= 800){
		steeringValue -= 800;
		steeringValue /= 200;

		console.log(`motors, turn right ${Math.round(steeringValue*100)}%`);
		motorSetPercent(2, 1, steeringValue);
		motorSetPercent(1, 0, steeringValue);
		return;
	}
	if(steeringValue <= 200){
		steeringValue /= 200;
		steeringValue = 1 - steeringValue;//invert

		console.log(`motors, turn right ${Math.round(steeringValue*100)}%`);
		motorSetPercent(2, 0, steeringValue);
		motorSetPercent(1, 1, steeringValue);
		return;
	}

	if (throttleValue > throttleMidpoint-throttleThreshold && throttleValue < throttleMidpoint+throttleThreshold) {

		console.log('motors, stop');
		motorSetPercent(1, 0, 0);
		motorSetPercent(2, 0, 0);

	} else {

		if (throttleValue >= 500) {
			throttleValue = (throttleValue - 500) / 500;

			console.log(`motors, forward ${Math.round(throttleValue*100)}%`);

			motorSetPercent(1, 1, throttleValue);
			motorSetPercent(2, 1, throttleValue);

		} else {
			throttleValue = (500 - throttleValue) / 500;

			console.log(`motors, reverse ${Math.round(throttleValue*100)}%`);

			motorSetPercent(1, -1, throttleValue);
			motorSetPercent(2, -1, throttleValue);
		}
	}

}
function motorSetPercent(motorNo, direction, throttlePercent){
	switch(config.outputs.drive.type){
		case 'l298n':
			motorSetPercentGpio(motorNo, direction, throttlePercent);
			break
		case 'pca9685':
			motorSetPercentPca(motorNo, direction, throttlePercent);
	}
}

function motorSetPercentGpio(motorNo, direction, throttlePercent){
	let pinPwm, pinin1, pinin2;

	switch (motorNo) {
		default:
			console.log("invalid motor! "+ motorNo);
			return;
		case 1:
			pinPwm = gpioPins.aen;
			pinin1 = gpioPins.ain1;
			pinin2 = gpioPins.ain2;
			break;
		case 2:
			pinPwm = gpioPins.ben;
			pinin1 = gpioPins.bin3;
			pinin2 = gpioPins.bin4;
			break;
	}

	//console.log("throttlePercent = "+(throttlePercent*100));
	if (throttlePercent == 0) {
		//console.log(`motor ${motorNo} stop`);

		pinin1.digitalWrite(false);
		pinin2.digitalWrite(false);
		pinPwm.digitalWrite(false);
	}else{

		if (direction >= 1) {
			//console.log(`motor ${motorNo} forward`);
			pinin1.digitalWrite(false);
			pinin2.digitalWrite(true);
		} else {
			//console.log(`motor ${motorNo} backward`);
			pinin1.digitalWrite(true);
			pinin2.digitalWrite(false);
		}

		//throttlePercent = motorPercentMin + throttlePercent;
		//console.log(`motor ${motorNo} throttle ${Math.floor(throttlePercent*100)}%`);
		let dutyCycle = Math.trunc(Math.min(255,throttlePercent*255));
		//console.log(`pwm duty cycle = ${dutyCycle}`);
		pinPwm.pwmWrite(dutyCycle);
	}
}

function motorSetPercentPca(motorNo, direction, throttlePercent){
	let pinPwm, pinin1, pinin2;

	switch (motorNo) {
		default:
			console.log("invalid motor! "+ motorNo);
			return;
		case 1:
			pinPwm = config.outputs.drive.pins.aen;
			pinin1 = config.outputs.drive.pins.ain1;
			pinin2 = config.outputs.drive.pins.ain2;
			break;
		case 2:
			pinPwm = config.outputs.drive.pins.ben;
			pinin1 = config.outputs.drive.pins.bin3;
			pinin2 = config.outputs.drive.pins.bin4;
			break;
	}

	var onValue = 4096;
	//console.log("throttlePercent = "+(throttlePercent*100));
	if (throttlePercent == 0) {

		pcapwm.channelOff(pinin1);
		pcapwm.channelOff(pinin2);
		pcapwm.channelOff(pinPwm);
	}else{

		if (direction >= 1) {
			pcapwm.channelOn(pinin2);
			pcapwm.channelOff(pinin1);
		} else {
			pcapwm.channelOff(pinin2);
			pcapwm.channelOn(pinin1);
		}

		//throttlePercent = motorPercentMin + throttlePercent;
		//console.log("motor "+motorNo+" throttle % = " + throttlePercent);
		pcapwm.setDutyCycle(pinPwm, throttlePercent);
	}
}

function shutdownPwm(){

	console.log("center all pwm channels");
	pwm.setPulseLength(pwmPanChannel, 1500);
	pwm.setPulseLength(pwmTiltChannel, 1500);

	console.log("stoppnig motors...");
	motorSetPercent(1, 0, 0);
	motorSetPercent(2, 0, 0);

	if(pcapwm.dispose){
		pcapwm.dispose();
		//pcapwm.channelOff(pwmPanChannel);
		//pcapwm.channelOff(pwmTiltChannel);
	}
}

function readConfig(){
	let configFileData;
	if (!fs.existsSync(configFile)) {
		config=defaultConfigs;
		log(`configs file ${configFile} doesn't exist, defaults loaded`);
		return;
	}
	try{
		configFileData = fs.readFileSync(configFile, 'utf8');//, function (err, data) {
	}catch(e){
		config=defaultConfigs;
		log(`read configs from ${configFile} - Error! Unable to read file! Check permissions! Defaults loaded`);
		//console.log(e);
		return;
	}
	try{
		config=JSON.parse(configFileData);
	}catch(e){
		config=defaultConfigs;
		log(`read configs from ${configFile} - Error! File contains invalid json! Defaults loaded`);
		console.log(`--------\r\nBad Config:${configFileData}\r\n--------`);
		return;
	}

	if(!config.hasOwnProperty('httpPort')){
		config=defaultConfigs;
		log(`read configs from ${configFile} - Error! Config missing httpPort, assuming bad! Defaults loaded`);
		console.log(`--------\r\nBad Config:${configFileData}\r\n--------`);
	}else{
		log(`read configs from ${configFile}`);
		console.log(configFileData);
	}
	//});
}
// function updateConfigIndexExists(obj, level,  ...rest) {
// 	//from https://stackoverflow.com/a/2631198
// 	if (obj === undefined) return false
// 	if (rest.length == 0 && obj.hasOwnProperty(level)) return true
// 	return updateConfigIndexExists(obj[level], ...rest)
// }
function updateConfigIndex(obj, is, value) {
	//from https://stackoverflow.com/a/6394168
	if (typeof is == 'string')
		return updateConfigIndex(obj,is.split('.'), value);
	else if (is.length==1 && value!==undefined)
		return obj[is[0]] = value;
	else if (is.length==0)
		return obj;
	else
		return updateConfigIndex(obj[is[0]],is.slice(1), value);
}
function updateConfigFromClient(updateMessage){

	if(updateMessage.hasOwnProperty('key')){
		console.log(`update config key from client - ${updateMessage.key}`);
		console.log(JSON.stringify(updateMessage.config,null,2));
		//if(updateConfigIndexExists(config, updateMessage.key)){
			updateConfigIndex(config,updateMessage.key, updateMessage.config);
		//}else{
		//	console.log(`update config key from client - Error! key does not exist ${updateMessage.key}`);
		//}

	}else{
		console.log(`update full config from client`);
		config = updateMessage.config;
	}

	if(updateMessage.key === 'outputs.drive'){
		initHardware();
	}
	console.log(JSON.stringify(config,null,2));
	writeConfig();
}
function writeConfig(){
	fs.writeFile(configFile, JSON.stringify(config,null,2), (err) => {
		if (err){
			log(`writing configs to ${configFile} - Error! Unable to write file! Check permissions!`);
		}else{
			log(`writing configs to ${configFile}`);
		}
	});
}

var videoServerConnectionCount = 0;
var audioServerConnectionCount = 0;

var FfmpegVideoProcess = null;
var videoRunning = false;

var FfmpegAudioProcess = null;
var audioRunning = false;

var internetVideoStarted = false;
var internetVideoConnection = null;
var internetAudioConnection = null;
var internetVideoReConnectDelayTime = 3000;
var internetVideoUrl = 'vcn2.roboprojects.com:8055';
var internetVideoUrlProtocol = 'http://'
var internetVideoUrlPathVideo = '/sendVideo/';
var internetVideoUrlPathAudio = '/sendAudio/';
var internetVideoUrlKeyString = '?streamKey=';
var internetVideoUrlKey = 'fartbuttpoo';

var internetControlStarted = false;
var internetControlWebSocket = null;
var internetControlUrl = internetVideoUrl;
var internetControlUrlPath = '/control';

var messageLocal = 1;
var messageInternet = 2;



//full range:
//var ServoMax = 2400;
//var ServoMin = 800;
var ServoMax = 2400;
var ServoMin = 800;
var ServoRange = ServoMax - ServoMin;

var ServoTiltMax = 2156;
var ServoTiltMin = 1100;
var ServoTiltRange = ServoTiltMax - ServoTiltMin;

var pwmPanChannel = 15;
var pwmTiltChannel = 14;

var steeringValue = 500; // midpoint - straight foward

var throttleThreshold = 60.0
var throttleMidpoint = 500.0

var motorPercentMin = 0.2; // 20% pwm duty cycle for minimum motor movement
//var motorPwmMax = 4095
//var motorPwmRange = 1000.0
//var motorPwmOffset = motorPwmMax - motorPwmRange

var pwmShootChannel = 1;


const webSocketServer = new WebSocket.Server({ noServer: true });

webSocketServer.on('connection', function connection(ws, req) {

	const ip = req.connection.remoteAddress;
	console.log('connection from ' + ip);

	 ws.on('message', function(message){
	 	handleIncomingControlMessage(ws, message, messageLocal);
	});

	ws.on('close', function clear() {
		console.log('connection closed for ' + ip);
	});

	ws.send('{"connected":true}');
});
function internetVideoStart(url, key){

	if(internetVideoUrl !== url || internetVideoUrlKey !== key){
		internetVideoStop();
	}
	internetVideoUrl = url;
	internetVideoUrlKey = key;

	startVideoProcess();

	internetVideoStarted = true;
	internetVideoConnect();
	internetAudioConnect();
}
function internetVideoStop(){
	internetVideoStarted = false;

	if(internetVideoConnection){
		internetVideoConnection.end();
	}
	internetVideoConnection = null;

	if(internetAudioConnection){
		internetAudioConnection.end();
	}
	internetAudioConnection = null;

	internetVideoStarted = false;
}
function internetVideoReConnectDelay(){
	setTimeout(function(){
		internetVideoConnect();
	}, internetVideoReConnectDelayTime);
}
function internetVideoConnect(){
	if(internetVideoConnection !== null){
		console.log("internetVideoConnect failed, already connected");
		return;
	}
	let url = internetVideoUrlProtocol + internetVideoUrl + internetVideoUrlPathVideo + internetVideoUrlKeyString + internetVideoUrlKey;
	let options = {
		family:4,
		timeout: 0,
		headers:{
			'Transfer-Encoding':'chunked'
		}
	};
	internetVideoConnection = http.request(url, options);
	
	internetVideoConnection.on('socket', function(){
		console.log("internetVideoConnect socket");
	});
	internetVideoConnection.on('connect', function(){
		console.log("internetVideoConnect connected");
	});
	internetVideoConnection.on('aborted', function(){
		console.log("internetVideoConnect aborted");
		internetVideoConnection = null;
	});
	internetVideoConnection.on('close', function(){
		console.log("internetVideoConnect close");
		internetVideoConnection = null;
		internetVideoReConnectDelay();
	});
	internetVideoConnection.on('error', function(){
		console.log("internetVideoConnect error");
		internetVideoConnection = null;
	});
	// internetVideoConnection.on('timeout', function(){
	// 	console.log("internetVideoConnect timeout");
	// 	internetVideoConnection = null;
	// 	internetVideoReConnectDelay();
	// });
	internetVideoConnection.on('response', function(){
		console.log("internetVideoConnect response");
	});
	internetVideoConnection.flushHeaders();
	console.log("internetVideoConnect connecting");
}
function internetVideoSendVideoData(data){

	if(internetVideoConnection === null ){
		return;
	}
	internetVideoConnection.write(data);
}

function internetAudioReConnectDelay(){
	setTimeout(function(){
		internetAudioConnect();
	}, internetVideoReConnectDelayTime);
}
function internetAudioConnect(){
	if(internetAudioConnection !== null){
		console.log("internetAudioConnect failed, already connected");
		return;
	}
	let url = internetVideoUrlProtocol + internetVideoUrl + internetVideoUrlPathAudio + internetVideoUrlKeyString + internetVideoUrlKey;
	let options = {
		family:4,
		timeout: 0,
		headers:{
			'Transfer-Encoding':'chunked'
		}
	};
	internetAudioConnection = http.request(url, options);
	
	internetAudioConnection.on('socket', function(){
		console.log("internetAudioConnect socket");
	});
	internetAudioConnection.on('connect', function(){
		console.log("internetAudioConnect connected");
	});
	internetAudioConnection.on('aborted', function(){
		console.log("internetAudioConnect aborted");
		internetAudioConnection = null;
	});
	internetAudioConnection.on('close', function(){
		console.log("internetAudioConnect close");
		internetAudioConnection = null;
		internetAudioReConnectDelay();
	});
	internetAudioConnection.on('error', function(){
		console.log("internetAudioConnect error");
		internetAudioConnection = null;
	});
	// internetAudioConnection.on('timeout', function(){
	// 	console.log("internetAudioConnect timeout");
	// 	internetAudioConnection = null;
	// 	internetAudioReConnectDelay();
	// });
	internetAudioConnection.on('response', function(){
		console.log("internetAudioConnect response");
	});
	internetAudioConnection.flushHeaders();
	console.log("internetAudioConnect connecting");
}
function internetVideoSendAudioData(data){

	if(internetAudioConnection === null ){
		return;
	}
	internetAudioConnection.write(data);
}



function internetControlStart(){
	internetControlStarted = true;
	internetControlWebSocketConnect();
}
function internetControlStop(){
	internetControlStarted = false;
	internetControlWebSocketClose();
}
function internetControlWebSocketClose(){
	if(internetControlWebSocket !== null ){
		internetControlWebSocket.close();
	}
}
function internetControlWebSocketConnect(){
	if(internetControlStarted === false){
		console.log('internet control websocket, not connecting, internetControlDisabled');
		return;
	}
	if(internetControlWebSocket !== null){
		console.log('internet control websocket, already active');
		return;
	}
	console.log('internet control websocket, connecting to '+internetControlUrl);
	internetControlWebSocket = new WebSocket('ws://'+internetControlUrl+ internetControlUrlPath);
	internetControlWebSocket.on('open', function() {
		console.log('internet control websocket, connection Opened to '+internetControlUrl);
	});
	internetControlWebSocket.on('close', function(code, reason) {
		console.log('internet control websocket, connection Closed '+code+' '+reason);
		internetControlWebSocket = null;
		setTimeout(internetControlWebSocketConnect, 2000);
	});
	internetControlWebSocket.on('error', function(error) {
		console.log('internet control websocket, connection Error ',error.code);
	});

	internetControlWebSocket.on('message', function(message){
		console.log('internet control websocket, msg rcvd: "%s"', message);
		handleIncomingControlMessage(false, message, messageInternet);
	});
}
function InternetControlWebsocketSend(msg){
	if(!internetControlWebSocket || internetControlWebSocket.readyState !== WebSocket.OPEN){
		console.log("internet control websocket, send failed, not connected");
		console.log(msg);
		return;
	}

	internetControlWebSocket.send(msg);
}


function handleIncomingControlMessage(wsp, message, source) {
	var ws = wsp || false;
	//console.log('control, recv: "%s"', message);
	
	let messageJson;
	try{
		messageJson = JSON.parse(message);
	}catch(err) {
		console.log('control,invalid json message');
		return;
	}
	if(!messageJson.action){
		console.log('control, invalid json message, missing action');
		return;
	}
	switch(messageJson.action){
		case "internetVideo":
			if(!messageJson.hasOwnProperty("enabled")){
				console.log('control, internetVideo action, missing enabled');
				return;
			}
			if(!messageJson.hasOwnProperty("server")){
				console.log('control, internetVideo action, missing server');
				return;
			}
			if(!messageJson.hasOwnProperty("key")){
				console.log('control, internetVideo action, missing key');
				return;
			}
			if(messageJson.enabled){
				console.log('control, internetVideo action, enabled');
				internetVideoStart(messageJson.server, messageJson.key);
			}else{
				console.log('control, internetVideo action, disabled');
				internetVideoStop();
			}
			break;
		case "internetControl":
			if(!messageJson.hasOwnProperty("enabled")){
				console.log('control, internetControl action, missing enabled');
				return;
			}
			if(messageJson.enabled){
				console.log('control, internetControl action, enabled');
				internetControlStart();
			}else{
				console.log('control, internetControl action, disabled');
				internetControlStop();
			}
			break;
		case "updateConfig":
			updateConfigFromClient(messageJson);
			break;
		case "stopVideo":
			stopVideoProcess();
			break;
		case "startVideo":
			startVideoProcess();
			break;
		case "readVideoRunning":
			if(ws !== false){
				ws.send('{"cmd":"videoRunning","running":'+(videoRunning === true?1:0)+'}');
			}

			break;
		case "setShoot":
			if(source === messageInternet){
				console.log('disregarding shoot from internet');
				return;
			}
			if(!messageJson.hasOwnProperty('value')){
				console.log('control, setShoot, missing value');
				return;
			}

			return;

			if(messageJson.value >= 1){
				console.log("control, FIRE!");
				pwm.channelOn(pwmShootChannel);
			}else{
				console.log("control, STOP FIRE!");
				pwm.channelOff(pwmShootChannel);
			}

			break;
		// case "setSteering":
		// 	if(!messageJson.hasOwnProperty('value')){
		// 		console.log('invalid json message, missing value');
		// 		return;
		// 	}
		// 	steeringValue = parseInt(messageJson.value);
		// 	break;
		//case "setThrottle":
		case "readConfig":
			ws.send(JSON.stringify({"cmd":"config","config":config}));
			break;
		case "move":
			if(!messageJson.hasOwnProperty('y') || !messageJson.hasOwnProperty('x')){
				console.log('control, move, missing value');
				return;
			}

			//move X is throttle
			//move Y is steering
			motorMove(messageJson.y, messageJson.x);

			break;
		case "setTilt":
			if(!messageJson.hasOwnProperty('value')){
				console.log('control, setTilt, missing value');
				return;
			}
			var servoPercent = messageJson.value / 1000;

			var servoValue = ServoTiltRange * servoPercent + ServoTiltMin;

			console.log('control, setTilt, pwm = '+servoValue);
			//pwm.setPulseLength(pwmTiltChannel, servoValue);
			break;
		case "setPan":
			if(!messageJson.hasOwnProperty('value')){
				console.log('control, setPan, missing value');
				return;
			}
			var servoPercent = messageJson.value / 1000;

			var servoValue = ServoRange * servoPercent + ServoMin;

			console.log('control, setPan, pwm = '+servoValue);
			//pwm.setPulseLength(pwmPanChannel, servoValue);
			break;
		default:
			console.log("control, unknown action!");
			return;
	}
}

const videoServer = new WebSocket.Server({ noServer: true });
videoServer.on('connection', function(socket, upgradeReq) {
	videoServerConnectionCount++;
	console.log(
		'New Video Viewer Connection: ', 
		(upgradeReq || socket.upgradeReq).socket.remoteAddress,
		(upgradeReq || socket.upgradeReq).headers['user-agent'],
		'('+videoServerConnectionCount+' total)'
	);
	socket.on('close', function(code, message){
		videoServerConnectionCount--;
		console.log(
			'Disconnected Video WebSocket ('+videoServerConnectionCount+' total)'
		);
	});
});
function broadcastVideoData(data) {
	videoServer.clients.forEach(function each(clientSocket) {
		if (clientSocket.readyState === WebSocket.OPEN) {
			clientSocket.send(data);
		}
	});
}

const audioServer = new WebSocket.Server({ noServer: true });
audioServer.on('connection', function(socket, upgradeReq) {
	audioServerConnectionCount++;
	console.log(
		'New Audio Viewer Connection: ', 
		(upgradeReq || socket.upgradeReq).socket.remoteAddress,
		(upgradeReq || socket.upgradeReq).headers['user-agent'],
		'('+audioServerConnectionCount+' total)'
	);
	socket.on('close', function(code, message){
		audioServerConnectionCount--;
		console.log(
			'Disconnected Audio WebSocket ('+audioServerConnectionCount+' total)'
		);
	});
});
function broadcastAudioData(data) {
	audioServer.clients.forEach(function each(clientSocket) {
		if (clientSocket.readyState === WebSocket.OPEN) {
			clientSocket.send(data);
		}
	});
}

function stopVideoProcess(){
	if(FfmpegVideoProcess !== null){
		FfmpegVideoProcess.kill();
	}
	if(FfmpegAudioProcess !== null){
		FfmpegAudioProcess.kill();
	}
}
function startVideoProcess(){
	if(videoRunning === true){
		console.log('startVideo() - Video already running - not starting');
		return;
	}
	console.log('startVideo() - launching ffmpeg');


	// $ v4l2-ctl --list-devices
	// bcm2835-codec (platform:bcm2835-codec):
	// 		/dev/video10
	// 		/dev/video11
	// 		/dev/video12
	
	// HD Pro Webcam C920 (usb-3f980000.usb-1.1.3):
	// 		/dev/video0
	// 		/dev/video1
	

	// $ ffmpeg -f v4l2 -list_formats all -i /dev/video0
	// ffmpeg version 3.2.14-1~deb9u1+rpt1 Copyright (c) 2000-2019 the FFmpeg developers
	//   built with gcc 6.3.0 (Raspbian 6.3.0-18+rpi1+deb9u1) 20170516
	//   configuration: --prefix=/usr --extra-version='1~deb9u1+rpt1'
	// [video4linux2,v4l2 @ 0x20485c0] Raw       :     yuyv422 :           YUYV 4:2:2 : 640x480 160x90 160x120 176x144 320x180 320x240 352x288 432x240 640x360 800x448 800x600 864x480 960x720 1024x576 1280x720 1600x896 1920x1080 2304x1296 2304x1536
	// [video4linux2,v4l2 @ 0x20485c0] Compressed:        h264 :                H.264 : 640x480 160x90 160x120 176x144 320x180 320x240 352x288 432x240 640x360 800x448 800x600 864x480 960x720 1024x576 1280x720 1600x896 1920x1080
	// [video4linux2,v4l2 @ 0x20485c0] Compressed:       mjpeg :          Motion-JPEG : 640x480 160x90 160x120 176x144 320x180 320x240 352x288 432x240 640x360 800x448 800x600 864x480 960x720 1024x576 1280x720 1600x896 1920x1080


	FfmpegVideoProcess = spawn('ffmpeg', [
		'-hide_banner',
		'-nostats',
		'-loglevel','fatal',
		//input video
		'-f', 'v4l2', //video4linux2
		//'-threads', '4',
		//'-framerate','20',
		'-video_size','800x448', // '800x448' good, '1280x720' fails, '960x720' fails
		'-i','/dev/video0',
		//input audio
		//'-f','alsa', //alsa audio
		//'-i','hw:1', //audio device
		//'-ar','44100', //audio sample rate
		//'-c','2', //audio channels
		//output
		'-f','mpegts', //output codec format
		'-framerate','15',
		'-codec:v','mpeg1video',
		'-b:v','1800k',
		//'-codec:a', 'mp2',
		//'-b:a','128k',
		'-bf','0',
		'-muxdelay','0.001',
		'http://127.0.0.1:'+config.httpPort+'/sendVideo/'
	]);

	FfmpegAudioProcess = spawn('ffmpeg', [
        '-hide_banner',
        '-nostats',
        '-loglevel','fatal',
		//input video
		'-vn', //no video
		'-f','alsa', //alsa audio
		'-i','hw:1', //audio device
		'-ar','44100', //audio sample rate
		'-c','2', //audio channels
		//output
		'-f','mpegts', //output codec format
		'-codec:a', 'mp2',
		'-b:a','96k',
		'-bf','0',
		'-muxdelay','0.001',
		'http://127.0.0.1:'+config.httpPort+'/sendAudio/'
	]);
	//, {stdio: [process.stdin, process.stdout, process.stderr]}
	audioRunning = true;
	
	FfmpegAudioProcess.on('exit', (code) => {
		console.log('startVideo() - ffmpeg AUDIO process exited');
		audioRunning = false;
		FfmpegAudioProcess = null;
	});

	// FfmpegAudioProcess.stdout.on('data', (data) => {
	//   console.log(data.toString());
	// });
	
	// FfmpegAudioProcess.stderr.on('data', (data) => {
	//   console.error(data.toString());
	// });

	 FfmpegAudioProcess.stdout.pipe(process.stdout);
	FfmpegAudioProcess.stderr.pipe(process.stderr);

	videoRunning = true;
	
	FfmpegVideoProcess.on('exit', (code) => {
		console.log('startVideo() - ffmpeg VIDEO process exited');
		videoRunning = false;
		FfmpegVideoProcess = null;
	});
	
	FfmpegVideoProcess.stdout.pipe(process.stdout);
	FfmpegVideoProcess.stderr.pipe(process.stderr);

	// FfmpegVideoProcess.stdout.on('data', (data) => {
	//   console.log(data.toString());
	// });
	
	// FfmpegVideoProcess.stderr.on('data', (data) => {
	//   console.error(data.toString());
	// });
	
}

// maps file extention to MIME types
const mimeType = {
	'.ico': 'image/x-icon',
	'.html': 'text/html',
	'.js': 'text/javascript',
	'.json': 'application/json',
	'.css': 'text/css',
	'.png': 'image/png',
	'.jpg': 'image/jpeg',
	'.wav': 'audio/wav',
	'.mp3': 'audio/mpeg',
	'.svg': 'image/svg+xml',
	'.pdf': 'application/pdf',
	'.doc': 'application/msword',
	'.eot': 'appliaction/vnd.ms-fontobject',
	'.ttf': 'aplication/font-sfnt'
};

const httpServer = http.createServer(function (req, res) {
	console.log(`${req.method} ${req.url}`);

	const parsedUrl = url.parse(req.url);
	//console.log(`parsedUrl.pathname = ${parsedUrl.pathname}`);

	if(parsedUrl.pathname.indexOf('/sendVideo') != -1){
		res.connection.setTimeout(0);
		log('Incoming Video Stream client connect from ' + req.socket.remoteAddress + ':' +req.socket.remotePort );
		req.on('data', function(data){
			broadcastVideoData(data);
			if(internetVideoStarted){
				internetVideoSendVideoData(data);
			}
		});
		req.on('end',function(){
			log('Incoming Video Stream client closed from ' + req.socket.remoteAddress + ':' +req.socket.remotePort );
		});
		return;
	}


	if(parsedUrl.pathname.indexOf('/sendAudio') != -1){
		res.connection.setTimeout(0);
		log('Incoming Audio client connect from ' + req.socket.remoteAddress + ':' + req.socket.remotePort);
		req.on('data', function(data){
			broadcastAudioData(data);
			if(internetVideoStarted){
				internetVideoSendAudioData(data);
			}
		});
		req.on('end',function(){
			log('Incoming Audio client closed from '+ req.socket.remoteAddress + ':' + req.socket.remotePort);
		});
		return;
	}


	// extract URL path
	// Avoid https://en.wikipedia.org/wiki/Directory_traversal_attack
	// e.g curl --path-as-is http://localhost:9000/../fileInDanger.txt
	// by limiting the path to current directory only
	const sanitizePath = path.normalize(parsedUrl.pathname).replace(/^(\.\.[\/\\])+/, '');
	let pathname = path.join(__dirname, 'webroot/', sanitizePath);

	fs.exists(pathname, function (exist) {
		if (!exist) {
			// if the file is not found, return 404
			log('404 not found!');
			res.statusCode = 404;
			res.end(`File ${pathname} not found!`);
			return;
		}

		// if is a directory, then look for index.html
		if (fs.statSync(pathname).isDirectory()) {
			pathname += '/index.html';
		}

		// read file from file system
		fs.readFile(pathname, function (err, data) {
			if (err) {
				log('500 file exists but cant read!');
				res.statusCode = 500;
				res.end(`Error getting the file: ${err}.`);
			} else {
				// based on the URL path, extract the file extention. e.g. .js, .doc, ...
				const ext = path.parse(pathname).ext;
				// if the file is found, set Content-type and send data
				res.setHeader('Content-type', mimeType[ext] || 'text/plain');
				res.end(data);
			}
		});
	});

});

httpServer.on('upgrade', function upgrade(request, socket, head) {
	const pathname = url.parse(request.url).pathname;

	switch(pathname){
		case '/wsapi': 
			webSocketServer.handleUpgrade(request, socket, head, function done(ws) {
				webSocketServer.emit('connection', ws, request);
			});
			break;
		case '/viewVideo': 
			videoServer.handleUpgrade(request, socket, head, function done(ws) {
				videoServer.emit('connection', ws, request);
			});
			break;
		case '/viewAudio': 
			audioServer.handleUpgrade(request, socket, head, function done(ws) {
				audioServer.emit('connection', ws, request);
			});
			break;
		default:
			socket.destroy();
	}
});
function initHttpServer(){
	httpServer.listen(config.httpPort);
}

init();

function showBanner(){

	const banner = [
	'██████╗░░█████╗░██████╗░░█████╗░████████╗',
	'██╔══██╗██╔══██╗██╔══██╗██╔══██╗╚══██╔══╝',
	'██████╔╝██║░░██║██████╦╝██║░░██║░░░██║░░░',
	'██╔══██╗██║░░██║██╔══██╗██║░░██║░░░██║░░░',
	'██║░░██║╚█████╔╝██████╦╝╚█████╔╝░░░██║░░░',
	'╚═╝░░╚═╝░╚════╝░╚═════╝░░╚════╝░░░░╚═╝░░░',
	'██████╗░██████╗░██╗██╗░░░██╗███████╗██████╗░',
	'██╔══██╗██╔══██╗██║██║░░░██║██╔════╝██╔══██╗',
	'██║░░██║██████╔╝██║╚██╗░██╔╝█████╗░░██████╔╝',
	'██║░░██║██╔══██╗██║░╚████╔╝░██╔══╝░░██╔══██╗',
	'██████╔╝██║░░██║██║░░╚██╔╝░░███████╗██║░░██║',
	'╚═════╝░╚═╝░░╚═╝╚═╝░░░╚═╝░░░╚══════╝╚═╝░░╚═╝'
	];

	for(let i in banner){
		console.log(banner[i]);
	}
}

// set-up CTRL-C with graceful shutdown
process.on("SIGINT", function () {
	console.log("\nGracefully shutting down from SIGINT (Ctrl-C)");

	//shutdownPwm();

	process.exit(-1);
});
