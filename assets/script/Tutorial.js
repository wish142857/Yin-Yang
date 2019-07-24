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
        this.paths = this.node.getChildByName('paths');
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
        // 说明文字模块引用
        this.text = this.node.getChildByName('Text');
        // 主界面静场景引用（用于过渡动画）
        this.homeShadow = this.node.getChildByName('Shadow');
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
        // *** 按钮栏初始化 ***
        // 初始化音乐按钮（承接全局）
        this.switchMute(this.audio.isMute);
        // *** 按键栏初始化 ***
        this.switchKey = this.keyNode.getChildByName('switch');
        this.switchKey.active = false;
        this.blackLShiftKey = this.keyNode.getChildByName('black-LShift');
        this.blackLShiftKey.active = true;
        this.blackRShiftKey = this.keyNode.getChildByName('black-RShift');
        this.blackRShiftKey.active = false;
        this.whiteLShiftKey = this.keyNode.getChildByName('white-LShift');
        this.whiteLShiftKey.active = false;
        this.whiteRShiftKey = this.keyNode.getChildByName('white-RShift');
        this.whiteRShiftKey.active = true;
        this.leftHint = this.keyNode.getChildByName('leftHint');
        // *** 引用背景轨道块和说明文字 ***
        this.paths = this.node.getChildByName('paths');
        this.up1 = this.paths.getChildByName('up1');
        this.up2 = this.paths.getChildByName('up2');
        this.up3 = this.paths.getChildByName('up3');
        this.up4 = this.paths.getChildByName('up4');
        this.down1 = this.paths.getChildByName('down1');
        this.down2 = this.paths.getChildByName('down2');
        this.down3 = this.paths.getChildByName('down3');
        this.down4 = this.paths.getChildByName('down4');
        this.text = this.node.getChildByName('Text');
        this.text1 = this.text.getChildByName('text1');
        this.text2_1 = this.text.getChildByName('text2-1');
        this.text2_2 = this.text.getChildByName('text2-2');
        this.text3 = this.text.getChildByName('text3');
        this.textBg = this.text.getChildByName('textBg');
        this.textWarn = this.text.getChildByName('textWarn');
        this.stage = 1;
    },

    onDestroy: function() {
    },

    start: function () {
        // 控件位置适配
        this.scoreNode.y = this.data.screenHeight * 480 / 1280;
        this.buttonNode.y = this.data.screenHeight * 540 / 1280;
        this.keyNode.y = this.data.screenHeight * -480 / 1280;
        this.homeShadow.getChildByName('music-off').y = this.data.screenHeight * 540 / 1280;
        this.homeShadow.getChildByName('music-on').y = this.data.screenHeight * 540 / 1280;
    },

    update: function (dt) {
        this.clickedLeft = false;
        this.clickedRight = false;
        if(this.leftPressed && this.stage === 1) {
            // 左键按过后进入第二阶段
            this.stage = 2;
            this.animation.playTutorialFall(this.down1);
            this.animation.playTutorialFall(this.down2);
            this.animation.playTutorialFall(this.down3);
            this.animation.playTutorialFall(this.down4);
            this.text1.active = false;
            this.textWarn.active = false;
            this.text2_1.active = true;
            this.scheduleOnce(function() {
                this.animation.playSimpleFade(this.text, 1, 0);  
                this.scheduleOnce(function() {
                    this.text2_1.active = false;
                    this.text2_2.active = true;
                    this.animation.playSimpleFade(this.text, 1, 255);
                    this.switchKey.active = true;                    
                }, 1)
            }, 3)
            
        } else if(this.stage === 2 && this.switched) {
            this.animation.playSimpleFade(this.text, 1, 0);
            // 点击交换键后进入第三阶段
            this.stage = 3;
        } else if(this.stage === 3) {
            // 轨道完全落下后进入第四阶段
            this.up1.y -= 5;
            this.up2.y -= 5;
            this.up3.y -= 5;
            this.up4.y -= 5;
            if(this.up1.y <= -this.up1.height * 0.5) {
                this.stage = 4;
            }
        } else if(this.stage === 4) {
            this.text2_2.active = false;
            this.text3.active = true;
            this.animation.playSimpleFade(this.text, 1, 255);
            this.stage = 5;
        } else if(this.stage === 5) {
            // 背景渐隐，回到主界面
            this.stage = 6;
            this.scheduleOnce(function() {
                for(let i = 0; i < this.node.childrenCount; i++) {
                    if(this.node.children[i].name !== 'Shadow') {
                        this.node.children[i].runAction(cc.fadeTo(1, 0));
                    } else {
                        this.node.children[i].runAction(cc.fadeTo(1, 255));
                    }
                }
            }, 5);
            
            this.scheduleOnce(function() {
                cc.director.loadScene('home');
            },6);
        }
    },

    leftShift: function () {
        // *** 进行左切换 ***
        if(this.clickedLeft) {
            return;
        }
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
        this.leftPressed = true;
        this.leftHint.active = false;
    },

    rightShift: function () {
        // *** 进行右切换 ***
        if(this.clickedRight) {
            return;
        }
        if(this.stage === 1) {
            this.text1.active = false;
            this.textWarn.active = true;
            return;
        }
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
            if(this.blackLShiftKey.active) {
                this.blackLShiftKey.active = false;
                this.whiteLShiftKey.active = true;
            } else {
                this.blackLShiftKey.active = true;
                this.whiteLShiftKey.active = false;
            }
            if(this.blackRShiftKey.active) {
                this.blackRShiftKey.active = false;
                this.whiteRShiftKey.active = true;
            } else {
                this.blackRShiftKey.active = true;
                this.whiteRShiftKey.active = false;
            }
            this.switched = true;
        }    
    },

    returnHome: function() {
        // *** 回到主页 ***
        let musicOn = this.homeShadow.getChildByName('music-on');
        let musicOff = this.homeShadow.getChildByName('music-off');
        if (this.audio.isMute) {
            musicOn.active = false;
            musicOff.active = true;
        }
        else {
            musicOn.active = true;
            musicOff.active = false;
        }
        cc.director.resume();
        this.audio.playEffect(this.audio.clickSound);
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


});

