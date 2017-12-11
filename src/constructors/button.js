/**
 * 按钮构造器
 * @author ydr.me
 * @create 2017-12-11 16:18
 * @update 2017-12-11 16:18
 */


'use strict';

var modification = require('blear.core.modification');

var namespace = 'blearui-editor';
var iconClassName = namespace + '-icon';
var buttonClassName = namespace + '-button';

/**
 * 创建按钮
 * @param editor
 * @param options
 */
module.exports = function (editor, options) {
    var headerEl = editor.getHeaderEl();
    var buttonEl = modification.create('i', {
        'class': iconClassName + ' ' + iconClassName + '-' + options.name,
        title: options.title
    });
    var divEl = modification.create('div', {
        'class': buttonClassName + ' ' + buttonClassName + '-' + options.name
    });
    modification.insert(buttonEl, divEl);
    modification.insert(divEl, headerEl);
    return buttonEl;
};
