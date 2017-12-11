/**
 * blear.ui.editor
 * @author ydr.me
 * @create 2016年06月04日14:09:36
 */

'use strict';

var Editable = require('blear.classes.editable');
var UI = require('blear.ui');
var selector = require('blear.core.selector');
var attribute = require('blear.core.attribute');
var modification = require('blear.core.modification');
var object = require('blear.utils.object');
var fun = require('blear.utils.function');

var template = require('./template.html');
var defaults = {
    el: '',
    placeholder: '请输入',
    toolbars: []
};
var Editor = UI.extend({
    constructor: function (options) {
        var the = this;

        Editor.parent(the);
        the[_options] = object.assign({}, defaults, options);
        the[_initFrame]();
        the[_initPlaceholder]();
        the[_initEditable]();
        the[_initEvent]();
    },

    /**
     * 实例化一个按钮
     * @param meta {Object}
     * @param meta.el
     * @param meta.cmd {String|Function}
     * @param [meta.shortcut] {String}
     * @returns {Editor}
     */
    button: function (meta) {
        var the = this;
        the[_editable].button(meta);
        return the;
    },

    /**
     * 设置内容
     * @param value
     * @returns {Editor}
     */
    setValue: function (value) {
        var the = this;
        the[_editable].setValue(value);
        return the;
    },

    /**
     * 获取内容
     * @returns {string}
     */
    getValue: function () {
        return this[_editable].getValue();
    },

    // /**
    //  * 使用插件
    //  * @returns {Editor}
    //  */
    // install: function () {
    //     var the = this;
    //     return the;
    // },

    /**
     * 销毁实例
     */
    destroy: function () {
        var the = this;

        the[_editable].destroy();
        Editor.invoke('destroy', the);
        modification.insert(the[_editableEl], the[_editorEl], 3);
        modification.remove(the[_editorEl]);
        the[_editableEl] = the[_editorEl] = the[_editorToolbarsEl]
            = the[_editorPlaceholderEl] = the[_editorBodyEl]
            = the[_editorFooterEl] = null;
    }
});
var prop = Editor.prototype;
var sole = Editor.sole;
var _options = sole();
var _initFrame = sole();
var _initPlaceholder = sole();
var _initEditable = sole();
var _initEvent = sole();
var _editable = sole();
var _editableEl = sole();
var _editorEl = sole();
var _editorToolbarsEl = sole();
var _editorPlaceholderEl = sole();
var _editorBodyEl = sole();
var _editorFooterEl = sole();

prop[_initFrame] = function () {
    var the = this;
    var options = the[_options];

    the[_editableEl] = selector.query(options.el)[0];
    the[_editorEl] = modification.parse(require('./template.html'));
    var els = selector.children(the[_editorEl]);
    the[_editorToolbarsEl] = els[0];
    the[_editorBodyEl] = els[1];
    the[_editorFooterEl] = els[2];
    the[_editorPlaceholderEl] = selector.children(the[_editorBodyEl])[0];
    modification.insert(the[_editorEl], the[_editableEl], 3);
    modification.insert(the[_editableEl], the[_editorBodyEl], 2);
};

prop[_initPlaceholder] = function () {
    var the = this;
    var options = the[_options];

    attribute.style(the[_editorPlaceholderEl], attribute.style(the[_editorBodyEl], [
        'padding',
        'background',
        'font'
    ]));
    attribute.html(the[_editorPlaceholderEl], options.placeholder);
};

prop[_initEditable] = function () {
    var the = this;
    var options = the[_options];

    the[_editable] = new Editable({
        el: the[_editableEl]
    });
};

prop[_initEvent] = function () {
    var the = this;
    var options = the[_options];
    var lastDisplay = 'block';

    the[_editable].on('change', fun.debounce(function () {
        var text = the[_editable].getText().replace(/^\s+|\s+$/g, '');
        var display = text ? 'none' : 'block';

        if (display === lastDisplay) {
            return;
        }

        attribute.style(the[_editorPlaceholderEl], 'display', lastDisplay = display);
    }));
};

require('./style.css', 'css|style');
Editor.defaults = defaults;
Editor.mac = Editable.mac;
module.exports = Editor;
