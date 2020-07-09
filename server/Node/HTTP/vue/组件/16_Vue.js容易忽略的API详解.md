#### 目录

* [ ] 一、nextTick
* [x] 二、v-model 语法糖
* [x] 三、.sync 修饰符
* [x] 四、$set


#### 一、nextTick
[nextTick源码](https://github.com/vuejs/vue/blob/dev/src/core/util/next-tick.js)

>nextTick 函数接收一个回调函数 cb，在下一个 DOM 更新循环之后执行

>Vue.js 使用了 Promise、setTimeout 和 setImmediate 三种方法来实现 nextTick


#### 二、v-model 语法糖
```
<template>
  <div>
    <button @click="increase(-1)">减 1</button>
    <span style="color: red;padding: 6px">{{ currentValue }}</span>
    <button @click="increase(1)">加 1</button>
  </div>
</template>
<script>
  export default {
    name: 'InputNumber',
    props: {
      number: {
        type: Number
      }
    },
    model: {
      prop: 'number',
      event: 'change'
    },
    data () {
      return {
        currentValue: this.number
      }
    },
    watch: {
      value (val) {
        this.currentValue = val;
      }
    },
    methods: {
      increase (val) {
        this.currentValue += val;
        this.$emit('number', this.currentValue);
      }
    }
  }
</script>

<template>
  <InputNumber v-model="value" />
</template>
<script>
  import InputNumber from '../components/input-number/input-number.vue';

  export default {
    components: { InputNumber },
    data () {
      return {
        value: 1
      }
    }
  }
</script>
```

#### 三、.sync 修饰符

```
<template>
  <div>
    <button @click="increase(-1)">减 1</button>
    <span style="color: red;padding: 6px">{{ value }}</span>
    <button @click="increase(1)">加 1</button>
  </div>
</template>
<script>
  export default {
    name: 'InputNumber',
    props: {
      value: {
        type: Number
      }
    },
    methods: {
      increase (val) {
        this.$emit('update:value', this.value + val);
      }
    }
  }
</script>

<template>
  <InputNumber :value.sync="value" />
</template>
<script>
  import InputNumber from '../components/input-number/input-number.vue';

  export default {
    components: { InputNumber },
    data () {
      return {
        value: 1
      }
    }
  }
</script>

不能和表达式一起使用（如 v-bind:title.sync="doc.title + '!'" 是无效的）；
不能用在字面量对象上（如 v-bind.sync="{ title: doc.title }" 是无法正常工作的）。
```

####  四、$set
>由于 JavaScript 的限制，Vue 不能检测以下变动的数组：
当利用索引直接设置一个项时，例如：this.items[index] = value;
当修改数组的长度时，例如：vm.items.length = newLength。
由于 JavaScript 的限制，Vue 不能检测对象属性的添加或删除。

>数组的以下方法，都是可以触发视图更新的，也就是响应性的：
push()、pop()、shift()、unshift()、splice()、sort()、reverse()。

```
// 数组
export default {
  data () {
    return {
      items: ['a', 'b', 'c']
    }
  },
  methods: {
    handler () {
      this.$set(this.items, 1, 'x');  // 是响应性的
    }
  }
}

// 对象
export default {
  data () {
    return {
      item: {
        a: 1
      }
    }
  },
  methods: {
    handler () {
      this.$set(this.item, 'b', 2);  // 是响应性的
    }
  }
}

```
计算属性的 set

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