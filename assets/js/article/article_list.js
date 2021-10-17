$(function(){
    var layer=layui.layer
    var form = layui.form
    var laypage = layui.laypage;
    // 定义参数
    var q = {
        pagenum: 1, // 页码值，默认请求第一页的数据
        pagesize: 2, // 每页显示几条数据，默认每页显示2条
        cate_id: '', // 文章分类的 Id
        state: '' // 文章的发布状态
      }
       

    initArticleCate()
    initTable()
    // 定义美化时间的过滤器
    template.defaults.imports.dateFormat=function(date){
        const dt=new Date(date);

        var y=addZero(dt.getFullYear())
        var m=addZero(dt.getMonth()+1)
        var d=addZero(dt.getDay())

        var h=addZero(dt.getHours())
        var min=addZero(dt.getMinutes());
        var sec=addZero(dt.getSeconds());

        return y+'-'+'m'+'-'+d+'  '+h+':'+min+':'+sec


    }

    // 定义补零的函数
    function addZero(n){
      return  n>9?n:'0'+n
    }
  
    // 获取文章的列表数据函数
    function initTable(){
        $.ajax({
            method:'GET',
            url:'/my/article/list',
            data:q,
            success:function(res){
                if(res.status!==0){
                    return layui.layer.msg('获取文章列表失败')
                }
                else{
                    // 使用模板引擎渲染数据
                  var htmlstr= template('tpl-List',res)
                  $('tbody').html(htmlstr)
                  form.render()
                //   调用渲染分页的函数方法
                  renderPage(res.total)
                }
            }
        })
    }
    // 通过ajax动态获取文章分类
    function initArticleCate(){
        $.ajax({
            method:'GET',
            url:'/my/article/cates',
            success:function(res){
                if(res.status!==0){
                    return layui.layer.msg('获取文章分类失败')
                }
                else{
                    // 调用模板引擎渲染数据
                    var htmlstr=template('tpl-cate',res)
                    $('[name=cate_id]').html(htmlstr)
                    form.render()
                }
            }
        })
    }
    // 实现筛选功能
    // 1.给筛选的按钮添加提交事件
    // 2.获取两个div中的值
    // 3.将div中的值填充到q中
    // 4.最后调用initTable
    $('#btnChoose').on('sumbit',function(e){
        e.preventDefault();
        var cate_id=$('[name=cate_id]').val();
        var state=$('[name=state]').val();
    // 为查询参数对象 q 中对应的属性赋值
         q.cate_id = cate_id;
         q.state = state;
    //   重新渲染数据
    initTable();
        
    })
    // 分页渲染函数的方法
    function renderPage(total){
        laypage.render({
            elem: 'pageBox' //注意，这里的 test1 是 ID，不用加 # 号
            ,count: total , //数据总数，从服务端得到
            limit:q.pagesize,
            curr:q.pagenum,
            layout:['count','prev','limit','page','next','skip'],
            // 重新调用limits来指定我们每次显示页面的条数
            limits:[2,3,4,5],
            jump:function(obj,first){
                // console.log(obj.curr);
                // 将最新的页码值赋值给q中的pagenum
                q.pagenum=obj.curr;
                q.pagesize=obj.limit;
                // 根据最新的数据来渲染页码值中的内容===发送死循环
                if(!first){
                    initTable()
                  }
                


            }
          });

    }
//  实现文章的编辑功能
// 1.首先给编辑按钮绑定事件2.点击后跳转到文章发布页面3.将里面的值进行填冲
$('body').on('click','#btns-edit',function(){
    // 获取点击编辑按钮的数据
    var fd= new FormData($(this)[2])
    location.href='/article/article_pub.html'

    $.ajax({
        method:'POST',
        url:'/my/article/edit',
        data:$(this).serialize(),
        contentType: false,
        processData: false,
        success:function(res){
            if(res.status!==0){
                return layer.msg('文章修改失败')
            }
            else{
                alert('文章修改成功')
            }

        }
    })
})

    // 实现删除文章的功能
    // 1.给删除按钮动态添加代理点击事件，
    // 2.点击后弹出询问的提示框，点击取消则不需要执行任何操作
    //   点击确定则可删除对应的文章
    // 3.发起ajax请求
    $('body').on('click','#btn-delete',function(){
        // 弹出询问用户是否要删除的弹框
        var id=$(this).attr('data-id')
        // 获取文章列表中删除按钮的个数【删除按钮的个数就相当于
        // 页面中文章数据的个数】
        var len=$('#btn-delete').length;
        layer.confirm('确认删除', {icon: 3, title:'提示'}, function(index){
           $.ajax({
               method:'GET',
               url:'/my/article/delete/'+id,
               success:function(res){
                   if(res.status!=0){
                       return layer.msg('删除文章失败')
                   }
                   else{
                       layer.msg('文章删除成功')
                    //    需要进行判断，当当前页码值没有数据了然后将
                    //    页码值进行-1操作之后再初始化表格中的数据
                    // ①当len等于1 时，点击删除后就没有数据了，此时需要页码值减一
                    // ②还要判断页码值是否为1，如果页码值为1就不可以在进行减一操作了

                    if(len==1){
                       q.pagenum=q.pagenum==1?1:q.pagenum-1
                        
                    }
                       initTable()
                   }
               }
           })
            
            layer.close(index);
          })
    })
})