// *************************
// 子域脚本
// *************************

const Width = 600 // 排行榜宽度
const Height = 1000 // 排行榜高度
const RankShowNumber = 4 // 排行榜记录数

// ***** 排行榜类 *****
class RankList {
  constructor () {
    // *** 构造函数 ***
    this.sharedCanvas = wx.getSharedCanvas() // 获取共享画布
    this.context = this.sharedCanvas.getContext('2d') // 获取绘图上下文
  }

  listenMainMsg () {
    // *** 监听主域消息 ***
    wx.onMessage(msg => {
      switch (msg.action) {
        case 'UpdateRankingData':
          console.log(`Sub: call this.updateRankData()`)
          this.updateRankData() // 开始更新排行数据
          break
        case 'UpdateRankingList':
          console.log(`Sub: call this.updateRankList()`)
          this.updateRankList() // 开始更新绘制排行榜
          break
        case 'ClearRankingData':
          console.log(`Sub: call this.clearRankList()`)
          this.clearRankList()  // 开始清除排行数据
          break
        default:
          console.log(`Sub: unknown msg.action = ${msg.action}`)
          break
      }
    })
  }

  updateRankData () {
    // *** 更新分数 ***
    wx.getUserCloudStorage({
      keyList: ['score', 'tempScore'],
      success: res => {
        let score = '-1'
        let tempScore = '-1'
        if (res.KVDataList[0]) {
          if (res.KVDataList[0].key === 'score') { score = res.KVDataList[0].value } else if (res.KVDataList[0].key === 'tempScore') { tempScore = res.KVDataList[0].value }
        }
        if (res.KVDataList[1]) {
          if (res.KVDataList[1].key === 'score') { score = res.KVDataList[1].value } else if (res.KVDataList[1].key === 'tempScore') { tempScore = res.KVDataList[1].value }
        }
        if (parseInt(tempScore) > parseInt(score)) {
          wx.setUserCloudStorage({
            KVDataList: [{ key: 'score', value: tempScore }],
            success: function (res) { console.log(`Sub: updateRankData success`) },
            fail: function (res) { console.log(`Main: updateRankData fail`) }
          })
        }
      },
      fail: res => {
        console.log(`Sub: getUserCloudStorage fail: ${res}`)
      }
    })
  }

  updateRankList () {
    // *** 更新排行榜 ***
    // * 背景重绘 *
    const context = this.context
    context.clearRect(0, 0, Width, Height)
    const img = wx.createImage()
    img.src = 'sub/res/background.png'
    img.onload = function (res) {
      context.drawImage(img, 0, 0)
    }
    // * 玩家数据绘制*
    wx.getUserCloudStorage({
      keyList: ['score'],
      success: res => {
        if (res.KVDataList[0]) {
          console.log(`Sub: getUserCloudStorage success`)
          const myScore = res.KVDataList[0].value + ' 分'
          this.context.font = 'bold 48px KaiTi'
          this.context.fillStyle = '#FFFFFF'
          this.context.textAlign = 'left'
          this.context.fillText(myScore, 330, 810)
        } else {
          const myScore = '0 分'
          this.context.font = 'bold 48px KaiTi'
          this.context.fillStyle = '#FFFFFF'
          this.context.textAlign = 'left'
          this.context.fillText(myScore, 330, 810)
        }
      },
      fail: res => {
        console.log(`Sub: getUserCloudStorage fail: ${res}`)
        const myScore = '0 分'
        this.context.font = 'bold 48px KaiTi'
        this.context.fillStyle = '#FFFFFF'
        this.context.textAlign = 'left'
        this.context.fillText(myScore, 330, 810)
      }
    })
    // * 朋友数据绘制 *
    wx.getFriendCloudStorage({
      keyList: ['username', 'score'],
      success: res => {
        console.log(`Sub: getFriendCloudStorage success`)
        console.log(res)
        if ((!res) || (!res.data) || (res.data.length <= 0)) { this.drawFail() } else { this.drawRankList(res) }
      },
      fail: res => {
        console.log(`Sub: getFriendCloudStorage fail: ${res}`)
        this.drawFail()
      }
    })
  }

