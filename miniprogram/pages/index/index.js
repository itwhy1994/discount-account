//index.js

Page({
  data: {
    user: {},

    stores: [],
    indexstore: -1,

    categories: [],
    indexcategory: -1,

    name: "",
    price: -1,
  },

  setUserLoginCount(){
    let that = this
    const db = wx.cloud.database()
    db.collection("user").where({
      // _openid
    }).limit(1).get().then(res => {
      if (res.errMsg == "collection.get:ok") {
        if (res.data.length) {
          that.setData({
            user: res.data[0],
          })
          db.collection("user").doc(that.data.user._id).update({
            data: {
              opencount: db.command.inc(1)
            }
          })
        } else {
          db.collection("user").add({
            data: {
              opencount: 1,
              family_id: "",
            }
          })
        }
      } else {
        console.log("user get fail!")
      }
    })
  },

  bindchangeStore(e){
    this.setData({
      indexstore: e.detail.value,
    })
  },

  getDataStore() {
    let that = this
    const db = wx.cloud.database()
    db.collection("store").where({
      // openid
    }).get().then(res => {
      if (res.errMsg == "collection.get:ok") {
        if (res.data.length) {
          that.setData({
            stores: res.data[0].items,
            indexstore: 0,
          })
        }
      } else {
        wx.showToast({
          title: '商户数据获取失败！',
          duration: 1500,
          icon: "none",
        })
      }
    })
  },

  bindchangeCategory(e){
    this.setData({
      indexcategory: e.detail.value,
    })
  },

  getDataCategory() {
    let that = this
    const db = wx.cloud.database()
    db.collection("category").where({
      // openid
    }).get().then(res => {
      if (res.errMsg == "collection.get:ok") {
        if (res.data.length) {
          that.setData({
            categories: res.data[0].items,
            indexcategory: 0,
          })
        }
      } else {
        wx.showToast({
          title: '分类数据获取失败！',
          duration: 1500,
          icon: "none",
        })
      }
    })
  },

  bindblurname(e){
    this.setData({
      name: e.detail.value,
    })
  },

  bindblurprice(e){
    if (e.detail.value){
      this.setData({
        price: parseFloat(e.detail.value)
      })
    }
  },

  bindsubmitaddgoods(){
    if (this.data.indexstore < 0){
      wx.showToast({
        title: '请选择商户！',
        duration: 1500,
        icon: "none",
      })
      return
    }
    if (this.data.indexcategory < 0){
      wx.showToast({
        title: '请选择分类！',
        duration: 1500,
        icon: "none",
      })
      return
    }
    if (!this.data.name.length){
      wx.showToast({
        title: '请填写商品名！',
        duration: 1500,
        icon: "none",
      })
      return
    }
    if (!this.data.price < 0){
      wx.showToast({
        title: '请填写价格！',
        duration: 1500,
        icon: "none",
      })
      return
    }
    const db = wx.cloud.database()
    db.collection("goods").add({
      data:{
        store: this.data.stores[this.data.indexstore],
        category: this.data.categories[this.data.indexcategory],
        name: this.data.name,
        price: this.data.price,
      }
    }).then(res =>{
      if (res.errMsg == "collection.add:ok"){
        wx.showToast({
          title: '添加成功！',
          duration: 1500,
        })
      }
    })
  },

  onLoad: function () {
    this.setUserLoginCount()
    
  },


})