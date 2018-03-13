/**
 * blear.ui.editor
 * @author ydr.me
 * @create 2016年06月04日14:09:36
 * @update 2017年12月11日19:43:05
 */

'use strict';

var Hotkey = require('blear.classes.hotkey');
var UI = require('blear.ui');
var selector = require('blear.core.selector');
var attribute = require('blear.core.attribute');
var modification = require('blear.core.modification');
var event = require('blear.core.event');
var object = require('blear.utils.object');
var fun = require('blear.utils.function');
var typeis = require('blear.utils.typeis');
var time = require('blear.utils.time');
var array = require('blear.utils.array');

var Ranger = require('./managers/ranger');
var History = require('./managers/history');
var nodal = require('./utils/nodal');
var clipboard = require('./utils/clipboard');
var clean = require('./utils/clean');
var Button = require('./constructors/button');

var iconFontLink = 'https://at.alicdn.com/t/font_504834_2qdjl2hpwqumcxr.css';
var isMac = Hotkey.mac;
var defaults = {
    el: '',
    placeholder: '请输入',
    allowTags: [
        'br', 'span', 'a', 'img', 'b', 'strong', 'i', 'strike', 'p', 'blockquote', 'font',
        'u', 'ul', 'ol', 'li', 'pre', 'code', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'hr'
    ],
    allowAttrs: {
        img: ['src', 'alt', 'width', 'height'],
        a: ['href', 'target'],
        font: ['color'],
        code: ['class'],
        pre: ['class']
    },
    allowStyles: [
        'color', 'background-color', 'font-size', 'text-align', 'list-style-type', 'list-style-position'
    ],
    onPasteImage: function (callback) {
        console.log('未配置粘贴图片上传回调');
        callback();
    },
    onDropImage: function (callback) {
        console.log('未配置拖拽图片上传回调');
        callback();
    }
};
var namespace = require('./settings.json').namespace;
var Editor = UI.extend({
    constructor: function (options) {
        var the = this;

        Editor.parent(the);
        the.mac = Hotkey.mac;
        the[_options] = object.assign({}, defaults, options);
        the[_buttons] = [];
        the[_initFrame]();
        the[_initHotkey]();
        the[_initRanger]();
        the[_initPlaceholder]();
        the[_initEvent]();
        the.focus();
    },

    /**
     * 挂载一个菜单
     * @param make {Function} 构造器
     * @returns {Editor}
     */
    menu: function (make) {
        var the = this;
        make.call(the, the);
        return the;
    },

    /**
     * 实例化一个按钮
     * @param meta {Object}
     * @param meta.el 元素
     * @param meta.action {Function} 行为
     * @param [meta.as] {Function} 检查激活状态方法，返回布尔值
     * @returns {Editor}
     */
    button: function (meta) {
        var the = this;
        var button = new Button(meta);
        the[_buttons].push(button);
        return the;
    },

    /**
     * 加粗
     * @returns {Editor}
     */
    bold: nativeExec('bold'),

    /**
     * 斜体
     * @returns {Editor}
     */
    italic: nativeExec('italic'),

    /**
     * 下划线
     * @returns {Editor}
     */
    underline: nativeExec('underline'),

    /**
     * 删除线
     * @returns {Editor}
     */
    strikeThrough: nativeExec('strikeThrough'),

    /**
     * 判断当前是否为某状态
     * @param state
     * @returns {boolean}
     */
    as: function (state) {
        return document.queryCommandState(state);
    },

    /**
     * 插入节点
     * @param node
     * @returns {Editor}
     */
    insertNode: function (node) {
        var the = this;
        the.focus();
        time.nextTick(function () {
            the[_ranger].insertNode(node);
            the.focus();
        });
        return the;
    },

    /**
     * 设置内容
     * @param value
     * @returns {Editor}
     */
    setValue: function (value) {
        var the = this;
        the[_contentEl].innerHTML = value;
        the[_fixContent]();
        the.focus();
        the.emit('change');
        return the;
    },

    /**
     * 获取内容
     * @returns {string}
     */
    getText: function () {
        var the = this;
        return attribute.text(the[_contentEl]);
    },

    /**
     * 获取内容
     * @returns {string}
     */
    getValue: function () {
        var the = this;
        return attribute.html(the[_contentEl]);
    },

    /**
     * 聚焦
     * @returns {Editor}
     */
    focus: function () {
        var the = this;
        the[_ranger].focus();
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
     * 获取 content 元素
     * @returns {HTMLElement}
     */
    getContentEl: function () {
        return this[_contentEl];
    },

    /**
     * 绑定快捷键
     * @returns {*}
     */
    shortcut: function (shortcut, listener) {
        var the = this;
        the[_hotkey].bind(shortcut, function (ev) {
            listener.call(the, ev);
            ev.preventDefault();
        });
        return the;
    },

    /**
     * 销毁实例
     */
    destroy: function () {
        var the = this;

        the[_hotkey].destroy();
        Editor.invoke('destroy', the);
        modification.insert(the[_contentEl], the[_editorEl], 3);
        modification.remove(the[_editorEl]);
        attribute.removeClass(the[_contentEl], namespace + '-content');
        the[_contentEl] = the[_editorEl] = the[_editorHeaderEl]
            = the[_editorPlaceholderEl] = the[_editorBodyEl]
            = the[_editorFooterEl] = null;
        array.each(the[_buttons], function (index, button) {
            button.destroy();
        });
    }
});
var prop = Editor.prototype;
var sole = Editor.sole;
var _options = sole();
var _buttons = sole();
var _initFrame = sole();
var _initRanger = sole();
var _initPlaceholder = sole();
var _initHotkey = sole();
var _initEvent = sole();
var _hotkey = sole();
var _contentEl = sole();
var _editorEl = sole();
var _editorHeaderEl = sole();
var _editorPlaceholderEl = sole();
var _editorBodyEl = sole();
var _editorFooterEl = sole();
var _ranger = sole();
var _fixContent = sole();
var _onKeydownListener = sole();
var _onKeyupListener = sole();
var _onPasteListener = sole();
var _onMousedownListener = sole();
var _pastingContainerEl = sole();

/**
 * 初始化框架
 */
prop[_initFrame] = function () {
    var the = this;
    var options = the[_options];
    the[_contentEl] = selector.query(options.el)[0];
    the[_editorEl] = modification.parse(require('./template.html'));
    var els = selector.children(the[_editorEl]);
    the[_editorHeaderEl] = els[0];
    the[_editorBodyEl] = els[1];
    the[_editorFooterEl] = els[2];
    the[_editorPlaceholderEl] = selector.children(the[_editorBodyEl])[0];
    modification.insert(the[_editorEl], the[_contentEl], 3);
    modification.insert(the[_contentEl], the[_editorBodyEl], 2);
    attribute.addClass(the[_contentEl], namespace + '-content');
    attribute.attr(the[_contentEl], 'contenteditable', true);
    the[_fixContent]();
};

/**
 * 初始化选区
 */
prop[_initRanger] = function () {
    var the = this;
    var options = the[_options];

    the[_ranger] = new Ranger({
        el: the[_contentEl]
    });
};

/**
 * 初始化占位
 */
prop[_initPlaceholder] = function () {
    var the = this;
    var options = the[_options];

    attribute.style(the[_editorPlaceholderEl], attribute.style(the[_contentEl], [
        'padding',
        'background',
        'font'
    ]));
    attribute.html(the[_editorPlaceholderEl], options.placeholder);
};

/**
 * 初始化热键
 */
prop[_initHotkey] = function () {
    var the = this;
    var options = the[_options];

    the[_hotkey] = new Hotkey({
        el: the[_contentEl]
    });
};

/**
 * 初始化事件
 */
prop[_initEvent] = function () {
    var the = this;
    var options = the[_options];
    var lastDisplay = 'block';
    var cmdKey = isMac ? 'cmd' : 'ctrl';

    the[_hotkey]
    // 后退删除
        .bind('backspace', function (ev) {
            if (nodal.isEmpty(the[_contentEl])) {
                the[_fixContent]();
                return ev.preventDefault();
            }

            if (isInitialState(the[_contentEl])) {
                return ev.preventDefault();
            }
        })
        // 撤销
        .bind(cmdKey + '+z', function (ev) {
            ev.preventDefault();
            the[_ranger].undo();
        })
        // 恢复
        .bind(cmdKey + '+shift+z', function (ev) {
            ev.preventDefault();
            the[_ranger].redo();
        });

    event.on(the[_contentEl], 'keydown', the[_onKeydownListener] = function (ev) {
        the[_ranger].change();
    });

    event.on(the[_contentEl], 'keyup', the[_onKeyupListener] = function () {
        the.emit('change');
    });

    event.on(the[_contentEl], 'paste', the[_onPasteListener] = function (ev) {
        if (the[_pastingContainerEl]) {
            return false;
        }

        var image = clipboard.image(ev);

        if (image) {
            options.onPasteImage(function (meta) {
                if (!meta) {
                    return;
                }

                if (typeis.String(meta)) {
                    meta = {url: meta};
                }

                var imgEl = modification.create('img', {
                    src: meta.url,
                    alt: meta.alt || '',
                    width: meta.width || 'auto',
                    height: meta.height || 'auto'
                });
                the.insertNode(imgEl);
                the.emit('change');
            });
            return false;
        }

        the[_pastingContainerEl] = createPastingContainerEl();
        the[_pastingContainerEl].focus();
        time.nextTick(function () {
            clean(the[_pastingContainerEl], options.allowTags, options.allowAttrs, options.allowStyles);
            var pastingNodes = array.from(the[_pastingContainerEl].childNodes);

            array.each(pastingNodes, function (index, node) {
                the[_ranger].insertNode(node);
            });

            the.focus();
            modification.remove(the[_pastingContainerEl]);
            the[_pastingContainerEl] = null;
            the.emit('change');
        });
    });

    event.on(the[_contentEl], 'mousedown', 'img', the[_onMousedownListener] = function (ev) {
        the[_ranger].wrapNode(this);
        return false;
    });

    the[_ranger].on('selectionChange', function () {
        the.emit('change');
    });

    the.on('change', fun.debounce(function () {
        var text = the.getText().replace(/^\s+|\s+$/g, '');
        var display = text ? 'none' : 'block';

        if (display === lastDisplay) {
            return;
        }

        attribute.style(the[_editorPlaceholderEl], 'display', lastDisplay = display);
    }));

    the.on('change', function () {
        array.each(the[_buttons], function (index, button) {
            button.update();
        });
    });
};

/**
 * 修正容器
 */
prop[_fixContent] = function () {
    var the = this;
    var childNodes = the[_contentEl].childNodes;

    if (!childNodes.length) {
        the[_contentEl].innerHTML = '<p><br></p>';
    }
};

modification.insert(modification.create('link', {
    href: iconFontLink,
    rel: 'stylesheet'
}));
require('./style.css', 'css|style');
Editor.defaults = defaults;
Editor.mac = Hotkey.mac;
module.exports = Editor;


// ===============================================

/**
 * 执行本地命令
 * @param command
 * @returns {Function}
 */
function nativeExec(command) {
    return function () {
        var the = this;

        document.execCommand(command, false, null);

        return the;
    }
}

/**
 * 是否为初始状态
 * @param containerEl
 * @returns {boolean}
 */
function isInitialState(containerEl) {
    var children = containerEl.children;

    if (children.length > 1) {
        return false;
    }

    var pEl = children[0];
    var pChildren = pEl.childNodes;

    return pChildren.length === 1 && pChildren[0].nodeName === 'BR';
}

/**
 * 创建用于当前复制粘贴所有的元素
 * @returns {Element}
 */
function createPastingContainerEl() {
    var el = modification.create('div', {
        contenteditable: true,
        tabindex: -1,
        style: {
            position: 'fixed',
            opacity: 0,
            width: 1,
            height: 20
        }
    });
    modification.insert(el);
    return el;
}


