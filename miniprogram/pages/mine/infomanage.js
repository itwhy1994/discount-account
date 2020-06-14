// miniprogram/pages/mine/infomanage.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type: "none",
    dbname: "",
    items:[],
    _id: "",
    addname: "",
  },

  getData(){
    let that = this
    const db = wx.cloud.database()
    db.collection(this.data.dbname).where({
      // openid
    }).get().then(res =>{
      if (res.data.length){
        that.setData({
          _id: res.data[0]._id,
          items: res.data[0].items,
        })
      }
    })
  },

  bindblurAdd(e){
    this.setData({
      addname: e.detail.value,
    })
  },

  bindtapAdd(){
    let that = this
    const db = wx.cloud.database()
    if (this.data._id.length){
      db.collection(this.data.dbname).doc(this.data._id).update({
        data:{
          items: db.command.push([this.data.addname]),
        }
      })
    }
    else{
      db.collection(this.data.dbname).add({
        data:{
          items: [this.data.addname],
        }
      }).then(res =>{
        that.data._id = res._id
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.type == "商户管理"){
      this.setData({
        type: options.type,
        dbname: "store",
      })
    }
    else if (options.type == "分类管理"){
      this.setData({
        type: options.type,
        dbname: "category",
      })
    }
    else if (options.type == "商品管理"){
      this.setData({
        type: options.type,
        dbname: "goods",
      })
    }

    this.getData()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  }
})