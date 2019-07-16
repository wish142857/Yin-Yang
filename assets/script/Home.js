// *************************
// 开始场景主脚本
// *************************

var AudioManager = require('AudioManager');
<<<<<<< HEAD
var AnimationManager = require('AnimationManager');
var DataManager = require('DataManager');
=======

>>>>>>> ae04134c3e571190ae9e5b085ff250c9996cf6cf
cc.Class({
    extends: cc.Component,

    properties: {
        audio: {                            // 全局音频引用
            default: null,
            type: AudioManager
<<<<<<< HEAD
        },
        animation: {                        // 全局动画
            default: null,
            type: AnimationManager
        },
        data: {                             // 全局数据引用
            default: null,
            type: DataManager
        },
=======
        }
>>>>>>> ae04134c3e571190ae9e5b085ff250c9996cf6cf
    },

    onLoad: function () {
    },

    start: function () {
<<<<<<< HEAD
        this.data = cc.find('DataManager').getComponent('DataManager');
        this.audio = cc.find('AudioManager').getComponent('AudioManager');
        this.animation = cc.find('AnimationManager').getComponent('AnimationManager');
        this.option = this.node.getChildByName('option');
=======
        // 引用全局音频
        this.audio = cc.find('AudioManager').getComponent('AudioManager');
>>>>>>> ae04134c3e571190ae9e5b085ff250c9996cf6cf
        // 初始化音乐按钮（默认非静音）
        this.switchMute(false);
    },

    update: function (dt) {

    },

    startGame: function () {
        // *** 开始游戏 ***
<<<<<<< HEAD
        this.animation.startGame(this.option, -this.data.screenHeight - 50);
=======
        cc.director.loadScene('game');
>>>>>>> ae04134c3e571190ae9e5b085ff250c9996cf6cf
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