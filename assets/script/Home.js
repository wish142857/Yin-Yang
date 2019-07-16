// *************************
// 开始场景主脚本
// *************************

var AudioManager = require('AudioManager');

cc.Class({
    extends: cc.Component,

    properties: {
        audio: {                            // 全局音频引用
            default: null,
            type: AudioManager
        }
    },

    onLoad: function () {
    },

    start: function () {
        // 引用全局音频
        this.audio = cc.find('AudioManager').getComponent('AudioManager');
        // 初始化音乐按钮（默认非静音）
        this.switchMute(false);
    },

    update: function (dt) {

    },

    startGame: function () {
        // *** 开始游戏 ***
        cc.director.loadScene('game');
    },

    showIntroduction: function () {
        // *** 游戏介绍 ***
        cc.log('showIntroduction');

    },

    showRankingList: function() {
        // *** 显示排行 ***
        cc.log('showRankingList');
    },

    showSettingInterface: function() {
        // *** 显示设置界面 ***
        cc.log('showSettingInterface');
    },

    exitGame: function () {
        // *** 退出游戏 ***
        cc.log('exitGame');
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