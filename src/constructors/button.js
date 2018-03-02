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
var event = require('blear.core.event');
var object = require('blear.utils.object');
var typeis = require('blear.utils.typeis');

var namespace = require('../settings.json').namespace;
var buttonClassName = namespace + '-button';
var mousedownEventType = 'mousedown';
var defaults = {
    el: null,
    activeClassName: 'active',
    action: function () {
        // ignore
    },
    as: null
};
var Button = Events.extend({
    constructor: function (options) {
        var the = this;

        Button.parent(the);
        the[_options] = object.assign({}, defaults, options);
        var as = the[_options].as;
        the[_options].as = typeis.Function(as) ? as : function () {
            return false;
        };
        the[_el] = selector.query(the[_options].el)[0];
        attribute.addClass(the[_el], buttonClassName);
        event.on(the[_el], mousedownEventType, the[_onMousedownListener] = function () {
            if (the.emit('action', the[_options].action) !== false) {
                the[_options].action();
            }

            the.update();
            return false;
        });
        the.active = false;
    },

    /**
     * 切换按钮状态
     * @returns {Button}
     */
    toggle: function (active) {
        var the = this;
        the[_active](!the.active);
        return the;
    },

    /**
     * 更新状态
     * @returns {Button}
     */
    update: function () {
        var the = this;
        var boolean = the[_options].as();
        the[_active](boolean);
        return the;
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
var pro = Button.prototype;
var sole = Button.sole;
var _options = sole();
var _el = sole();
var _onMousedownListener = sole();
var _active = sole();


Button.defaults = defaults;
module.exports = Button;


/**
 * 激活按钮
 * @param boolean
 */
pro[_active] = function (boolean) {
    var the = this;
    var activeClassName = the[_options].activeClassName;

    if (boolean === the.active) {
        return;
    }

    the.active = boolean;
    attribute[(boolean ? 'add' : 'remove') + 'Class'](the[_el], activeClassName);
};
