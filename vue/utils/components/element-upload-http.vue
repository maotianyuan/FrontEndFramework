<template>
  <div class="vip-dialog">
    <el-dialog
      class="upload-modal"
      center
      top="10vh"
      :visible.sync="dialogFormVisible"
      :close-on-press-escape="false"
      :modal-append-to-body="false"
      :before-close="handleClose"
      :close-on-click-modal="false"
      :lock-scroll="false"
      :show-close="showClose"
    >
      <el-upload
        class="upload-wrap"
        :multiple="true"
        :action="actionUpload"
        :show-file-list="false"
        ref="upload"
        name="file"
        :file-list="fileList"
        :on-error="handleError"
        :on-change="handleChange"
        :on-success="handleSuccess"
        :auto-upload="false"
      >
      <el-button class="hide" slot="trigger" size="small" ref="refSelectFileBtn" type="zebra-current">选取文件</el-button>
      </el-upload>

      <el-form class="el-form-primary" ref="form" :model="formUpload" label-width="80px">
        <div class="section__senior">
          <el-form-item label="选择文件">
            <el-col class="el-input-col w310" :span="18">
               <el-input class="el-input-primary"
               v-model="formUpload.fileName"
               readonly="readonly"
               ></el-input>
            </el-col>
            <el-col class="" :span="4">
              <el-button
                size="small"
                type="zebra-current"
                style="margin-left:10px"
                @click="triggerSelectFile"
              >浏览</el-button>
            </el-col>
            <el-col class="label-subtext" :span="24">问卷支持xlsx、xls、csv格式，音频支持wav、mp3、acc格式</el-col>
          </el-form-item>
        </div>
      </el-form>

      <div slot="footer">
        <el-button
          type="default"
          @click="$emit('update:dialogFormVisible', false)"
        >取消</el-button>
        <el-button
          type="primary"
          :loading="btnLoading"
          @click="uploadSectionFile"
        >确认上传</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

export default {
  name: 'dialogUpload',
  props: {
    dialogFormVisible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      formUpload: {
        fileName: ''
      },
      actionUpload: process.env.NODE_ENV === 'production' ? '/admin/taskConfigUpload' : '/admin/taskConfigUpload',
      showClose: true,
      fileList: [],
      btnLoading: false,
      id: '',
      currentFileName: 'file1'
    }
  },
  computed: {
  },
  components: {},
  watch: {},
  created () {
    this.id = this.$route.query.id
  },
  methods: {
    triggerSelectFile () {
      this.$refs.refSelectFileBtn.$el.click()
    },
    async uploadSectionFile () {
      if (this.fileList.length <= 0) {
        this.utilAlert('不存在上传文件!')
        return
      }
      this.showClose = false
      this.btnLoading = true
      this.formDate = new FormData()
      // Object.keys(this.formUpload).map(key => {
      //   this.formDate.append(key, this.formUpload[key])
      // })
      this.formDate.append('task_data_id', this.id)
      this.formDate.append('file', this.fileList[0] && this.fileList[0].raw)
      this.$http({
        method: 'post',
        url: this.actionUpload,
        data: this.formDate,
        headers: { 'Content-Type': 'multipart/form-data' }
      })
        .then((res) => {
          this.handleSuccess(res.data)
        })
        .catch((error) => {
          this.handleSuccess(error)
        })
    },
    handleError () {
      this.fileList = []
      this.formUpload.fileName = ''
      this.$refs.upload.clearFiles()
      this.utilAlert('发生未知异常错误，请重新上传!')
      this.btnLoading = false
      this.showClose = true
    },
    handleSuccess (res) {
      this.btnLoading = false
      this.$refs.upload.clearFiles()
      this.formUpload.fileName = ''
      this.fileList = []
      this.showClose = true
      if (!res.success) {
        this.utilAlert(res.rows)
        return
      }
      this.utilAlert('上传成功')
      this.$emit('uploadSuccess', true)
      this.$emit('update:dialogFormVisible', false)
    },
    handleChange (file, fileList) {
      if (fileList.length <= 0) {
        return false
      }
      this.fileList[0] = file
      this.formUpload.fileName = this.fileList[0] && this.fileList[0].name
    },
    utilAlert (str) {
      this.$message({
        message: str,
        type: 'info'
      })
    },
    handleClose () {
      this.$emit('update:dialogFormVisible', false)
    }
  }
}
</script>

<style lang="stylus" scoped>
.vip-dialog
  position fixed
  top 0
  width 100%
  left 50%
  margin-left -50%
  margin-top 0vh
  z-index 20
  .upload-modal
    /deep/
      .el-dialog
        &.el-dialog--center
          width 540px
          min-height 248px
          .el-dialog__body
            padding 40px 0 0
      .el-dialog__header
        position absolute
        right 0
        top 0
        padding 20px 20px 0
      .el-dialog__headerbtn
        top 6px
        right 6px
        .el-dialog__close
          color #acacac
          font-weight 600
      .el-dialog__footer
        padding-top 23px
        .dialog__wrap--btn
          padding 8px 25px
      .primary-select
        margin -3px 0 0 4px
    .upload-wrap
      .hide
        display none
    .el-dialog__footer
      width 100%
      clear both
      position absolute
      bottom 15px
      padding-top 53px
</style>
