/**
 * 文件描述
 * @author ydr.me
 * @create 2016-06-27 17:34
 */


'use strict';

var Editor = require('../src/index');

var edi = new Editor({
    el: '#demo'
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

edi.button(require('../src/buttons/heading'));
edi.button(require('../src/buttons/bold'));
edi.button(require('../src/buttons/italic'));

window.edi = edi;


