/**
 * 按钮构造器
 * @author ydr.me
 * @create 2017-12-11 16:18
 * @update 2017-12-11 16:18
 */


'use strict';

var modification = require('blear.core.modification');

var classBase = 'blearui-editor-icon';

/**
 * 创建按钮
 * @param editor
 * @param options
 */
module.exports = function (editor, options) {
    var toolbarsEl = editor.getToolbarsEl();
    var buttonEl = modification.create('i', {
        'class': classBase + ' ' + classBase + '-' + options.name,
        title: options.title
    });
    modification.insert(buttonEl, toolbarsEl);
    return buttonEl;
};
