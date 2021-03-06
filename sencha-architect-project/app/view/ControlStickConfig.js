/*
 * File: app/view/ControlStickConfig.js
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

Ext.define('RobotDriver.view.ControlStickConfig', {
    extend: 'Ext.form.Panel',
    alias: 'widget.controlstickconfig',

    requires: [
        'RobotDriver.view.ControlStickConfigViewModel',
        'RobotDriver.view.ControlHardwareCombo',
        'RobotDriver.view.BaseControlStick',
        'RobotDriver.view.ControlManagementButtons',
        'Ext.field.Text',
        'Ext.field.Checkbox',
        'Ext.Panel'
    ],

    viewModel: {
        type: 'controlstickconfig'
    },
    border: true,
    defaultListenerScope: true,

    layout: {
        type: 'hbox',
        align: 'start'
    },
    items: [
        {
            xtype: 'container',
            itemId: 'mycontainer71',
            layout: {
                type: 'vbox',
                align: 'start'
            },
            items: [
                {
                    xtype: 'textfield',
                    enableKeyEvents: true,
                    itemId: 'labelText',
                    name: 'label',
                    margin: '6 0 0 70',
                    label: 'Label',
                    labelWidth: 50,
                    autoComplete: false,
                    clearable: false,
                    listeners: {
                        change: 'onMytextfield3Change1'
                    }
                },
                {
                    xtype: 'checkbox',
                    itemId: 'mycheckbox',
                    name: 'tankControls',
                    width: 237,
                    margin: '0 0 0 100',
                    label: 'Enable Tank-Style Motor Control',
                    labelAlign: 'right',
                    labelWidth: 210,
                    listeners: {
                        change: 'onMycheckboxChange'
                    }
                },
                {
                    xtype: 'container',
                    layout: 'hbox',
                    items: [
                        {
                            xtype: 'container',
                            itemId: 'xMotorLabel',
                            style: {
                                'text-align': 'right'
                            },
                            width: 75,
                            html: 'X Axis',
                            margin: '18 0 0 6'
                        },
                        {
                            xtype: 'controlhardwarecombo',
                            itemId: 'xhardware',
                            width: 350
                        }
                    ]
                },
                {
                    xtype: 'container',
                    layout: 'hbox',
                    items: [
                        {
                            xtype: 'container',
                            itemId: 'yMotorLabel',
                            style: {
                                'text-align': 'right'
                            },
                            width: 75,
                            html: 'Y Axis',
                            margin: '18 0 0 6'
                        },
                        {
                            xtype: 'controlhardwarecombo',
                            itemId: 'yhardware',
                            width: 350
                        }
                    ]
                }
            ]
        },
        {
            xtype: 'panel',
            border: true,
            margin: '0 0 0 40',
            title: 'Preview',
            items: [
                {
                    xtype: 'basecontrolstick',
                    itemId: 'stickPreview'
                }
            ]
        },
        {
            xtype: 'container',
            flex: 1
        },
        {
            xtype: 'controlmanagementbuttons',
            bubbleEvents: [
                'controldelete',
                'controlmoveup',
                'controlmovedown'
            ]
        }
    ],
    listeners: {
        painted: 'onFormpanelPainted'
    },

    onMytextfield3Change1: function(field, newValue, oldValue, eOpts) {
        this.queryById('stickPreview').setLabel(newValue);
    },

    onMycheckboxChange: function(checkbox, newValue, oldValue, eOpts) {
        console.log(newValue, oldValue);
        if(newValue === true){
            this.queryById('xMotorLabel').setHtml('Left Motor');
            this.queryById('yMotorLabel').setHtml('Right Motor');
        }else{
            this.queryById('xMotorLabel').setHtml('X Axis');
            this.queryById('yMotorLabel').setHtml('Y Axis');
        }
    },

    onFormpanelPainted: function(sender, element, eOpts) {
        if(this.init){
           return;
        }else{
           this.init = true;
        }

        this.controlId = element.component.config.controlId;
        if(element.component.config.label){
            this.queryById('stickPreview').setLabel(element.component.config.label);
        }
    },

    setConfigValues: function(config) {
        console.log('setConfigValues', config);
        this.setValues(config);

        // if(config.hardware && config.hardware.type==='motor'){
        //     console.log('yah');
        //     this.queryById('sliderPreview').showMotorLabels();
        // }else{
        //     this.queryById('sliderPreview').hideMotorLabels();
        // }
        this.queryById('stickPreview').setLabel(config.label);

        this.queryById('xhardware').setHardwareId(config.xhardwareId);
        this.queryById('yhardware').setHardwareId(config.yhardwareId);
    },

    getConfigValues: function() {
        let values = this.getValues();
        values.type='stick';

        values.controlId = this.controlId;
        values.label = this.queryById('stickPreview').getLabel();

        values.xhardwareId = this.queryById('xhardware').getHardwareId();
        values.yhardwareId = this.queryById('yhardware').getHardwareId();

        return values;
    }

});