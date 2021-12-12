//index.js

Page({
  data: {
    user: {},

    stores: [],
    indexstore: -1,

    categories: [],
    indexcategory: -1,

    goods: [],
    goods_id: "", 
    indexgoods:-1,

    name: "",
    price: -1,

    priceinfo: [],
    priceinfo_id: "",
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
          icon: "none",
        })
      }
    })
  },

  getGoodsByCategory(){
    let that = this
    const db = wx.cloud.database()
    db.collection("goods2category").where({
      category: this.data.categories[this.data.indexcategory].showText,
    }).get().then(res => {
      if(res.errMsg == "collection.get:ok"){
        if(res.data.length){
          console.log(res.data[0])
          that.setData({
            goods: res.data[0].goods,
            goods_id: res.data[0]._id,
            indexgoods: 0,
          })
        }
        else{
          that.setData({
            goods: [],
            goods_id: "",
            indexgoods: -1,
          })
        }
      }else{
        wx.showToast({
          title: '查询商品失败',
          icon: 'none',
        })
      }
    })
  },

  bindchangeCategory(e){
    this.setData({
      indexcategory: e.detail.value,
    })
    this.getGoodsByCategory()
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
            categories: res.data,
            indexcategory: 0,
          })
        }
        else {
          wx.showToast({
            title: '分类数据获取失败，请刷新！',
            icon: "none",
          })
        }
      } else {
        wx.showToast({
          title: '分类数据获取失败，请刷新！',
          icon: "none",
        })
      }
    })
  },

  bindchangeGoods(e){
    this.setData({
      indexgoods:e.detail.value,
    })
    const db = wx.cloud.database()
    let that = this
    db.collection("goodsinfo").where({
      category: this.data.categories[this.data.indexcategory],
      goods: this.data.goods[this.data.indexgoods],
    }).get().then(res =>{
      if(res.errMsg == "collection.get:ok"){
        if(res.data.length){
          that.setData({
            priceinfo: res.data[0].info,
            priceinfo_id: res.data[0]._id,
          })
        }
        else{
          that.setData({
            priceinfo: [],
            priceinfo_id: "",
          })
        }
      }
      else{
        wx.showToast({
          title: '该商品价格信息获取失败！',
          icon: 'none',
        })
      }
    })

  },

  bindbluraddGoods(e){
    this.data.name = e.detail.value
  },

  bindtapaddName(){
    if (this.data.name.length){
      if(this.data.goods.includes(this.data.name)){
        wx.showToast({
          title: '已有该商品！',
          icon: "none",
        })
      }
      else{
        if(this.data.goods.length){
          const db = wx.cloud.database()
          let that = this
          db.collection("goods2category").doc(this.data.goods_id).update({
            data: {
              goods: db.command.addToSet(this.data.name),
            }
          }).then(res =>{
            if(res.errMsg == "document.update:ok"){
              let goods = that.data.goods
              goods.push(that.data.name)
              that.setData({
                goods: goods,
                indexgoods: goods.length-1,
              })
              wx.showToast({title: '商品添加成功！',})
            }
            else{
              console.log(res.errMsg)
              wx.showToast({
                title: '商品添加失败，请重试！',
                icon: 'none',
              })
            }
          })
        }
        else{
          const db = wx.cloud.database()
          let that = this
          db.collection("goods2category").add({
            data: {
              category: this.data.categories[this.data.indexcategory].showText,
              goods: [this.data.name],
            }
          }).then(res =>{
            if(res.errMsg == "collection.add:ok"){
              that.setData({
                goods: [that.data.name],
                goods_id: res._id,
                indexgoods: 0,
              })
              wx.showToast({ title: '商品添加成功！', })
            }
            else{
              console.log(res.errMsg)
              wx.showToast({
                title: '商品添加失败，请重试！',
                icon: 'none',
              })
            }
          })
        }
      }
    }
    else{
      wx.showToast({
        title: '请填写商品名！',
        icon: 'none',
      })
    }
  },

  bindblurprice(e){
    if (e.detail.value){
      this.data.price = parseFloat(e.detail.value)
    }
  },

  bindsubmitaddgoods(){
    if (this.data.indexstore < 0){
      wx.showToast({
        title: '请选择商户！',
        icon: "none",
      })
      return
    }
    if (this.data.indexcategory < 0){
      wx.showToast({
        title: '请选择分类！',
        icon: "none",
      })
      return
    }
    if (this.data.indexgoods < 0){
      wx.showToast({
        title: '请填写商品名！',
        icon: "none",
      })
      return
    }
    if (this.data.price < 0){
      wx.showToast({
        title: '请填写价格！',
        icon: "none",
      })
      return
    }
    const db = wx.cloud.database()
    db.collection("goods").add({
      data:{
        category: this.data.categories[this.data.indexcategory].showText,
        goodsname: this.data.goods[this.data.indexgoods],

        store: this.data.stores[this.data.indexstore],
        price: this.data.price,
      }
    }).then(res =>{
      if (res.errMsg == "collection.add:ok"){
        wx.showToast({ title: '添加成功！', })
      }
    })
  },

  onLoad: function () {
    this.setUserLoginCount()
    this.getDataCategory()
  },

})