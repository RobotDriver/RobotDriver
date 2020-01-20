Ext.define("RobotDriver.ColorPicker", {
    extend: "Ext.field.Text",
    clearable:false,

    regex: /^\#[0-9A-F]{6}$/i,
    allowBlank: false,
    setOnChange: "background",

    contrastColor: function (hex) {
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
    },

    listeners: {
        painted:function(){
            if(!this.tapAdded){
                this.tapAdded = true;
                
                this.el.on('tap', function(){
                    
                    this.showPicker();
                }, this);
                
                let val = this.getValue();
                if(!val){ 
                    this.setValue("#FFFFFF");
                }else{
                    this.setBackgroundColor(val);
                }
                this.fireEvent("select");
            }
        },
//         focus:function(){
//             console.log('focus!');

//             if (this.disabled) {
//                 return;
//             }
//             this.showPicker();
//         },
        select: function () {
            console.log('select!');
            console.log(this);
            console.log(this.el);
            this.setBackgroundColor(this.getValue());
        }
    },
    setBackgroundColor:function(color){
        var a = this.inputElement.dom;
        if (this.setOnChange == "background") {
            a.style.backgroundColor = color;
            console.log('contrast color ',this.contrastColor(color));
            a.style.color = this.contrastColor(color);
        } else {
            if (this.setOnChange == "color") {
                a.style.color = this.getValue();
            } else {
                if (typeof this.setOnChange == "function") {
                    this.setOnChange();
                }
            }
        }
    },
    showPicker:function(){
        
            var a = this;
            if (!this.menu) {
                this.createPicker();
            }
            
            let xy = this.el.getXY();
            
            xy[0] += this.el.getWidth();
            
            this.menu.showAt(xy);
    },
    createPicker:function(){
        var a = this;
        this.menu = Ext.create({
            xtype:'menu',
            //plain: true,
            //width:250,
            //height:250,
            separator: false,
            userCls:'colorpickermenu',
            items: [{
                xtype: "container",
                autoEl: {
                    tag: "div",
                    height: 195,
                    width: 195,
                    cls: "ux-color-picker"
                },
                //getParent: function () {
                //    this.up("form");
                //},
                listeners: {
                    painted: function () {
                        if(!this.spectrumpainted){
                            this.spectrumpainted = true;
                            el = this.el.dom.appendChild(document.createElement("div"));
                            el.className = 'canvascontainer';
                            a.drawSpace = el;
                            a.drawSpectrum();
                        }
                    }
                }
            }]
        });
    },
    drawSpectrum: function () {
        console.log('drawSpectrum!');
        var a = this;
        !a.isValid() && a.setValue("#FFFFFF");
        a.spectrum = this.drawSpace.appendChild(document.createElement("canvas"));
        var b = a.spectrum.getContext("2d");
        a.spectrum.setAttribute("width", "200");
        a.spectrum.setAttribute("height", "200");
        a.spectrum.setAttribute("class", "ux-color-picker-spectrum");
        var c = new Image();
        c.onload = function () {
            b.drawImage(c, 0, 0)
        };
        c.src = a.spectrumImg || "resources/spectrum.png";
        a.drawLuminance();
        
        var extel = Ext.get(a.drawSpace);
        console.log(extel);
        extel.on("tap", function (h, d) {
            console.log('tap');
            function i(l, k, e) {
                var j = "0123456789ABCDEF";
                return "#" + (j[parseInt(l / 16)] + j[parseInt(l % 16)] + j[parseInt(k / 16)] + j[parseInt(k % 16)] + j[parseInt(e / 16)] + j[parseInt(e % 16)])
            }
            b = a.spectrum.getContext("2d");
            var g = [h.getXY()[0] - Ext.get(d).getLeft(), h.getXY()[1] - Ext.get(d).getTop()];
            try {
                var f = b.getImageData(g[0], g[1], 1, 1);
                } catch (h) {
                    return;
                }
            if (f.data[3] == 0) {
                b = a.luminance.getContext("2d");
                f = b.getImageData(g[0], g[1], 1, 1);
                if (f.data[3] == 0) {
                    return;
                }
                a.setValue(i(f.data[0], f.data[1], f.data[2]));
            } else {
                a.setValue(i(f.data[0], f.data[1], f.data[2]));
                a.drawLuminance();
            }
            a.fireEvent("select")
        })
    },

    drawLuminance: function () {
        var b = this;
        if (!b.luminance) {
            b.luminance = el.appendChild(document.createElement("canvas"));
            b.luminance.setAttribute("width", "200");
            b.luminance.setAttribute("height", "200");
            b.luminance.setAttribute("class", "ux-color-picker-luminance")
        }

        var c = b.luminance.getContext("2d");
        var a = [97.5, 98];
        c.clearRect(0, 0, b.luminance.width, b.luminance.height);
        c.beginPath();
        c.fillStyle = b.getValue();
        c.strokeStyle = b.getValue();
        c.arc(a[0], a[0], 65, 0, 2 * Math.PI, false);
        c.closePath();
        c.fill();

        var d = new Image();
        d.onload = function () {
            c.drawImage(d, 33, 32)
        };
        d.src = b.luminanceImg || "resources/luminance.png"
    }
});