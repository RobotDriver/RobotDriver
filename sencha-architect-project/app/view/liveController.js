/*
 * File: app/view/liveController.js
 *
 * This file was generated by Sencha Architect
 * http://www.sencha.com/products/architect/
 *
 * This file requires use of the Ext JS 6.5.x Modern library, under independent license.
 * License of Sencha Architect does not include license for Ext JS 6.5.x Modern. For more
 * details see http://www.sencha.com/license or contact license@sencha.com.
 *
 * This file will be auto-generated each and everytime you save your project.
 *
 * Do NOT hand edit this file.
 */

Ext.define('RobotDriver.view.liveController', {
    extend: 'Ext.Container',
    alias: 'widget.livecontroller',

    requires: [
        'RobotDriver.view.liveControllerViewModel'
    ],

    viewModel: {
        type: 'livecontroller'
    },
    defaultListenerScope: true,

    listeners: {
        painted: 'onContainerPainted'
    },

    onContainerPainted: function(sender, element, eOpts) {
        if(this.init){
            return;
        }else{
            this.init = true;
        }

        this.activeGamepads = {};
        this.gamepadStates = {};

        var gamepadUpdate = navigator.getGamepads();
        for(var i=0; i<9; i++){
            if(gamepadUpdate[i] && gamepadUpdate[i].id){
                this.gamepadConnected({gamepad: gamepadUpdate[i]});
            }
        }

        window.addEventListener("gamepadconnected", this.gamepadConnected.bind(this));
        window.addEventListener("gamepaddisconnected", this.gamepadDisconnected.bind(this));

        this.gamePadLoop = false;
        this.startControllerLoop();
    },

    loadConfig: function(config) {
        this.mappedGamepads = config;
    },

    startControllerLoop: function() {
        if(this.gamePadLoop !== false){
            return;
        }
        this.gamePadLoop = setInterval(this.gamepadPoll.bind(this), 75);
    },

    stopControllerLoop: function() {
        if(this.gamePadLoop === false){
            return;
        }
        clearInterval(this.gamePadLoop);
        this.gamePadLoop = false;
    },

    gamepadConnected: function(e) {
        let gx = e.gamepad.index+e.gamepad.id;

        this.activeGamepads[gx] = e.gamepad;

        this.fireEvent('gamepadConnect', e.gamepad);

        this.gamepadStates[gx] = this.getGamepadState(e.gamepad);
    },

    gamepadDisconnected: function(e) {
        let gx = e.gamepad.index+e.gamepad.id;

        delete this.activeGamepads[gx];
        delete this.gamepadStates[gx];

        this.fireEvent('gamepadDisconnect', e.gamepad);
    },

    gamepadPoll: function() {
        var gamepadUpdate = navigator.getGamepads();

        for(var gx in this.activeGamepads){
            let ag = this.activeGamepads[gx];

            if(gamepadUpdate[ag.index]){
                ag = gamepadUpdate[ag.index];
            }else{
                this.gamepadDisconnected({gamepad:ag});
                return;
            }

            this.gamepadCheckState(ag);
        }
    },

    getGamepadState: function(gamepad) {
        let state = {
            buttons:{},
            axes:{}
        };

        for(let b in gamepad.buttons){
            state.buttons[b] = gamepad.buttons[b].pressed;
        }
        for(let a in gamepad.axes){
            state.axes[a] = gamepad.axes[a];
        }

        return state;
    },

    gamepadChange: function(gamepad, type, index, newValue, oldValue) {
        let foundMap = false;
        Ext.each(this.mappedGamepads, function(mapped){
            if(mapped.gamepadId == gamepad.id && mapped.gamepadIndex == gamepad.index && mapped.mapIndex === index){
                foundMap = mapped;
                return false;
            }
        });
        if(foundMap){
            this.fireEvent('action', foundMap, newValue);
        }
    },

    gamepadCheckState: function(gamepad) {
        let gx = gamepad.index+gamepad.id;
        let gs = this.gamepadStates[gx];

        //detect changes!
        let newState = this.getGamepadState(gamepad);
        for(b in newState.buttons){
            if(newState.buttons[b] != gs.buttons[b]){
               this.gamepadChange(gamepad, 'button', b, newState.buttons[b], gs.buttons[b]);
            }
        }
        for(a in newState.axes){
            if(Math.abs(newState.axes[a] -gs.axes[a]) >= 0.005){ //for axes detect change more than 0.5%
               this.gamepadChange(gamepad, 'axis', a, newState.axes[a], gs.axes[a]);
            }else{
               newState.axes[a] = gs.axes[a];
            }
        }
        this.gamepadStates[gx] = newState;
    }

});