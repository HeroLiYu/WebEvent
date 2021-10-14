$(function(){
    var form=layui.form;
    form.verify({
        nickname:function(value){
            if(value.length>6){
                return alert('昵称必须要在1~6位之间')
            }
        }
    })

    initUserInfo()
    // 初始化用户的基本信息函数
function initUserInfo(){
    $.ajax({
        method:'GET',
        url:'/my/userinfo',
        success:function(res){
            if(res.status!==0){
                return layer.msg('初始化用户信息失败')
            }
            else{
                console.log(res);
                form.val('formUserInfo',res.data)
            }
        }
    })
}


        // 实现重置功能
        $('#btnReset').on('click',function(e){
            e.preventDefault();
            // 将用户最原始的信息重置回来只需要调用init函数即可
            initUserInfo()

        }
        )

        // 监听表单的提交事件
        $('.layui-form').on('submit',function(e){
            // 阻止表单的默认提交行为
            e.preventDefault();
            var data={id:$('layui-form [name=id]'),nickname:$('layui-form [name=nickname]'),
            email:$('layui-form [name=email]')}
            // 发起Ajax数据请求
            $.ajax({
                method:'POSt',
                url:'/my/userinfo',
                data:data,
                contentType : false,
                processData : false,
                success:function(res){
                    if(res.status!==0){
                        return layer.msg('修改用户信息失败')
                    }
                    else{
                        return layer.msg('更新用户信息成功')
                        window.parent.getUserinfo()
                    }
                    
                }
            })
        })


       
})

