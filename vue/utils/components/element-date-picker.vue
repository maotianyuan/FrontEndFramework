<template>
  <base-table class="transfer__table" :data="transferRightData" :pagination="false" border @selection-change="handleSelectionChange" :columns="columns">
    <el-table-column v-if="isSelection" align="center" label="请选择" type="selection"></el-table-column>
    <el-table-column type="index" label="序号" align="center" width="50">
    </el-table-column>
    <template v-slot:plan_time="{ row }" v-if="isTimeGroup">
      <el-date-picker style="width:353px;" value-format='yyyy-MM-dd HH:mm:ss' type="datetimerange" v-model="row.plan_time" :unlink-panels="true" align="right" ref="picker" @change="plan_visit(row)" :picker-options="pickerOptions(row)" start-placeholder="计划开始时间" end-placeholder="计划结束时间">
      </el-date-picker>
    </template>
    <template v-slot:plan_visit_created_at="{ row }" v-if="isTimeGroup">
      <el-date-picker :disabled="true" v-model="row.plan_visit_created_at" value-format='yyyy-MM-dd HH:mm:ss' type="datetime" placeholder="到店走访时间">
      </el-date-picker>
    </template>
  </base-table>
</template>
<script>

export default {
  name: 'TaskCreateFilter',

  components: {
  },

  props: {
    isSelection: {
      type: Boolean,
      default: false
    },
    isTimeGroup: {
      type: Boolean,
      default: false
    },
    transferRightData: {
      type: Array,
      default: []
    },
    columns: {
      type: Array,
      default: []
    }
  },
  computed: {
  },
  watch: {
    plan_time: {
      handler: (newVal) => {
        console.log(newVal)
      },
      deep: true
    }
  },

  data () {
    return { }
  },

  methods: {
    pickerOptions (row) {
      let _this = this
      return {
        onPick: function ({ minDate = '', maxDate = '' }) {
          this.handleConfirm = function () {
            var visible = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false
            if (this.isValidValue([this.minDate, this.maxDate])) {
              let maxTime = new Date(this.minDate).getTime() + (8.64e7 * 7)
              if (new Date(this.maxDate) <= maxTime) {
                this.$emit('pick', [this.minDate, this.maxDate], visible)
              } else {
                _this.$message({
                  message: '计划开始结束时间，需要控制在一周内'
                })
              }
            }
          }
        },
        disabledDate (time) {
          return time.getTime() < Date.now() - 8.64e7
        }
      }
    },
    plan_visit (row) {
      row.plan_visit_created_at = row.plan_time && row.plan_time.length >= 0 && row.plan_time[0]
    },
    handleSelectionChange (val) {
      this.$emit('handleSelectionChange', val)
    }
  }
}
</script>

<style lang="scss" scoped>
.title-text {
  font-size: 16px;
  font-weight: normal;
  color: #414957;
  margin: 0 0 20px;
}
span.input__normal_type {
  width: 106px;
  display: block;
  color: #687284;
  margin-left: 18px;
}
span.input__long_type {
  width: 182px;
  display: block;
  color: #687284;
  margin-left: 18px;
}
.transfer__table {
  .base-table__wrapper {
    .el_table {
      height: 350px;
    }
  }
}
/deep/.el-table__body-wrapper {
  max-height: 316px;
  overflow-y: scroll;
}
/deep/.el-table__empty-block {
  min-height: 32px;
}
/deep/.el-table__empty-text {
  line-height: 32px;
}
</style>
