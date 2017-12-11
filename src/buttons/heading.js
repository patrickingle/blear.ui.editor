/**
 * bold
 * @author ydr.me
 * @create 2017-12-11 14:45
 * @update 2017-12-11 14:45
 */


'use strict';

var button = require('../constructors/button');

module.exports = function (editor) {
    editor.button({
        el: button(editor, {
            name: 'heading',
            title: '段落'
        }),
        cmd: function () {

        },
        query: function () {

        }
    }).on('action', function () {

    });
};

