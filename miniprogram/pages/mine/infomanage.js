// miniprogram/pages/mine/infomanage.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    stores: [],
    addnamestore: "",
    _idstore: "",

    categories: [],
    addnamecategory: "",
    _idcategory: "",
    
    goods: [],
  },

  getDataStore(){
    let that = this
    const db = wx.cloud.database()
    db.collection("store").where({
      // openid
    }).get().then(res =>{
      if (res.errMsg == "collection.get:ok"){
        if (res.data.length){
          that.setData({
            _idstore: res.data[0]._id,
            stores: res.data[0].items,
          })
        }
      }
      else{
        wx.showToast({
          title: '数据获取失败！',
          duration: 1500,
        })
        this.getDataStore()
      }
    })
  },

  bindblurAddStore(e){
    this.setData({
      addnamestore: e.detail.value,
    })
  },

  bindtapAddStore(){
    let that = this
    const db = wx.cloud.database()
    let stores = this.data.stores
    stores.push(this.data.addnamestore)
    this.setData({
      stores,
    })
    if (this.data._idstore.length){
      db.collection("store").doc(this.data._idstore).update({
        data:{
          items: db.command.push([this.data.addnamestore]),
        }
      })
    }
    else{
      db.collection("store").add({
        data:{
          items: [this.data.addnamestore],
        }
      }).then(res =>{
        that.data._idstore = res._id
      })
    }
  },

  bindtapDelStore(e){
    const index = e.currentTarget.dataset.index
    let stores = this.data.stores
    let that = this
    wx.showModal({
      cancelText: '取消',
      confirmText: '确认',
      content: '删除该信息',
      showCancel: true,
      success: (result) => {
        if (result.confirm){
          stores.splice(index, 1)
          that.setData({
            stores,
          })
          const db = wx.cloud.database()
          db.collection("store").doc(that.data._idstore).update({
            data:{
              items: stores,
            }
          })
        }
      },
      title: '删除确认？',
    })
  },

  getDataCategory(){
    let that = this
    const db = wx.cloud.database()
    db.collection("category").where({
      // openid
    }).get().then(res =>{
      if (res.errMsg == "collection.get:ok"){
        if (res.data.length){
          that.setData({
            _idcategory: res.data[0]._id,
            categories: res.data[0].items,
          })
        }
      }
      else{
        wx.showToast({
          title: '数据获取失败！',
          duration: 1500,
        })
        this.getDataCategory()
      }
    })
  },

  getDataGoodsByCategory(category){
    let that = this
    const db = wx.cloud.database()
    db.collection("goods").where({
      // openid
      category: category
    }).get().then(res =>{
      if (res.errMsg == "collection.get:ok"){
        if (res.data.length){
          that.setData({
            goods: res.data,
          })
        }
        else{
          wx.showToast({
            title: '没有相关数据！',
            duration: 1500,
          })
        }
      }
      else{
        wx.showToast({
          title: '数据获取失败！',
          duration: 1500,
        })
      }
    })
  },

  bindtapCategory(e){
    const index = e.currentTarget.dataset.index
    this.getDataGoodsByCategory(this.data.categories[index])
  },

  bindblurAddCategory(e){
    this.setData({
      addnamecategory: e.detail.value,
    })
  },

  bindtapAddCategory(){
    let that = this
    const db = wx.cloud.database()
    let categories = this.data.categories
    categories.push(this.data.addnamecategory)
    this.setData({
      categories,
    })
    if (this.data._idcategory.length){
      db.collection("category").doc(this.data._idcategory).update({
        data:{
          items: db.command.push([this.data.addnamecategory]),
        }
      })
    }
    else{
      db.collection("category").add({
        data:{
          items: [this.data.addnamecategory],
        }
      }).then(res =>{
        that.data._idcategory = res._id
      })
    }
  },

  bindtapDelCategory(e){
    const index = e.currentTarget.dataset.index
    let categories = this.data.categories
    let that = this
    wx.showModal({
      cancelText: '取消',
      confirmText: '确认',
      content: '删除该信息',
      showCancel: true,
      success: (result) => {
        if (result.confirm){
          categories.splice(index, 1)
          that.setData({
            categories,
          })
          const db = wx.cloud.database()
          db.collection("category").doc(that.data._idcategory).update({
            data:{
              items: categories,
            }
          })
        }
      },
      title: '删除确认？',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getDataStore()
    this.getDataCategory()
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