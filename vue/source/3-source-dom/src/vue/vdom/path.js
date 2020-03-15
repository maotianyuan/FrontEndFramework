export function render(vnode,container){ // 让虚拟节点 渲染成真实节点
  console.log(vnode)
  let el = createElm(vnode);
  container.appendChild(el);
}

function createElm (vnode) {
  const { tag, children = [],text } = vnode
  if (typeof tag === 'string') {
    vnode.el = document.createElement(tag);
    updateProperties(vnode)
    children.map(child => {
      return render(child, vnode.el)
    });
  } else {
    vnode.el = document.createTextNode(text);
  }
  return vnode.el;
}

function updateProperties (vnode, oldProprs = {}) {
  let newProps = vnode.props || [];
  var el = vnode.el;
  let newStyle = newProps.style
  let oldStyle = oldProprs.style
  
   // 旧的有，新的没有的样式style
  for(let key in oldStyle) {
    if (!newStyle[key]) {
      el.style[key] = ''
    }
  }
  // 旧的有，新的没有的属性
  for (let key in oldProprs) {
    if (!newProps[key]) {
      delete el[key]
    }
  }
  Object.keys(newProps).map(props => {
    if (props === 'style') {
      Object.keys(newStyle).map(styleName => {
        el.style[styleName] = newStyle[styleName]
      })
    } else if (props === 'class') {
      el.className = newProps.class
    } else {
      el[props] = newProps[props]
    }
  })
}

export function patch (oldVnode, newVnode) {
  // 1:比对根标签，不同则替换
  if (oldVnode.tag !== newVnode.tag) {
    oldVnode.el.parentNode.replaceChild(createElm(newVnode), oldVnode.el)
  }

  // 2:比较是否为为本，文本不一样替换
  if (!oldVnode.tag) {
    if (oldVnode.text !== newVnode.text) {
      oldVnode.el.textContent = newVnode.text
    }
  }
  // 3: 标签一样：对比属性
  let el = newVnode.el = oldVnode.el;
  updateProperties(newVnode, oldVnode.props)
  
  // 4:比较孩子
  let oldChildren = oldVnode.children || []
  let newChildren = newVnode.children || []
  // 4.1 新老都有孩子
  // 4.2 新有孩子，老没有
  // 4.3 老有孩子，新没有孩子
  if (oldChildren.length > 0 && newChildren.length > 0) {
    updateChildren(el, oldChildren, newChildren)
  }else if (newChildren.length > 0) {
    newChildren.map(item => {
      render(item, el)
    })
  } else if (oldChildren.length > 0) {
    el.innerHTML = ''
  }
}
function isSameVnode (oldVnode, newVnode) {
  return (oldVnode.tag === newVnode.tag) && (oldVnode.key === newVnode.key)
}

function updateChildren (parent, oldChildren, newChildren) {
  console.log(oldChildren, newChildren)
  // 双指针
  let oldStartIndex = 0;
  let oldStartVnode = oldChildren[0]
  let oldEndIndex = oldChildren.length - 1
  let oldEndVnode = oldChildren[oldEndIndex]

  let newStartIndex = 0;
  let newStartVnode = newChildren[0]
  let newEndIndex = newChildren.length - 1
  let newEndVnode = newChildren[newEndIndex]

  // 都从头开始看是否一样
  // 都从尾巴看是看是否一样
  // 老头对新尾巴看是否一样 移动
  // 老尾对新头看是否一样 移动
  // 是否存在则移动
  function makeIndexByKey(children){
    let map = {};
    children.forEach((item,index)=>{
        map[item.key] = index
    });
    return map; // {a:0,b:1...}
}
let map = makeIndexByKey(oldChildren);

  while(oldStartIndex <= oldEndIndex && newStartIndex <= newEndIndex) {
    if(!oldStartVnode){
      oldStartVnode = oldChildren[++oldStartIndex];
  }else if(!oldEndVnode){
      oldEndVnode = oldChildren[--oldEndIndex]
  }else if (isSameVnode(oldStartVnode, newStartVnode)) {
      patch(oldStartVnode, newStartVnode)
      oldStartVnode = oldChildren[++oldStartIndex]
      newStartVnode = newChildren[++newStartIndex]
    } else if (isSameVnode(oldEndVnode, newEndVnode)) {
      patch(oldEndVnode, newEndVnode)
      oldEndVnode = oldChildren[--oldEndIndex]
      newEndVnode = newChildren[--newEndIndex]
    } else if (isSameVnode(oldStartVnode, newEndVnode)) {
      patch(oldStartVnode, newEndVnode)
      parent.insertBefore(oldStartVnode.el, oldEndVnode.el.nextSibling)
      oldStartVnode = oldChildren[++oldStartIndex]
      newEndVode = newChildren[--newEndIndex]
    } else if (isSameVnode(oldEndVnode, newStartVnode)) {
      patch(oldEndVnode, newStartVnode)
      parent.insertBefore(oldEndVnode.el, oldStartVnode.el)
      oldEndVnode = oldChildren[--oldEndIndex];
      newStartVnode = newChildren[++newStartIndex]
    } else {
      let moveIndex = map[newStartVnode.key];
      if(moveIndex == undefined){ // 不存在 key
        console.log(oldStartVnode)
          parent.insertBefore(createElm(newStartVnode),oldStartVnode.el);
      }else{
          // 我要移动这个元素
          let moveVnode = oldChildren[moveIndex];
          oldChildren[moveIndex] = undefined;
          parent.insertBefore(moveVnode.el,oldStartVnode.el);
          patch(moveVnode,newStartVnode);
      }
      // 要将新节点的指针向后移动
      newStartVnode = newChildren[++newStartIndex]
    }
  }  
  console.log(newStartIndex ,'12', newEndIndex)
  // 新的元素多
  if (newStartIndex <= newEndIndex) {
    for(let i = newStartIndex; i <= newEndIndex; i++) {
      let ele = newChildren[newEndIndex+1] == null ? null : newChildren[newEndIndex+1].el;
      console.log(ele)
      parent.insertBefore(createElm(newChildren[i]), ele )
    }
  }
  // 老得元素多
  if(oldStartIndex <= oldEndIndex){
    for(let i = oldStartIndex; i<=oldEndIndex;i++){
        let child = oldChildren[i];
        if(child != undefined){
            parent.removeChild(child.el)
        }
    }
}
}
