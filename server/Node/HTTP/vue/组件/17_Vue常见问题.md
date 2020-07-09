#### 目录

* [x] 一、v-show 与 v-if 区别
* [x] 二、绑定 class 的数组用法
* [x] 三、computed 和 watch 的区别
* [x] 四、事件修饰符
* [x] 五、组件中data为什么是函数
* [x] 六、keep-alive 的理解
* [x] 七、**递归组件的要求**
* [x] 八、自定义组件的语法糖 v-model 是怎样实现的
* [ ] 九、Vuex 中 mutations 和 actions 的区别
* [ ] 十、**Render 函数**
* [x] 十一、怎样理解单向数据流
* [x] 十二、生命周期
* [x] 十三、组件间通信
* [x] 十四、路由的跳转方式
* [ ] 十五、Vue.js 2.x 双向绑定原理
* [ ] 十六、什么是 MVVM，与 MVC 有什么区别



#### 一、v-show 与 v-if 区别
>1. [明显]v-show: 切换元素的 display CSS 属性；
    v-if: 决定是否会选择代码块的内容（或组件);
>2. [性能]v-show: 无论是否为真，都会被编译缓存，DOM元素保留，适合频繁操作时 一次性渲染完的，更多的初始化渲染消耗；
    v-if: 切换时元素及它的数据绑定 / 组件被销毁并重建；切换消耗，不适合频繁
>3. [编译]v-if="false" 时，内部组件是不会渲染的，所以在特定条件才渲染部分组件（或内容）时，可以先将条件设置为 false，需要时（或异步，比如 $nextTick）再设置为 true，这样可以优先渲染重要的其它内容，合理利用，可以进行性能优化。

#### 二、绑定 class 的数组用法
>可以是固定的值，还有动态值（对象）的混合。

```js
<template>
  <div :class="classes"></div>
</template>
<script>
  export default {
    computed: {
      classes () {
        return [
          `${prefixCls}`,
          `${prefixCls}-${this.type}`,
          {
            [`${prefixCls}-long`]: this.long,
            [`${prefixCls}-${this.shape}`]: !!this.shape,
            [`${prefixCls}-${this.size}`]: this.size !== 'default',
            [`${prefixCls}-loading`]: this.loading != null && this.loading,
            [`${prefixCls}-icon-only`]: !this.showSlot && (!!this.icon || !!this.customIcon || this.loading),
            [`${prefixCls}-ghost`]: this.ghost
          }
        ];
      }
    }
  }
</script>
```

#### 三、computed 和 watch 的区别

> computed：自动监听依赖值的变化，从而动态返回内容，监听是一个过程，在监听的值变化时，可以触发一个回调，并做一些事情。

> 区别：
需要动态值，那就用computed
需要知道值的改变后执行业务逻辑，才用 watch，用反或混用虽然可行，但都是不正确的用法。

1. computed 是一个对象时，它有哪些选项？
> 所有 getter 和 setter 的 this 上下文自动地绑定为 Vue 实例。有 get 和 set 两个选项；
> 是一个方法时候，仅读取；
```
this.fullName = 'Aresn Liang'，computed 的 set 就会调用，firstName 和 lastName 会被赋值为 Aresn 和 Liang。
computed: {
  fullName: {
    get () {
      return `${this.firstName} ${this.lastName}`;
    },
    set (val) {
      const names = val.split(' ');
      this.firstName = names[0];
      this.lastName = names[names.length - 1];
    }
  }
}
```

2. computed 和 methods 有什么区别
> methods 是一个方法，它可以接受参数，而 computed 不能；computed 是可以缓存的，methods 不会;一般在 v-for 里，需要根据当前项动态绑定值时，只能用 methods 而不能用 computed，因为 computed 不能传参
3. computed 是否能依赖其它组件的数据？
> computed 可以依赖其它 computed，甚至是其它组件的 data。
4. watch 是一个对象时，它有哪些选项？
> handler 执行的函数 
 deep 是否深度
 immediate 是否立即执行
 
 ```
 var vm = new Vue({
  data: {
    a: 1,
    b: 2,
    c: 3,
    d: 4,
    e: {
      f: {
        g: 5
      }
    }
  },
  watch: {
    a: function (val, oldVal) {
      console.log('new: %s, old: %s', val, oldVal)
    },
    // 方法名
    b: 'someMethod',
    // 深度 watcher
    c: {
      handler: function (val, oldVal) { /* ... */ },
      deep: true
    },
    // 该回调将会在侦听开始之后被立即调用
    d: {
      handler: function (val, oldVal) { /* ... */ },
      immediate: true
    },
    e: [
      'handle1',
      function handle2 (val, oldVal) { /* ... */ },
      {
        handler: function handle3 (val, oldVal) { /* ... */ },
        /* ... */
      }
    ],
    // watch vm.e.f's value: {g: 5}
    'e.f': function (val, oldVal) { /* ... */ }
  }
})
vm.a = 2 // => new: 2, old: 1
 ```
 
 
 #### 四、事件修饰符
 
 1. 怎样给这个自定义组件 custom-component 绑定一个原生的 click 事件？
