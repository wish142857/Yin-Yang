// *************************
// 音效管理器脚本
// *************************

cc.Class({
    extends: cc.Component,

    properties: {
        current: {                    // 当前背景音乐ID
            default: 0,
            type: cc.Integer
        },
        musicVolume: {                // 音乐音量
            default: 0,
            type: cc.Float
        },
        effectVolume: {               // 音效音量
            default: 0,
            type: cc.Float
        }
        // music1: {                   // 音乐预载，利用属性检查器加入
        //     default: null,   
        //     type: cc.AudioClip
        // }

    },

    onLoad: function () {
        // 设置常驻节点属性
        cc.game.addPersistRootNode(this.node);
        // 初始化音量
        this.musicVolume = 0.8;
        this.effectVolume = 0.8;
    },

    onDestroy: function() {
        // 解除常驻节点属性
        cc.game.removePersistRootNode(this.node);
    },

 
    playMusic: function (clip) {
        // *** 播放音乐 ***
        // （背景音乐，循环，单例）
        cc.audioEngine.stop(this.current);
        this.current = cc.audioEngine.play(clip, true, this.musicVolume);
    },

    playEffect: function (clip) {
        // *** 播放音效 ***
        // （游戏音效，非循环，非单例）
        cc.audioEngine.play(clip, false, this.effectVolume);
    },

        
    pause: function() {
        // *** 暂停音乐 ***
        cc.audioEngine.pause(this.current);
    },

    resume: function() {
        // *** 恢复音乐 ***
        cc.audioEngine.resume(this.current);
    },

    getMusicVolume: function() {
        // *** 获取音乐音量 ***
        return this.musicVolume;
    },

    setMusicVolume: function(volume) {
        // *** 设定音乐音量 ***
        if ((volume < 0) || (volume > 1))
            return;
        this.musicVolume = volume;
        cc.audioEngine.setVolume(this.current, this.musicVolume);
    },

    getEffectVolume: function() {
        // *** 获取音效音量 ***
        return this.effectVolume;
    },

    setEffectVolume: function(volume) {
        // *** 设定音效音量 ***
        if ((volume < 0) || (volume > 1))
            return;
        this.effectVolume = volume;
    }

});