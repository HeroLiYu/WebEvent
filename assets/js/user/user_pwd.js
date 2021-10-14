$(function(){
    // 为重置密码页面添加校验规则
    var form =layui.form;
    var layer=layui.layer;
    form.verify({
        pwd:[
            /^[\S]{6,12}$/
            ,'密码必须6到12位，且不能出现空格'
          ],
          repwd:function(value){
              var oldpwd=$('.layui-input-block [name=pwd]').val()
              var newpwd=$('.layui-input-block [name=newPwd]').val()
              if(value===oldpwd){
                return '新密码与原密码一致，请重新修改'
              }
              if(value!==newpwd){
             return '两次输入的密码不一样，请重新输入'
              }
          }
    })

    // 实现重置密码的功能:点击重置后，内容全部为空

    // 监听表单的提交事件
    $('.layui-form').on('submit',function(e){
      e.preventDefault();
      $.ajax({
        method:'POST',
        url:'http://api-breakingnews-web.itheima.net/my/updatepwd',
        Headers:{ Authorization:localStorage.getItem('token')||""},
        data:$(this).serialize(),
        contentType : false,
        processData : false,
        success:function(res){
          if(res.status!==0){
            layui.layer.msg('更新密码成功')
            // 实现重置密码的功能:点击重置后，内容全部为空
            $('.layui-form')[0].reset()
          }
          else{
            layui.layer.msg('更新密码失败')
            
          }
        }

      })
    })
    // 这里的重置密码的代码有问题 
  
})