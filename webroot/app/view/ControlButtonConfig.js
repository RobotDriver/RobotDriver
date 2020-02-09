/*
 * File: app/view/ControlButtonConfig.js
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

Ext.define('RobotDriver.view.ControlButtonConfig', {
    extend: 'Ext.form.Panel',
    alias: 'widget.controlbuttonconfig',

    requires: [
        'RobotDriver.view.HardwareServoViewModel4',
        'RobotDriver.view.ControlHardwareCombo',
        'RobotDriver.view.ControlButton',
        'RobotDriver.view.ControlManagementButtons',
        'Ext.field.ComboBox',
        'Ext.XTemplate',
        'Ext.Spacer',
        'Ext.Panel'
    ],

    viewModel: {
        type: 'controlbuttonconfig'
    },
    border: true,
    defaultListenerScope: true,

    items: [
        {
            xtype: 'container',
            layout: 'hbox',
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
                                    xtype: 'controlhardwarecombo',
                                    itemId: 'hardware',
                                    listeners: {
                                        select: {
                                            fn: 'onHardwareSelect1',
                                            delay: 1
                                        }
                                    }
                                },
                                {
                                    xtype: 'textfield',
                                    enableKeyEvents: true,
                                    itemId: 'label',
                                    name: 'label',
                                    margin: 10,
                                    label: 'Label',
                                    labelWidth: 50,
                                    autoComplete: false,
                                    clearable: false,
                                    listeners: {
                                        change: 'onMytextfield3Change'
                                    }
                                }
                            ]
                        },
                        {
                            xtype: 'container',
                            padding: 10,
                            layout: {
                                type: 'hbox',
                                align: 'start'
                            },
                            items: [
                                {
                                    xtype: 'container',
                                    itemId: 'senchacolorpicker',
                                    width: 152
                                },
                                {
                                    xtype: 'combobox',
                                    name: 'icon',
                                    margin: '0 0 0 10',
                                    label: 'icon',
                                    labelWidth: 40,
                                    matchFieldWidth: false,
                                    displayField: 'name',
                                    itemTpl: [
                                        '<span class="x-fa fa-{name}"></span>&nbsp;&nbsp;&nbsp;&nbsp;{name}'
                                    ],
                                    valueField: 'name',
                                    anyMatch: true,
                                    minChars: 1,
                                    queryMode: 'local',
                                    typeAhead: true,
                                    bind: {
                                        store: '{iconStore}'
                                    },
                                    listeners: {
                                        select: 'onMycombobox7Select'
                                    }
                                },
                                {
                                    xtype: 'spacer'
                                }
                            ]
                        },
                        {
                            xtype: 'container',
                            items: [
                                {
                                    xtype: 'combobox',
                                    itemId: 'actionType',
                                    name: 'actionType',
                                    width: 347,
                                    margin: 10,
                                    label: 'Action Type',
                                    labelWidth: 80,
                                    value: 'momentary',
                                    displayField: 'display',
                                    valueField: 'value',
                                    queryMode: 'local',
                                    bind: {
                                        store: '{actionTypeStore}'
                                    },
                                    listeners: {
                                        select: 'onActionTypeSelect'
                                    }
                                }
                            ]
                        }
                    ]
                },
                {
                    xtype: 'container',
                    items: [
                        {
                            xtype: 'panel',
                            border: true,
                            width: 100,
                            title: 'Preview',
                            layout: {
                                type: 'vbox',
                                align: 'start'
                            },
                            items: [
                                {
                                    xtype: 'controlbutton',
                                    itemId: 'controlbutton'
                                }
                            ]
                        }
                    ]
                },
                {
                    xtype: 'container',
                    flex: 1,
                    layout: {
                        type: 'hbox',
                        align: 'start'
                    },
                    items: [
                        {
                            xtype: 'spacer',
                            flex: 1
                        },
                        {
                            xtype: 'controlmanagementbuttons',
                            bubbleEvents: [
                                'controldelete',
                                'controlmoveup',
                                'controlmovedown'
                            ],
                            itemId: 'controlmanagementbuttons1'
                        }
                    ]
                }
            ]
        }
    ],
    listeners: {
        painted: 'onFormpanelPainted'
    },

    onHardwareSelect1: function(selection) {
        if(selection !== null && this.queryById('label').getValue() == ''){
            this.queryById('label').setValue(selection.data.name);
        }
    },

    onMytextfield3Change: function(field, newValue, oldValue, eOpts) {
        this.queryById('controlbutton').setLabel(newValue);
    },

    onMycombobox7Select: function(combobox, newValue, oldValue, eOpts) {
        this.queryById('controlbutton').setButtonIcon(newValue.data.name);
    },

    onActionTypeSelect: function(combobox, newValue, oldValue, eOpts) {
        if(newValue !== null){
            this.queryById('controlbutton').setButtonActionType(newValue.data.value);
        }
    },

    onFormpanelPainted: function(sender, element, eOpts) {
        if(this.init){
           return;
        }else{
           this.init = true;
        }

        this.controlId = element.component.config.controlId;

        this.colorPicker = Ext.create("RobotDriver.ColorPicker",
        {
            labelWidth: 55,
            width:150,
            name:'color',
            label:'Color',
            value: this.configColor || '#E67E22', // initial color
            renderTo: this.queryById('senchacolorpicker'),
            listeners: {
                scope:this,
                change: function(field, newVal) {
                    this.buttonChangeColor(newVal);
                }
            }
        });

        this.buttonChangeColor(this.configColor || '#E67E22');
    },

    getConfigValues: function() {
        let values = this.getValues();

        values.type='button';
        values.controlId = this.controlId;

        values.hardwareId = this.queryById('hardware').getHardwareId();

        values.color = this.configColor;
        values.colorShadow = this.configColorShadow;
        values.iconColor = this.configContrastColor;

        return values;
    },

    buttonChangeColor: function(color) {
        this.configColor = color;
        this.configColorShadow = this.pSBC( -0.4, color, false, true );
        this.configContrastColor = this.contrastColor(color);

        this.queryById('controlbutton').updateButtonStyles(color, this.configColorShadow, this.configContrastColor);
    },

    setConfigValues: function(config) {
        let button = this.queryById('controlbutton');
        button.setButtonActionType(config.actionType);

        //this.controlId = config.controlId;

        this.setValues(config);

        button.setLabel(config.label);

        this.configColor = config.color;
        this.configColorShadow = this.pSBC( -0.4, config.color, false, true );
        this.configContrastColor = this.contrastColor(config.color);

        button.updateButtonStyles(config.color, this.configColorShadow, this.configContrastColor);

        this.queryById('hardware').setHardwareId(config.hardwareId);
    },

    pSBC: function(p, c0, c1, l) {
        //const pSBC=(p,c0,c1,l)=>{
        	let r,g,b,P,f,t,h,i=parseInt,m=Math.round,a=typeof(c1)=="string";
        	if(typeof(p)!="number"||p<-1||p>1||typeof(c0)!="string"||(c0[0]!='r'&&c0[0]!='#')||(c1&&!a))return null;
        	if(!this.pSBCr)this.pSBCr=(d)=>{
        		let n=d.length,x={};
        		if(n>9){
        			[r,g,b,a]=d=d.split(","),n=d.length;
        			if(n<3||n>4)return null;
        			x.r=i(r[3]=="a"?r.slice(5):r.slice(4)),x.g=i(g),x.b=i(b),x.a=a?parseFloat(a):-1
        		}else{
        			if(n==8||n==6||n<4)return null;
        			if(n<6)d="#"+d[1]+d[1]+d[2]+d[2]+d[3]+d[3]+(n>4?d[4]+d[4]:"");
        			d=i(d.slice(1),16);
        			if(n==9||n==5)x.r=d>>24&255,x.g=d>>16&255,x.b=d>>8&255,x.a=m((d&255)/0.255)/1000;
        			else x.r=d>>16,x.g=d>>8&255,x.b=d&255,x.a=-1
        		}return x};
        	h=c0.length>9,h=a?c1.length>9?true:c1=="c"?!h:false:h,f=this.pSBCr(c0),P=p<0,t=c1&&c1!="c"?this.pSBCr(c1):P?{r:0,g:0,b:0,a:-1}:{r:255,g:255,b:255,a:-1},p=P?p*-1:p,P=1-p;
        	if(!f||!t)return null;
        	if(l)r=m(P*f.r+p*t.r),g=m(P*f.g+p*t.g),b=m(P*f.b+p*t.b);
        	else r=m((P*f.r**2+p*t.r**2)**0.5),g=m((P*f.g**2+p*t.g**2)**0.5),b=m((P*f.b**2+p*t.b**2)**0.5);
        	a=f.a,t=t.a,f=a>=0||t>=0,a=f?a<0?t:t<0?a:a*P+t*p:0;
        	if(h)return"rgb"+(f?"a(":"(")+r+","+g+","+b+(f?","+m(a*1000)/1000:"")+")";
        	else return"#"+(4294967296+r*16777216+g*65536+b*256+(f?m(a*255):0)).toString(16).slice(1,f?undefined:-2)
        //};
    },

    contrastColor: function(hex) {
        // https://stackoverflow.com/a/35970186

        if (hex.indexOf('#') === 0) {
            hex = hex.slice(1);
        }
        // convert 3-digit hex to 6-digits.
        if (hex.length === 3) {
            hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
        }
        if (hex.length !== 6) {
            throw new Error('Invalid HEX color.');
        }
        var r = parseInt(hex.slice(0, 2), 16),
            g = parseInt(hex.slice(2, 4), 16),
            b = parseInt(hex.slice(4, 6), 16);

        // http://stackoverflow.com/a/3943023/112731
        return (r * 0.299 + g * 0.587 + b * 0.114) > 186
            ? '#000000'
        : '#FFFFFF';
    }

});