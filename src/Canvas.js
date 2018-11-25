"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var stream_1 = require("stream");
var request = require("request");
var fs = require("fs");
var CanvasMethodCall = (function () {
    function CanvasMethodCall(methodName, args) {
        this.type = 'methodCall';
        this.methodName = methodName;
        this.args = args || [];
    }
    return CanvasMethodCall;
}());
exports.CanvasMethodCall = CanvasMethodCall;
var CanvasPropSet = (function () {
    function CanvasPropSet(propertyName, value) {
        this.type = 'propSet';
        this.methodName = propertyName;
        this.value = value;
    }
    return CanvasPropSet;
}());
exports.CanvasPropSet = CanvasPropSet;
var CanvasCustomMethodCall = (function () {
    function CanvasCustomMethodCall(methodName, args) {
        this.type = 'customMethodCall';
        this.methodName = methodName;
        this.args = args || [];
    }
    return CanvasCustomMethodCall;
}());
exports.CanvasCustomMethodCall = CanvasCustomMethodCall;
var Canvas = (function () {
    function Canvas(width, height, options) {
        this.$options = {
            width: width,
            height: height
        };
        this.$serverOptions = options || {};
        this.$serverOptions.serverUrl = this.$serverOptions.serverUrl || Canvas.defaultOptions.serverUrl;
        this.$serverOptions.timeout = this.$serverOptions.timeout || Canvas.defaultOptions.timeout;
        this.$commands = [];
    }
    Object.defineProperty(Canvas.prototype, "fillStyle", {
        get: function () {
            return this.$fillStyle;
        },
        set: function (value) {
            this.$fillStyle = value;
            this.$commands.push(new CanvasPropSet('fillStyle', value));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Canvas.prototype, "lineWidth", {
        get: function () {
            return this.$lineWidth;
        },
        set: function (value) {
            this.$lineWidth = value;
            this.$commands.push(new CanvasPropSet('lineWidth', value));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Canvas.prototype, "globalAlpha", {
        get: function () {
            return this.$globalAlpha;
        },
        set: function (value) {
            this.$globalAlpha = value;
            this.$commands.push(new CanvasPropSet('globalAlpha', value));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Canvas.prototype, "strokeStyle", {
        get: function () {
            return this.$strokeStyle;
        },
        set: function (value) {
            this.$strokeStyle = value;
            this.$commands.push(new CanvasPropSet('strokeStyle', value));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Canvas.prototype, "font", {
        get: function () {
            return this.$font;
        },
        set: function (value) {
            this.$font = value;
            this.$commands.push(new CanvasPropSet('font', value));
        },
        enumerable: true,
        configurable: true
    });
    Canvas.prototype.fillRect = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        this.$commands.push(new CanvasMethodCall('fillRect', args));
    };
    Canvas.prototype.rotate = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        this.$commands.push(new CanvasMethodCall('rotate', args));
    };
    Canvas.prototype.beginPath = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        this.$commands.push(new CanvasMethodCall('beginPath', args));
    };
    Canvas.prototype.arc = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        this.$commands.push(new CanvasMethodCall('arc', args));
    };
    Canvas.prototype.fill = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        this.$commands.push(new CanvasMethodCall('fill', args));
    };
    Canvas.prototype.stroke = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        this.$commands.push(new CanvasMethodCall('stroke', args));
    };
    Canvas.prototype.fillText = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        this.$commands.push(new CanvasMethodCall('fillText', args));
    };
    Canvas.prototype.moveTo = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        this.$commands.push(new CanvasMethodCall('moveTo', args));
    };
    Canvas.prototype.lineTo = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        this.$commands.push(new CanvasMethodCall('lineTo', args));
    };
    Canvas.prototype.quadraticCurveTo = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        this.$commands.push(new CanvasMethodCall('quadraticCurveTo', args));
    };
    Canvas.prototype.closePath = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        this.$commands.push(new CanvasMethodCall('closePath', args));
    };
    Canvas.prototype.save = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        this.$commands.push(new CanvasMethodCall('save', args));
    };
    Canvas.prototype.clip = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        this.$commands.push(new CanvasMethodCall('clip', args));
    };
    Canvas.prototype.restore = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        this.$commands.push(new CanvasMethodCall('restore', args));
    };
    Canvas.prototype.drawImage = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        this.$commands.push(new CanvasCustomMethodCall('drawImage', args));
    };
    Canvas.prototype.toBase64 = function (callback) {
        request({
            url: this.$serverOptions.serverUrl + "/produce-img",
            method: 'POST',
            json: {
                options: this.$options,
                commands: this.$commands
            },
            timeout: this.$serverOptions.timeout
        }, function (e, res, body) {
            if (e)
                callback(e, undefined);
            else
                callback(undefined, body.base64);
        });
    };
    Canvas.prototype.toBuffer = function (callback) {
        this.toBase64(function (e, base64) {
            if (e)
                callback(e, undefined);
            else {
                var buffer = new Buffer(base64, 'base64');
                callback(undefined, buffer);
            }
        });
    };
    Canvas.prototype.toStream = function (callback) {
        this.toBuffer(function (e, buffer) {
            if (e) {
                callback(e, undefined);
            }
            else {
                var stream = new stream_1.Stream.PassThrough();
                stream.end(buffer);
                callback(undefined, stream);
            }
        });
    };
    Canvas.prototype.toFile = function (filePath, callback) {
        this.toBuffer(function (e, buffer) {
            if (e) {
                callback(e);
            }
            else {
                fs.writeFile(filePath, buffer, callback);
            }
        });
    };
    return Canvas;
}());
Canvas.defaultOptions = {
    serverUrl: 'http://localhost:1900',
    timeout: 15000
};
exports.Canvas = Canvas;
