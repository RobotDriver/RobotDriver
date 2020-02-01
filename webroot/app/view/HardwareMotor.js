/*
 * File: app/view/HardwareMotor.js
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

Ext.define('RobotDriver.view.HardwareMotor', {
    extend: 'Ext.form.Panel',
    alias: 'widget.hardwaremotor',

    requires: [
        'RobotDriver.view.HardwareServoViewModel1',
        'Ext.field.ComboBox',
        'Ext.Spacer',
        'Ext.Button',
        'Ext.form.Panel',
        'Ext.field.Number'
    ],

    viewModel: {
        type: 'hardwaremotor'
    },
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
                    style: {
                        margin: '5px 5px 0 12px',
                        'font-weight': 'bold',
                        'font-size': '16px'
                    },
                    width: 97,
                    html: 'Motor'
                },
                {
                    xtype: 'combobox',
                    itemId: 'motorDriverType',
                    name: 'motorDriverType',
                    width: 340,
                    label: 'Motor Driver Type',
                    labelWidth: 120,
                    value: 'l298n',
                    displayField: 'display',
                    valueField: 'value',
                    minChars: 1,
                    queryMode: 'local',
                    typeAhead: true,
                    bind: {
                        store: '{motorDriverType}'
                    },
                    listeners: {
                        select: 'onMycombobox1Select'
                    }
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
                    }
                },
                {
                    xtype: 'formpanel',
                    border: true,
                    itemId: 'l298npins',
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
                    xtype: 'formpanel',
                    border: true,
                    itemId: 'motorConfigs2',
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
                                    xtype: 'container',
                                    itemId: 'motor1',
                                    width: 80,
                                    html: '<B>Motor 1</B>',
                                    margin: '8 0 0 0'
                                },
                                {
                                    xtype: 'textfield',
                                    enableKeyEvents: true,
                                    itemId: 'name1',
                                    name: 'name1',
                                    width: 180,
                                    label: 'Name',
                                    labelWidth: 50,
                                    autoComplete: false,
                                    clearable: false
                                },
                                {
                                    xtype: 'numberfield',
                                    name: 'amin',
                                    width: 100,
                                    margin: '0 0 0 10',
                                    label: 'Min %',
                                    labelWidth: 50,
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
                                    xtype: 'container',
                                    itemId: 'motor2',
                                    width: 80,
                                    html: '<B>Motor 2</B>',
                                    margin: '8 0 0 0'
                                },
                                {
                                    xtype: 'textfield',
                                    enableKeyEvents: true,
                                    itemId: 'name2',
                                    name: 'name2',
                                    width: 180,
                                    label: 'Name',
                                    labelWidth: 50,
                                    autoComplete: false,
                                    clearable: false
                                },
                                {
                                    xtype: 'numberfield',
                                    name: 'bmin',
                                    width: 100,
                                    margin: '0 0 0 10',
                                    label: 'Min %',
                                    labelWidth: 50,
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
                },
                {
                    xtype: 'formpanel',
                    border: true,
                    itemId: 'pwmescpins',
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
                            html: '<b>GPIO Pin</b>',
                            padding: '0 0 5 5'
                        },
                        {
                            xtype: 'container',
                            itemId: 'motora',
                            layout: 'hbox',
                            items: [
                                {
                                    xtype: 'numberfield',
                                    name: 'rcescpin',
                                    width: 120,
                                    margin: '0 0 0 10',
                                    label: 'Pin',
                                    labelWidth: 60
                                },
                                {
                                    xtype: 'numberfield',
                                    name: 'rcescpinRangeMin',
                                    width: 150,
                                    margin: '0 0 0 10',
                                    label: '&#181;S Min',
                                    labelWidth: 55,
                                    value: 1000
                                },
                                {
                                    xtype: 'numberfield',
                                    name: 'rcescpinRangeMax',
                                    width: 150,
                                    margin: '0 0 0 10',
                                    label: '&#181;S Max',
                                    labelWidth: 55,
                                    value: 2000
                                }
                            ]
                        }
                    ]
                },
                {
                    xtype: 'formpanel',
                    border: true,
                    hidden: false,
                    itemId: 'motorConfigs1',
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
                            itemId: 'left2',
                            margin: '10 0 0 0',
                            layout: 'hbox',
                            items: [
                                {
                                    xtype: 'container',
                                    itemId: 'motor2',
                                    width: 80,
                                    html: '<B>Motor 1</B>',
                                    margin: '8 0 0 0'
                                },
                                {
                                    xtype: 'textfield',
                                    enableKeyEvents: true,
                                    itemId: 'name1',
                                    name: 'name1',
                                    width: 180,
                                    label: 'Name',
                                    labelWidth: 50,
                                    autoComplete: false,
                                    clearable: false
                                },
                                {
                                    xtype: 'numberfield',
                                    name: 'bmin',
                                    width: 100,
                                    margin: '0 0 0 10',
                                    label: 'Min %',
                                    labelWidth: 50,
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

    onMycombobox1Select: function(combobox, newValue, oldValue, eOpts) {
        if(newValue===null){
            return;
        }
        switch(newValue.data.value){
            case 'pca9685':
                this.queryById('l298npins').hide();
                this.queryById('pwmescpins').hide();
                this.queryById('motorConfigs1').hide();
                this.queryById('motorConfigs2').hide();
                break;
            case 'l298n':
                this.queryById('l298npins').show();
                this.queryById('pwmescpins').hide();
                this.queryById('motorConfigs1').hide();
                this.queryById('motorConfigs2').show();
                break;
            case 'pwmesc':
                this.queryById('l298npins').hide();
                this.queryById('pwmescpins').show();
                this.queryById('motorConfigs1').show();
                this.queryById('motorConfigs2').hide();
                break;
        }
    },

    onMybutton9Tap: function(button, e, eOpts) {
        this.fireEvent('hardwaredelete', this);
    },

    setConfigValues: function(config) {
        this.setValues(config);

        switch(config.motorDriverType){
            case 'pca9685':
                break;
            case 'l298n':
                //this.queryById('namedual1').setValue(config.name1);
                //this.queryById('namedual2').setValue(config.name2);
                this.queryById('motorConfigs2').setValues(config);
                this.queryById('l298npins').setValues(config);
                break;
            case 'pwmesc':
                //this.queryById('namesingle').setValue(config.name1);
                this.queryById('motorConfigs1').setValues(config);
                break;
        }

        this.hardwareId = config.hardwareId;
    },

    getConfigValues: function() {
        let values = {
            type:'motor',
            hardwareId: this.hardwareId,
            motorDriverType: this.queryById('motorDriverType').getValue()
        };

        switch(values.motorDriverType){
            case 'pca9685':
                break;
            case 'l298n':
                Ext.apply(values, this.queryById('motorConfigs2').getValues());
                Ext.apply(values, this.queryById('l298npins').getValues());
                break;
            case 'pwmesc':
                Ext.apply(values, this.queryById('motorConfigs1').getValues());
                break;
        }

        console.log(values);
        return values;
    }

});