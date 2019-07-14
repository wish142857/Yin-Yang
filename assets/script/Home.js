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

    },

    update: function (dt) {

    },

    startSinglePlayerGame: function () {
        // *** 开始单人游戏 ***
        cc.director.loadScene('game');
    },

    startMultiPlayerGame: function () {
        // *** 开始多人游戏 ***
    },

    showRankingList: function() {
        // *** 显示排行榜 ***
    },

    showSettingInterface: function() {
        // *** 显示设置界面 ***
    }
});