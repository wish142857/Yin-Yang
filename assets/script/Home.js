// *************************
// 开始场景主脚本
// *************************

var AudioManager = require('AudioManager');
var AnimationManager = require('AnimationManager');
var DataManager = require('DataManager');
var RankList = require('RankList');


cc.Class({
    extends: cc.Component,

    properties: {
        audio: {                            // 全局音频引用
            default: null,
            type: AudioManager
        },
        animation: {                        // 全局动画引用
            default: null,
            type: AnimationManager
        },
        data: {                             // 全局数据引用
            default: null,
            type: DataManager
        },
        rankList: {                         // 排行榜组件引用
            default: null,
            type: RankList
        },
        option: {                           // 选择结点引用
            default: null,
            type: cc.Node
        },
        rlClose: {                          // 排行榜关闭结点引用
            default: null,
            type: cc.Node
        }
    },

    onLoad: function () {
        // 开始引用
        this.data = cc.find('DataManager').getComponent('DataManager');
        this.audio = cc.find('AudioManager').getComponent('AudioManager');
        this.animation = cc.find('AnimationManager').getComponent('AnimationManager');
        this.rankList = cc.find('RankList').getComponent('RankList');
        this.option= this.node.getChildByName('option');
        this.rlClose = this.node.getChildByName('close');
        cc.director.preloadScene('game');
        // 初始化音乐按钮（默认非静音）
        this.switchMute(false);
        // 初始化排行榜关闭结点（默认不激活）
        this.rlClose.active = false;
    },

    start: function () {
    },

    update: function (dt) {

    },

    startGame: function () {
        // *** 开始游戏 ***
        this.animation.startGame(this.option, -this.data.screenHeight - 30);
        setTimeout(function() {
            cc.director.loadScene('game');
        }, 1501);
    },

    showIntroduction: function () {
        // *** 游戏介绍 ***
        this.animation.startGame(this.option, -this.data.screenHeight - 30);
        setTimeout(function() {
            cc.director.loadScene('tutorial');
        }, 1501);
    },

    openRankingList: function() {
        // *** 显示排行 ***
        this.option.pauseSystemEvents(true);
        this.rlClose.active = true;
        this.rankList.openRankingList();
    },

    closeRankingList: function() {
        // *** 关闭排行榜 ***
        this.option.resumeSystemEvents(true);
        this.rlClose.active = false;
        this.rankList.closeRankingList();
    },

    exitGame: function () {
        // *** 退出游戏 ***
        wx.exitMiniProgram();
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
    }
});