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
        menuNode: {                         // 菜单栏结点引用
            default: null,
            type: cc.Node
        },
        scoreNode: {                        // 分数栏结点引用
            default: null,
            type: cc.Node
        },
        buttonNode: {                       // 按钮栏结点引用
            default: null,
            type: cc.Node
        },
        keyNode: {                          // 按键栏结点引用
            default: null,
            type: cc.Node
        },
        resultNode: {                       // 结算栏结点引用
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
        // *** 游戏数据初始化 ***
        this.score = 0;
        this.isPaused = false;
        // *** 结点与组件引用 ***
        // 引用全局数据
        this.data = cc.find('DataManager').getComponent('DataManager');
        // 引用全局音频
        this.audio = cc.find('AudioManager').getComponent('AudioManager');
        // 引用全局动画
        this.animation = cc.find('AnimationManager').getComponent('AnimationManager');
        // 引用背景节点
        this.bg = this.node.getChildByName('Background');
        // 引用暂停界面阴影节点
        this.shade = this.node.getChildByName('Shade');
        // 引用左右元素
        this.lElementNode = this.node.getChildByName('Black');
        this.rElementNode = this.node.getChildByName('White');
        // 菜单栏引用
        this.menuNode = this.node.getChildByName('Menu');
        // 分数栏引用
        this.scoreNode = this.node.getChildByName('Score');
        // 按钮栏引用
        this.buttonNode = this.node.getChildByName('Button');
        // 按键栏引用
        this.keyNode = this.node.getChildByName('Key');
        // 结算栏引用
        this.resultNode = this.node.getChildByName('Result');
        // *** 左右元素初始化 ***
        this.lElementNode.position = cc.v2(this.data.elementPathLineX_2, this.data.elementBaseLineY);
        this.rElementNode.position = cc.v2(this.data.elementPathLineX_3, this.data.elementBaseLineY);
        this.lElementNode.pathNumber = 2;
        this.lElementNode.colorId = 0;
        this.rElementNode.pathNumber = 3;
        this.rElementNode.colorId = 1;
        this.animation.isLeftMoving = false;
        this.animation.isRightMoving = false;
        this.animation.playSpin(this.lElementNode);
        this.animation.playSpin(this.rElementNode);
        // *** 菜单栏初始化 ***
        this.menuNode.active = false;
        // *** 分数栏初始化 ***
        this.scoreNode.getComponent(cc.Label).string = this.score;
        // *** 按钮栏初始化 ***
        // 初始化音乐按钮（承接全局）
        this.switchMute(this.audio.isMute);
        // 初始化暂停-继续按钮
        this.gameContinue();
        // *** 按键栏初始化 ***
        this.keyNode.getChildByName('switch').active = true;
        this.keyNode.getChildByName('black-LShift').active = true;
        this.keyNode.getChildByName('black-RShift').active = false;
        this.keyNode.getChildByName('white-LShift').active = false;
        this.keyNode.getChildByName('white-RShift').active = true;
        // *** 结算栏初始化 ***
        this.resultNode.active = false;
        // *** 播放背景音乐 ***
        this.audio.playMusic(this.audio.music1);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        this.fail = false;
        this.data.gameSpeed = 5;
        this.data.score = 0;
    },

    onDestroy: function() {
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
    },

    start: function () {
        
    },

    update: function (dt) {
        //if (this.isPaused)
        //    return;
        this.clickedLeft = false;
        this.clickedRight = false;
        // 判定死亡逻辑
        if(!this.fail && !this.bg.noPath) {
            for(let i = this.bg.childrenCount - 1; i >= 0; --i) {
                let childNode = this.bg.children[i];
                if(childNode.y <= this.data.elementBaseLineY && childNode.y + childNode.height > this.data.elementBaseLineY && !childNode.falling) {
                    if(childNode.index === this.lElementNode.pathNumber) {
                        if(childNode.colorId !== this.lElementNode.colorId) {
                            this.fail = true;                        
                            this.beforeGameOver();
                        }
                    }
                    if(childNode.index === this.rElementNode.pathNumber) {
                        if(childNode.colorId !== this.rElementNode.colorId) {
                            this.fail = true;  
                            this.beforeGameOver();
                        }
                    }
                }                   
            }
        }
        
        // 刷新分值逻辑
        this.getScore();
        if(this.data.score % 5 === 0 && this.data.score !== 0 
            && this.keyNode.getChildByName('switch').active === true) {
            this.keyNode.getChildByName('switch').active = false;
            this.keyNode.getChildByName('combineEffect').active = true;
            this.keyNode.getChildByName('combine').active = true;
        }        
        
    },

    combine: function() {
        if(this.clickedLeft || this.clickedRight) {
            return;
        }
        this.clickedLeft = true;
        this.clickedRight = true;
        // 播放动画
        if(this.animation.isLeftMoving === false && this.animation.isRightMoving === false) {
            this.keyNode.getChildByName('combineEffect').active = false;
            this.keyNode.getChildByName('combine').active = false;
            if(this.keyNode.getChildByName('black-LShift').active) {
                this.keyNode.getChildByName('black-LShift').active = false;
                var lActive = this.keyNode.getChildByName('black-LShift');
            } else {
                this.keyNode.getChildByName('white-LShift').active = false;
                var lActive = this.keyNode.getChildByName('white-LShift');
            }
            if(this.keyNode.getChildByName('black-RShift').active) {
                this.keyNode.getChildByName('black-RShift').active = false;
                var rActive = this.keyNode.getChildByName('black-RShift');
            } else {
                this.keyNode.getChildByName('white-RShift').active = false;
                var rActive = this.keyNode.getChildByName('white-RShift');
            }
            this.bg.noPath = true;
            this.lElementNode.stopActionByTag(1);
            this.rElementNode.stopActionByTag(1);
            if(this.lElementNode.pathNumber === 1) {
                var posX1 = this.data.elementPathLineX_1;
            } else {
                var posX1 = this.data.elementPathLineX_2;
            }
            if(this.rElementNode.pathNumber === 3) {
                var posX2 = this.data.elementPathLineX_3;
            } else {
                var posX2 = this.data.elementPathLineX_4;
            }
            this.animation.playFuse(this.lElementNode, this.rElementNode, posX1, posX2);
            this.scheduleOnce(function() {
                this.bg.noPath = false;
                this.keyNode.getChildByName('switch').active = true;
                this.keyNode.getChildByName('combineEffect').active = false;
                this.keyNode.getChildByName('combine').active = false;
                lActive.active = true;
                rActive.active = true;
            }, 5);
        }
        
    },

    getScore: function () {
        // *** 增加分数 ***
        //this.data.score = this.data.score + 1;
        this.scoreNode.getComponent(cc.Label).string = this.data.score;
    },

    leftShift: function () {
        // *** 进行左切换 ***
        
        if(this.clickedLeft) {
            return;
        }
        this.clickedLeft = true;
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
        if(this.clickedRight) {
            return;
        }
        this.clickedRight = true;
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
        if(this.clickedLeft || this.clickedRight) {
            return;
        }
        this.clickedLeft = true;
        this.clickedRight = true;
        // 播放动画
        if(this.animation.isLeftMoving === false && this.animation.isRightMoving === false) {
            var posX1 = this.data.paths[this.rElementNode.pathNumber];
            var posX2 = this.data.paths[this.lElementNode.pathNumber];
            this.animation.playSwitch(this.lElementNode, this.rElementNode, posX1, posX2);            
            // 赛道编号交换
            var tempNum = this.lElementNode.pathNumber;
            this.lElementNode.pathNumber = this.rElementNode.pathNumber;
            this.rElementNode.pathNumber = tempNum;
            // 引用交换
            var tempNode = this.lElementNode;
            this.lElementNode = this.rElementNode;
            this.rElementNode = tempNode;
            
            // 按键切换
            if(this.keyNode.getChildByName('black-LShift').active) {
                this.keyNode.getChildByName('black-LShift').active = false;
                this.keyNode.getChildByName('white-LShift').active = true;
            }
            else {
                this.keyNode.getChildByName('black-LShift').active = true;
                this.keyNode.getChildByName('white-LShift').active = false;
            }
            if(this.keyNode.getChildByName('black-RShift').active) {
                this.keyNode.getChildByName('black-RShift').active = false;
                this.keyNode.getChildByName('white-RShift').active = true;
            }
            else {
                this.keyNode.getChildByName('black-RShift').active = true;
                this.keyNode.getChildByName('white-RShift').active = false;
            }
            
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
        this.gameOver();
    },

    collision: function () {
        // *** 碰撞检测 ***
        return false;
    },

    gamePause: function() {
        // *** 游戏暂停 ***
        // 标记切换
        this.isPaused = true;
        // 菜单栏显示
        this.menuNode.active = true;
        // 暂停-继续按钮切换
        this.buttonNode.getChildByName('continue').active = false;
        this.buttonNode.getChildByName('pause').active = true;
        // 暂停所有系统事件
        this.node.pauseSystemEvents(true);
        // 恢复按钮栏事件                          
        this.buttonNode.resumeSystemEvents(true);
        // 恢复菜单栏事件
        this.menuNode.resumeSystemEvents(true);
        // 暂停当前场景
        cc.director.pause();
    },

    gameContinue: function() {
        // *** 游戏继续 ***
        // 背景阴影去除
        this.animation.playShadeOff(this.shade);
        // 标记切换
        this.isPaused = false;
        // 菜单栏隐藏
        this.menuNode.active = false;
        // 暂停-继续按钮切换
        this.buttonNode.getChildByName('continue').active = true;
        this.buttonNode.getChildByName('pause').active = false;
        // 恢复所有系统事件
        this.node.resumeSystemEvents(true);
        // 恢复当前场景
        cc.director.resume();
        
    },

    gameRestart: function() {
        // *** 游戏重开 ***
        cc.director.resume();
        cc.director.loadScene('game');
    },

    gameOver: function() {
        // *** 游戏结束 ***
        
        // 暂停所有系统事件
        this.node.pauseSystemEvents(true);
        // 恢复结算栏事件
        this.resultNode.resumeSystemEvents(true);
        // 暂停当前场景
        cc.director.pause();
        // 结算分数更新
        this.resultNode.getChildByName('score').getComponent(cc.Label).string = this.data.score;
        // 结算评价更新
        if (this.data.score >= this.data.scoreA)
            this.resultNode.getChildByName('scoreA').active = true;
        else if (this.data.score >= this.data.scoreB)
            this.resultNode.getChildByName('scoreB').active = true;
        else if (this.data.score >= this.data.scoreC)
            this.resultNode.getChildByName('scoreC').active = true;
        else
            this.resultNode.getChildByName('scoreD').active = true;
        // 激活结算界面
        this.resultNode.active = true;
    },

    returnHome: function() {
        // *** 回到主页 ***
        this.keyNode.getChildByName('combineEffect').active = false;
        this.fail = true; // 不再触发update失败逻辑
        cc.director.resume();
        for(let i = 0; i < this.node.childrenCount; i++) {
            if(this.node.children[i].name !== 'Shadow') {
                this.node.children[i].runAction(cc.fadeTo(1, 0));
            } else {
                this.node.children[i].runAction(cc.fadeTo(1, 255));
            }
        }
        this.scheduleOnce(function() {
            cc.director.loadScene('home');
        }, 1);
    },

    switchMute: function (isMute) {
        // *** 切换静音 ***
        // 全局音频切换
        this.audio.switchMute(isMute);      
        // 音乐按钮切换
        if (isMute) {
            this.buttonNode.getChildByName('music-on').active = false;
            this.buttonNode.getChildByName('music-off').active = true;
        }
        else {
            this.buttonNode.getChildByName('music-on').active = true;
            this.buttonNode.getChildByName('music-off').active = false;
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
        // 背景阴影开启
        this.animation.playShadeOn(this.shade, this.gamePause.bind(this));
        //this.gamePause();
    },

    clickPause: function () {
        // *** 按下暂停按钮 游戏继续 ***
        this.gameContinue();
    },

    beforeGameOver: function() {
        this.buttonNode.opacity = 50;
        this.animation.playShadeOn(this.shade, this.gameOver.bind(this));
    }


});