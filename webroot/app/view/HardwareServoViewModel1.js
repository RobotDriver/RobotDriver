/*
 * File: app/view/HardwareServoViewModel1.js
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

Ext.define('RobotDriver.view.HardwareServoViewModel1', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.hardwaremotordriver',

    requires: [
        'Ext.data.Store',
        'Ext.data.field.Field'
    ],

    stores: {
        configPwmTypeStore: {
            data: [
                [
                    'pca9685',
                    'PCA9685 i2c PWM Driver'
                ],
                [
                    'l298n',
                    'L298N on GPIO'
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