  drawRankList (res) {
    // *** 绘制排行榜 ***
    // * 数据索引 *
    const rankInfo = []
    for (const i in res.data) {
      const data = res.data[i] // 当前数据
      let usernameIndex = -1 // 用户名索引
      let scoreIndex = -1 // 分数值索引
      for (let i = 0; i < data.KVDataList.length; i++) {
        if (data.KVDataList[i].key === 'username') {
          usernameIndex = i
        } else if (data.KVDataList[i].key === 'score') {
          scoreIndex = i
        }
      }
      const obj = { username: '???', score: '0' }
      if (data.nickname) { obj.nickname = data.nickname }
      if (data.avatarUrl) { obj.headimgurl = data.avatarUrl }
      if (data.KVDataList[usernameIndex]) { obj.username = data.KVDataList[usernameIndex].value }
      if (data.KVDataList[scoreIndex]) { obj.score = data.KVDataList[scoreIndex].value }
      rankInfo.push(obj)
    }
    console.log('Sub: rankInfo.length = ' + rankInfo.length)
    // * 数据排序 *
    rankInfo.sort(function (x, y) {
      const intX = parseInt(x.score)
      const intY = parseInt(y.score)
      if (intX > intY) { return -1 }
      if (intX < intY) { return 1 }
      if (x.nickname > y.nickname) { return 1 }
      if (x.nickname < y.nickname) { return -1 }
      return 0
    })
    // * 开始绘制 *
    // (只绘制前四名)
    for (let i = 0; i < RankShowNumber; i++) {
      if (rankInfo[i]) {
        // 绘制头像
        const context = this.context
        const img = wx.createImage()
        img.src = rankInfo[i].headimgurl
        img.onload = function (res) {
          const heightImg = res.target.height
          const widthImg = res.target.width
          context.drawImage(img, 0, 0, widthImg, heightImg, 210, 275 + 115 * i, 100, 100)
        }
        // 绘制用户名
        this.context.font = 'bold 32px KaiTi'
        this.context.fillStyle = '#FFFFFF'
        this.context.textAlign = 'left'
        this.context.fillText(this.trimString(rankInfo[i].nickname, 10), 350, 315 + 115 * i)
        // 绘制分数
        this.context.font = 'bold 40px KaiTi'
        this.context.fillStyle = '#FFFFFF'
        this.context.textAlign = 'left'
        if (parseInt(rankInfo[i].score) > 9999) { this.context.fillText('9999+ 分', 350, 365 + 115 * i) } else { this.context.fillText([rankInfo[i].score, ' 分'].join(''), 350, 365 + 115 * i) }
      } else {
        // 绘制空数据
        this.context.fillText('- 暂无数据 -', 230, 340 + 115 * i)
      }
    }
  }

  isChinese (char) {
    // *** 判断是否为中文 ***
    var reCh = /[u00-uff]/
    return !reCh.test(char)
  }

  trimString (string, renderLenMax) {
    // *** 截断过长的文字***
    // （基于文字渲染长度）
    // 参考: https://www.jianshu.com/p/c35e10499c2e
    // * 获取渲染长度 *
    let renderLen = 0
    for (let i = 0; i < string.length; i++) {
      if (this.isChinese(string.charAt(i))) { renderLen += 2 } else { renderLen += 1 }
    }
    // * 判断是否截取 *
    if (renderLen > renderLenMax) {
      let len = 0
      let lenToSubstr = 0
      for (let i = 0; i < string.length; i++) {
        if (this.isChinese(string[i])) { len += 2 } else { len += 1 }
        lenToSubstr += 1
        if (len >= renderLenMax) {
          string = string.substr(0, lenToSubstr)
          string = string + '...'
          break
        }
      }
    }
    return string
  }

  drawFail () {
    // * 绘制空数据 *
    console.log(`Sub: drawFail()`)
    this.context.font = 'bold 40px KaiTi'
    this.context.fillStyle = '#FFFFFF'
    this.context.textAlign = 'left'
    this.context.fillText('- 暂无数据 -', 230, 340)
    this.context.fillText('- 暂无数据 -', 230, 455)
    this.context.fillText('- 暂无数据 -', 230, 570)
    this.context.fillText('- 暂无数据 -', 230, 685)
  }

  clearRankList() {
    wx.removeUserCloudStorage({
      keyList: ['score', 'tempScore'],
      success: (res) => {
      console.log(`Sub: clearRankList success`, res);
      },
      fail: (res) => {
      console.log(`Sub: clearRankList fail`, res);
      }
  })
  }
}

// 排行榜实例化
const rankList = new RankList()
rankList.listenMainMsg()