> <custom-component @click.native="xxx">内容</custom-component>
2. 常见的事件修饰符有哪些？
```
.stop
.prevent
.capture
.self
顺序很重要；相应的代码会以同样的顺序产生。因此，用 v-on:click.prevent.self 会阻止所有的点击，而 v-on:click.self.prevent 只会阻止对元素自身的点击。

.exact 是 Vue.js 2.5.0 新加的，它允许你控制由精确的系统修饰符组合触发的事件，比如：

<!-- 即使 Alt 或 Shift 被一同按下时也会触发 -->
<button @click.ctrl="onClick">A</button>

<!-- 有且只有 Ctrl 被按下的时候才触发 -->
<button @click.ctrl.exact="onCtrlClick">A</button>

<!-- 没有任何系统修饰符被按下的时候才触发 -->
<button @click.exact="onClick">A</button>

```

#### 五、组件中 data 为什么是函数
为什么组件中的 data 必须是一个函数，然后 return 一个对象，而 new Vue 实例里，data 可以直接是一个对象？
> 因为组件是用来复用的，JS 里对象是引用关系，这样作用域没有隔离，而 new Vue 的实例，是不会被复用的，因此不存在引用对象的问题

#### 六、keep-alive 的理解
> 这是个概念题，主要考察候选人是否知道这个用法。简单说，就是把一个组件的编译缓存起来； 要求被切换到的组件都有自己的名字，不论是通过组件的 name 选项还是局部/全局注册。

#### 七、递归组件的要求
>要给组件设置 name；
要有一个明确的结束条件。

#### 八、自定义组件的语法糖 v-model 是怎样实现的
```
<template>
  <div>
    {{ currentValue }}
    <button @click="handleClick">Click</button>
  </div>
</template>
<script>
  export default {
    props: {
      value: {
        type: Number,
        default: 0
      }
    },
    data () {
      return {
        currentValue: this.value
      }
    },
    methods: {
      handleClick () {
        this.currentValue += 1;
        this.$emit('input', this.currentValue);
      }
    },
    watch: {
      value (val) {
        this.currentValue = val;
      }
    }
  }
</script>


或者
__value:{
   get(){
       return this.value;
   },
   set(val){
      this.$emit('input',val);
   }
}
```

#### 九、Vuex 中 mutations 和 actions 的区别
```
主要的区别是，actions 可以执行异步。actions 是调用 mutations，而 mutations 来修改 store。
```

#### 十、Render 函数
1. 什么是 Render 函数，它的使用场景是什么。
2. createElement 是什么？
3. Render 函数有哪些常用的参数

#### 十一、怎样理解单向数据流
这个概念出现在组件通信。父组件是通过 prop 把数据传递到子组件的，但是这个 prop 只能由父组件修改，子组件不能修改，否则会报错。子组件想修改时，只能通过 $emit 派发一个自定义事件，父组件接收到后，由父组件修改。

1.在子组件的 data 中拷贝一份 prop，data 是可以修改的，但 prop 不能：

```
export default {
  props: {
    value: String
  },
  data () {
    return {
      currentValue: this.value
    }
  }
}
```
2、如果是对 prop 值的转换，可以使用计算属性：
```
export default {
  props: ['size'],
  computed: {
    normalizedSize: function () {
      return this.size.trim().toLowerCase();
    }
  }
}
```


#### 十二、生命周期
> 创建前 / 后（beforeCreate / created）：在 beforeCreate 阶段，Vue 实例的挂载元素 el 和数据对象 data 都为 undefined，还未初始化。在 created 阶段，Vue 实例的数据对象 data 有了，el 还没有。

> 载入前 / 后（beforeMount / mounted）：在 beforeMount 阶段，Vue 实例的 $el 和 data 都初始化了，但还是挂载之前为虚拟的 DOM 节点，data 尚未替换。在 mounted 阶段，Vue 实例挂载完成，data 成功渲染。

> 更新前 / 后（beforeUpdate / updated）：当 data 变化时，会触发 beforeUpdate 和 updated 方法。这两个不常用，且不推荐使用。

> 销毁前 / 后（beforeDestroy / destroyed）：beforeDestroy 是在 Vue 实例销毁前触发，一般在这里要通过 removeEventListener 解除手动绑定的事件。实例销毁后，触发 destroyed。

#### 十三、组件间通信
> 父子通信：
父向子传递数据是通过 props，子向父是通过 events（$emit）；通过父链 / 子链也可以通信（$parent / $children）；ref 也可以访问组件实例；provide / inject API。
> 兄弟通信 Bus；Vuex；
> 跨级通信 Bus；Vuex；provide / inject API。

#### 十四、路由的跳转方式
1. 通过 <router-link to="home">，router-link 标签会渲染为 <a> 标签，在 template 中的跳转都是用这种；
2. 另一种是编程式导航，也就是通过 JS 跳转，比如 router.push('/home')

#### 十五、Vue.js 2.x 双向绑定原理
> 这个问题几乎是面试必问的，回答也是有深有浅。基本上要知道核心的 API 是通过 Object.defineProperty() 来劫持各个属性的 setter / getter，在数据变动时发布消息给订阅者，触发相应的监听回调，这也是为什么 Vue.js 2.x 不支持 IE8 的原因（IE 8 不支持此 API，且无法通过 polyfill 实现）

#### 十六、什么是 MVVM，与 MVC 有什么区别
>MVVM 模式是由经典的软件架构 MVC 衍生来的。当 View（视图层）变化时，会自动更新到 ViewModel（视图模型），反之亦然。View 和 ViewModel 之间通过双向绑定（data-binding）建立联系。与 MVC 不同的是，它没有 Controller 层，而是演变为 ViewModel。
>ViewModel 通过双向数据绑定把 View 层和 Model 层连接了起来，而 View 和 Model 之间的同步工作是由 Vue.js 完成的，我们不需要手动操作 DOM，只需要维护好数据状态