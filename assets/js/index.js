$(function(){
// 调用获取用户信息的函数
    getUserinfo()
    var layer=layui.layer;
    // 给退出按钮绑定点击事件
    $('#LogoOut').on('click',function(){
        layer.confirm('确定退出登陆吗?', {icon: 3, title:'提示'}, function(index){
        //    清空本地的token
        localStorage.removeItem('token')
        //    跳转到登录页面
        location.href='/login.html'
        lay1.close(index);
          });
    })
})

// 获取用户信息的函数
function getUserinfo(){
    $.ajax({
        method:'GET',
        url:'/my/userinfo',
        processData: false, 
        success:function(res){
           if(res.status!==0){
            layer.msg('获取用户信息失败',{icon:5})
           }
           else{
            //    调用渲染用户投降的函数
            renderAvatar(res.data)
           }
        },
        // 无论成功还是失败都会调用complete函数
    })
}

// 渲染用户的头像的函数
function renderAvatar(user){
    // 获取用户名称
    var name=user.nickname||user.username;
    // 设置欢迎的文本
    $('.welcome').html('欢迎&nbsp;&nbsp;'+name)
    // 按需渲染
    if(user.user_pic!=null){
        // 渲染图片头像
        $('.layui-nav-img').attr('src',user.user_pic).show()
        $('.text-avatar').hide();
    }
    else{
        // 渲染文本头像
        $('.layui-nav-img').hide();
        var first=name[0].toUpperCase();
        $('.text-avatar').html(first).show()
    }
}