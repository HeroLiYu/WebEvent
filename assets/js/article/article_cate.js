$(function(){
    var layer=layui.layer;
    var form=layui.form;
    initArtCateList()

    // 定义获取文章分类列表 渲染数据需要导入模板引擎
    function initArtCateList(){
        $.ajax({
            method:'GET',
            url:'/my/article/cates',
            success:function(res){
            var htmlstr= template('tpl-list',res)
            $('tbody').html(htmlstr)
            }
        })

    }
    var indexAdd=null
    $('#btnAdd').on('click',function(){
      indexAdd=  layer.open({
            type:1,
            title: '添加文章分类',
            content: $('#dialog-add').html(),
            area:['500px','250px'],
          }); 
    })

    // 实现点击确定添加文件的功能【动态添加大力模式】
    $('body').on('submit','#form-add',function(e){
        e.preventDefault();
        $.ajax({
            method:'POST',
            url:'/my/article/addcates',
            data:$(this).serialize(),
            success:function(res){
                if(res.staus!==0){
                    return layer.msg('新增文章失败')
                  
                }
                else{
                  
                    layer.msg('新增文件成功')
                    initArtCateList()
                    layer.close(indexAdd)
                   
                }
            }
        })


    })

    // 实现编辑/修改按钮的功能
    var indexEdit=-null;
       $('tbody').on('click','#btn-edit',function(){
        //    弹出修改的框
        indexEdit=  layer.open({
            type:1,
            title: '修改文章分类',
            content: $('#dialog-edit').html(),
            area:['500px','250px'],
          }); 
        //   获取要修改的列表的属性
        var id=$(this).attr('data-id')
    //  发起请求获取对应的分类数据
          $.ajax({
              method:'GET',
              url:'/my/article/cates/'+id,
              success:function(res){
                 form.val('form-edit',res.data)
                 
              }

          })
        //   通过代理的方式给“确认修改”监听表单提交的事件
        $('body').on('submit','#form-edit',function(e){
            e.preventDefault();
            $.ajax({
                method:'POST',
                url:'/my/article/updatecate',
                data:$(this).serialize(),
                success:function(res){
                   if(res.staus!==0){
                    return layer.msg('修改数据失败')

                   }
                   else{
                   
                    return layer.msg('修改文件成功')
                    layer.close(indexEdit)
                    initArtCateList()
                  
                      
                   }
                }

            })
        })


        // 删除图书列表分类按钮
        // 给删除按钮绑定点击事件
        var indexDelete=null;
        $('body').on('click','#btn-delete',function(){
            var id=$(this).attr('data-id')
            layer.confirm('确认删除', {icon: 3, title:'提示'}, function(index){
               //发出请求来调用
                $.ajax({
                    method:'GET',
                    url:'/my/article/deletecate/'+id,
                    success:function(res){
                        if(res.status!=0){
                            return layer.msg('删除失败')
                        }
                        else{
                            layer.msg('删除成功')
                            initArtCateList();
                            layer.close(index);
                        }
                    }
                })
                
             
              });

        })
       })
})


