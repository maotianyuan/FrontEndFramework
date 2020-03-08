export default {
  props: {
    to: {
      type: String,
      require: true,
    },
    tag: {
      type: String,
      default: 'a'
    }
  },
  methods: {
    handler() {
      this.$router.push(this.to)
    }
  },
  render (h) {
    return <a onClick ={this.handler}>{this.$slots.default}</a>
  }
}