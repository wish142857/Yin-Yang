// *************************
// 游戏场景主脚本
// *************************


var DataManager = require('DataManager');
var AnimationManager = require('AnimationManager');

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
        bg: {
            default: null,
            type: cc.Node
        },
        data: {                             // 全局数据
            default: null,
            type: DataManager
        },
        animation: {
            default: null,
            type: AnimationManager
        }

    },

    onLoad: function () {
        cc.log("loaded");
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
    },

    onDestroy: function() {

    },

    start: function () {
        
        // 引用全局数据
        this.data = cc.find('DataManager').getComponent('DataManager');
        // 引用全局动画
        this.animation = cc.find('AnimationManager').getComponent('AnimationManager');
        
        this.bg = this.node.getChildByName('Background');
        // 左右元素初始化
        this.lElementNode = this.node.getChildByName('Black');
        this.rElementNode = this.node.getChildByName('White');
        this.lElementNode.position = cc.v2(this.data.elementPathLineX_2, this.data.elementBaseLineY);
        this.rElementNode.position = cc.v2(this.data.elementPathLineX_3, this.data.elementBaseLineY);
        this.lElementNode.pathNumber = 2;
        this.lElementNode.colorId = 0;
        this.rElementNode.pathNumber = 3;
        this.rElementNode.colorId = 1;
        // 左右元素开始旋转
        this.animation.playSpin(this.lElementNode);
        this.animation.playSpin(this.rElementNode);
    },

    update: function (dt) {
        for(let i = this.bg.childrenCount - 1; i >= 0; --i) {
            let childNode = this.bg.children[i];
            if(childNode.y <= this.data.elementBaseLineY && childNode.y + childNode.height > this.data.elementBaseLineY) {
                if(childNode.index === this.lElementNode.pathNumber) {
                    if(childNode.colorId !== -1 && childNode.colorId !== this.lElementNode.colorId) {                        
                        //this.gameOver();
                    }
                }
                if(childNode.index === this.rElementNode.pathNumber) {
                    if(childNode.colorId !== -1 && childNode.colorId !== this.rElementNode.colorId) {
                        //this.gameOver();
                    }
                }
            }                   
        }
    },

    leftShift: function () {
        // *** 进行左切换 ***
        // 播放动画
        if(this.animation.isLeftMoving === false) {
            if(this.lElementNode.pathNumber === 1) {
                this.lElementNode.pathNumber = 2;
                var posX = this.data.elementPathLineX_2;
            } else {
                this.lElementNode.pathNumber = 1;
                var posX = this.data.elementPathLineX_1;
            }
            this.animation.playShift(this.lElementNode, posX, true);
        }
        
    },

    rightShift: function () {
        // *** 进行右切换 ***
        // 播放动画
        if(this.animation.isRightMoving === false) {
            if(this.rElementNode.pathNumber === 3) {
                this.rElementNode.pathNumber = 4;
                var posX = this.data.elementPathLineX_4;
            } else {
                this.rElementNode.pathNumber = 3;
                var posX = this.data.elementPathLineX_3;
            }
            this.animation.playShift(this.rElementNode, posX, false);
        }
    },

    switch: function () {
        // *** 进行交换 ***
        // 播放动画
        if(this.animation.isLeftMoving === false && this.animation.isRightMoving === false) {
            var posX1 = this.data.paths[this.rElementNode.pathNumber];
            var posX2 = this.data.paths[this.lElementNode.pathNumber];
            cc.log(posX1);
            cc.log(posX2);
            this.animation.playSwitch(this.lElementNode, this.rElementNode, posX1, posX2);            
            // 赛道编号交换
            var tempNum = this.lElementNode.pathNumber;
            this.lElementNode.pathNumber = this.rElementNode.pathNumber;
            this.rElementNode.pathNumber = tempNum;
            // 引用交换
            var tempNode = this.lElementNode;
            this.lElementNode = this.rElementNode;
            this.rElementNode = tempNode;
        }      
    },

    // 测试使用
    onKeyDown (event) {      
        switch(event.keyCode) {
            case cc.macro.KEY.a:
                this.leftShift();
                break;
            case cc.macro.KEY.d:
                this.rightShift();
                break;
            case cc.macro.KEY.s:
                this.switch();
                break;
            default:
                break;
        }
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