$.ajaxPrefilter(function(options){
    console.log(options.url);
    options.url='http://api-breakingnews-web.itheima.net'+options.url;
    console.log(options.url);


    // 统一为有权限的接口设置headers请求头
    if(options.url.indexOf('/my/')!=-1){
    options.headers={
        Authorization:localStorage.getItem('token')||""
    }
}


// 优化用户控制权限代码
options.complete=function(res){
    if(res.responseJSON.status == 1 && res.responseJSON.message == '身份认证失败！'){
        //    清空本地的token
          localStorage.removeItem('token')
          //    跳转到登录页面
             location.href='/login.html'
         }
}
})