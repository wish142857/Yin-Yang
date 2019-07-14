// *************************
// 动画管理器脚本
// *************************
var DataManager = require("DataManager");
cc.Class({
    extends: cc.Component,

    properties: {
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
        isLeftMoving: {
            default: false,
            type: cc.Boolean,
            tooltip: '左元素是否在移动'
        },
        isRightMoving: {
            default: false,
            type: cc.Boolean,
            tooltip: '右元素是否在移动'
        },
        shiftDuration: {
            default: 0.3,
            type: cc.Float,
            tooltip: '移动动画时长'
        },
        spinDuration: {
            default: 0,
            type: cc.Float,
            tooltip: '旋转动画周期'
        }
    },

    setShiftAction: function(posX) {
        
        var shift = cc.moveTo(this.shiftDuration, cc.v2(posX, this.elementBaseLineY));
        //return cc.sequence(started, shift, finished);
        return shift;
    },

    setSpinAction: function() {
        var rotate = cc.rotateBy(this.spinDuration, -180);
        return cc.repeatForever(rotate);
    },

    playShift: function(node, posX, isLeftNode) {
        cc.log(node.x);
        var started = cc.callFunc(function() {
            if(isLeftNode) {
                this.isLeftMoving = true;
            }
            else {
                this.isRightMoving = true;
            }
        }, this);
        var finished = cc.callFunc(function() {
            if(isLeftNode) {
                this.isLeftMoving = false;
            }
            else {
                this.isRightMoving = false;
            }
            node.x = posX;
        }, this);
        node.runAction(cc.sequence(started, this.setShiftAction(posX), finished));          
    },

    playSwitch: function(node1, node2, posX1, posX2) {
        var started = cc.callFunc(function() {
                this.isLeftMoving = true;
                this.isRightMoving = true;
        }, this);
        var finished = cc.callFunc(function() {
                this.isLeftMoving = false;
                this.isRightMoving = false;
                node1.x = posX1;
                node2.x = posX2;
        }, this);
        node1.runAction(cc.sequence(started, this.setShiftAction(posX1), finished));
        node2.runAction(this.setShiftAction(posX2));

    },

    playSpin: function(node) {
        
        node.runAction(this.setSpinAction());
    },

    onLoad: function () {
        // 设置常驻节点属性
        cc.game.addPersistRootNode(this.node);
        //DataManager.anim = this;
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