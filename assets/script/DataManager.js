// *************************
// 数据管理器脚本
// *************************

cc.Class({
    extends: cc.Component,

    properties: {
        // 参考分辨率  W: 640 H: 1280
        elementPathLineX_1: {
            default: -240,
            type: cc.Integer,
            tooltip: '元素第一条路径线相对于背景中心锚点的X坐标'
        },
        elementPathLineX_2: {
            default: -80,
            type: cc.Integer,
            tooltip: '元素第二条路径线相对于背景中心锚点的X坐标'
        },
        elementPathLineX_3: {
            default: 80,
            type: cc.Integer,
            tooltip: '元素第三条路径线相对于背景中心锚点的X坐标'
        },
        elementPathLineX_4: {
            default: 240,
            type: cc.Integer,
            tooltip: '元素第四条路径线相对于背景中心锚点的X坐标'
        },
        elementBaseLineY: {
            default: 0,
            type: cc.Integer,
            tooltip: '元素基准线相对于背景中心锚点的Y坐标'
        },
        
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
        this.paths = [, this.elementPathLineX_1, this.elementPathLineX_2, 
            this.elementPathLineX_3, this.elementPathLineX_4];
    },

    update: function (dt) {

    },

    TODO: function () {
        // *** ??? ***
    },

});