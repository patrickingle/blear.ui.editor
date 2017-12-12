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

// edi.button({
//     el: '#bold',
//     cmd: 'bold',
//     shortcut: (Editor.mac ? 'cmd' : 'ctrl') + ' + b'
// });
// edi.button({
//     el: '#italic',
//     cmd: 'italic',
//     shortcut: (Editor.mac ? 'cmd' : 'ctrl') + ' + i'
// });
//
// edi.menu(require('../src/icons/heading')());
edi.menu(require('../src/menus/bold')());
// edi.menu(require('../src/icons/italic')());

window.edi = edi;


