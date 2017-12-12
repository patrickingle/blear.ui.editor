/**
 * Icon
 * @author ydr.me
 * @create 2017-12-12 17:30
 * @update 2017-12-12 17:30
 */


'use strict';

var Events = require('blear.classes.events');
var modification = require('blear.core.modification');
var object = require('blear.utils.object');

var namespace = require('../settings.json').namespace;
var iconClassName = namespace + '-icon';
var defaults = {
    name: '',
    title: ''
};
var Icon = Events.extend({
    constructor: function (options) {
        var the = this;

        Icon.parent(the);
        the[_options] = object.assign({}, defaults, options);
        the[_el] = modification.create('i', {
            class: iconClassName + ' ' + iconClassName + '-' + options.name,
            title: options.title
        });
    },

    /**
     * 获取元素
     * @returns {*}
     */
    getEl: function () {
        return this[_el];
    },

    /**
     * 销毁实例
     */
    destroy: function () {
        var the = this;

        Events.invoke('destroy', the);
        modification.remove(this[_el]);
    }
});

Icon.defaults = defaults;
var sole = Icon.sole;
var _options = sole();
var _el = sole();


module.exports = Icon;




