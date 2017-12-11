/**
 * bold
 * @author ydr.me
 * @create 2017-12-11 14:45
 * @update 2017-12-11 14:45
 */


'use strict';

var button = require('../constructors/button');

var cmd = 'italic';

module.exports = function (editor) {
    editor.button({
        el: button(editor, {
            name: cmd,
            title: '斜体'
        }).getButtonEl(),
        cmd: cmd,
        shortcut: (editor.constructor.mac ? 'cmd' : 'ctrl') + '+i'
    });
};

