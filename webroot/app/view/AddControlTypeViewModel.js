/*
 * File: app/view/AddControlTypeViewModel.js
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

Ext.define('RobotDriver.view.AddControlTypeViewModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.addcontroltype',

    requires: [
        'Ext.data.Store',
        'Ext.data.field.Field'
    ],

    stores: {
        controlTypeStore: {
            data: [
                [
                    'slider',
                    'Slider'
                ],
                [
                    'stick',
                    'Stick'
                ],
                [
                    'button',
                    'Button'
                ]//,
                //['dpad','D-Pad']
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