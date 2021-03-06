/*
 * File: app/view/HardwareServo.js
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

Ext.define('RobotDriver.view.HardwareServo', {
    extend: 'Ext.form.Panel',
    alias: 'widget.hardwareservo',

    requires: [
        'RobotDriver.view.HardwareServoViewModel',
        'Ext.Container',
        'Ext.field.Display',
        'Ext.Spacer',
        'Ext.Button',
        'Ext.field.Number'
    ],

    viewModel: {
        type: 'hardwareservo'
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
                    width: 63,
                    html: 'Servo'
                },
                {
                    xtype: 'textfield',
                    itemId: 'name',
                    name: 'name',
                    label: 'Name',
                    labelWidth: 50,
                    autoComplete: false,
                    clearable: false
                },
                {
                    xtype: 'displayfield',
                    hidden: true,
                    name: 'type',
                    value: 'servo'
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
            xtype: 'container',
            itemId: 'pan',
            margin: '0 0 20 0',
            defaults: {
                clearable: false
            },
            layout: 'hbox',
            items: [
                {
                    xtype: 'numberfield',
                    itemId: 'pin',
                    name: 'pin',
                    width: 100,
                    margin: '0 0 0 10',
                    label: 'Pin',
                    labelWidth: 35,
                    maxValue: 27,
                    minValue: 2
                },
                {
                    xtype: 'container',
                    style: {
                        margin: '5px 5px 0 12px',
                        'font-weight': 'bold',
                        'font-size': '15px'
                    },
                    html: 'Range:'
                },
                {
                    xtype: 'numberfield',
                    name: 'startingPosition',
                    width: 170,
                    margin: '0 0 0 10',
                    label: 'Starting Position',
                    labelWidth: 110,
                    value: 1500
                },
                {
                    xtype: 'numberfield',
                    name: 'rangeMin',
                    width: 150,
                    margin: '0 0 0 10',
                    label: '&#181;S Min',
                    labelWidth: 55,
                    value: 800
                },
                {
                    xtype: 'numberfield',
                    name: 'rangeMax',
                    width: 150,
                    margin: '0 0 0 10',
                    label: '&#181;S Max',
                    labelWidth: 55,
                    value: 2400
                }
            ]
        }
    ],

    onMybutton9Tap: function(button, e, eOpts) {
        this.fireEvent('hardwaredelete', this);
    },

    setConfigValues: function(config) {
        this.setValues(config);

        this.hardwareId = config.hardwareId;
    },

    getConfigValues: function() {
        let values = this.getValues();

        values.hardwareId = this.hardwareId;

        return values;
    }

});