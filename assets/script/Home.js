// *************************
// 开始场景主脚本
// *************************

cc.Class({
    extends: cc.Component,

    properties: {

    },

    onLoad: function () {
    },

    start: function () {
        // this.startSinglePlayerGame();
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
    }

});