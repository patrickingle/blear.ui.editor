/**
 * image
 * @author ydr.me
 * @create 2018年03月02日14:47:07
 * @update 2018年03月02日14:47:10
 */


'use strict';

var modification = require('blear.core.modification');
var event = require('blear.core.event');
var object = require('blear.utils.object');

var Icon = require('../constructors/icon');
var Button = require('../constructors/button');
var Menu = require('../constructors/menu');

var cmd = 'image';
var defaults = {
    fileName: 'file',
    /**
     * 上传操作
     * @param el {HTMLInputElement} 文件输入框
     * @param ev {Event} 事件
     * @param callback {Function} 回调，接受两个参数：
     * @param callback:0 url {String|Object}
     */
    upload: function (el, ev, callback) {
        console.log('未配置选择图片上传回调');
        callback();
    }
};
var inputFileEl = null;

/**
 * 实现一个 bold 菜单
 * @param options
 * @param [options.fileName="file"]
 * @param [options.upload=function]
 * @returns {Function}
 */
module.exports = function (options) {
    options = object.assign({}, defaults, options);

    return function (editor) {
        var callback = function (el, ev) {
            options.upload(el, ev, function (meta) {
                resetInputFileEl(options, callback);

                if (!meta) {
                    return;
                }

                if (typeis.String(meta)) {
                    meta = {url: meta};
                }

                editor.insertNode(modification.create('img', {
                    src: meta.url,
                    alt: meta.alt || '',
                    width: meta.width || 'auto',
                    height: meta.height || 'auto'
                }));
            });
        };
        resetInputFileEl(options, callback);
        var icon = new Icon({
            name: cmd,
            title: '图片'
        });
        var button = new Button({
            el: icon.getEl(),
            action: function () {
                event.emit(inputFileEl, new MouseEvent('click'));
            }
        });
        var menu = new Menu(editor, {
            shortcut: (editor.mac ? 'cmd' : 'ctrl') + '+g'
        });

        menu.button(button);
    };
};


// ===================================

/**
 * 重置 input:file
 * @param options
 * @param callback
 * @returns {HTMLInputElement}
 */
function resetInputFileEl(options, callback) {
    if (inputFileEl) {
        inputFileEl.onchange = null;
        modification.remove(inputFileEl);
    }

    inputFileEl = modification.create('input', {
        id: Date.now() + '',
        type: 'file',
        name: options.fileName
    });
    modification.insert(inputFileEl);
    inputFileEl.onchange = function (ev) {
        if (!inputFileEl.value) {
            return;
        }

        callback(inputFileEl, ev);
    };
    return inputFileEl;
}
