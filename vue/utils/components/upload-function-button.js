export default {
  functional: true,

  name: 'Upload',
  handlerFileAccept (file) {
    console.log('tesaadsf', this)
    return false
  },
  render (createElement, context) {
    const {
      action,
      extraData,
      accept,
      fileList,
      extension
    } = context.props
    const { ref } = context.data
    const {
      handleChange,
      handleSuccess
    } = context.listeners
    const handlerFileAccept = (file) => {
      let allow = accept.split(',')
      let isAllow = allow.filter(item => item === '.' + file.name.split('.')[1])
      if (isAllow.length <= 0) {
        fileList.pop()
        this.utilAlert(`文件格式不正确, 仅支持${extension}文件`)
        return false
      }
      return true
    }
    return createElement(
      'el-upload',
      {
        class: 'upload__default',
        ref: ref,
        attrs: {
          action: action,
          data: extraData,
          multiple: true,
          accept: accept,
          autoUpload: false,
          fileList,
          onChange: (file, fileList) => {
            if (fileList.length <= 0) {
              return false
            }
            if (!handlerFileAccept(file)) {
              return false
            }
            handleChange(fileList)
          },
          handleSuccess: (res, file, fileList) => {
            return handleSuccess(res, file, fileList)
          }
        }
      },
      [
        createElement('el-button',
          {
            attrs: {
              type: 'zebra-current',
              icon: 'el-icon-upload2'
            }
          },
          '上传文件'
        ),
        createElement('div',
          {
            slot: 'tip',
            class: 'el-upload__tip upload__default--tips'
          },
          `支持扩展名：${extension}`
        )
      ]
    )
  }
}
