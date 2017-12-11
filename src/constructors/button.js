/**
 * 按钮构造器
 * @author ydr.me
 * @create 2017-12-11 16:18
 * @update 2017-12-11 16:18
 */


'use strict';

var modification = require('blear.core.modification');
var Events = require('blear.classes.events');
var object = require('blear.utils.object');

var namespace = 'blearui-editor';
var iconClassName = namespace + '-icon';
var buttonClassName = namespace + '-button';
var defaults = {
    name: '',
    title: ''
};
var Button = Events.extend({
    constructor: function (options) {
        var the = this;

        Button.parent(the);
        the[_options] = object.assign({}, defaults, options);
        the[_el] = modification.create('div', {
            class: buttonClassName + ' ' + buttonClassName + '-' + options.name
        });
        the[_buttonEl] = modification.create('i', {
            class: iconClassName + ' ' + iconClassName + '-' + options.name,
            title: options.title
        });
        modification.insert(the[_buttonEl], the[_el]);
    },

    /**
     * 获取按钮元素
     * @returns {*}
     */
    getEl: function () {
        return this[_el];
    },

    /**
     * 获取按钮元素
     * @returns {*}
     */
    getButtonEl: function () {
        return this[_buttonEl];
    },

    /**
     * 销毁实例
     */
    destroy: function () {
        var the = this;

        modification.remove(the[_el])
    }
});
var sole = Button.sole;
var _el = sole();
var _buttonEl = sole();
var _options = sole();


/**
 * 创建按钮
 * @param editor
 * @param options
 * @returns Button
 */
module.exports = function (editor, options) {
    var button = new Button(options);
    modification.insert(button.getEl(), editor.getHeaderEl());
    return button;
};
