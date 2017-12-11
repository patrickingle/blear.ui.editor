/**
 * bold
 * @author ydr.me
 * @create 2017-12-11 14:45
 * @update 2017-12-11 14:45
 */


'use strict';

var buttonCreator = require('../utils/button-creator');

module.exports = function (editor) {
    editor.button({
        el: buttonCreator(editor, {
            name: 'heading',
            title: '段落'
        }),
        cmd: function () {

        },
        imme: false,
        query: function () {

        }
    }).on('action', function () {
        this.toggle(true);
    });
};

