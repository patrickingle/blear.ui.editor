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
var event = require('blear.core.event');
var modification = require('blear.core.modification');
var object = require('blear.utils.object');
var fun = require('blear.utils.function');
var typeis = require('blear.utils.typeis');

var iconFontLink = 'https://at.alicdn.com/t/font_504834_2qdjl2hpwqumcxr.css';
var defaults = {
    el: '',
    placeholder: '请输入'
};
var namespace = 'blearui-editor';
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
     * 挂载一个图标
     * @returns {Editor}
     */
    icon: function (iconMaker) {
        var the = this;
        iconMaker.call(the, the);
        return the;
    },

    /**
     * 实例化一个按钮
     * @param meta {Object}
     * @param meta.el 元素
     * @param meta.cmd {String|Function} 命令
     * @param [meta.shortcut] {String} 快捷键
     * @param [meta.query] {Function} 检查激活状态方法，返回布尔值
     * @returns {Editor}
     */
    button: function (meta) {
        var the = this;
        var query = meta.query;
        meta.query = typeis.Function(query) ? function () {
            return query.call(the);
        } : null;
        return the[_editable].button(meta);
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

    /**
     * 聚焦
     * @returns {Editor}
     */
    focus: function () {
        var the = this;
        the[_editable].focus();
        return the;
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
     * 获取 header 区域元素
     * @returns {HTMLDivElement}
     */
    getHeaderEl: function () {
        return this[_editorHeaderEl];
    },

    /**
     * 销毁实例
     */
    destroy: function () {
        var the = this;

        the[_editable].destroy();
        Editor.invoke('destroy', the);
        modification.insert(the[_editableEl], the[_editorEl], 3);
        modification.remove(the[_editorEl]);
        attribute.removeClass(the[_editableEl], namespace + '-content');
        the[_editableEl] = the[_editorEl] = the[_editorHeaderEl]
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
var _editorHeaderEl = sole();
var _editorPlaceholderEl = sole();
var _editorBodyEl = sole();
var _editorFooterEl = sole();

prop[_initFrame] = function () {
    var the = this;
    var options = the[_options];

    the[_editableEl] = selector.query(options.el)[0];
    the[_editorEl] = modification.parse(require('./template.html'));
    var els = selector.children(the[_editorEl]);
    the[_editorHeaderEl] = els[0];
    the[_editorBodyEl] = els[1];
    the[_editorFooterEl] = els[2];
    the[_editorPlaceholderEl] = selector.children(the[_editorBodyEl])[0];
    modification.insert(the[_editorEl], the[_editableEl], 3);
    modification.insert(the[_editableEl], the[_editorBodyEl], 2);
    attribute.addClass(the[_editableEl], namespace + '-content');
};

prop[_initPlaceholder] = function () {
    var the = this;
    var options = the[_options];

    attribute.style(the[_editorPlaceholderEl], attribute.style(the[_editableEl], [
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
    the[_editable].focus();
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

modification.insert(modification.create('link', {
    href: iconFontLink,
    rel: 'stylesheet'
}));
require('./style.css', 'css|style');
Editor.defaults = defaults;
Editor.mac = Editable.mac;
module.exports = Editor;
