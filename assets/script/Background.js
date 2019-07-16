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
        blackPathPrefab: {
            default: null,
            type: cc.Prefab
        },
        whitePathPrefab: {
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
        let poolCapacity = 8;
        this.blackPathPool = new cc.NodePool;
        for (let i = 0; i < poolCapacity; ++i) {
            let path = cc.instantiate(this.blackPathPrefab); // 创建节点
            this.blackPathPool.put(path); // 通过 put 接口放入对象池
        }
        this.whitePathPool = new cc.NodePool;
        for (let i = 0; i < poolCapacity; ++i) {
            let path = cc.instantiate(this.whitePathPrefab); // 创建节点
            this.whitePathPool.put(path); // 通过 put 接口放入对象池
        }
    },
    createPath: function (color, sizeY, index, posX, posY) {
        let path = null;
        if(color === 0) {
            if (this.blackPathPool.size() > 0) { // 通过 size 接口判断对象池中是否有空闲的对象
                path = this.blackPathPool.get();
            } else { // 如果没有空闲对象，也就是对象池中备用对象不够时，我们就用 cc.instantiate 重新创建
                path = cc.instantiate(this.blackPathPrefab);
            }
        } else {
            if (this.whitePathPool.size() > 0) { // 通过 size 接口判断对象池中是否有空闲的对象
                path = this.whitePathPool.get();
            } else { // 如果没有空闲对象，也就是对象池中备用对象不够时，我们就用 cc.instantiate 重新创建
                path = cc.instantiate(this.whitePathPrefab);
            }
        }
        this.node.addChild(path);
        //if(color === 0) path.color = cc.Color.BLACK;
        //else path.color = cc.Color.WHITE;
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

        this.colorSequence = [1, 0, 1, 0];
        this.screenWidth = this.data.screenWidth;
        this.screenHeight = this.data.screenHeight;

        this.halfScreenHeight = this.screenHeight / 2;
        this.initSpeed = 5;
        this.lengthRecorder = -this.grayLength;
        this.totalLength = this.pathLength + this.grayLength;
        this.createPath(1, this.screenHeight, 1, this.pathX_1, -this.halfScreenHeight);
        this.createPath(0, this.screenHeight, 2, this.pathX_2, -this.halfScreenHeight);
        this.createPath(1, this.screenHeight, 3, this.pathX_3, -this.halfScreenHeight);
        this.createPath(0, this.screenHeight, 4, this.pathX_4, -this.halfScreenHeight);
        this.createPath(1, this.totalLength, 1, this.pathX_1, this.halfScreenHeight + this.grayLength);
        this.createPath(0, this.totalLength, 2, this.pathX_2, this.halfScreenHeight + this.grayLength);
        this.createPath(1, this.totalLength, 3, this.pathX_3, this.halfScreenHeight + this.grayLength);
        this.createPath(0, this.totalLength, 4, this.pathX_4, this.halfScreenHeight + this.grayLength);
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
                if(childNode.colorId === 0) {
                    this.blackPathPool.put(childNode);
                } else {
                    this.whitePathPool.put(childNode);
                }
                
            }
            /*if(childNode.y <= this.baselineY && childNode.y + childNode.height > this.baselineY) {
                this.currentColor[childNode.index] = childNode.colorId;
            }*/                   
        }
        //cc.log(this.currentColor[1]); 
        if(refresh) {
            this.pathGenerator();
            var posY = this.halfScreenHeight - this.lengthRecorder + this.grayLength;
            this.createPath(this.colorSequence[0], this.pathLength, 1, this.pathX_1, posY);
            this.createPath(this.colorSequence[1], this.pathLength, 2, this.pathX_2, posY);
            this.createPath(this.colorSequence[2], this.pathLength, 3, this.pathX_3, posY);
            this.createPath(this.colorSequence[3], this.pathLength, 4, this.pathX_4, posY);
        }
    },
    
    pathGenerator: function() {
        
        var temp = this.colorSequence;
        do {
            let flip = [];
            for(let i = 0; i < 4; i++) {
                if(this.randomizer()) {
                    flip.push(1);
                } else {
                    flip.push(0);
                }
            }
            if(flip.join('') === '0000') {
                flip = [1, 1, 1, 1];
            }
            this.colorSequence = temp;
            for(let i = 0; i < 4; i++) {
                if(flip[i]) {
                    this.colorSequence[i] ^= 1;
                }
            }
        } while(this.colorSequence.join('') === '0000' || this.colorSequence.join('') === '1111')
        cc.log(this.colorSequence.join(''));
        //return this.colorSequence;
        
    },

    randomizer: function() {
        return Math.round(Math.random());
    }
})