/*
 * File: app/view/HardwareServoViewModel2.js
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

Ext.define('RobotDriver.view.HardwareServoViewModel2', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.hardwarei2c',

    requires: [
        'Ext.data.Store',
        'Ext.data.field.Field'
    ],

    stores: {
        i2cdevices: {
            data: [
                [
                    'ina219',
                    'INA219 Voltage/Current Sensor'
                ],
                [
                    'bme280',
                    'BME280 Temp,Pres,Humidity'
                ],
                [
                    'oled',
                    'OLED Display'
                ]
            ],
            fields: [
                {
                    name: 'value'
                },
                {
                    name: 'display'
                }
            ]
        }
    }

});