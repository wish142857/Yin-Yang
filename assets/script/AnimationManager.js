// *************************
// 动画管理器脚本
// *************************

cc.Class({
    extends: cc.Component,

    properties: {

    },

    onLoad: function () {
        // 设置常驻节点属性
        cc.game.addPersistRootNode(this.node);
    },

    onDestroy: function() {
        // 解除常驻节点属性
        cc.game.removePersistRootNode(this.node);
    },

    start: function () {

    },

    update: function (dt) {

    },

    TODO: function () {
        // *** ??? ***
    },

});