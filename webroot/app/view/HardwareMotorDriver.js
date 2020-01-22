/*
 * File: app/view/HardwareMotorDriver.js
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

Ext.define('RobotDriver.view.HardwareMotorDriver', {
    extend: 'Ext.form.Panel',
    alias: 'widget.hardwaremotordriver',

    requires: [
        'RobotDriver.view.HardwareServoViewModel1',
        'Ext.field.Display',
        'Ext.Spacer',
        'Ext.Button',
        'Ext.form.Panel',
        'Ext.field.ComboBox',
        'Ext.field.Number'
    ],

    viewModel: {
        type: 'hardwaremotordriver'
    },
    border: true,
    defaultListenerScope: true,

    items: [
        {
            xtype: 'container',
            itemId: 'tbar',
            padding: 10,
            layout: 'hbox',
            items: [
                {
                    xtype: 'container',
                    itemId: 'title',
                    width: 117,
                    html: 'Motor Driver',
                    margin: '10 0 0 20'
                },
                {
                    xtype: 'textfield',
                    enableKeyEvents: true,
                    name: 'name',
                    label: 'Name',
                    labelWidth: 50,
                    autoComplete: false,
                    clearable: false,
                    listeners: {
                        change: 'onMytextfield3Change'
                    }
                },
                {
                    xtype: 'displayfield',
                    hidden: true,
                    name: 'type',
                    value: 'motordriver'
                },
                {
                    xtype: 'spacer'
                },
                {
                    xtype: 'button',
                    iconCls: 'x-fa fa-trash',
                    text: 'Delete',
                    listeners: {
                        tap: 'onMybutton9Tap'
                    }
                }
            ]
        },
        {
            xtype: 'formpanel',
            itemId: 'outputDrive1Form',
            items: [
                {
                    xtype: 'container',
                    style: {
                        color: '#fff'
                    },
                    items: [
                        {
                            xtype: 'combobox',
                            name: 'motorDriverType',
                            width: 340,
                            margin: '10 0 0 10',
                            label: 'Motor Driver Type',
                            labelWidth: 120,
                            value: 'l298n',
                            displayField: 'display',
                            valueField: 'value',
                            bind: {
                                store: '{configPwmTypeStore}'
                            }
                        }
                    ]
                },
                {
                    xtype: 'panel',
                    border: true,
                    itemId: 'l298pins',
                    margin: 10,
                    padding: 10,
                    defaults: {
                        defaults: {
                            clearable: false
                        }
                    },
                    items: [
                        {
                            xtype: 'container',
                            itemId: 'header',
                            html: '<b>L298 Pins</b>',
                            padding: '0 0 5 5'
                        },
                        {
                            xtype: 'container',
                            itemId: 'motora',
                            layout: 'hbox',
                            items: [
                                {
                                    xtype: 'numberfield',
                                    name: 'aen',
                                    width: 160,
                                    margin: '0 0 0 10',
                                    label: 'Motor 1 - A EN',
                                    labelWidth: 120
                                },
                                {
                                    xtype: 'numberfield',
                                    name: 'ain1',
                                    width: 75,
                                    margin: '0 0 0 10',
                                    label: 'IN1',
                                    labelWidth: 35
                                },
                                {
                                    xtype: 'numberfield',
                                    name: 'ain2',
                                    width: 75,
                                    margin: '0 0 0 10',
                                    label: 'IN2',
                                    labelWidth: 35
                                }
                            ]
                        },
                        {
                            xtype: 'container',
                            itemId: 'motorb',
                            margin: '5 0 0 0',
                            layout: 'hbox',
                            items: [
                                {
                                    xtype: 'numberfield',
                                    name: 'ben',
                                    width: 160,
                                    margin: '0 0 0 10',
                                    label: 'Motor 2 - B EN',
                                    labelWidth: 120
                                },
                                {
                                    xtype: 'numberfield',
                                    name: 'bin3',
                                    width: 75,
                                    margin: '0 0 0 10',
                                    label: 'IN3',
                                    labelWidth: 35
                                },
                                {
                                    xtype: 'numberfield',
                                    name: 'bin4',
                                    width: 75,
                                    margin: '0 0 0 10',
                                    label: 'IN4',
                                    labelWidth: 35
                                }
                            ]
                        }
                    ]
                },
                {
                    xtype: 'panel',
                    border: true,
                    itemId: 'motorConfigs',
                    margin: 10,
                    padding: 10,
                    defaults: {
                        defaults: {
                            clearable: false
                        }
                    },
                    items: [
                        {
                            xtype: 'container',
                            itemId: 'header',
                            html: '<b>Motor Speed</b>',
                            padding: '0 0 5 5'
                        },
                        {
                            xtype: 'container',
                            itemId: 'left1',
                            layout: 'hbox',
                            items: [
                                {
                                    xtype: 'numberfield',
                                    name: 'amin',
                                    width: 175,
                                    margin: '0 0 0 10',
                                    label: 'Motor 1 - Min %',
                                    labelWidth: 120,
                                    value: 0,
                                    maxValue: 100,
                                    minValue: 0
                                },
                                {
                                    xtype: 'numberfield',
                                    name: 'amax',
                                    width: 95,
                                    margin: '0 0 0 10',
                                    label: 'Max',
                                    labelWidth: 40,
                                    value: 100,
                                    maxValue: 100,
                                    minValue: 0
                                }
                            ]
                        },
                        {
                            xtype: 'container',
                            itemId: 'left2',
                            margin: '10 0 0 0',
                            layout: 'hbox',
                            items: [
                                {
                                    xtype: 'numberfield',
                                    name: 'bmin',
                                    width: 175,
                                    margin: '0 0 0 10',
                                    label: 'Motor 2 - Min %',
                                    labelWidth: 120,
                                    value: 0,
                                    maxValue: 100,
                                    minValue: 0
                                },
                                {
                                    xtype: 'numberfield',
                                    name: 'bmax',
                                    width: 95,
                                    margin: '0 0 0 10',
                                    label: 'Max',
                                    labelWidth: 40,
                                    value: 100,
                                    maxValue: 100,
                                    minValue: 0
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    ],

    onMytextfield3Change: function(field, newValue, oldValue, eOpts) {
        this.hardwareStoreRec.set('name',newValue);
    },

    onMybutton9Tap: function(button, e, eOpts) {
        this.fireEvent('hardwaredelete', this);
    },

    getHardwareConfig: function() {
        let values = this.getValues();

        //values.devNum = this.hardwareConfig.devNum;
        values.hardwareId = this.hardwareConfig.hardwareId;

        return values;
    }

});