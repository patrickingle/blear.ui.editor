/**
 * 下拉菜单
 * @author ydr.me
 * @create 2017-12-11 17:38
 * @update 2017-12-11 17:38
 */


'use strict';

var Events = require('blear.classes.events');
var object = require('blear.utils.object');
var array = require('blear.utils.array');
var selector = require('blear.core.selector');
var attribute = require('blear.core.attribute');
var modification = require('blear.core.modification');
var event = require('blear.core.event');
var UI = require('blear.ui');

var namespace = require('../settings.json').namespace;
var mousedownEventType = 'mousedown';
var dropOptionsClassName = namespace + '-options';
var activeClassName = 'active';
var defaults = {
    options: [/*{text: "文本", value: "值"}*/],
    active: 0
};
var Options = Events.extend({
    constructor: function (options) {
        var the = this;

        Options.parent(the);
        the[_options] = object.assign({}, defaults, options);
        the[_activeIndex] = the[_options].active;
        the[_el] = modification.create('ul', {
            class: dropOptionsClassName
        });
        the[_lastDisplay] = false;
        the[_initNode]();
        the[_initEvent]();
    },

    /**
     * 获取菜单元素
     * @returns {HTMLElement}
     */
    getEl: function () {
        return this[_el];
    },

    /**
     * 激活某个选项
     * @param index
     * @returns {{text: String, value: *}}
     */
    active: function (index) {
        var the = this;
        var options = the[_options].options;

        if (the[_activeIndex] === index) {
            return options[index];
        }

        the[_activeIndex] = index;
        attribute.removeClass(the[_lastActiveOptionEl], activeClassName);
        attribute.addClass(the[_lastActiveOptionEl] = the[_optionsEls][index], activeClassName);

        return options[index];
    },

    /**
     * 显示菜单
     * @returns {Options}
     */
    show: function () {
        var the = this;
        the[_lastDisplay] = true;
        attribute.show(the[_el]);
        attribute.style(the[_el], 'z-index', UI.zIndex());
        return the;
    },

    /**
     * 隐藏菜单
     * @returns {Options}
     */
    hide: function () {
        var the = this;
        the[_lastDisplay] = false;
        attribute.hide(the[_el]);
        return the;
    },

    toggle: function () {
        var the = this;

        the[_lastDisplay] ? the.hide() : the.show();

        return the;
    },

    /**
     * 销毁菜单
     */
    destroy: function () {
        var the = this;

        Events.invoke('destroy', the);
        event.un(the[_el]);
        event.un(document, mousedownEventType, the[_onDocumentMousedownListener]);
        modification.remove(the[_el]);
        the[_el] = null;
    }
});
var prop = Options.prototype;
var sole = Options.sole;
var _options = sole();
var _el = sole();
var _initNode = sole();
var _initEvent = sole();
var _optionsEls = sole();
var _lastActiveOptionEl = sole();
var _activeIndex = sole();
var _lastDisplay = sole();
var _onDocumentMousedownListener = sole();


prop[_initNode] = function () {
    var the = this;
    var op = the[_options];
    var liHtml = '';

    array.each(op.options, function (index, option) {
        var isActiveClassName = index === op.active ? activeClassName : '';
        liHtml += '<li class="' + isActiveClassName + '" data-index="' + index + '"><a href="javascript:;">' + option.text + '</a></li>';
    });

    attribute.html(the[_el], liHtml);
    the[_optionsEls] = selector.children(the[_el]);
    the[_lastActiveOptionEl] = the[_optionsEls][the[_activeIndex]];
};

prop[_initEvent] = function () {
    var the = this;
    var op = the[_options];

    event.on(the[_el], mousedownEventType, 'li', function () {
        var index = attribute.data(this, 'index') * 1;
        var option = op.options[index];

        if (index === the[_activeIndex]) {
            return;
        }

        the.active(index);
        the.emit('action', index, option);
    });

    event.on(document, mousedownEventType, the[_onDocumentMousedownListener] = function (ev) {
        if (!the[_lastDisplay]) {
            return;
        }

        var targetEl = ev.target;
        var closestEl = selector.closest(targetEl, the[_el]);

        if (!closestEl.length) {
            the.emit('escape');
            the.hide();
        }
    });
};


/**
 * 创建菜单
 * @param button
 * @param options
 * @returns Options
 */
module.exports = function (button, options) {
    var menu = new Options({
        options: options
    });
    modification.insert(menu.getEl(), button.getEl());
    return menu;
};


