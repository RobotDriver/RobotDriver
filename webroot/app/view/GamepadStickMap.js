/*
 * File: app/view/GamepadStickMap.js
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

Ext.define('RobotDriver.view.GamepadStickMap', {
    extend: 'Ext.Panel',
    alias: 'widget.gamepadstickmap',

    requires: [
        'RobotDriver.view.GamepadStickMapViewModel',
        'Ext.Container',
        'Ext.Button',
        'Ext.field.Checkbox',
        'Ext.field.ComboBox'
    ],

    viewModel: {
        type: 'gamepadstickmap'
    },
    border: true,
    margin: '6 0 0 0',
    padding: '0 0 6 10',
    layout: 'vbox',
    defaultListenerScope: true,

    items: [
        {
            xtype: 'container',
            userCls: 'mapped-to',
            margin: '10 0 0 0',
            layout: {
                type: 'hbox',
                align: 'start'
            },
            items: [
                {
                    xtype: 'container',
                    layout: {
                        type: 'vbox',
                        align: 'start'
                    },
                    items: [
                        {
                            xtype: 'container',
                            layout: {
                                type: 'hbox',
                                align: 'start'
                            },
                            items: [
                                {
                                    xtype: 'container',
                                    width: 115,
                                    html: 'X Mapped To:',
                                    margin: '6 0 0 10'
                                },
                                {
                                    xtype: 'container',
                                    itemId: 'mappedTox',
                                    html: '<font color="red">Press Button/Move Axis On Controller</font>',
                                    margin: '6 0 0 0'
                                },
                                {
                                    xtype: 'button',
                                    hidden: true,
                                    itemId: 'remapx',
                                    margin: '0 0 0 10',
                                    iconCls: 'x-fa fa-pencil-square-o',
                                    text: 'Remap',
                                    listeners: {
                                        tap: 'onMybuttonTap'
                                    }
                                }
                            ]
                        },
                        {
                            xtype: 'checkbox',
                            hidden: false,
                            itemId: 'axisInvertX',
                            name: 'axisInvertX',
                            width: 120,
                            margin: '0 0 0 120',
                            label: 'Invert X Axis',
                            labelAlign: 'right',
                            labelWidth: 100,
                            value: '1'
                        },
                        {
                            xtype: 'container',
                            margin: '6 0 0 0',
                            layout: {
                                type: 'hbox',
                                align: 'start'
                            },
                            items: [
                                {
                                    xtype: 'container',
                                    width: 115,
                                    html: 'Y Mapped To:',
                                    margin: '6 0 0 10'
                                },
                                {
                                    xtype: 'container',
                                    itemId: 'mappedToy',
                                    html: '',
                                    margin: '6 0 0 0'
                                },
                                {
                                    xtype: 'button',
                                    hidden: true,
                                    itemId: 'remapy',
                                    margin: '0 0 0 10',
                                    iconCls: 'x-fa fa-pencil-square-o',
                                    text: 'Remap',
                                    listeners: {
                                        tap: 'onMybuttonTap1'
                                    }
                                }
                            ]
                        },
                        {
                            xtype: 'checkbox',
                            hidden: false,
                            itemId: 'axisInvertY',
                            name: 'axisInvertY',
                            width: 120,
                            margin: '0 0 0 120',
                            label: 'Invert Y Axis',
                            labelAlign: 'right',
                            labelWidth: 100,
                            value: '1'
                        }
                    ]
                },
                {
                    xtype: 'container',
                    flex: 1
                },
                {
                    xtype: 'button',
                    itemId: 'delete',
                    margin: '0 10 0 0',
                    iconCls: 'x-fa fa-trash',
                    text: 'Delete',
                    listeners: {
                        tap: 'onDeleteTap1'
                    }
                }
            ]
        },
        {
            xtype: 'combobox',
            itemId: 'control',
            name: 'control',
            width: 367,
            label: 'Control',
            labelTextAlign: 'right',
            labelWidth: 110,
            displayField: 'display',
            valueField: 'controlId',
            forceSelection: true,
            queryCaching: false,
            queryMode: 'local',
            bind: {
                store: '{controlStore}'
            }
        },
        {
            xtype: 'textfield',
            itemId: 'name',
            name: 'name',
            width: 300,
            label: 'Name (optional)',
            labelWidth: 110,
            clearable: false
        }
    ],
    listeners: {
        painted: 'onPanelPainted'
    },

    onMybuttonTap: function(button, e, eOpts) {
        this.fireEvent('remap', this);
        this.setMapping(false, 'x');
    },

    onMybuttonTap1: function(button, e, eOpts) {
        this.fireEvent('remap', this);
        this.setMapping(false, 'y');
    },

    onDeleteTap1: function(button, e, eOpts) {
        this.fireEvent('mapDelete', this);
    },

    onPanelPainted: function(sender, element, eOpts) {
        if(this.init){
            return;
        }else{
            this.init = true;
        }

        this.bothAxesMapped = false;

        this.mapping = {
            x:null,
            y:null
        };

        this.setControlStoreData(element.component.config.controlsDataStoreData);

        if(element.component.config.mapConfig){
            let config = element.component.config.mapConfig;

            this.setMapping(config.x.gamepadId, config.x.gamepadIdIndex, config.x.mapType, config.x.mapIndex);
            this.setMapping(config.y.gamepadId, config.y.gamepadIdIndex, config.y.mapType, config.y.mapIndex);

            this.queryById('name').setValue(config.name);
            this.queryById('control').setValue(config.controlId);
            this.queryById('axisInvertX').setChecked(config.axisInvertX ? true : false);
            this.queryById('axisInvertY').setChecked(config.axisInvertY ? true : false);
        }
    },

    setMapping: function(gamepadId, gamepadIdIndex, mapType, mapIndex) {
        if(gamepadId === false){
            //gamepadIdIndex is re-used to tell wich axis is unmapped

            this.mapping[gamepadIdIndex] = null;

            this.queryById('remap' + gamepadIdIndex).hide();
            this.queryById('mappedTo' + gamepadIdIndex).setHtml('<font color="red">Press Button/Move Axis On Controller</font>');

            //this.queryById('control').setValue(null);
            //this.queryById('control').disable();

            this.bothAxesMapped = false;
            return;
        }

        if(mapType === 'button'){
            Ext.Msg.alert('Problem!','Wrong control type!<BR><BR>Please map to an axis, not a button!');
            return false;
        }

        let axis = 'x';
        if(this.mapping[axis] !== null){

            if(this.mapping[axis].gamepadId === gamepadId
               && this.mapping[axis].gamepadIdIndex === gamepadIdIndex
               && this.mapping[axis].mapType === mapType
               && this.mapping[axis].mapIndex === mapIndex
              ){
                Ext.Msg.alert('Problem!','You have the same index mapped for X<BR><BR>Please select another axis!');
                return false;
            }

            axis = 'y';
            this.bothAxesMapped = true;
        }
        this.mapping[axis] = {
            type:'stick',
            gamepadId:gamepadId,
            gamepadIdIndex:gamepadIdIndex,
            mapType:mapType,
            mapIndex:mapIndex
        };

        this.queryById('mappedTo'+ axis).setHtml(gamepadId + " #"+  (parseInt(gamepadIdIndex)+1) + " "+mapType+" #"+ (parseInt(mapIndex)+1) );
        this.queryById('remap'+ axis).show();
        if(axis === 'x'){
            this.queryById('mappedToy').setHtml('<font color="red">Press Button/Move Axis On Controller</font>');
            this.queryById('remapy').hide();
        }

        return true;
        //this.queryById('control').enable();
    },

    getMapping: function() {
        this.mapping.name = this.queryById('name').getValue();
        this.mapping.controlId = this.queryById('control').getValue();
        this.mapping.axisInvertX = this.queryById('axisInvertX').getChecked() ? 1 : 0;
        this.mapping.axisInvertY = this.queryById('axisInvertY').getChecked() ? 1 : 0;
        this.mapping.type='stick';
        console.log(this.mapping);
        return this.mapping;
    },

    setControlStoreData: function(data) {
        this.getViewModel().getStore('controlStore').loadData(data);
    }

});