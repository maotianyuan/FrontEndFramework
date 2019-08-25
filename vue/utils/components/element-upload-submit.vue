<template>
<div class="service-dialog">
  <intro-step :step="1" class="intro__wrap">
    <el-dialog class="upload-modal" center :visible.sync="dialogFormVisible" :close-on-press-escape=false :close-on-click-modal="false" :modal-append-to-body="false" :show-close="showClose">
      <div class="intro__step left-top">
        <span class="intro__text">******</span>
        <p class="intro__line"></p>
      </div>
      <div class="intro__step left-bottom">
        <span class="intro__text">*****</span>
        <p class="intro__line"></p>
      </div>
      <div class="intro__step right-top">
        <span class="intro__text">选择您要上传的数据</span>
        <p class="intro__line"></p>
      </div>
      <div class="intro__step center-content">
        <div class="el-select-dropdown el-popper" style="min-width:173px;position:relative;">


        <div class="el-scrollbar" style="">
          <div class="el-select-dropdown__wrap el-scrollbar__wrap el-scrollbar__wrap--hidden-default">
            <ul class="el-scrollbar__view el-select-dropdown__list">
              <!---->
              <li data-v-e6e90baa="" class="el-select-dropdown__item hover"><span>**</span></li>
              <li data-v-e6e90baa="" class="el-select-dropdown__item"><span>**</span></li>
            </ul>
          </div>
          <div class="el-scrollbar__bar is-horizontal">
            <div class="el-scrollbar__thumb" style="transform: translateX(0%);"></div>
          </div>
          <div class="el-scrollbar__bar is-vertical">
            <div class="el-scrollbar__thumb" style="transform: translateY(0%);"></div>
          </div>
        </div>
        <!---->
        <div x-arrow="" class="popper__arrow" style="left: 35px;"></div>
        </div>
      </div>
      <div class="row-inline">
        <label for="fileName" class="fileNameLabel">上传文件:
          <input type="text" class="fileName" name="fileName" readonly="readonly" :value="fileNameValue" /></label>
        <el-upload class="upload-wrap" 
          :action="`${baseUrl}/nlp/uploadFile`" 
          :headers="myHeaders" 
          :multiple="false"
          :data="extraData"
          :show-file-list="false"
          ref="upload"
          :file-list="fileList"
          accept=".xlsx,.xls,.csv"
          :on-error="handleError"
          :on-change="handleChange"
          :before-upload="beforeUpload"
          :on-success="handleSuccess"
          :auto-upload="false"
          >
          <button size="small" class="btn btn-bmw-default btn-submit" type="primary">浏览</button>
        </el-upload>
      </div>
      <p class="upload-tip-text">提示：请上传{{taskNumber}}条记录内的.xls、xlsx、csv文件</p>
      <p class="upload-tip-text" v-if="limit==1 && uploadNums<=10">剩余上传次数<span class="num" id="uploadNums">{{uploadNums}}</span>次</p>
      <div class="row-inline ">
        <span class="label-text">数据类型:</span>
        <el-select class="primary-select" v-model="uploadType" placeholder="请选择">
          <el-option v-for="item in selectOptions" :key="item.id" :label="item.name" :value="item.id">
          </el-option>
        </el-select>
        <span class="type-tips" id="typeTips" v-if="typeTips">{{typeTips}}</span>
      </div>
      <div slot="footer">
        <a class="down-excel" target="_blank" :href="`${baseUrl}/yours/api`">下载模板</a>
        <el-button class="btn btn-bmw-info btn-submit" type="test" :loading="btnLoading" @click="submitUpload">确认上传</el-button>
      </div>
    </el-dialog>
  </intro-step>

  <intro-step :step="2" class="intro__wrap">
    <el-dialog class="uploading-modal" center :modal-append-to-body="false" :show-close="false" :visible.sync="uploadingDialog" :close-on-click-modal="false">
      <div class="intro__step right-center">
        <span class="intro__text">上传成功，等待分析完成</span>
        <p class="intro__line"></p>
      </div>
      <img :src=uploadingImg alt="">
      <p v-html="lockTipText"></p>
    </el-dialog>
  </intro-step>

  <el-dialog class="fail-modal" center :modal-append-to-body="false" :visible.sync="faileDialog" :show-close="true" :close-on-click-modal="false">
    <img src="@/assets/images/service/detail/fail.png" alt="">
    <p class="tips" v-html="failTips"></p>
    <p v-if="uploadNums<=0" style="color:#687284">充值请联系客服：***-****-****</p>
    <span class="reupload-btn" @click="reUploadBtn" v-else>重新上传文件</span>
  </el-dialog>
</div>
</template>

<script>
import Cookie from 'js-cookie'
import IntroStep from '@/components/intro/introStep'
import {
  mapState,
  mapGetters
} from 'vuex'

