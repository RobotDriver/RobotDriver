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
        'RobotDriver.view.HardwareMotorViewModel',
        'Ext.field.ComboBox',
        'Ext.Spacer',
        'Ext.Button',
        'Ext.form.Panel',
        'Ext.field.Number'
    ],

    viewModel: {
        type: 'hardwaremotor'
    },
    padding: '0 0 10 0',
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
            xtype: 'panel',
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
                    itemId: 'l298npins',
                    defaults: {
                        defaults: {
                            clearable: false,
                            validationMessage: 'Invalid Pin Number',
                            defaults: {
                                clearable: false,
                                validationMessage: 'Invalid Pin Number',
                                defaults: {
                                    clearable: false,
                                    validationMessage: 'Invalid Pin Number'
                                }
                            }
                        }
                    },
                    items: [
                        {
                            xtype: 'panel',
                            border: true,
                            margin: '0 4 0 20',
                            padding: 6,
                            items: [
                                {
                                    xtype: 'container',
                                    itemId: 'motora',
                                    layout: 'hbox',
                                    items: [
                                        {
                                            xtype: 'container',
                                            html: '<b>Motor A</b>',
                                            padding: '8 10 0 0'
                                        },
                                        {
                                            xtype: 'textfield',
                                            enableKeyEvents: true,
                                            itemId: 'name1',
                                            name: 'name1',
                                            width: 200,
                                            label: 'Name',
                                            labelTextAlign: 'right',
                                            labelWidth: 80,
                                            autoComplete: false,
                                            clearable: false,
                                            maxLength: 30
                                        }
                                    ]
                                },
                                {
                                    xtype: 'container',
                                    margin: '5 0 0 0',
                                    layout: 'hbox',
                                    items: [
                                        {
                                            xtype: 'container',
                                            html: 'Pins:',
                                            padding: '8 10 0 0'
                                        },
                                        {
                                            xtype: 'numberfield',
                                            itemId: 'aen',
                                            name: 'aen',
                                            width: 95,
                                            margin: '0 0 0 15',
                                            label: 'A EN',
                                            labelTextAlign: 'right',
                                            labelWidth: 45,
                                            maxValue: 27,
                                            minValue: 2
                                        },
                                        {
                                            xtype: 'numberfield',
                                            itemId: 'ain1',
                                            name: 'ain1',
                                            width: 75,
                                            margin: '0 0 0 10',
                                            label: 'IN1',
                                            labelWidth: 35,
                                            maxValue: 27,
                                            minValue: 2
                                        },
                                        {
                                            xtype: 'numberfield',
                                            itemId: 'ain2',
                                            name: 'ain2',
                                            width: 75,
                                            margin: '0 0 0 10',
                                            label: 'IN2',
                                            labelWidth: 35,
                                            maxValue: 27,
                                            minValue: 2
                                        }
                                    ]
                                },
                                {
                                    xtype: 'container',
                                    margin: '5 0 0 0',
                                    layout: 'hbox',
                                    items: [
                                        {
                                            xtype: 'container',
                                            html: 'Power:',
                                            padding: '8 10 0 0'
                                        },
                                        {
                                            xtype: 'numberfield',
                                            name: 'amin',
                                            width: 100,
                                            margin: '0 0 0 10',
                                            label: 'Min %',
                                            labelTextAlign: 'right',
                                            labelWidth: 50,
                                            value: 0,
                                            maxValue: 100,
                                            minValue: 0
                                        },
                                        {
                                            xtype: 'numberfield',
                                            name: 'amax',
                                            width: 100,
                                            margin: '0 0 0 10',
                                            label: 'Max %',
                                            labelWidth: 50,
                                            value: 100,
                                            maxValue: 100,
                                            minValue: 0
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            xtype: 'panel',
                            border: true,
                            margin: '6 4 0 20',
                            padding: 6,
                            layout: 'vbox',
                            items: [
                                {
                                    xtype: 'container',
                                    itemId: 'motorb',
                                    layout: 'hbox',
                                    items: [
                                        {
                                            xtype: 'container',
                                            html: '<b>Motor B</b>',
                                            padding: '6 10 0 0'
                                        },
                                        {
                                            xtype: 'textfield',
                                            enableKeyEvents: true,
                                            itemId: 'name2',
                                            name: 'name2',
                                            width: 200,
                                            label: 'Name',
                                            labelTextAlign: 'right',
                                            labelWidth: 80,
                                            autoComplete: false,
                                            clearable: false,
                                            maxLength: 30
                                        }
                                    ]
                                },
                                {
                                    xtype: 'container',
                                    margin: '5 0 0 0',
                                    layout: 'hbox',
                                    items: [
                                        {
                                            xtype: 'container',
                                            html: 'Pins:',
                                            padding: '8 10 0 0'
                                        },
                                        {
                                            xtype: 'numberfield',
                                            itemId: 'ben',
                                            name: 'ben',
                                            width: 95,
                                            margin: '0 0 0 15',
                                            label: 'B EN',
                                            labelTextAlign: 'right',
                                            labelWidth: 45,
                                            maxValue: 27,
                                            minValue: 2
                                        },
                                        {
                                            xtype: 'numberfield',
                                            itemId: 'bin3',
                                            name: 'bin3',
                                            width: 75,
                                            margin: '0 0 0 10',
                                            label: 'IN3',
                                            labelWidth: 35,
                                            maxValue: 27,
                                            minValue: 2
                                        },
                                        {
                                            xtype: 'numberfield',
                                            itemId: 'bin4',
                                            name: 'bin4',
                                            width: 75,
                                            margin: '0 0 0 10',
                                            label: 'IN4',
                                            labelWidth: 35,
                                            maxValue: 27,
                                            minValue: 2
                                        }
                                    ]
                                },
                                {
                                    xtype: 'container',
                                    margin: '5 0 0 0',
                                    layout: 'hbox',
                                    items: [
                                        {
                                            xtype: 'container',
                                            html: 'Power:',
                                            padding: '8 10 0 0'
                                        },
                                        {
                                            xtype: 'numberfield',
                                            name: 'bmin',
                                            width: 100,
                                            margin: '0 0 0 10',
                                            label: 'Min %',
                                            labelTextAlign: 'right',
                                            labelWidth: 50,
                                            value: 0,
                                            maxValue: 100,
                                            minValue: 0
                                        },
                                        {
                                            xtype: 'numberfield',
                                            name: 'bmax',
                                            width: 100,
                                            margin: '0 0 0 10',
                                            label: 'Max %',
                                            labelWidth: 50,
                                            value: 100,
                                            maxValue: 100,
                                            minValue: 0
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                },
                {
                    xtype: 'formpanel',
                    itemId: 'escpins',
                    margin: '4 0 0 10',
                    defaults: {
                        defaults: {
                            clearable: false
                        }
                    },
                    items: [
                        {
                            xtype: 'textfield',
                            enableKeyEvents: true,
                            itemId: 'name1',
                            name: 'name1',
                            width: 200,
                            label: 'Name',
                            labelWidth: 45,
                            autoComplete: false,
                            clearable: false,
                            maxLength: 30
                        },
                        {
                            xtype: 'container',
                            itemId: 'motora',
                            layout: 'hbox',
                            items: [
                                {
                                    xtype: 'numberfield',
                                    allowBlank: false,
                                    itemId: 'pin',
                                    name: 'pin',
                                    width: 100,
                                    margin: '0 0 0 10',
                                    label: 'Pin',
                                    labelWidth: 40,
                                    validationMessage: 'Invalid Pin Number',
                                    maxValue: 27,
                                    minValue: 2
                                },
                                {
                                    xtype: 'numberfield',
                                    name: 'rangeMin',
                                    width: 120,
                                    margin: '0 0 0 10',
                                    label: '&#181;S Min',
                                    labelWidth: 55,
                                    value: 1000
                                },
                                {
                                    xtype: 'numberfield',
                                    name: 'rangeMax',
                                    width: 120,
                                    margin: '0 0 0 10',
                                    label: '&#181;S Max',
                                    labelWidth: 55,
                                    value: 2000
                                }
                            ]
                        },
                        {
                            xtype: 'container',
                            margin: '5 0 0 0',
                            layout: 'hbox',
                            items: [
                                {
                                    xtype: 'container',
                                    html: 'Power:',
                                    padding: '8 10 0 0'
                                },
                                {
                                    xtype: 'numberfield',
                                    name: 'min',
                                    width: 100,
                                    margin: '0 0 0 10',
                                    label: 'Min %',
                                    labelTextAlign: 'right',
                                    labelWidth: 50,
                                    value: 0,
                                    maxValue: 100,
                                    minValue: 0
                                },
                                {
                                    xtype: 'numberfield',
                                    name: 'max',
                                    width: 100,
                                    margin: '0 0 0 10',
                                    label: 'Max %',
                                    labelWidth: 50,
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
                this.queryById('escpins').hide();
                break;
            case 'l298n':
                this.queryById('l298npins').show();
                this.queryById('escpins').hide();
                break;
            case 'esc':
                this.queryById('l298npins').hide();
                this.queryById('escpins').show();
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
                //this.queryById('motorConfigs2').setValues(config);
                this.queryById('l298npins').setValues(config);
                break;
            case 'esc':
                //this.queryById('namesingle').setValue(config.name1);
                //this.queryById('motorConfigs1').setValues(config);
                this.queryById('escpins').setValues(config);
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
                //Ext.apply(values, this.queryById('motorConfigs2').getValues());
                Ext.apply(values, this.queryById('l298npins').getValues());
                break;
            case 'esc':
                Ext.apply(values, this.queryById('escpins').getValues());
                //Ext.apply(values, this.queryById('motorConfigs1').getValues());
                break;
        }

        return values;
    }

});