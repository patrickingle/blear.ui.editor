/**
 * 文件描述
 * @author ydr.me
 * @create 2018-03-12 15:38
 * @update 2018-03-12 15:38
 */


'use strict';

var History = require('../src/managers/history');

var his = window.his = new History({
    max: 5
});
var a = 1;

document.getElementById('putSix').onclick = function () {
    his.put({a: a++});
    his.put({a: a++});
    his.put({a: a++});
    his.put({a: a++});
    his.put({a: a++});
    his.put({a: a++});
};

