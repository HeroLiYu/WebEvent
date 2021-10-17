$(function(){
    $('#redBox').on('click',function(){
        $('.loginBox').hide()
        $('.redBox').show()
    })
    $('#link_login').on('click',function(){
        $('.loginBox').show()
        $('.redBox').hide()
    })
      // 自定义校验规则 从layui中获取form对象
     var form=layui.form;
     var layer=layui.layer;
     form.verify({
         pwd:[
            /^[\S]{6,12}$/
            ,'密码必须6到12位，且不能出现空格'
          ],
                  //   注册确认密码两次密码应该一致
        // 需要拿到密码框的内容和校验密码框的内容然后进行比较
        repwd:function(value){
            var pwd=$('.redBox [name=pwd]').val()
            if(value!=pwd){
                return '两次输入密码不一样'
            }
        }
     })


         // 对接注册页面的接口
         $('#form_reg').on('submit',function(e){
            e.preventDefault();
            var data={username:$('.redBox [name=username]').val(),password:$('.redBox [name=pwd]').val()};
           $.post('/api/reguser',data,
            function(res){
                if(res.status!==0){
                 layer.msg(res.message,{icon:5})

                }
                else{
                    layer.msg('注册成功,请登录', {icon: 6}); 
                    // 模拟人的点击操作自动跳转到登录页面
                    $('.links').click();
                }
            }
           )
        })
        // 监听登录页面的接口
        $('#form_login').on('submit',function(e){
            e.preventDefault();
            var data={username:$('.loginBox [name=username]').val(),password:$('.loginBox [name=pwd]').val()};
            $.ajax({
                method:'post',
                url:'/api/login',
                data:data,
                success:function(res){
                    if(res.status!==0){
                        layer.msg(res.message,{icon:5})
                    }
                    else{
                        layer.msg('恭喜登陆成功', {icon: 6}); 
                        // 登陆成功之后将token值存储到localStorage中
                        localStorage.setItem('token',res.token)
                        // 登录成功后要要跳转到后台主页
                        location.href='/index.html'
                    }
                }
            })
        })
})