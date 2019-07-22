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
        }
    },

    onLoad: function () {
        // 开始引用
        this.data = cc.find('DataManager').getComponent('DataManager');
        this.audio = cc.find('AudioManager').getComponent('AudioManager');
        this.animation = cc.find('AnimationManager').getComponent('AnimationManager');
        this.rankList = cc.find('RankList').getComponent('RankList');
        this.option= this.node.getChildByName('option');
        cc.director.preloadScene('game');
        // 初始化音乐按钮（默认非静音）
        this.switchMute(false);
    },

    start: function () {
        // 控件位置适配
        this.node.getChildByName('music-on').y = this.data.screenHeight * 520 / 1280;
        this.node.getChildByName('music-off').y = this.data.screenHeight * 520 / 1280;
    },

    update: function (dt) {

    },

    startGame: function () {
        // *** 开始游戏 ***
        this.audio.playEffect(this.audio.clickSound);
        this.animation.startGame(this.option, -this.data.screenHeight - 30);
        setTimeout(function() {
            cc.director.loadScene('game');
        }, 1501);
    },

    showIntroduction: function () {
        // *** 游戏介绍 ***
        this.audio.playEffect(this.audio.clickSound);
        this.animation.startGame(this.option, -this.data.screenHeight - 30);
        setTimeout(function() {
            cc.director.loadScene('tutorial');
        }, 1501);
    },

    openRankingList: function() {
        // *** 显示排行 ***
        this.audio.playEffect(this.audio.clickSound);
        this.option.pauseSystemEvents(true);
        this.rankList.openRankingList();
    },

    closeRankingList: function() {
        // *** 关闭排行榜 ***
        this.audio.playEffect(this.audio.clickSound);
        this.option.resumeSystemEvents(true);
        this.rankList.closeRankingList();
    },

    exitGame: function () {
        // *** 退出游戏 ***
        this.audio.playEffect(this.audio.clickSound);
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