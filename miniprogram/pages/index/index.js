//index.js

Page({
  data: {
    user: {},
  },

  

  onLoad: function() {
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
            data:{
              opencount:db.command.inc(1)
            }
          })
        }
        else {
          db.collection("user").add({
            data: {
              opencount: 1,
              family_id: "",
            }
          })
        }
      }
      else{
        console.log("user get fail!")
      }
    })

  },


})
