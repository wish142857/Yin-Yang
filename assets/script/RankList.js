// *************************
// 排行榜脚本
// *************************

cc.Class({
    extends: cc.Component,

    properties: {
        rankSprite:{            // 精灵组件引用
            default: null,
            type: cc.Sprite
        }
    },

    onLoad: function () {
        // 设置常驻节点属性
        cc.game.addPersistRootNode(this.node);
        // 精灵组件引用
        this.rankSprite = this.node.getComponent(cc.Sprite);
    },

    onDestroy: function() {
        // 解除常驻节点属性
        cc.game.removePersistRootNode(this.node);
    },
    
    init: function () {
        // *** 初始化 ***
        // * 画布初始化 *
        if(!this.sharedCanvas) {
            let openDataContext = wx.getOpenDataContext();
            this.sharedCanvas = openDataContext.canvas;
            this.sharedCanvas.width = 600;
            this.sharedCanvas.height = 1000;
        }
        // * 纹理初始化 *
        if (!this.texture) {
            this.texture = new cc.Texture2D();
        }
    },

    openRankingList: function () {
        // *** 打开排行榜 ***
        // *** （对外接口） ***
        console.log('Main: openRankingList');
        // * 初始化 *
        this.init();
        // * 向子域发送更新信息 *
        wx.getOpenDataContext().postMessage({ action: 'UpdateRankList' });
        // * 开始刷新排行榜 *
        // 防止子域响应慢，或者头像加载慢，每隔0.7s 绘制1次 总共绘制6次
        this.refreshStart = true;
        this.refreshTimeRest = 6;
        this.refreshTimer = 0.4
        this.refreshInterval = 0.7;
    },

    closeRankingList: function() {
        // *** 关闭排行榜 ***
        // *** （对外接口） ***
        console.log('Main: closeRankingList');
        // * 开始隐藏排行榜 *
        this.hide();
    },

    uploadRankingData: function (username, score) {
        // *** 上传玩家数据 ***
        // *** （对外接口） ***
        console.log('Main: uploadRankingData');
        wx.setUserCloudStorage({
            KVDataList: [{
                key: 'username',
                value: username
            }, {
                'key': 'score',
                value: score
            }],
            success: function (res) {
                console.log(`Main: Upload Success`);
            },
            fail: function (res) {
                console.log(`Main: Upload Fail`);
            },
        });
    },

    update: function (dt) {
        if (this.refreshStart && this.refreshTimeRest > 0) {
        // 每隔0.7s 绘制1次 总共绘制6次
            this.refreshTimer += dt;
            if (this.refreshTimer > this.refreshInterval) {
                this.refreshTimer -= this.refreshInterval;
                this.refreshTimeRest--;
                this.show();
            }
        }
    },

    show: function () {
        // * 展示画布 *
        if (this.spriteFrame) {
            this.spriteFrame.clearTexture();
        }
        if (this.texture) {
            this.texture.initWithElement(this.sharedCanvas);
            this.texture.handleLoadedTexture();
            this.spriteFrame = new cc.SpriteFrame(this.texture);
            this.rankSprite.spriteFrame = this.spriteFrame;
        }
        // * 激活精灵节点 *
        this.node.getComponent(cc.Sprite).enabled = true;
    },

    hide: function () {
        // * 销毁画布 *
        if (this.spriteFrame) {
            this.spriteFrame.clearTexture();
            this.spriteFrame = null;
        }
        if (this.texture) {
            this.texture.destroy();
            this.texture = null;
        }
        // * 关闭精灵节点 *
        this.node.getComponent(cc.Sprite).enabled = false;
    },
});
