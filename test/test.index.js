/**
 * karma 测试 文件
 * @author ydr.me
 * @create 2016-05-17 12:13
 */


'use strict';

var History = require('../src/managers/history.js');

describe('managers/history.js', function () {
    it('#put', function (done) {
        var his = new History();

        his.put({a: 1});
        his.put({a: 2});

        expect(his.recent().a).toEqual(2);
        done();
    });
    it('#forward/backward', function (done) {
        var his = new History();

        his.put({a: 1});
        his.put({a: 2});
        his.put({a: 3});
        his.put({a: 4});
        his.put({a: 5});

        expect(his.forward()).toEqual(null);
        expect(his.backward().a).toEqual(4);
        expect(his.backward().a).toEqual(3);
        expect(his.recent().a).toEqual(3);
        expect(his.forward().a).toEqual(4);
        expect(his.forward().a).toEqual(5);
        expect(his.forward()).toEqual(null);
        expect(his.backward().a).toEqual(4);
        expect(his.backward().a).toEqual(3);
        expect(his.backward().a).toEqual(2);
        his.put({a: 6});
        expect(his.recent().a).toEqual(6);
        expect(his.forward()).toEqual(null);
        expect(his.backward().a).toEqual(2);
        done();
    });
});
