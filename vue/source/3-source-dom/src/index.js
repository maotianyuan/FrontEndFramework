import { h, render, patch } from './vue/vdom'

const oldValue = h('div',{id: 'content1', key: 1 },
 h('div', {id: 'child1', key:11, style: { color: 'red'}, class: "header"}, 'child1'),
 h('div', {id: 'child2', key:2, style: { color: 'yellow'}, class: "main"}, 'child2'),
 h('div', {id: 'child3', key:3,style: { color: 'blue'}, class:"footer"}, 'child3'),
 )

//  const newValue = h('p',{id: 'content2', key: 2 },
//  h('div', {id: 'p1', style: { background: 'red'}, class: "header"}, 'p1'),
//  h('div', {id: 'p2',style: { background: 'yellow'}, class: "main"}, 'p2'),
//  h('div', {id: 'p3',style: { background: 'blue'}, class:"footer"}, 'p3'),
//  'pppp'
//  )


 const newValue = h('div',{id: 'content1', key: 1 },
 h('div', {id: 'child1', key:11, style: { color: 'red'}, class: "header"}, 'child1'),
 h('div', {id: 'child2', key:2, style: { color: 'yellow'}, class: "main"}, 'child2'),
 h('div', {id: 'child3', key:3,style: { color: 'blue'}, class:"footer"}, 'child3'),
 h('div', {id: 'child4', key:4,style: { color: 'blue'}, class:"footer"}, 'child4'),
 h('div', {id: 'child4', key:6,style: { color: 'blue'}, class:"footer"}, 'child6'),
 )
 render(oldValue, document.getElementById('app'))
 setTimeout(()=>{
  patch(oldValue, newValue)
 }, 2000)
 
