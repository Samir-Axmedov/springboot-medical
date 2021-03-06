var order_data_7,order_data_30,order_data_month;

function init_order_data(flag,ctx) {
    $.ajax({
        type: "POST",
        url: config.base_url + "stat/order",
        data: {
            'token':checktoken(),
            'flag':flag
        },
        success: function (res) {
            if(res.succ == 1){
                if (flag == 1)
                    order_data_7 = res.data;
                else if (flag == 2)
                    order_data_30 = res.data;
                //默认加载新订单数据
                $("#new_orders").text(res.data[res.data.length-1].new_orders);
                $("#paid_orders").text(res.data[res.data.length-1].paid_orders);
                $("#cancel_orders").text(res.data[res.data.length-1].cancel_orders);
                $("#complaint_orders").text(res.data[res.data.length-1].complaint_orders);
                process_order_data(res.data,ctx,1);
            }

            else {
                //todo:error
            }
        }
    });
}

function month_order_data(ctx) {
    $('#stat_order_table').bootstrapTable({

        method:"GET",
        dataType:'json',
        pagination:true,
        onLoadSuccess: function(){  //加载成功时执行
            return "加载成功";
        },
        onLoadError: function(){  //加载失败时执行
            return "加载数据失败";
        },
        striped:true,

        columns: [
            {
                field: 'date',
                title: '月份',
                sortable : true
            },
            {
                field: 'new_orders',
                title: '新增订单'
            },
            {
                field: 'paid_orders',
                title: '支付订单'
            },
            {
                field: 'cancel_orders',
                title: '取消订单'
            },
            {
                field: 'complaint_orders',
                title: '投诉订单'
            }
        ]
    });
    $.ajax({
        type: "POST",
        url: config.base_url + "stat/order",
        data: {
            'token':checktoken(),
            'flag':3
        },
        success: function (res) {
            if(res.succ == 1){
                $('#stat_order_table').bootstrapTable('load',res.data);
                order_data_month = res.data;
                process_order_data(res.data,ctx,1);
            }

            else {
                //todo:error
            }
        }
    });

}

function switch_data(flag) {
    clear_order_canvas();
    var ctx1 = document.getElementById("chart_7").getContext("2d");
    var ctx2 = document.getElementById("chart_30").getContext("2d");
    var ctx3 = document.getElementById("chart_month").getContext("2d");
    process_order_data(order_data_7,ctx1,flag);
    process_order_data(order_data_30,ctx2,flag);
    process_order_data(order_data_month,ctx3,flag);
}

function process_order_data(data,ctx,flag) {
    var date = [];
    var count = [];
    if (flag == 1){
        for (var i=0;i<data.length;i++){
            date.push(data[i].date);
            count.push(data[i].new_orders);
        }
        init_order_chart(date,count,ctx,'rgb(151, 217, 234)');
    }
    else if (flag == 2){
        for (var i=0;i<data.length;i++){
            date.push(data[i].date);
            count.push(data[i].paid_orders);
        }
        init_order_chart(date,count,ctx,'rgb(244, 177, 98)');
    }
    else if (flag == 3){
        for (var i=0;i<data.length;i++){
            date.push(data[i].date);
            count.push(data[i].cancel_orders);
        }
        init_order_chart(date,count,ctx,'rgb(133, 211, 152)');
    }
    else if (flag == 4){
        for (var i=0;i<data.length;i++){
            date.push(data[i].date);
            count.push(data[i].complaint_orders);
        }
        init_order_chart(date,count,ctx,'rgb(246, 132, 132)');
    }
}

function init_order_chart(labels,data,ctx,color) {
    var chart = new Chart(ctx, {
        // The type of chart we want to create
        type: 'line',
        // The data for our dataset
        data: {
            labels: labels,
            datasets: [{
                backgroundColor: 'rgb(255, 255, 255)',//绘制双曲线的时候最好使用rgba,要不不透明的白色背景可以使得某些线条绘制不出来
                // borderColor: 'rgb(153, 217, 234)',
                borderColor: color,
                data: data
            }]
        },
        // 配置文件
        options: {
            //标题设置
            title:{
                display:true,
                text:'',
            },
            //禁用动画
            animation:{
                duration:0,
            },
            hover:{
                animationDuration:0,
            },
            // responsive: false,
            responsiveAnimationDuration: 0,
            //提示功能
            tooltips:{
                enable:false
            },
            //顶部的文字提示
            legend:{
                display:false,
            },
            //设置x,y轴网格线显示,标题等
            scales :{
                xAxes:[{
                    //轴标题
                    scaleLabel:{
                        display:true,
                        labelString:'日期',
                        fontColor:'#666'
                    },
                    //网格显示
                    gridLines:{
                        display:false
                    }


                }],
                yAxes:[{
                    scaleLabel:{
                        display:true,
                        labelString:'订单数量'
                    },
                    gridLines:{
                        display:false
                    },

                }],

            },

            //禁用赛尔曲线
            elements: {
                line: {
                    tension: 0,
                }
            }

        }
    });
}

function clear_order_canvas() {
    $('#chart_7').remove();
    $('#container_7').append('<canvas id="chart_7"></canvas>');
    $('#chart_30').remove();
    $('#container_30').append('<canvas id="chart_30"></canvas>');
    $('#chart_month').remove();
    $('#container_month').append('<canvas id="chart_month"></canvas>');
}