/**
 * HistoryManager
 * @author ydr.me
 * @create 2017-11-29 14:15
 * @update 2017-11-29 14:15
 */


'use strict';

var Class = require('blear.classes.class');
var object = require('blear.utils.object');

var defaults = {
    /**
     * 最长记录
     */
    max: 99
};
var HistoryManager = Class.extend({
    className: 'HistoryManager',
    constructor: function (options) {
        var the = this;

        HistoryManager.parent(the);
        the[_options] = object.assign({}, defaults, options);
        the[_histories] = [];
        the[_active] = -1;
        the[_gid] = 0;
    },

    /**
     * 插入记录
     * @param item
     * @returns {HistoryManager}
     */
    put: function (item) {
        var the = this;

        // 删除激活后的无用数据
        the[_histories].splice(the[_active] + 1);

        if (the[_histories].length === the[_options].max) {
            the[_histories].shift();
            the[_active]--;
        }

        item.id = the[_gid]++;
        item.timestamp = Date.now();
        the[_histories].push(item);
        the[_active]++;

        return the;
    },

    /**
     * 最近一个记录
     * @returns {*}
     */
    recent: function () {
        var the = this;
        return the[_histories][the[_active]];
    },

    /**
     * 前进
     * @returns {*}
     */
    forward: function () {
        var the = this;

        // 刚好在历史终点
        if (the[_histories].length === the[_active] + 1) {
            return null;
        }

        the[_active]++;
        return the[_histories][the[_active]];
    },

    /**
     * 后退
     * @returns {*}
     */
    backward: function () {
        var the = this;

        // 刚好在历史起点
        if (0 === the[_active]) {
            return null;
        }

        the[_active]--;
        return the[_histories][the[_active]];
    },

    /**
     * 销毁
     */
    destroy: function () {
        var the = this;

        the[_histories] = the[_options] = the[_gid] = null;
        HistoryManager.invoke('destroy', the);
    }
});
var sole = HistoryManager.sole;
var pro = HistoryManager.prototype;
var _options = sole();
var _histories = sole();
var _active = sole();
var _gid = sole();


if (typeof DEBUG !== 'undefined' && DEBUG) {
    _histories = '_histories';
    _active = '_active';
}

HistoryManager.defaults = defaults;
module.exports = HistoryManager;



