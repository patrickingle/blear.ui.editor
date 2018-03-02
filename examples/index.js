/**
 * 文件描述
 * @author ydr.me
 * @create 2016-06-27 17:34
 */


'use strict';

var Editor = require('../src/index');

var url = 'https://ss0.bdstatic.com/5aV1bjqh_Q23odCf/static/superman/img/logo/bd_logo1_31bdc765.png';
var edi = new Editor({
    el: '#demo',
    placeholder: '请输入你想说的话',
    onPasteImage: function (callback) {
        callback(url);
    }
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
edi.menu(require('../src/menus/italic')());
edi.menu(require('../src/menus/image')({
    upload: function (el, ev, callback) {
        callback(url);
    }
}));

window.edi = edi;


