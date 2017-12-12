/**
 * bold
 * @author ydr.me
 * @create 2017-12-11 14:45
 * @update 2017-12-11 14:45
 */


'use strict';

var modification = require('blear.core.modification');

var Icon = require('../constructors/icon');
var Button = require('../constructors/button');
var Menu = require('../constructors/menu');

var cmd = 'bold';

module.exports = function (options) {
    return function (editor) {
        // editor.button({
        //     el: Icon(editor, {
        //         name: cmd,
        //         title: '加粗'
        //     }).getButtonEl(),
        //     cmd: cmd,
        //     shortcut: (editor.mac ? 'cmd' : 'ctrl') + '+b'
        // });

        var icon = new Icon({
            name: cmd,
            title: '加粗'
        });
        var button = new Button({
            el: icon.getEl(),
            query: function () {
                return document.queryCommandState(cmd);
            }
        });
        var menu = new Menu(editor);
        var shortcut = (editor.mac ? 'cmd' : 'ctrl') + '+b';

        menu.button(button);
        editor.shortcut(shortcut, function (ev) {
            button.update();
            editor.bold();
        });
        editor.on('change', function () {
            button.update();
        });
        button.on('action', function () {
            editor.bold();
        });
    };
};

