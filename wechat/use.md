- wechat使用
```js
import { WECHAT_INFO } from 'store/mutation-types'
this.$store.dispatch(WECHAT_INFO).then(data => {
      let { appId, timestamp, nonceStr, signature, } = data
      let configParam = {
        debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        appId: appId, // 公众号的唯一标识
        timestamp: timestamp, // 生成签名的时间戳
        nonceStr: nonceStr, // 生成签名的随机串
        signature: signature, // 签名
        jsApiList: ['getLocation', 'onMenuShareAppMessage']
      };
      this.wx.config(configParam)
      this.wx.ready(() => {
        this.wx.getLocation({
          success: function (res) {
            alert(JSON.stringify(res));
          },
          cancel: function () {
            alert('用户拒绝授权获取地理位置');
          }
        });
      })
    })
```