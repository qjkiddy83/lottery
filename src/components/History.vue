<template>
  <div>
    <header class="mui-bar mui-bar-nav"><a href="javascript:;" class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
        <h1 class="mui-title">{{lotteryname}}开奖记录</h1><a href="cur-predict.html" class="mui-btn mui-btn-blue mui-btn-link mui-pull-right">预测</a></header>
    <div id="pullrefresh" class="mui-content mui-scroll-wrapper full-extfooter">
        <div class="mui-scroll">
            <ul class="mui-table-view mui-table-view-striped mui-table-view-condensed">
                <li class="mui-table-view-cell" v-for="li in list">
                    <div class="mui-table">
                        <div class="mui-table-cell mui-col-xs-9">
                            <p class="mui-ellipsis">第{{li.periods}}期</p>
                            <p class="balls"><span class="mball" v-for="ball in li.lotteryFormat[0]">{{ball}}</span><span class="mball blue" v-for="ball in li.lotteryFormat[1]">{{ball}}</span></p>
                        </div>
                        <div class="mui-table-cell mui-col-xs-3 mui-text-right">
                            <span class="mui-h5">{{li.lotterytime}}</span>
                        </div>
                    </div>
                </li>
            </ul>
        </div>
    </div>
    <vfooter active="0"></vfooter>
    </div>
</template>

<script>
import lotterys from '../js/lottery-data';
import mui from '../js/mui/mui.js';
import $ from '../js/zepto.js';
import Vue from 'vue';
import vfooter from './common/vfooter.vue'

var bus = new Vue();

function lotteryFormat(str) {
    var ret = [];
    str.split('|').forEach(function(item, i) {
        ret[i] = item.split(',');
    })
    return ret;
}

function getData(params, callback) {
    $.ajax({
        url: '/lottery/lotterywinning.jsp',
        data: params,
        method: 'POST',
        dataType: 'json',
        success: function(d) {
            callback(d);

        }
    })
}


/**
 * 下拉刷新具体业务实现
 */
function pulldownRefresh() {
    setTimeout(function() {
        var table = document.body.querySelector('.mui-table-view');
        var tpl = '';
        for (var i = 0, len = 5; i < len; i++) {
            tpl += `<li class="mui-table-view-cell">
                <div class="mui-table">
                    <div class="mui-table-cell mui-col-xs-9">
                        <p class="mui-ellipsis">第20170312期</p>
                        <p class="balls"><span class="mball">01</span><span class="mball">01</span><span class="mball">01</span><span class="mball">01</span><span class="mball">01</span><span class="mball">01</span></p>
                    </div>
                    <div class="mui-table-cell mui-col-xs-3 mui-text-right">
                        <span class="mui-h5">2017-12-05</span>
                    </div>
                </div>
            </li>`
        }
        table.innerHTML = tpl;
        mui('#pullrefresh').pullRefresh().endPulldownToRefresh();
    }, 1500);
}
/**
 * 上拉加载具体业务实现
 */
function pullupRefresh() {
    vm.page++;
    getData({
        lotterytype: '0001',
        drawstat: 1,
        page: vm.page,
        pagesize: 20
    },function(d){
        var nomore = false;
        if(d.pagecount <= vm.page){
            nomore = true;
        }
        d.lotterylist.map(function(item) {
            item.lotteryFormat = lotteryFormat(item.lottery)
        }) 
        vm.list = vm.list.concat(d.lotterylist)
        mui('#pullrefresh').pullRefresh().endPullupToRefresh(nomore);
    });
}

export default {
    name: 'index',
    data () {
        return {
            pagecount: 1,
            page: 1,
            lotteryname: this.$route.params.lotteryname,
            list: []
        }
    },
    props : ["lotterytype"],
    components:{"vfooter":vfooter},
    created: function() {
        var _this = this;
        getData({
            lotterytype: this.$route.params.lotterytype,
            drawstat: 1,
            page: 1,
            pagesize: 20
        }, function(d) {
            d.lotterylist.map(function(item) {
                item.lotteryFormat = lotteryFormat(item.lottery)
            })
            _this.list = d.lotterylist;
            _this.pagecount = d.pagecount;
        })

        this.$nextTick(function(){
            mui.init({
                pullRefresh: {
                    container: '#pullrefresh',
                    down: {
                        callback: pulldownRefresh
                    },
                    up: {
                        contentrefresh: '正在加载...',
                        callback: pullupRefresh
                    }
                }
            });
        })
    }
}
</script>
<style lang="scss" scoped>
  @import '../assets/css/history';
</style>