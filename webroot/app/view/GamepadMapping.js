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
                    text: 'Add Controller Mapping',
                    listeners: {
                        tap: 'onMybutton5Tap11'
                    }
                }
            ]
        },
        {
            xtype: 'panel',
            border: true,
            height: 163,
            itemId: 'controllerEventsContainer',
            margin: '0 4 0 4',
            padding: 10,
            scrollable: true,
            title: 'Controller Events',
            layout: {
                type: 'vbox',
                align: 'start'
            },
            items: [
                {
                    xtype: 'container',
                    flex: 1,
                    itemId: 'controllerEvents'
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
            itemId: 'mappingsContainer',
            margin: '0 4 0 4'
        },
        {
            xtype: 'container',
            itemId: 'noMappingMsg',
            userCls: 'text-prompt-container',
            html: 'No Controller Mapping Configured<BR><BR>Click <B><U>Add Controller Mapping</U></B>',
            padding: 40
        }
    ],
    listeners: {
        painted: 'onContainerPainted'
    },

    onMybutton1Tap11: function(button, e, eOpts) {
        console.log('save mapping');

        var allMappings = [];
        Ext.each(this.queryById('mappingsContainer').items.items, function(mapComp){
            let map = mapComp.getMapping();

            if(map === false){ return; };

            allMappings.push(map);
        });

        this.fireEvent('websocketSend',{
            action:'updateConfig',
            key:'controllerMapping',
            config:allMappings
        });
    },

    onMybutton5Tap11: function(button, e, eOpts) {
        if(this.activeMapping !== false){
            return;
        }

        this.activeMapping = this.addMapping();
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

        window.addEventListener("gamepadconnected", this.gamepadConnected.bind(this));
        window.addEventListener("gamepaddisconnected", this.gamepadDisconnected.bind(this));

        this.gamePadLoop = false;
        this.startControllerLoop();
    },

    gamepadConnected: function(e) {
        let gx = e.gamepad.index+e.gamepad.id;

        this.activeGamepads[gx] = e.gamepad;

        this.appendControllerEvent("Connected! controller #"+(e.gamepad.index+1)+ " "+ e.gamepad.id + "<BR>\r\n");

        this.gamepadStates[gx] = this.getGamepadState(e.gamepad);
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
        let gx = e.gamepad.index+e.gamepad.id;

        delete this.activeGamepads[gx];
        delete this.gamepadStates[gx];

        this.appendControllerEvent("Disconnected! controller #"+(e.gamepad.index+1)+ " "+ e.gamepad.id + "<BR>\r\n");
    },

    addMapping: function(config) {
        let newMapping = Ext.create({
            xtype:'gamepaditemmap',
            controlsDataStoreData: this.controlsDataStoreData,
            mapConfig:config,
            listeners:{
                scope:this,
                remap:function(){
                    this.activeMapping = newMapping;
                },
                mapDelete:function(panel){
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
            this.addMapping(mapping);
        },this);
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

    gamepadChange: function(gamepad, type, index, newValue, oldValue) {
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

        this.appendControllerEvent("controller #"+(gamepad.index+1)+ " "+ gamepad.id + " &nbsp;&nbsp; " + type + " #" + (parseInt(index)+1) + " = " + newValue + "<BR>\r\n");

        let mapFound = false;
        if(this.activeMapping !== false){

            Ext.each(this.queryById('mappingsContainer').items.items, function(mapComp){
                let map = mapComp.getMapping();

                if(map === false){ return; };

                if(map.gamepadId === gamepad.id && map.mapType === type && map.mapIndex===index ){
                    mapFound = true;
                    return false;
                }

            });
            if(mapFound){
                Ext.Msg.alert('Error!',type + " #" + (parseInt(index)+1) +' is already mapped!');
                return false;
            }

            this.activeMapping.setMapping(gamepad.id, gamepad.index, type, index);
            this.activeMapping = false;
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
            if(Math.abs(newState.axes[a] -gs.axes[a]) >= 0.15){ //for axes detect change more than 15%
               this.gamepadChange(gamepad, 'axis', a, newState.axes[a], gs.axes[a]);
            }else{
               newState.axes[a] = gs.axes[a];
            }
        }
        this.gamepadStates[gx] = newState;
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
    }

});