<template>
    <div>
        <header class="mui-bar mui-bar-nav"><h1 class="mui-title">专家本期预测</h1><a class="mui-icon-extra mui-icon-extra-share mui-pull-right"></a></header>
        <lottery-classify v-bind:lotterys="lotterys" v-bind:curLottery="curLottery" @change="changeLtype"></lottery-classify>
        <div class="mui-slider home" id="slider1">
            <div class="mui-slider-group">
                <div class="mui-slider-item" v-for="group in lotterys">
                    <div>
                        <div class="flex-auto">
                            <div class="notice mui-ellipsis">
                                141期头奖1000万中3注，权威专家带您一起中！
                            </div>
                            <div class="mini-classify">
                                <ul>
                                    <li v-for="(item,index) in group.product" v-on:click="changeForecast" v-bind:data-index="index" v-bind:class="group.product[group.curforecast].code==item.code?'active mui-col-xs-3':'mui-col-xs-3'"><span>{{item.name}}</span></li><li v-if="group.product.length>5" class="mui-col-xs-3" node-act="combine"><span>收起 <i class="mui-icon mui-icon-arrowup"></i></span></li>
                                </ul>
                            </div>
                        </div>
                        <div class="scroll-container">
                            <div class="mui-content mui-scroll-wrapper mui-scroll-wrapper-segmented li-praised">
                                <div class="mui-scroll">
                                    <ul class="mui-table-view mui-table-view-striped mui-table-view-condensed">
                                        <li class="mui-table-view-cell" v-for="li in group.product[group.curforecast].list">
                                            <a v-bind:href='"expert.html?expertid="+li.expertsid'>
                                                <img class="mui-media-object mui-pull-left" v-bind:src="li.expertspic">
                                                <div class="mui-media-body">
                                                    <h3><span>{{li.expertsname}}</span><small>{{li.rank}}</small></h3>
                                                    <p class='mui-ellipsis mui-col-xs-10'>{{group.product[group.curforecast].name}}：<span class="color-link">想中大奖，必看该专家的预测号码</span></p>
                                                    <p class='mui-ellipsis'>{{li.expertdesc}}</p>
                                                </div>
                                                <em class="iconfont icon-ioseye"></em>
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <vfooter active="1"></vfooter>
    </div>
</template>

<script>
import lotterys from '../js/lottery-data';
import mui from '../js/mui/mui.js';
import $ from '../js/zepto.js';
import Vue from 'vue';
import lotteryClassify from './common/lottery-classify.vue'
import vfooter from './common/vfooter.vue'
var pullRefreshArr = []

var bus = new Vue();

function combine(list, _this) {
    list.each(function(i) {
        if (i > 6 && !$(this).attr('node-act')) {
            $(this).hide();
            _this.html(`<span>更多 <i class="mui-icon mui-icon-arrowdown"></i></span>`).data('combined', 1)
        }
    })
    _this.closest('.mui-slider-group').find('.li-praised').addClass('combine')
}

function expand(list, _this) {
    list.show();
    _this.html(`<span>收起 <i class="mui-icon mui-icon-arrowup"></i></span>`).data('combined', 0)
    _this.closest('.mui-slider-group').find('.li-praised').removeClass('combine')
}
$(document).on('click', '[node-act="combine"]', function() {
    var _this = $(this);
    if (_this.data('combined')) {
        expand($(this).parent().find('li'), _this)
    } else {
        combine($(this).parent().find('li'), _this)
    }
})

lotterys.map(function(item) { //初始化数据结构
    $.extend(item, {
        periods: '',
        curforecast: 0
    })
    item.product.map(function(_item) {
        _item.pagecount = 1;
        _item.page = 1;
        _item.list = []
    })
})

function getData(params, callback) {
    $.ajax({
        url: '/forecast/forecastlist.jsp',
        data: params,
        dataType: 'json',
        success: function(d) {
            // pullRefreshArr[vm.curLottery].refresh(true)
            // pullRefreshArr[vm.curLottery].scrollTo(0,0);
            callback(d)
        }
    })
}

function lotteryFormat(str) {
    var ret = [];
    str.split('|').forEach(function(item, i) {
        ret[i] = item.split(',');
    })
    return ret;
}

function callbackTpl(lotterys, curLottery, curforecast, load, d) {
    lotterys[curLottery].periods = d.periods;
    d.returnlist.map(function(item) {
        item.lotteryFormat = lotteryFormat(item.periodscon)
    })
    lotterys[curLottery].product[curforecast].pagecount = d.pagecount;
    lotterys[curLottery].product[curforecast].list = load && lotterys[curLottery].product[curforecast].list ? lotterys[curLottery].product[curforecast].list.concat(d.returnlist) : d.returnlist;
}

