// *************************
// 数据管理器脚本
// *************************

cc.Class({
  extends: cc.Component,

  properties: {
    // 参考分辨率  W: 640 H: 1280
    screenWidth: {
      default: 640,
      type: cc.Integer,
      tooltip: '设备屏幕宽度'
    },
    screenHeight: {
      default: 1280,
      type: cc.Integer,
      tooltip: '设备屏幕高度'
    },
    elementPathLineX_1: {
      default: -240,
      type: cc.Integer,
      tooltip: '元素第一条路径线相对于背景中心锚点的X坐标'
    },
    elementPathLineX_2: {
      default: -80,
      type: cc.Integer,
      tooltip: '元素第二条路径线相对于背景中心锚点的X坐标'
    },
    elementPathLineX_3: {
      default: 80,
      type: cc.Integer,
      tooltip: '元素第三条路径线相对于背景中心锚点的X坐标'
    },
    elementPathLineX_4: {
      default: 240,
      type: cc.Integer,
      tooltip: '元素第四条路径线相对于背景中心锚点的X坐标'
    },
    elementBaseLineY: {
      default: 0,
      type: cc.Integer,
      tooltip: '元素基准线相对于背景中心锚点的Y坐标'
    },
    gameSpeed: {
      default: 0,
      type: cc.Integer,
      tooltip: '游戏速度'
    },
    scoreD: {
      default: 0,
      type: cc.Integer,
      tooltip: ' 丁 评价最低分'
    },
    scoreC: {
      default: 0,
      type: cc.Integer,
      tooltip: ' 丙 评价最低分'
    },
    scoreB: {
      default: 0,
      type: cc.Integer,
      tooltip: ' 乙 评价最低分'
    },
    scoreA: {
      default: 0,
      type: cc.Integer,
      tooltip: ' 甲 评价最低分'
    },
    fail: {
      default: false,
      tooltip: ' 是否失败（或者回到主菜单）'
    },
    score: {
      default: 0,
      type: cc.Integer,
      tooltip: '游戏得分'
    },
    hellMode: {
      default: false,
      tooltip: '地狱模式是否开启'
    }
  },

  onLoad: function () {
    // *** 设置常驻节点属性 ***
    cc.game.addPersistRootNode(this.node)
    var screenSize = cc.winSize
    this.screenWidth = screenSize.width
    this.screenHeight = screenSize.height
  },

  onDestroy: function () {
    // *** 解除常驻节点属性 ***
    cc.game.removePersistRootNode(this.node)
  },

  start: function () {
    // *** 数据初始化 ***
    this.paths = [0, this.elementPathLineX_1, this.elementPathLineX_2, this.elementPathLineX_3, this.elementPathLineX_4]
  }

})
