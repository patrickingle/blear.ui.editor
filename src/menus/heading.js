/**
 * bold
 * @author ydr.me
 * @create 2017-12-11 14:45
 * @update 2017-12-11 14:45
 */


'use strict';

var button = require('../constructors/button');
var Options = require('../constructors/options');

module.exports = function (options) {
    return function (editor) {
        var btn = button(editor, {
            name: 'heading',
            title: '段落'
        });
        var options = new Options(btn, [{
            text: '段落',
            value: ''
        }, {
            text: '一级标题',
            value: '1'
        }, {
            text: '二级标题',
            value: '2'
        }])
            .on('escape', function () {
            });
        // var btn2 = editor.button({
        //     el: btn.getButtonEl(),
        //     cmd: function () {
        //
        //     },
        //     as: function () {
        //
        //     }
        // }).on('action', function () {
        //     dop.toggle();
        // });
    };
};

