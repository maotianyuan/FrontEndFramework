import createApp from './main'

export default (context) => {
  return new Promise(( resolve, reject )=>{
    const { app, router, store } = createApp();
    router.push(context.url)
    router.onReady(()=>{
      let matchComponents = router.getMatchedComponents();
      if (!matchComponents.length) {
        return reject({code: 404});
      }
      Promise.all(matchComponents.map(comp=>{
        return comp.asyncData && comp.asyncData(store)
      })).then(()=>{
          context.state = store.state;
          resolve(app)
      },err=>{
          reject(err); // 如果请求失败了 会不挂
      })
    }, reject)
  })
}