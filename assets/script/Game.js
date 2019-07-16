// *************************
// 游戏场景主脚本
// *************************


var DataManager = require('DataManager');
var AudioManager = require('AudioManager');
var AnimationManager = require('AnimationManager');


cc.Class({
    extends: cc.Component,

    properties: {
        score: {                            // 游戏分数
            default: 0,
            type: cc.Integer
        },
        isPaused: {                         // 是否暂停
            default: false,
        },
        bg: {                               // 背景结点引用
            default: null,
            type: cc.Node
        },
        scoreNode: {                        // 分数栏结点引用
            default: null,
            type: cc.Node
        },
        lElementNode: {                     // 左元素节点引用
            default: null,
            type: cc.Node
        },
        rElementNode: {                     // 右元素节点引用
            default: null,
            type: cc.Node
        },    
        data: {                             // 全局数据引用
            default: null,
            type: DataManager
        },
        audio: {                            // 全局音频引用
            default: null,
            type: AudioManager
        },
        animation: {                        // 全局动画引用
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
        // 游戏数据初始化
        this.score = 0;
        this.isPaused = false;
        // 引用全局数据
        this.data = cc.find('DataManager').getComponent('DataManager');
        // 引用全局音频
        this.audio = cc.find('AudioManager').getComponent('AudioManager');
        // 引用全局动画
        this.animation = cc.find('AnimationManager').getComponent('AnimationManager');
        // 引用背景结点
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
        this.animation.playSpin(this.lElementNode);
        this.animation.playSpin(this.rElementNode);
        // 分数栏初始化
        this.scoreNode = this.node.getChildByName('Score');
        this.scoreNode.getComponent(cc.Label).string = this.score;
        // 初始化音乐按钮（承接全局）
        this.switchMute(this.audio.isMute);
        // 初始化暂停-继续按钮
        this.gameContinue();
    },

    update: function (dt) {
        //if (this.isPaused)
        //    return;

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

    increaseScore: function () {
        // *** 增加分数 ***
        this.score = this.score + 1;
        this.scoreNode.getComponent(cc.Label).string = this.score;
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
            case cc.macro.KEY.p:
                this.increaseScore();
                break;
            case cc.macro.KEY.t:
                this.test();
            default:
                break;
        }
    },

    test: function() {
        // *** 测试函数 ***
        // *** t 键触发 ***
        if(this.isPaused)
            this.gameContinue();
        else
            this.gamePause();
    },

    collision: function () {
        // *** 碰撞检测 ***
        return false;
    },

    gamePause: function() {
        // *** 游戏暂停 ***
        // 标记切换
        this.isPaused = true;
        // 暂停-继续按钮切换
        this.node.getChildByName('continue').active = false;
        this.node.getChildByName('pause').active = true;
        // 暂停所有系统事件
        this.node.pauseSystemEvents(true);
        // 恢复按钮事件                          
        this.node.getChildByName('music-on').resumeSystemEvents(true);
        this.node.getChildByName('music-off').resumeSystemEvents(true);
        this.node.getChildByName('continue').resumeSystemEvents(true);
        this.node.getChildByName('pause').resumeSystemEvents(true);
        // 暂停当前场景
        cc.director.pause();
    },

    gameContinue: function() {
        // *** 游戏继续 ***
        // 标记切换
        this.isPaused = false;
        // 暂停-继续按钮切换
        this.node.getChildByName('continue').active = true;
        this.node.getChildByName('pause').active = false;
        // 恢复所有系统事件
        this.node.resumeSystemEvents(true);
        // 恢复当前场景
        cc.director.resume();
    },

    gameRestart: function() {
        // *** 游戏重开 ***
        cc.log('gameRestart');
    },

    gameOver: function() {
        // *** 游戏结束 ***
        cc.director.loadScene('game');
    },

    returnHome: function() {
        // *** 回到主页 ***
        cc.director.loadScene('home');
    },

    switchMute: function (isMute) {
        // *** 切换静音 ***
        // 全局音频切换
        this.audio.switchMute(isMute);      
        // 音乐按钮切换
        if (isMute) {
            this.node.getChildByName('music-on').active = false;
            this.node.getChildByName('music-off').active = true;
        }
        else {
            this.node.getChildByName('music-on').active = true;
            this.node.getChildByName('music-off').active = false;
        }
    },

    clickMusicOn: function () {
        // *** 按下音乐按钮 切换至静音 ***
        this.switchMute(true);
    },

    clickMusicOff: function () {
        // *** 按下音乐按钮 切换至非静音 ***
        this.switchMute(false);
    },

    clickContinue: function () {
        // *** 按下继续按钮 游戏暂停 ***
        this.gamePause();
    },

    clickPause: function () {
        // *** 按下暂停按钮 游戏继续 ***
        this.gameContinue();
    }


});