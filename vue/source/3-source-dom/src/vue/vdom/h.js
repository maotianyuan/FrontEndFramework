
// 生成虚拟 DOM
export default function h (tag, props, ...children) {
  let key = props.key
  delete props.key
  children = children.map(item => {
    if (typeof item === 'object') {
      return item
    } else {
      return createElement(undefined, undefined, undefined, undefined, item)
    }
  })
  return createElement(tag, props, key, children)
}
function createElement (tag, props, key, children, text) {
  return {
    tag,
    key,
    props,
    children,
    text,
  }
}