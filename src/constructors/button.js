/**
 * Button
 * @author ydr.me
 * @create 2017-12-12 17:38
 * @update 2017-12-12 17:38
 */


'use strict';

var Events = require('blear.classes.events');
var selector = require('blear.core.selector');
var attribute = require('blear.core.attribute');
var modification = require('blear.core.modification');
var event = require('blear.core.event');
var object = require('blear.utils.object');

var namespace = require('../settings.json').namespace;
var buttonClassName = namespace + '-button';
var DYNAMIC_TYPE = 'dynamic';
var STATIC_TYPE = 'static';
var mousedownEventType = 'mousedown';
var defaults = {
    el: null
};
var Button = Events.extend({
    constructor: function (options) {
        var the = this;

        Button.parent(the);
        the[_options] = object.assign({}, defaults, options);
        the[_el] = selector.query(the[_options].el)[0];
        attribute.addClass(the[_el], buttonClassName);
        event.on(the[_el], mousedownEventType, the[_onMousedownListener] = function () {
            the.emit('action');
            return false;
        });
    },

    /**
     * 获取元素
     * @returns {*}
     */
    getEl: function () {
        return this[_el];
    },

    /**
     * 销毁实例
     */
    destroy: function () {
        var the = this;

        Events.invoke('destroy', the);
        event.un(the[_el], mousedownEventType, the[_onMousedownListener]);
    }
});
var sole = Button.sole;
var _options = sole();
var _el = sole();
var _onMousedownListener = sole();


Button.defaults = defaults;
module.exports = Button;