mui.ready(function() {
    mui('.lottery-classify').scroll({
        scrollY: false, //是否竖向滚动
        scrollX: true
    });
    //循环初始化所有下拉刷新，上拉加载。
    mui.each(document.querySelectorAll('.mui-scroll-wrapper-segmented'), function(index, pullRefreshEl) {
        var oPullRefresh = mui(pullRefreshEl).pullRefresh({
            down: {
                callback: pulldownRefresh
            },
            up: {
                contentrefresh: '正在加载...',
                callback: pullupRefresh
            }
        });

        pullRefreshArr.push(oPullRefresh)

        /**
         * 下拉刷新具体业务实现
         */
        function pulldownRefresh() {
            console.log('pulldown')
            bus.$emit('pulldown',pullRefreshEl)
        }
        /**
         * 上拉加载具体业务实现
         */
        function pullupRefresh() {
          bus.$emit('pullup',pullRefreshEl)
        }
    });
});

export default {
  name: 'curPredict',
  data () {
    return {
      lotterys : lotterys,
      curLottery : 0
    }
  },
  components:{"lottery-classify":lotteryClassify,"vfooter":vfooter},
    methods: {
        changeForecast: function(event) {
            var curforecast = event.currentTarget.dataset.index;
            var curLottery = this.curLottery;
            this.lotterys[this.curLottery].curforecast = curforecast;
            getData({
                forecasttype: this.lotterys[this.curLottery].product[curforecast].code,
                lotterytype: this.lotterys[this.curLottery].code,
                page: 1,
                pagesize: 20
            }, function(d) {
                callbackTpl(this.lotterys, curLottery, curforecast, 0, d)
                pullRefreshArr[curLottery].refresh(true)
            }.bind(this));
        },
        changeLtype: function(event) {
            var dataset = event.target.dataset;
            var curLottery = dataset.index,curforecast = 0;
            this.curLottery = curLottery;
            this.lotterys[curLottery].product[curforecast].page = 1;
            mui(`.mui-slider`).slider().gotoItem(dataset.index);
            getData({
                forecasttype: this.lotterys[curLottery].product[curforecast].code,
                lotterytype: this.lotterys[curLottery].code,
                page: 1,
                pagesize: 20
            }, function(d) {
                callbackTpl(this.lotterys, curLottery, curforecast, 0, d)
            }.bind(this))
        }
    },
    created: function() {
        var curLottery = 0,
            curforecast = 0;
        getData({
            forecasttype: this.lotterys[curLottery].product[curforecast].code,
            lotterytype: this.lotterys[curLottery].code,
            page: 1,
            pagesize: 20
        }, function(d) {
            callbackTpl(this.lotterys, curLottery, curforecast, 0, d)
        }.bind(this))

        this.$nextTick(function(){
            document.querySelector('#slider1').addEventListener('slide', function(event) {
              bus.$emit('slide',event.detail.slideNumber)
            });
        })
    },
    mounted:function(){
      bus.$on('pulldown', function (pullRefreshEl) {//pulldown
        console.log('pulldown------',this)
        var curLottery = this.curLottery;
        var curforecast = this.lotterys[this.curLottery].curforecast;
        var nomore = false;
        this.lotterys[this.curLottery].product[curforecast].page = 1;
        getData({
            forecasttype: this.lotterys[this.curLottery].product[curforecast].code,
            lotterytype: this.lotterys[this.curLottery].code,
            page: this.lotterys[this.curLottery].product[curforecast].page,
            pagesize: 20
        }, function(d) {
            callbackTpl(this.lotterys, curLottery, curforecast, 0, d);
            if (this.lotterys[curLottery].product[curforecast].page >= d.pagecount) {
                nomore = true;
            }
            mui(pullRefreshEl).pullRefresh().endPulldownToRefresh(nomore);
        }.bind(this));
      }.bind(this))

      bus.$on('pullup', function (pullRefreshEl) {//pullup
        var curLottery = this.curLottery;
        var curforecast = this.lotterys[this.curLottery].curforecast;
        var nomore = false;
        if (this.lotterys[this.curLottery].product[curforecast].page >= this.lotterys[this.curLottery].product[curforecast].pagecount) {
            nomore = true;
            mui(pullRefreshEl).pullRefresh().endPullupToRefresh(nomore);
            return;
        }
        this.lotterys[this.curLottery].product[curforecast].page++;
        getData({
            forecasttype: this.lotterys[this.curLottery].product[curforecast].code,
            lotterytype: this.lotterys[this.curLottery].code,
            page: this.lotterys[this.curLottery].product[curforecast].page,
            pagesize: 20
        }, (d)=> {
            callbackTpl(this.lotterys, curLottery, curforecast, 1, d);
            if (this.lotterys[curLottery].product[curforecast].page >= d.pagecount) {
                nomore = true;
            }
            mui(pullRefreshEl).pullRefresh().endPullupToRefresh(nomore);
        });
      }.bind(this))

      bus.$on('slide',function(slideNumber){//slide
        var curLottery = slideNumber,curforecast = 0;
        this.curLottery = slideNumber;
        this.lotterys[curLottery].product[curforecast].page = 1;
        getData({
            forecasttype: this.lotterys[curLottery].product[curforecast].code,
            lotterytype: this.lotterys[curLottery].code,
            page: 1,
            pagesize: 20
        }, (d)=>{
            callbackTpl(this.lotterys, curLottery, curforecast, 0, d)
        })
      }.bind(this))
    }
}
</script>

<style lang="scss" scoped>
  @import '../assets/css/cur-predict';
</style>