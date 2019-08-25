export default {
  functional: true,

  name: 'Upload',
  render (createElement, context) {
    const {
      index,
      action,
      extraData,
      accept,
      fileList
    } = context.props
    const { ref } = context.data
    const {
      handleChange,
      beforeUpload
    } = context.listeners
    return createElement(
      'el-upload',
      {
        class: 'upload__primary dragger',
        ref: ref,
        attrs: {
          action: action,
          data: extraData,
          multiple: true,
          accept: accept,
          autoUpload: false,
          fileList: fileList,
          drag: true,
          beforeUpload: (file) => {
            return beforeUpload(file, index)
          },
          onChange: (file, fileList) => {
            return handleChange(file, fileList, index)
          }
        }
      },
      [
        createElement('i',
          {
            class: 'el-icon-upload'
          }
        ),
        createElement('div',
          {
            class: 'el-upload__text'
          },
          '点击或将文件拖拽到这里上传'
        ),
        createElement('div',
          {
            class: 'el-upload__text tips'
          },
          `支持扩展名：${accept}.....`
        )
      ]
    )
  }
}
