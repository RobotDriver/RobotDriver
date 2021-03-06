/*
 * File: app/view/HardwareMotorViewModel.js
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

Ext.define('RobotDriver.view.HardwareMotorViewModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.hardwaremotor',

    requires: [
        'Ext.data.Store',
        'Ext.data.field.Field'
    ],

    stores: {
        motorDriverType: {
            data: [
                [
                    'l298n',
                    'L298N on GPIO'
                ],
                [
                    'esc',
                    'RC ESC / GPIO PWM'
                ],
                [
                    'pca9685',
                    'PCA9685 i2c PWM Driver'
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