// *************************
// 游戏场景主脚本
// *************************


var DataManager = require('DataManager');

cc.Class({
    extends: cc.Component,

    properties: {
        lElementNode: {                     // 左元素节点
            default: null,
            type: cc.Node
        },
        rElementNode: {                     // 右元素节点
            default: null,
            type: cc.Node
        },    
        data: {                             // 全局数据
            default: null,
            type: DataManager
        }

    },

    onLoad: function () {
      
    },

    onDestroy: function() {

    },

    start: function () {
        // 引用全局数据
        this.data = cc.find('DataManager').getComponent('DataManager');
        // 左右元素初始化
        this.lElementNode = this.node.getChildByName('Black');
        this.rElementNode = this.node.getChildByName('White');
        this.lElementNode.position = cc.v2(this.data.elementPathLineX_2, this.data.elementBaseLineY);
        this.rElementNode.position = cc.v2(this.data.elementPathLineX_3, this.data.elementBaseLineY);
    },

    update: function (dt) {

    },

    leftShift: function () {
        // *** 进行左切换 ***
        // 位置更新
        if (this.lElementNode.x === this.data.elementPathLineX_2) {
            this.lElementNode.x = this.data.elementPathLineX_1;
        }
        else {
            this.lElementNode.x = this.data.elementPathLineX_2;
        }
    },

    rightShift: function () {
        // *** 进行右切换 ***
        // 位置更新
        if (this.rElementNode.x === this.data.elementPathLineX_3) {
            this.rElementNode.x = this.data.elementPathLineX_4;
        }
        else {
            this.rElementNode.x = this.data.elementPathLineX_3;
        }
    },

    switch: function () {
        // *** 进行交换 ***
        // 位置交换
        var tempInt = this.lElementNode.x;
        this.lElementNode.x = this.rElementNode.x;
        this.rElementNode.x = tempInt;
        // 引用交换
        var tempNode = this.lElementNode;
        this.lElementNode = this.rElementNode;
        this.rElementNode = tempNode;
    },


    collision: function () {
        // *** 碰撞检测 ***
        return false;
    },

    gameOver: function() {
        // *** 游戏结束 ***
        cc.director.loadScene('game');
    },

    gamePause: function() {
        // *** 游戏暂停 ***
        if (cc.director.isPaused())
            cc.director.resume();
        else
            cc.director.pause();
    },

    returnHome: function() {
        // *** 回到主页 ***
        cc.director.loadScene('home');
    }

});