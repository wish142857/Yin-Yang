// *************************
// 背景脚本
// *************************
var DataManager = require('DataManager');
cc.Class({
    extends: cc.Component,

    properties: {
        pathPrefab: {
            default: null,
            type: cc.Prefab
        },
        data: {                             // 全局数据
            default: null,
            type: DataManager
        },
        pathLength: {
            default: 0,
            type: cc.Integer
        },
        grayLength: {
            default:0,
            type: cc.Integer
        }
    },

    onLoad: function () {
        this.pathPool = new cc.NodePool;
        let initCount = 12;
        for (let i = 0; i < initCount; ++i) {
            let path = cc.instantiate(this.pathPrefab); // 创建节点
            this.pathPool.put(path); // 通过 put 接口放入对象池
        }
    },
    createPath: function (color, sizeY, index, posX, posY) {
        let path = null;
        if (this.pathPool.size() > 0) { // 通过 size 接口判断对象池中是否有空闲的对象
            path = this.pathPool.get();
        } else { // 如果没有空闲对象，也就是对象池中备用对象不够时，我们就用 cc.instantiate 重新创建
            path = cc.instantiate(this.pathPrefab);
        }
        this.node.addChild(path);
        if(color === 0) path.color = cc.Color.BLACK;
        else path.color = cc.Color.WHITE;
        path.setContentSize(160, sizeY);
        path.y = posY || this.halfScreenHeight;
        path.x = posX;
        path.colorId = color;
        path.index = index;
    }, 
    start: function () {
        this.data = cc.find('DataManager').getComponent('DataManager');
        this.pathX_1 = this.data.elementPathLineX_1;
        this.pathX_2 = this.data.elementPathLineX_2;
        this.pathX_3 = this.data.elementPathLineX_3;
        this.pathX_4 = this.data.elementPathLineX_4;
        this.baselineY = this.data.elementBaseLineY;
        //this.currentColor = [, 1, 0, 1, 0];
        var screenSize = cc.winSize;
        this.screenWidth = screenSize.width;
        this.screenHeight = screenSize.height;
        this.halfScreenHeight = screenSize.height / 2;
        this.initSpeed = 5;
        this.lengthRecorder = 0;
        this.totalLength = this.pathLength + this.grayLength;
        this.createPath(1, this.screenHeight, 1, this.pathX_1, -this.halfScreenHeight);
        this.createPath(0, this.screenHeight, 2, this.pathX_2, -this.halfScreenHeight);
        this.createPath(1, this.screenHeight, 3, this.pathX_3, -this.halfScreenHeight);
        this.createPath(0, this.screenHeight, 4, this.pathX_4, -this.halfScreenHeight);
        this.createPath(1, this.totalLength, 1, this.pathX_1);
        this.createPath(0, this.totalLength, 2, this.pathX_2);
        this.createPath(1, this.totalLength, 3, this.pathX_3);
        this.createPath(0, this.totalLength, 4, this.pathX_4);
        //this.createPath(1, this.screenHeight);
        
    },

    onDestroy: function() {

    },

    update: function (dt) {
        this.lengthRecorder += this.initSpeed;
        var refresh = false;
        if(this.lengthRecorder >= this.totalLength) {
            this.lengthRecorder -= this.totalLength;
            refresh = true;
        }
        /*for(let i = 0; i < 4; i++) {
            this.currentColor[i] = -1;
        }*/
        var childCount = this.node.childrenCount;
        //cc.log(childCount);
        // 从后向前遍历！
        for(let i = childCount - 1; i >= 0; --i) {
            let childNode = this.node.children[i];
            childNode.y -= this.initSpeed;
            if(childNode.y + childNode.height <= -this.halfScreenHeight) {
                this.pathPool.put(childNode);
            }
            /*if(childNode.y <= this.baselineY && childNode.y + childNode.height > this.baselineY) {
                this.currentColor[childNode.index] = childNode.colorId;
            }*/                   
        }
        //cc.log(this.currentColor[1]); 
        if(refresh) {
            var posY = this.halfScreenHeight - this.lengthRecorder + this.grayLength;
            this.createPath(this.randomizer(), this.pathLength, 1, this.pathX_1, posY);
            this.createPath(this.randomizer(), this.pathLength, 2, this.pathX_2, posY);
            this.createPath(this.randomizer(), this.pathLength, 3, this.pathX_3, posY);
            this.createPath(this.randomizer(), this.pathLength, 4, this.pathX_4, posY);
        }
    },
    
    randomizer: function() {
        return Math.round(Math.random());
    }
})