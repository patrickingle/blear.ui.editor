/**
 * bold
 * @author ydr.me
 * @create 2017-12-11 14:45
 * @update 2017-12-11 14:45
 */


'use strict';

var Icon = require('../constructors/icon');
var Button = require('../constructors/button');
var Menu = require('../constructors/menu');

var cmd = 'bold';

/**
 * 实现一个 bold 菜单
 * @param options
 * @returns {Function}
 */
module.exports = function (options) {
    return function (editor) {
        var icon = new Icon({
            name: cmd,
            title: '加粗'
        });
        var button = new Button({
            el: icon.getEl(),
            query: function () {
                return editor.query(cmd);
            }
        });
        var menu = new Menu(editor, {
            cmd: editor.bold,
            shortcut: (editor.mac ? 'cmd' : 'ctrl') + '+b'
        });

        menu.button(button);
    };
};

