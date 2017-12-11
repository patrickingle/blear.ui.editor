/**
 * bold
 * @author ydr.me
 * @create 2017-12-11 14:45
 * @update 2017-12-11 14:45
 */


'use strict';

var buttonCreator = require('../utils/button-creator');

var cmd = 'italic';

module.exports = function (editor) {
    editor.button({
        el: buttonCreator(editor, {
            name: cmd,
            title: '斜体'
        }),
        cmd: cmd,
        shortcut: (editor.constructor.mac ? 'cmd' : 'ctrl') + '+i'
    });
};

