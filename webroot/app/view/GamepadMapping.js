/*
 * File: app/view/GamepadMapping.js
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

Ext.define('RobotDriver.view.GamepadMapping', {
    extend: 'Ext.Container',
    alias: 'widget.gamepadmapping',

    requires: [
        'RobotDriver.view.GamepadMappingViewModel',
        'Ext.Toolbar',
        'Ext.Button',
        'Ext.Panel'
    ],

    viewModel: {
        type: 'gamepadmapping'
    },
    layout: 'fit',
    defaultListenerScope: true,

    items: [
        {
            xtype: 'toolbar',
            itemId: 'mytoolbar3',
            docked: 'top',
            items: [
                {
                    xtype: 'button',
                    iconCls: 'x-fa fa-save',
                    text: 'Save Changes',
                    listeners: {
                        tap: 'onMybutton1Tap11'
                    }
                },
                {
                    xtype: 'button',
                    iconCls: 'x-fa fa-plus',
                    text: 'Add Single Button/Axis Mapping',
                    listeners: {
                        tap: 'onMybutton5Tap11'
                    }
                },
                {
                    xtype: 'button',
                    iconCls: 'x-fa fa-plus',
                    text: 'Add Stick Mapping',
                    listeners: {
                        tap: 'onMybutton5Tap111'
                    }
                }
            ]
        },
        {
            xtype: 'container',
            scrollable: 'vertical',
            items: [
                {
                    xtype: 'panel',
                    border: true,
                    itemId: 'connectecControllersContainer',
                    margin: '0 4 0 4',
                    minHeight: 51,
                    padding: 6,
                    layout: {
                        type: 'vbox',
                        align: 'start'
                    },
                    items: [
                        {
                            xtype: 'container',
                            html: '<u><b>Active Controllers<b></u>',
                            margin: '0 0 5 0'
                        },
                        {
                            xtype: 'container',
                            itemId: 'connectedControllers',
                            html: 'No Controllers Detected'
                        }
                    ]
                },
                {
                    xtype: 'panel',
                    border: true,
                    height: 131,
                    itemId: 'controllerEventsContainer',
                    margin: '0 4 0 4',
                    padding: 6,
                    layout: {
                        type: 'vbox',
                        align: 'start'
                    },
                    items: [
                        {
                            xtype: 'container',
                            html: '<u><b>Controller Events<b></u>',
                            margin: '0 0 5 0'
                        },
                        {
                            xtype: 'container',
                            flex: 1,
                            itemId: 'controllerEvents',
                            html: '<b><font color=red>Press Buttons or Move Axes to see events</font></b>'
                        }
                    ]
                },
                {
                    xtype: 'container',
                    html: 'Controller buttons can be mapped to buttons. Controller Axes can be mapped to sliders.',
                    padding: 10
                },
                {
                    xtype: 'container',
                    itemId: 'noMappingMsg',
                    userCls: 'text-prompt-container',
                    html: 'No Controller Mapping Configured<BR><BR>Click <B><U>Add Controller Mapping</U></B>',
                    padding: 40
                },
                {
                    xtype: 'container',
                    itemId: 'mappingsContainer',
                    margin: '0 4 20 4'
                }
            ]
        }
    ],
    listeners: {
        painted: 'onContainerPainted'
    },

    onMybutton1Tap11: function(button, e, eOpts) {
        var newMappings = [];
        Ext.each(this.queryById('mappingsContainer').items.items, function(mapComp){
            let map = mapComp.getMapping();

            if(map === false){ return; };

            newMappings.push(map);
        });

        this.fireEvent('mappingsUpdated', newMappings);
        this.fireEvent('websocketSend',{
            action:'updateConfig',
            key:'controllerMapping',
            config:newMappings
        });
    },

    onMybutton5Tap11: function(button, e, eOpts) {
        if(this.activeMapping !== false){
            Ext.Msg.alert('','Please finish the current mapping before adding another');
            return;
        }

        this.activeMapping = this.addMapping('item');
    },

    onMybutton5Tap111: function(button, e, eOpts) {
        if(this.activeMapping !== false){
            Ext.Msg.alert('','Please finish the current mapping before adding another');
            return;
        }

        this.activeMapping = this.addMapping('stick');
    },

    onContainerPainted: function(sender, element, eOpts) {
        if(this.init){
            return;
        }else{
            this.init = true;
        }

        this.activeGamepads = {};
        this.gamepadStates = {};
        this.activeMapping = false;

        if(!this.controlsDataStoreData){
            this.controlsDataStoreData = [];
        }
        this.logEvents = [];

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

    gamepadConnected: function(e) {
        let gamepad = e.gamepad;

        let activeIndex = 0;
        if(this.activeGamepads[gamepad.id]){
            this.activeGamepads[gamepad.id].push(gamepad);
            activeIndex = 1;
        }else{
            this.activeGamepads[gamepad.id] = [gamepad];
        }

        if(this.gamepadStates[gamepad.id]){
            this.gamepadStates[gamepad.id].push(this.getGamepadState(gamepad));
        }else{
            this.gamepadStates[gamepad.id] = [ this.getGamepadState(gamepad) ];
        }

        this.updateConnectedControllers();

        this.appendControllerEvent("Connected! controller "+ gamepad.id + " #"+(activeIndex+1)+ "<BR>\r\n");
    },

    stopControllerLoop: function() {
        if(this.gamePadLoop === false){
            return;
        }
        clearInterval(this.gamePadLoop);
        this.gamePadLoop = false;
    },

    startControllerLoop: function() {
        if(this.gamePadLoop !== false){
            return;
        }
        this.gamePadLoop = setInterval(this.gamepadPoll.bind(this), 75);
    },

    gamepadDisconnected: function(e) {
        let gamepad =e.gamepad;

        //TODO
        delete this.activeGamepads[gamepad.id];
        delete this.gamepadStates[gamepad.id];

        this.updateConnectedControllers();

        this.appendControllerEvent("Disconnected! controller "+gamepad.id+ " #"+ (gamepad.index+1) + "<BR>\r\n");
    },

    addMapping: function(type, config) {
        let xtype;
        switch(type){
            default:
                console.error('Invalid Controller Mapping Type. Contact Support');
                return;
            case 'item':
                xtype='gamepaditemmap';
                break;
            case 'stick':
                xtype='gamepadstickmap';
                break;
        }
        let newMapping = Ext.create({
            xtype:xtype,
            controlsDataStoreData: this.controlsDataStoreData,
            mapConfig:config,
            listeners:{
                scope:this,
                remap:function(){
                    this.activeMapping = newMapping;
                },
                mapDelete:function(panel){
                    if(this.activeMapping === panel){
                        this.activeMapping = false;
                    }
                    this.mapDelete(panel);
                }
            }
        });
        this.queryById('mappingsContainer').insert(0,newMapping);

        this.queryById('noMappingMsg').hide();

        return newMapping;
    },

    loadConfig: function(config) {
        this.mappingConfig = config;

        this.queryById('mappingsContainer').removeAll(true, true);

        Ext.each(config,function(mapping){
            this.addMapping(mapping.type, mapping);
        },this);
    },

    gamepadPoll: function() {
        var gamepadUpdate = navigator.getGamepads();

        let newGamepadStates = {};
        for(let gamepadId in this.activeGamepads){
            let gamepadIdList = this.activeGamepads[gamepadId];

            for(let gamepadIdIndex=0; gamepadIdIndex<gamepadIdList.length; gamepadIdIndex++){

                gamepad = gamepadIdList[gamepadIdIndex];

                //is this gamepad still connected?
                if(!gamepadUpdate[gamepad.index]){
                    this.gamepadDisconnected({gamepad:gamepad});
                    return;
                }
                if(gamepadUpdate[gamepad.index].id !== gamepadId){
                    console.error('gamepad index/id ordering has changed! Refresh your browser! If problem continues, contact support!');
                    continue;
                }

                if(newGamepadStates[gamepadId]){
                    newGamepadStates[gamepadId].push(this.getGamepadState(gamepadUpdate[gamepad.index]));
                }else{
                    newGamepadStates[gamepadId] = [ this.getGamepadState(gamepadUpdate[gamepad.index]) ];
                }
            }

        }

        //detect changes!
        for(let gamepadId in newGamepadStates){

            let gamepadIdList = newGamepadStates[gamepadId];

            for(let gamepadIdIndex=0; gamepadIdIndex<gamepadIdList.length; gamepadIdIndex++){

                if(!this.gamepadStates[gamepadId][gamepadIdIndex]){
                    console.error('corresponding state not found for '+gamepadId+' index '+gamepadIdIndex+'! Refresh your browser! If problem continues, contact support!');
                    continue;
                }
                let newState = gamepadIdList[gamepadIdIndex];
                let oldState = this.gamepadStates[gamepadId][gamepadIdIndex];

                for(let b in newState.buttons){
                    if(newState.buttons[b] != oldState.buttons[b]){
                        this.gamepadChange(gamepadId, gamepadIdIndex, 'button', b, newState.buttons[b], oldState.buttons[b]);
                    }
                }
                for(let a in newState.axes){
                    if(Math.abs(newState.axes[a] -oldState.axes[a]) >= 0.12){ //for axes detect change more than 12%
                        this.gamepadChange(gamepadId, gamepadIdIndex, 'axis', a, newState.axes[a], oldState.axes[a]);
                    }else{
                        newState.axes[a] = oldState.axes[a];//save the old value to accumulate larger changes for better detection
                    }
                }
            }
        }

        this.gamepadStates = newGamepadStates;
    },

    mapDelete: function(panel) {
        Ext.destroy(panel);

        if(this.queryById('mappingsContainer').getItems().length < 1){
            this.queryById('noMappingMsg').show({type:'fade'});
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

    gamepadChange: function(gamepadId, gamepadIdIndex, type, index, newValue, oldValue) {
        //TODO left off here
        switch(type){
            case 'axis':
                newValue = newValue.toFixed(2);
                if(newValue == 0){
                    newValue = 0;
                }
                break;
            case 'button':
                newValue = newValue ? 'Down' : 'Up';
                break;
        }

        this.appendControllerEvent("controller "+ gamepadId + " #"+(gamepadIdIndex+1)+" &nbsp;&nbsp; " + type + " #" + (parseInt(index)+1) + " = " + newValue + "<BR>\r\n");

        let mapFound = false;
        if(this.activeMapping !== false){

            Ext.each(this.queryById('mappingsContainer').items.items, function(mapComp){
                let map = mapComp.getMapping();

                if(map === false){ return; };

                if(map.gamepadId === gamepadId && map.gamepadIdIndex === gamepad.gamepadIdIndex && map.mapType === type && map.mapIndex===index ){
                    mapFound = true;
                    return false;
                }

            });
            if(mapFound){
                Ext.Msg.alert('Error!',type + " #" + (parseInt(index)+1) +' is already mapped!');
                return false;
            }

            if(false === this.activeMapping.setMapping(gamepadId, gamepadIdIndex, type, index)){
                return;
            }

            //if this is a stick mapping we map X and Y so dont reset it
            console.log('gamepadChange activeMapping=',this.activeMapping);
            if(this.activeMapping.xtype === 'gamepadstickmap'){
                if(this.activeMapping.bothAxesMapped === true){
                    this.activeMapping = false;
                }else{
                    var activeMappingDefer = this.activeMapping;
                    this.activeMapping = false;
                    Ext.defer(function(){
                        this.activeMapping = activeMappingDefer;
                    }, 750, this);
                }
            }else{
                this.activeMapping = false;
            }
        }
    },

    appendControllerEvent: function(text) {
        if(this.logEvents.length >= 6){
            this.logEvents.shift();
        }
        this.logEvents.push(text);

        let logBuf = '';
        Ext.each(this.logEvents, function(line){
            logBuf += line;
        });

        let el = this.queryById('controllerEvents').el.dom;

        el.innerHTML = logBuf;
        el.scrollTop = el.scrollHeight - el.clientHeight;
    },

    updateMappingStores: function(controlsStoreData) {
        this.controlsDataStoreData = [];
        for(let c in controlsStoreData){
            let ci = controlsStoreData[c];

            this.controlsDataStoreData.push({
                controlId: ci.controlId,
                type:ci.type,
                label:ci.label,
                display:ci.type +' '+ci.label
            });
        }

        Ext.each(this.queryById('mappingsContainer').items.items, function(mapComp){
            mapComp.setControlStoreData(this.controlsDataStoreData);
        }, this);
    },

    updateConnectedControllers: function(index, id) {
        let el = this.queryById('connectedControllers').el.dom;

        let active = 0;
        let logBuf = '';
        for(let gamepadId in this.activeGamepads){
            let gamepadIdList = this.activeGamepads[gamepadId];

            for(let gamepadIdIndex=0; gamepadIdIndex<gamepadIdList.length; gamepadIdIndex++){
                let gamepad = gamepadIdList[gamepadIdIndex];
                logBuf += gamepad.id + ' #'+(gamepadIdIndex+1) + " " + "<BR>\r\n";
            }
        }
        if(logBuf === ''){
            logBuf = 'No Controllers Detected';
        }

        el.innerHTML = logBuf;
    }

});