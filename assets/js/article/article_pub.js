$(function(){
var form=layui.form;
var layer=layui.layer;



getArticleCate()
// 初始化富文本编辑器
initEditor()

    // 获取文章类别的数据函数
    function getArticleCate(){
        $.ajax({
            method:'GET',
            url:'/my/article/cates',
            success:function(res){
                if(res.status!==0){
                    return layui.layer.msg('获取文章分类失败')
                }
                else{
                    // 调用模板引擎渲染数据
                    var htmlstr=template('tpl-choose',res)
                    $('[name=cate_id]').html(htmlstr)
                    form.render()
                }
            }
        })
    }

     // 1. 初始化图片裁剪器 
     var $image = $('#image')  
      // 2. 裁剪选项  
     var options = {    aspectRatio: 400 / 280,    preview: '.img-preview' }   
      // 3. 初始化裁剪区域  
     $image.cropper(options)

    //  绑定选择封面文件的点击事件
    $('#btnChooseImage').on('click',function(){
        // 模拟点击行为
        $('#coverFile').click()
    })

    // 监听文件的change事件，判断用户是否选择了文件
    $('#coverFile').on('change',function(e){
        // 获取选择文件的数组
        var files=e.target.files;
        if(files.length<=0){
            return layer.msg('请选择要上传的图片')
        }
        else{
                // 根据文件，创建对应的 URL 地址
    var newImgURL = URL.createObjectURL(files[0])
    $image
    .cropper('destroy') // 销毁旧的裁剪区域
    .attr('src', newImgURL) // 重新设置图片路径
    .cropper(options) // 重新初始化裁剪区域
    }
    })


    // 定义文章的发布状态
    var art_state='已发布';
    $('#btnSave2').on('click',function(){
        art_state='草稿'
    })

    // 为表单绑定submit事件
    $('#form-pub').on('submit',function(e){
            e.preventDefault();
            // 基于form表单快速创建FormData对象
            var fd= new FormData($(this)[0])
            // 将文章的状态存到fd中
            fd.append('state',art_state)
           // 4. 将封面裁剪过后的图片，输出为一个文件对象
    $image
    .cropper('getCroppedCanvas', {
      // 创建一个 Canvas 画布
      width: 400,
      height: 280
    })
    .toBlob(function(blob) {
      // 将 Canvas 画布上的内容，转化为文件对象
      // 得到文件对象后，进行后续的操作
      // 5. 将文件对象，存储到 fd 中
      fd.append('cover_img', blob)
          // 6. 发起 ajax 数据请求
          publishArticle(fd)

    })

    // 定义发布文章的方法
    function  publishArticle(fd){
        $.ajax({
            method:'POST',
            url:'/my/article/add',
            data:fd,//如果向服务器提交的是FormData数据类型则必须要加入两个选项
            contentType: false,
            processData: false,
            success:function(res){
                if(res.status!==0){
                    return layer.msg('文章发布失败')
                }
                else{
                    alert('文章发布成功')
                    location.href='/article/article_list.html';

                }
            }
        })

    }
})
    

})
