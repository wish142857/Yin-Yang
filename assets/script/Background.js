// *************************
// 背景脚本
// *************************
var DataManager = require('DataManager')
var AnimationManager = require('AnimationManager')

cc.Class({
  extends: cc.Component,

  properties: {
    blackPathPrefab: {
      default: null,
      type: cc.Prefab,
      tooltip: '黑色轨道prefab'
    },
    whitePathPrefab: {
      default: null,
      type: cc.Prefab,
      tooltip: '白色轨道prefab'
    },
    pathLength: {
      default: 0,
      type: cc.Integer,
      tooltip: '轨道有效长度'
    },
    grayLength: {
      default: 0,
      type: cc.Integer,
      tooltip: '轨道坍塌状态长度'
    },
    data: { // 全局数据引用
      default: null,
      type: DataManager
    },
    animation: { // 全局动画引用
      default: null,
      type: AnimationManager
    }
  },

  onLoad: function () {
    // *** 组件引用 ***
    this.data = cc.find('DataManager').getComponent('DataManager')
    this.animation = cc.find('AnimationManager').getComponent('AnimationManager')
    // 获取轨道基线、屏幕宽高等数据
    this.pathX_1 = this.data.elementPathLineX_1
    this.pathX_2 = this.data.elementPathLineX_2
    this.pathX_3 = this.data.elementPathLineX_3
    this.pathX_4 = this.data.elementPathLineX_4
    this.baselineY = this.data.elementBaseLineY

    this.screenWidth = this.data.screenWidth
    this.screenHeight = this.data.screenHeight
    this.halfScreenHeight = this.screenHeight / 2

    // *** 初始化对象池 ***
    const poolCapacity = 8
    this.blackPathPool = new cc.NodePool()
    for (let i = 0; i < poolCapacity; ++i) {
      const path = cc.instantiate(this.blackPathPrefab) // 创建节点
      this.blackPathPool.put(path) // 通过 put 接口放入对象池
    }
    this.whitePathPool = new cc.NodePool()
    for (let i = 0; i < poolCapacity; ++i) {
      const path = cc.instantiate(this.whitePathPrefab) // 创建节点
      this.whitePathPool.put(path) // 通过 put 接口放入对象池
    }
  },

  start: function () {
    // *** 轨道颜色序列 ***
    this.colorSequence = [1, 0, 1, 0]

    this.lengthRecorder = 0
    this.totalLength = this.pathLength + this.grayLength
    this.createPath(1, this.screenHeight, 1, this.pathX_1, 0)
    this.createPath(0, this.screenHeight, 2, this.pathX_2, 0)
    this.createPath(1, this.screenHeight, 3, this.pathX_3, 0)
    this.createPath(0, this.screenHeight, 4, this.pathX_4, 0)
    var posY = this.halfScreenHeight + (this.totalLength >> 1)
    this.createPath(1, this.totalLength, 1, this.pathX_1, posY)
    this.createPath(0, this.totalLength, 2, this.pathX_2, posY)
    this.createPath(1, this.totalLength, 3, this.pathX_3, posY)
    this.createPath(0, this.totalLength, 4, this.pathX_4, posY)
    this.node.noPath = false
  },

  createPath: function (color, sizeY, index, posX, posY) {
    // *** 轨道创建 ***
    let path = null
    // 从对象池中获取
    if (color === 0) {
      if (this.blackPathPool.size() > 0) { // 判断对象池中是否有空闲的对象
        path = this.blackPathPool.get()
      } else {
        path = cc.instantiate(this.blackPathPrefab)
      }
    } else {
      if (this.whitePathPool.size() > 0) { // 判断对象池中是否有空闲的对象
        path = this.whitePathPool.get()
      } else {
        path = cc.instantiate(this.whitePathPrefab)
      }
    }
    // 属性设置
    path.setContentSize(160, sizeY)
    path.x = posX
    path.y = posY
    path.colorId = color
    path.index = index
    path.falling = false
    path.opacity = 255
    path.scale = 1
    // 作为background子节点
    this.node.addChild(path)
  },

  recyclePath: function (path) {
    // *** 回收轨道到对象池 ***
    if (path.colorId === 0) {
      this.blackPathPool.put(path)
    } else {
      this.whitePathPool.put(path)
    }
  },

  update: function (dt) {
    // *** 控制轨道的回收、创建等 ***

    // 记录经过距离，以判断是否要新建轨道
    this.lengthRecorder += this.data.gameSpeed
    var refresh = false
    if (this.lengthRecorder >= this.totalLength) {
      this.lengthRecorder -= this.totalLength
      refresh = true
    }

    // 遍历轨道，位置下移，并判断是否要回收
    var count = this.node.childrenCount
    for (let i = count - 1; i >= 0; --i) {
      const childNode = this.node.children[i]
      childNode.y -= this.data.gameSpeed
      if (!childNode.falling) {
        if (childNode.y + childNode.height / 2 <= this.baselineY + this.grayLength) {
          this.animation.playFalling(childNode, this.recyclePath.bind(this))
          childNode.falling = true
          if (childNode.index === 1) this.data.score++
        }
      }
    }

    // 创建新轨道
    if (refresh) {
      // 随机生成新轨道，确保不会无解
      this.pathGenerator()
      var posY = this.halfScreenHeight - this.lengthRecorder + this.totalLength / 2
      this.createPath(this.colorSequence[0], this.totalLength, 1, this.pathX_1, posY)
      this.createPath(this.colorSequence[1], this.totalLength, 2, this.pathX_2, posY)
      this.createPath(this.colorSequence[2], this.totalLength, 3, this.pathX_3, posY)
      this.createPath(this.colorSequence[3], this.totalLength, 4, this.pathX_4, posY)
      if (this.data.hellMode) {
        this.scheduleOnce(this.pathSwap, 0.5)
      }
    }

    // 无敌状态的特殊逻辑：轨道创建时就坍塌
    if (this.node.noPath === true) {
      const count = this.node.childrenCount
      for (let i = 0; i < count; i++) {
        const childNode = this.node.children[i]
        if (!childNode.falling) {
          this.animation.playFalling(childNode, this.recyclePath.bind(this))
          childNode.falling = true
          if (childNode.index === 1) this.data.score++
        }
      }
    }
  },

  pathGenerator: function () {
    // *** 随机生成下一组轨道序列，不与上一组重复，也不会四黑四白 ***
    var temp = []
    for (let i = 0; i < 4; i++) {
      temp[i] = this.colorSequence[i]
    }
    do {
      let flip = []
      for (let i = 0; i < 4; i++) {
        if (this.randomizer()) {
          flip.push(1)
        } else {
          flip.push(0)
        }
      }
      if (flip.join('') === '0000') {
        flip = [1, 1, 1, 1]
      }
      for (let i = 0; i < 4; i++) {
        this.colorSequence[i] = temp[i]
        if (flip[i]) {
          this.colorSequence[i] ^= 1
        }
      }
    } while (this.colorSequence.join('') === '0000' || this.colorSequence.join('') === '1111')
  },

  randomizer: function () {
    // *** 0 / 1随机数生成器 ***
    return Math.round(Math.random())
  },

  pathSwap: function () {
    // *** 随机交换两条轨道 ***
    if (this.randomizer()) {
      // 50%概率交换
      var childrenCount = this.node.childrenCount
      var children = this.node.children
      // 左右两组轨道概率五五开
      var colorSub, childSub
      if (this.randomizer()) {
        colorSub = 1
        childSub = childrenCount - 3
      } else {
        colorSub = 3
        childSub = childrenCount - 1
      }
      var temp = children[childSub].x
      children[childSub].x = children[childSub - 1].x
      children[childSub - 1].x = temp
      var tempIndex = children[childSub].index
      children[childSub].index = children[childSub - 1].index
      children[childSub - 1].index = tempIndex
      var tempColor = this.colorSequence[colorSub]
      this.colorSequence[colorSub] = this.colorSequence[colorSub - 1]
      this.colorSequence[colorSub - 1] = tempColor
    }
  }
})
