/**
 * italic
 * @author ydr.me
 * @create 2017-12-11 14:45
 * @update 2017-12-11 14:45
 */


'use strict';

var Icon = require('../constructors/icon');
var Button = require('../constructors/button');
var Menu = require('../constructors/menu');

var cmd = 'italic';

/**
 * 实现一个 italic 菜单
 * @param options
 * @returns {Function}
 */
module.exports = function (options) {
    return function (editor) {
        var icon = new Icon({
            name: cmd,
            title: '斜体'
        });
        var button = new Button({
            el: icon.getEl(),
            as: function () {
                return editor.as(cmd);
            },
            action: editor.italic
        });
        var menu = new Menu(editor, {
            shortcut: (editor.mac ? 'cmd' : 'ctrl') + '+i'
        });

        menu.button(button);
    };
};
