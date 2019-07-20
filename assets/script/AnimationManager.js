// *************************
// 动画管理器脚本
// *************************
cc.Class({
    extends: cc.Component,

    properties: {
        elementBaseLineY: {
            default: 0,
            type: cc.Integer,
            tooltip: '元素基准线相对于背景中心锚点的Y坐标'
        },
        isLeftMoving: {
            default: false,
            tooltip: '左元素是否在移动'
        },
        isRightMoving: {
            default: false,
            tooltip: '右元素是否在移动'
        },
        shiftDuration: {
            default: 0,
            type: cc.Float,
            tooltip: '移动动画时长'
        },
        spinDuration: {
            default: 0,
            type: cc.Float,
            tooltip: '旋转动画周期'
        },
        pullDownDuration: {
            default: 0,
            type: cc.Float,
            tooltip: '首页菜单下拉动画时间'
        },
        fadeDuration: {
            default: 0,
            type: cc.Float,
            tooltip: '暂停时渐隐时间'
        },
        fallDuration: {
            default: 0,
            type: cc.Float,
            tooltip: '轨道坍塌动画时间'
        }
    },

    setShiftAction: function(posX) {  
        // *** 元素移动动画 ***      
        var shift = cc.moveTo(this.shiftDuration, cc.v2(posX, this.elementBaseLineY));
        return shift;
    },

    setSpinAction: function() {
        // *** 元素旋转动画 *** 
        var rotate = cc.rotateBy(this.spinDuration, -180);
        return cc.repeatForever(rotate);
    },

    setBlinkAction: function(duration, minOpacity) {
        // *** 元素闪烁动画 *** 
        var blink = cc.sequence(cc.fadeTo(duration, minOpacity), cc.fadeTo(duration, 255));
        return blink;
    },

    playShift: function(node, posX, isLeftNode) {
        // *** 单元素移动动画播放 *** 
        var started = cc.callFunc(function() {
            if(isLeftNode) {
                this.isLeftMoving = true;
            } else {
                this.isRightMoving = true;
            }
        }, this);
        var finished = cc.callFunc(function() {
            if(isLeftNode) {
                this.isLeftMoving = false;
            } else {
                this.isRightMoving = false;
            }
        }, this);
        node.runAction(cc.sequence(started, this.setShiftAction(posX), finished));          
    },

    playSwitch: function(node1, node2, posX1, posX2) {
        // *** 双元素交换动画播放 *** 
        var started = cc.callFunc(function() {
                this.isLeftMoving = true;
                this.isRightMoving = true;
        }, this);
        var finished = cc.callFunc(function() {
                this.isLeftMoving = false;
                this.isRightMoving = false;
        }, this);
        node1.runAction(cc.sequence(started, this.setShiftAction(posX1), finished));
        node1.runAction(this.setBlinkAction(0.5 * this.shiftDuration, 0));
        node2.runAction(this.setShiftAction(posX2));
        node2.runAction(this.setBlinkAction(0.5 * this.shiftDuration, 0));
    },

    playSpin: function(node) {
        // *** 双元素旋转动画播放 ***       
        node.runAction(this.setSpinAction());
    },

    playFuse: function(node1, node2, posX1, posX2) {
        // *** 双元素合并动画 *** 
        var toCenter1= cc.spawn(cc.moveTo(this.shiftDuration, 0, this.elementBaseLineY), /*cc.rotateTo(this.shiftDuration, 0), */cc.scaleTo(this.shiftDuration, 2));
        var toCenter2= cc.spawn(cc.moveTo(this.shiftDuration, 0, this.elementBaseLineY), /*cc.rotateTo(this.shiftDuration, 0), */cc.scaleTo(this.shiftDuration, 2));
        var goBack1 = cc.spawn(cc.moveTo(this.shiftDuration, posX1, this.elementBaseLineY), cc.rotateTo(this.shiftDuration, 0), cc.scaleTo(this.shiftDuration, 1));
        var goBack2 = cc.spawn(cc.moveTo(this.shiftDuration, posX2, this.elementBaseLineY), cc.rotateTo(this.shiftDuration, 0), cc.scaleTo(this.shiftDuration, 1));
        var blink1 = this.setBlinkAction(0.8, 127);
        var blink2 = this.setBlinkAction(0.8, 127);
        node1.runAction(cc.sequence(toCenter1, cc.repeat(blink1, 3), goBack1));
        node2.runAction(cc.sequence(toCenter2, cc.repeat(blink2, 3), goBack2));
    },

    playWordFade: function(node) {
        // *** “合”按钮渐隐飞出动画 *** 
        var zoomFade = cc.spawn(cc.fadeTo(1,0), cc.scaleTo(1,3), cc.moveBy(1, 0, 400));
        var finished = cc.callFunc(function() {
            // 复原属性
            node.active = false;
            node.opacity = 255;
            node.scale = 1;
            node.y -= 400;
        }, this)
        node.runAction(cc.sequence(zoomFade, finished));
    },

    playShadeOn: function(node, gamePause) {
        // *** 暂停或游戏结束菜单跳出时背景渐暗动画 *** 
        var finished = cc.callFunc(gamePause, this);
        node.runAction(cc.sequence(cc.fadeTo(this.fadeDuration, 200), finished));
    },

    playShadeOff: function(node) {
        // *** 回到游戏时背景渐亮动画 *** 
        node.runAction(cc.fadeTo(this.fadeDuration, 0));
    },

    playFalling: function(node, recycle) {
        // *** 轨道坍塌动画 *** 
        var finished = cc.callFunc(recycle, this);
        var falling = cc.spawn(cc.fadeTo(this.fallDuration, 0), cc.scaleTo(this.fallDuration, 0));
        node.runAction(cc.sequence(falling, finished));
    },

    playTutorialFall: function(node) {
        // *** 教程中轨道坍塌动画 *** 
        var moveDown = cc.moveBy(this.fallDuration, 0, -node.height * 0.5);
        node.runAction(cc.spawn(cc.fadeTo(this.fallDuration, 0), cc.scaleTo(this.fallDuration, 0), moveDown));
    },

    startGame: function(node, pullDownDistance) {
        // *** 开始游戏或教程的菜单下拉动画 *** 
        var pullDown = cc.moveBy(this.pullDownDuration, 0, pullDownDistance).easing(cc.easeExponentialIn());
        node.runAction(pullDown);
    },

    onLoad: function () {
        // 设置常驻节点属性
        cc.game.addPersistRootNode(this.node);
    },

    onDestroy: function() {
        // 解除常驻节点属性
        cc.game.removePersistRootNode(this.node);
    },

    start: function () {
        
    },

    update: function (dt) {

    },
});