export default {
  props: {
    taskNumber: Number
  },
  data() {
    return {
      baseUrl: '/mock',
      dialogFormVisible: false,
      uploadingDialog: false,
      faileDialog: false,
      showClose: true,
      failTips: '-',
      myHeaders: {
        'api_token': Cookie.get('api_token') ? Cookie.get('api_token') : '',
      },
      extraData: {
        data_type_id: '',
      },
      uploadNums: '',
      fileNameValue: '',
      fileList: [],
      uploadingImg: require('@/assets/images/service/detail/yun.png'),
      lockTipText: '数据上传中...',
      limit: '',
      typeTips: '',
      uploadType: '',
      isRefreshTable: true,
      btnLoading: false,
      selectOptions: [],
      selectValue: '',
    }
  },
  computed: {
    ...mapGetters({
      uploadModal: 'service/getUploadModal',
      dialogSuccess: 'service/getDialogSuccess',
    })
  },
  components: {
    IntroStep
  },
  watch: {
    uploadModal({
      num,
      limit,
      show
    }) {
      this.uploadNums = num
      this.limit = limit
      this.dialogFormVisible = show
    },
    dialogSuccess({
      lockTipText,
      uploadingImg,
      show
    }) {
      this.lockTipText = lockTipText
      this.uploadingImg = uploadingImg
      this.uploadingDialog = show
    },

  },
  methods: {
    getSelect() {
      this.$axios.post('/yours/api').then(({
        data
      }) => {
        if (data.success) {
          let {
            list
          } = data.rows
          this.selectOptions = list
        }
      })
    },
    submitUpload() {
      if (this.limit == 1 && this.uploadNums <= 0) {
        this.utilAlert('<p>上传失败</p><p style="margin-top: 15px;color:#687284">您的可上传任务数为<span style="color:#FD6565">0</span></p>')
        return
      }
      if (this.fileList.length <= 0) {
        this.utilAlert('<p style="height:14px;"><p>不存在上传文件！')
        return
      }
      if (!this.uploadType) {
        this.typeTips = '请选择文件类型'
        return
      } else {
        this.typeTips = ''
      }
      this.showClose = false
      this.btnLoading = true
      this.extraData.data_type_id = this.uploadType

      this.$refs.upload.submit();
    },
    handleError(err, file, fileList) {
      this.fileList = []
      this.fileNameValue = ''
      this.$refs.upload.clearFiles();
      this.utilAlert('发生未知异常错误，请重新上传!')
      this.btnLoading = false
      this.showClose = true
    },
    handleSuccess(res, file, fileList) {
      this.btnLoading = false
      this.$refs.upload.clearFiles();
      this.fileNameValue = ''
      this.fileList = []
      this.showClose = true
      if (!res.success) {
        this.utilAlert(res.rows)
        return
      }
      if (this.limit == 1) {
        this.uploadNums--
        this.$store.dispatch('yours/api', {
          num: this.uploadNums,
          limit: this.limit,
        })
      }
      this.ulpadingAnimate()
      this.isRefreshTable = !this.isRefreshTable
      this.$store.dispatch('yours/api', {
        status: this.isRefreshTable
      })

    },
    handlerFileAccept(file) {
      let allow = ['xls', 'xlsx', 'csv']
      let isAllow = allow.filter(item => item === file.name.split('.')[1])
      if (isAllow.length <= 0) {
        this.fileList = []
        this.utilAlert('文件格式不正确<br/>仅支持xls、xlsx、csv文件')
        return false
      }
      return true
    },
    handleChange(file, fileList) {
      if (fileList.length <= 0) {
        return false
      }
      if (!this.handlerFileAccept(file)) {
        this.fileList = []
        return false
      }
      this.fileList = fileList.slice(-1)
      this.fileNameValue = this.fileList[0] && this.fileList[0].name
    },
    beforeUpload(file) {
      if (!this.handlerFileAccept(file)) {
        return false
      }
      return true
    },
    ulpadingAnimate() {
      this.dialogFormVisible = false
      this.uploadingDialog = true

      if (this.timer) {
        clearTimeout(this.timer)
        this.timer = null
      }
      let count = 3
      let countDown = () => {

        this.timer = setTimeout(() => {
          switch (count) {
            case 3:
              this.uploadingImg = require('@/assets/images/service/detail/yun.png'),
                this.lockTipText = '数据上传中...'
              break;
            case 2:
              this.uploadingImg = require('@/assets/images/service/detail/good.png'),
                this.lockTipText = '数据上传成功'
              break;
            case 1:
              this.uploadingDialog = false
              setTimeout(() => {
                this.uploadingImg = require('@/assets/images/service/detail/yun.png'),
                  this.lockTipText = '数据上传中...'
              }, 1000)

              break;
            default:
          }
          count--
          count > 0 && countDown()
        }, 1000)
      }
      countDown()
    },
    reUploadBtn() {
      this.dialogFormVisible = true
      this.faileDialog = false
    },
    //提示
    utilAlert(str) {
      this.dialogFormVisible = false
      this.faileDialog = true
      this.failTips = str
    }
  },
  created() {
    this.getSelect()
  }
}
</script>

<style lang="less" scoped>
@import '~assets/css/dialog/upload.less';
.service-dialog {
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 2;
    left: 50%;
    margin-left: -50%;
    margin-top: 15vh;
}
.intro-reference {
    .intro__step {
        display: block;
    }
}
.intro__step {
    position: absolute;
    display: none;
    .intro__line {
        width: 81px;
        height: 2px;
        position: relative;
        background: #fff;
        margin: -12px auto 5px;
        text-align: center;
        &::before {
            position: absolute;
            content: '';
            display: block;
            bottom: 0;
            width: 6px;
            left: 0;
            top: -2px;
            height: 6px;
            border-radius: 6px;
            background: #fff;
        }
    }
    .intro__text {
        color: #fff;
        text-align: left;
        font-size: 14px;
    }
    &.left-top {
        width: 314px;
        left: -209px;
        top: 93px;
    }
    &.left-bottom {
        width: 314px;
        left: -209px;
        top: 152px;
        .intro__text {
            padding-left: 26px;
        }
    }
    &.right-top {
        width: 400px;
        right: -255px;
        top: 30px;
        text-align: right;
        .intro__line {
            &::before {
                right: 0;
                left: inherit;
            }
        }
    }
    &.right-center {
        width: 400px;
        right: -255px;
        top: 65px;
        text-align: right;
        .intro__line {
            &::before {
                right: 0;
                left: inherit;
            }
        }
    }
    &.center-content{
      right: 252px;
      top: 149px;
    }
}
</style>
