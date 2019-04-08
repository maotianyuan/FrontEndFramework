### 目录

* [x] 一、组件的构成 prop slot event 

#### 一、组件的构成
>Vue.js 组件的 API：三部分组成的：prop、event、slot

1.属性 prop
>prop定义了有哪些可配置的属性，props 最好用对象的写法，这样可以针对每个属性设置类型、默认值或自定义校验属性的值，这点在组件开发中很重要;
>inheritAttrs: false 就可以禁用了 id class
```
// 判断参数是否是其中之一
  export default {
    props: {
      size: {
        validator (value) {
          return  ['success', 'warning', 'danger'].indexOf(value) !== -1
        },
        default: 'success'
      },
      disabled: {
        type: Boolean,
        default: false
      }
    }
  }
```

2.插槽 slot

[Slot](https://juejin.im/post/5c64e11151882562e4726d98#comment)

>编译作用域
父级模板里的所有内容都是在父级作用域中编译的；子模板里的所有内容都是在子作用域中编译的。

>后备内容
>具名插槽
一个不带 name 的 <slot> 出口会带有隐含的名字“default”。

```
<template>
  <button :class="'i-button-size' + size" :disabled="disabled">
    <slot name="icon"></slot>
    <slot></slot>
  </button>
</template>

<i-button>
  <i-icon slot="icon" type="checkmark"></i-icon>
  按钮 1
</i-button>

```
```
单个默认插槽的缩写形式
子组件
<span>
  <!-- 完整 v-bind:user 下面是简写形式 -->
  <slot :user="user">
    {{ user.firstName }}
  </slot>
</span>
父组件
<current-user>
 <!-- 两种写法均可 -->
  <!--<template v-slot="slotProps">
    {{ slotProps.user.firstName }}
  </template>-->
  <template v-slot:default="slotProps">
    {{ slotProps.user.firstName }}
  </template>
  
  //<template #other="otherSlotProps">
  <template v-slot:other="otherSlotProps">
    ...
  </template>
</current-user>
```
```
插槽内容的解构赋值
<current-user v-slot="{ user = { firstName: 'Guest' } }">>
  {{ user.firstName }}
</current-user>

```
```
动态插槽
<base-layout>
  <template v-slot:[dynamicSlotName]>
    ...
  </template>
</base-layout>

```
3.自定义事件 event
>如果不写 .native 修饰符，那上面的 @click 就是自定义事件 click，而非原生事件 click，但我们在组件内只触发了 on-click 事件，而不是 click，所以直接写 @click 会监听不到

