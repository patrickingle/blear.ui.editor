/**
 * clean
 * @author ydr.me
 * @create 2017-11-29 17:49
 * @update 2017-11-29 17:49
 */


'use strict';

var modfication = require('blear.core.modification');
var attribute = require('blear.core.attribute');
var array = require('blear.utils.array');

var dataRE = /^data-[.]+/;


module.exports = cleanNode;


// ===========================
/**
 * 清理节点
 * @param node
 * @param allowTags
 * @param allowAttrs
 * @param allowStyles
 */
function cleanNode(node, allowTags, allowAttrs, allowStyles) {
    allowStyles = allowStyles || [];

    var start = false;
    var work = function (node) {
        if (start && allowTags.indexOf(node.tagName.toLowerCase()) === -1) {
            modfication.remove(node);
            return;
        }

        var childNodes = array.from(node.childNodes);

        start = true;
        array.each(childNodes, function (i, childNode) {
            var childNodeType = childNode.nodeType;

            if (childNodeType === 1) {
                var attrs = array.from(childNode.attributes);
                var childNodeName = childNode.nodeName.toLowerCase();

                array.each(attrs, function (j, attr) {
                    var attrName = attr.name;

                    if (attrName === 'style') {
                        var childNodeStyle = array.from(childNode.style);
                        array.each(childNodeStyle, function (index, key) {
                            if (allowStyles.indexOf(key) < 0) {
                                attribute.style(childNode, key, '');
                            }
                        });
                        return;
                    }

                    var safeAttrs = allowAttrs[childNodeName] || [];

                    // 不存在的属性，删除
                    if (safeAttrs.indexOf(attrName) < 0) {
                        attribute.removeAttr(childNode, attrName);
                    }
                });

                work(childNode);
            } else if (childNodeType !== 3) {
                modfication.remove(childNode);
                return false;
            }
        });
    };

    work(node);
}


