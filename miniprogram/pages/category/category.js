// miniprogram/pages/category/category.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    categories: [],
    curIndex: 0,
    curClassGoods: [],
  },

  getGoodsInfo(){
    let that = this
    const db = wx.cloud.database()
    db.collection("goods").where({
      category: this.data.categories[this.data.curIndex],
    }).limit(20).get().then(res => {
      if (res.errMsg == "collection.get:ok") {
        if (res.data.length){
          that.setData({
            curClassGoods: res.data,
          })
        }
        else{
          wx.showToast({
            title: '没有该分类商品信息,请添加！',
            duration: 1500,
          })
        }
      }
    })
  },

  switchTab(e) {
    let curIndex = e.target.dataset.index
    this.setData({
      curIndex: curIndex,
    })
    this.getGoodsInfo()
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
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
    let that = this
    const db = wx.cloud.database()
    db.collection("category").where({
      // openid
    }).get().then(res =>{
      if (res.errMsg == "collection.get:ok"){
        if (res.data.length){
          that.setData({
            categories: res.data[0].items,
          })
          this.getGoodsInfo()
        }
        else{
          wx.showToast({
            title: '没有分类信息,请添加！',
            duration: 1500,
          })
        }
      }
      else{
        wx.showToast({
          title: '数据获取失败！',
          duration: 1500,
        })
        this.getData()
      }
    })
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