/**
 * Menu
 * @author ydr.me
 * @create 2017-12-12 18:04
 * @update 2017-12-12 18:04
 */


'use strict';

var Events = require('blear.classes.events');
var modification = require('blear.core.modification');
var object = require('blear.utils.object');

var namespace = require('../settings.json').namespace;
var iconClassName = namespace + '-menu';
var defaults = {
    shortcut: null,
    action: function () {

    }
};
var Menu = Events.extend({
    constructor: function (editor, options) {
        var the = this;

        Menu.parent(the);
        the[_editor] = editor;
        the[_options] = object.assign({}, defaults, options);
        the[_el] = modification.create('div', {
            class: iconClassName
        });
        modification.insert(the[_el], editor.getHeaderEl());
    },

    /**
     * 获取元素
     * @returns {*}
     */
    getEl: function () {
        return this[_el];
    },

    /**
     * 插入按钮
     * @param button
     * @returns {Menu}
     */
    button: function (button) {
        var the = this;
        var options = the[_options];
        var action = options.action;

        modification.insert(button.getEl(), the[_el]);

        // 编辑器内容变化
        the[_editor].on('change', function () {
            button.update();
        });

        // 绑定快捷键
        if (options.shortcut) {
            the[_editor].shortcut(options.shortcut, function (ev) {
                button.exec();
            });
        }

        return the;
    },

    /**
     * 插入下拉框
     * @param options
     * @returns {Menu}
     */
    options: function (options) {
        var the = this;
        modification.insert(options.getEl(), the[_el]);
        return the;
    },

    /**
     * 销毁实例
     */
    destroy: function () {
        var the = this;

        Events.invoke('destroy', the);
        modification.remove(the[_el]);
    }
});

Menu.defaults = defaults;
var sole = Menu.sole;
var _editor = sole();
var _options = sole();
var _el = sole();


module.exports = Menu;







