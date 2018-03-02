/**
 * 文件描述
 * @author ydr.me
 * @create 2016-06-27 17:34
 */


'use strict';

var Editor = require('../src/index');

var edi = new Editor({
    el: '#demo',
    placeholder: '请输入你想说的话'
});

edi.button({
    el: '#bold',
    action: edi.bold,
    as: function () {
        return edi.as('bold');
    }
});

//
// edi.menu(require('../src/menus/heading')());
edi.menu(require('../src/menus/bold')());
// edi.menu(require('../src/menus/italic')());

window.edi = edi;


