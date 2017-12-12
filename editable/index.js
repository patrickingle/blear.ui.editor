/**
 * blear.classes.editable
 * @ref https://github.com/codemirror/codemirror
 * @ref https://github.com/mycolorway/simditor
 * @ref https://github.com/wangfupeng1988/wangEditor/
 * @author ydr.me
 * @create 2016年06月04日14:09:36
 */

'use strict';


var Events = require('blear.classes.events');
var Hotkey = require('blear.classes.hotkey');
var selector = require('blear.core.selector');
var modification = require('blear.core.modification');
var attribute = require('blear.core.attribute');
var event = require('blear.core.event');
var object = require('blear.utils.object');
var array = require('blear.utils.array');
var time = require('blear.utils.time');
var typeis = require('blear.utils.typeis');

var nativeCommand = require('./commands/native');
var RangeManager = require('./classes/range-manager');
var HistoryManager = require('./classes/history-manager');
var clean = require('./utils/clean');
var nodal = require('./utils/nodal');
var clipboard = require('./utils/clipboard');

var defaults = {
    el: null,
    allowTags: [
        'br', 'span', 'a', 'img', 'b', 'strong', 'i', 'strike', 'u', 'font', 'p',
        'ul', 'ol', 'li', 'blockquote', 'pre', 'code', 'h1', 'h2', 'h3', 'h4', 'hr'
    ],
    allowAttrs: {
        img: ['src', 'alt', 'width', 'height'],
        a: ['href', 'target'],
        font: ['color'],
        code: ['class'],
        pre: ['class']
    },
    /**
     * 粘贴图片
     * @param next(meta)
     */
    onPasteImage: function (next) {

    },
    /**
     * 拖拽释放图片
     * @param next(meta)
     */
    onDropImage: function (next) {

    }
};
var Editable = Events.extend({
    className: 'Editable',
    constructor: function (options) {
        var the = this;

        the.mac = Hotkey.mac;
        Editable.parent(the);
        the[_options] = object.assign({}, defaults, options);
        the[_containerEl] = selector.query(the[_options].el)[0];
        the[_hotkey] = new Hotkey({
            el: the[_containerEl]
        });
        the[_rangerManager] = new RangeManager({
            containerEl: the[_containerEl],
            historyManager: new HistoryManager()
        });
        the[_latestRange] = null;
        the[_initNode]();
        the[_initEvent]();
    },

    /**
     * 加粗
     * @returns {Editable}
     */
    bold: nativeExec('bold'),

    /**
     * 斜体
     * @returns {Editable}
     */
    italic: nativeExec('italic'),

    /**
     * 下划线
     * @returns {Editable}
     */
    underline: nativeExec('underline'),

    /**
     * 删除线
     * @returns {Editable}
     */
    strikeThrough: nativeExec('strikeThrough'),

    /**
     * 插入节点
     * @param node
     * @returns {Editable}
     */
    insertNode: function (node) {
        var the = this;
        the.focus();
        time.nextTick(function () {
            the[_rangerManager].insertNode(node);
            the.focus();
        });
        return the;
    },

    /**
     * 聚焦
     * @returns {Editable}
     */
    focus: function () {
        var the = this;
        the[_rangerManager].focus();
        return the;
    },

    /**
     * 取值
     * @returns {string|*|string}
     */
    getText: function () {
        var the = this;
        // var cloneNode = the[_containerEl].cloneNode(true);
        return attribute.text(the[_containerEl]);
    },

    /**
     * 取值
     * @returns {string|*|string}
     */
    getValue: function () {
        var the = this;
        // var cloneNode = the[_containerEl].cloneNode(true);
        return the[_containerEl].innerHTML;
    },

    /**
     * 设值
     * @param value
     * @returns {Editable}
     */
    setValue: function (value) {
        var the = this;
        the[_containerEl].innerHTML = value;
        the[_fixContainer]();
        the.focus();
        the.emit('change');
        return the;
    },

    /**
     * 销毁实例
     */
    destroy: function () {
        var the = this;

        event.un(the[_containerEl], 'keydown', the[_onKeydownListener]);
        event.un(the[_containerEl], 'keyup', the[_onKeyupListener]);
        event.un(the[_containerEl], 'paste', the[_onPasteListener]);
        event.un(the[_containerEl], 'mousedown', the[_onMousedownListener]);
        the[_rangerManager].destroy();
        the[_rangerManager] = null;
        the[_hotkey].destroy();
        Editable.invoke('destroy', the);
    }
});
var pro = Editable.prototype;
var sole = Editable.sole;
var _options = sole();
var _hotkey = sole();
var _initNode = sole();
var _pastingContainerEl = sole();
var _initEvent = sole();
var _containerEl = sole();
var _rangerManager = sole();
var _latestRange = sole();
var _fixContainer = sole();
var _pushButtons = sole();
var _onKeydownListener = sole();
var _onKeyupListener = sole();
var _onPasteListener = sole();
var _onMousedownListener = sole();

/**
 * 初始化节点
 */
pro[_initNode] = function () {
    var the = this;
    attribute.attr(the[_containerEl], 'contenteditable', true);
    the[_fixContainer]();
};

/**
 * 初始化事件
 */
pro[_initEvent] = function () {
    var the = this;
    var options = the[_options];

    the[_hotkey].bind('backspace', function (ev) {
        if (nodal.isEmpty(the[_containerEl])) {
            the[_fixContainer]();
            return ev.preventDefault();
        }

        if (isInitialState(the[_containerEl])) {
            return ev.preventDefault();
        }
    });

    event.on(the[_containerEl], 'keydown', the[_onKeydownListener] = function (ev) {
        the[_rangerManager].change();
    });

    event.on(the[_containerEl], 'keyup', the[_onKeyupListener] = function () {
        the.emit('change');
    });

    event.on(the[_containerEl], 'paste', the[_onPasteListener] = function (ev) {
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
            clean(the[_pastingContainerEl], options.allowTags, options.allowAttrs, true);
            var pastingNodes = array.from(the[_pastingContainerEl].childNodes);

            array.each(pastingNodes, function (index, node) {
                the[_rangerManager].insertNode(node);
                return false;
            });

            the.focus();
            modification.remove(the[_pastingContainerEl]);
            the[_pastingContainerEl] = null;
            the.emit('change');
        });
    });

    event.on(the[_containerEl], 'mousedown', 'img', the[_onMousedownListener] = function (ev) {
        the[_rangerManager].wrapNode(this);
        return false;
    });

    the[_rangerManager].on('selectionChange', function () {
        the.emit('change');
    });
};

/**
 * 修正容器
 */
pro[_fixContainer] = function () {
    var the = this;
    var childNodes = the[_containerEl].childNodes;

    if (!childNodes.length) {
        the[_containerEl].innerHTML = '<p><br></p>';
    }
};

Editable.defaults = defaults;
Editable.mac = Hotkey.mac;
module.exports = Editable;

// ===============================================

/**
 * 执行本地命令
 * @param command
 * @returns {Function}
 */
function nativeExec(command) {
    return function () {
        var the = this;

        nativeCommand(command);

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
 * @returns {div}
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


