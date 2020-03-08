export default {
  functional:true,
  render(h,{parent,data}){
      let route = parent.$route
      
      let depth = 0;
      console.log('parent', parent)
      while(parent){
          if(parent.$vnode && parent.$vnode.data.routerView =='abc'){
            console.log(1)
              depth++;
          }
          parent = parent.$parent;
      }
      data.routerView = 'abc';
      let record = route.matched[depth];   // [0,1]
      console.log(depth, record)
      if(!record){
          return h();
      }
      return h(record.component,data)
  }
}