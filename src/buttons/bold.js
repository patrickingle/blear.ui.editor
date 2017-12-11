/**
 * bold
 * @author ydr.me
 * @create 2017-12-11 14:45
 * @update 2017-12-11 14:45
 */


'use strict';

var buttonCreator = require('../utils/button-creator');

var cmd = 'bold';

module.exports = function (editor) {
    editor.button({
        el: buttonCreator(editor, {
            className: cmd
        }),
        cmd: cmd,
        shortcut: (editor.constructor.mac ? 'cmd' : 'ctrl') + '+b'
    });
};

