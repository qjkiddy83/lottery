<template>
  <div>
    <header class="mui-bar mui-bar-nav">
        <h1 class="mui-title">专家上期预测中</h1>
        <a href="activities.html" class="mui-pull-right icon-text">
            <span class="mui-icon iconfont icon-huodong"></span>
            <span class="mui-tab-label">活动</span>
        </a>
    </header>
    <lottery-classify v-bind:lotterys="lotterys" v-bind:curLottery="curLottery" @change="changeLtype"></lottery-classify>
    <div class="mui-slider home" id="slider1">
        <div class="mui-slider-group">
            <div class="mui-slider-item" v-for="group in lotterys">
                <div>
                    <div class="flex-auto">
                        <a v-bind:href='"history.html?code="+group.code+"&name="+group.name' class="res-board mui-navigate-right">
                            <h3>第{{group.periods}}期开奖结果</h3>
                            <ol>
                                <li class="ball" v-for="ball in group.lotteryFormat[0]">{{ball}}</li>
                                <li class="ball blue" v-for="ball in group.lotteryFormat[1]">{{ball}}</li>
                            </ol>
                        </a>
                        <div class="notice mui-ellipsis">
                            <span class="iconfont icon-message"></span>喜！141期头奖1000万中3注，权威专家带您一起中！
                        </div>
                        <div class="mini-classify">
                            <ul>
                                <li v-for="(item,index) in group.product" v-on:click="changeForecast" v-bind:data-index="index" v-bind:class="group.product[group.curforecast].code==item.code?'active mui-col-xs-3':'mui-col-xs-3'"><span>{{item.name}}</span></li><li v-if="group.product.length>5" class="mui-col-xs-3" node-act="combine"><span>收起 <i class="mui-icon mui-icon-arrowup"></i></span></li>
                            </ul>
                        </div>
                    </div>
                    <div class="scroll-container">
                        <div>
                            <div class="mui-content mui-scroll-wrapper mui-scroll-wrapper-segmented li-praised">
                                <div class="mui-scroll">
                                    <ul class="mui-table-view mui-table-view-striped mui-table-view-condensed">
                                        <li class="mui-table-view-cell" v-for="li in group.product[group.curforecast].list">
                                            <a v-bind:href='"expert.html?expertid="+li.expertsid'>
                                                <img class="mui-media-object mui-pull-left" v-bind:src="li.expertspic">
                                                <div class="mui-media-body">
                                                    <h3><span>{{li.expertsname}}</span><small>{{li.rank}}</small></h3>
                                                    <div class="balls">后区定六 <p class="mui-inline mui-col-xs-8 mui-col-ms-9"><span class="mball" v-if="ball" v-for="ball in li.lotteryFormat[0]">{{ball}}</span><span class="mball blue" v-if="ball" v-for="ball in li.lotteryFormat[1]">{{ball}}</span></p></div>
                                                    <p class='mui-ellipsis'>{{li.expertdesc}}</p>
                                                </div>
                                                <em>{{li.forecastresult}}</em>
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
    </div>
    <vfooter active="0"></vfooter>
    </div>
</template>

<script>
import lotterys from '../js/lottery-data';
import mui from '../js/mui/mui.js';
import $ from '../js/zepto.js';
import Vue from 'vue';
import lotteryClassify from './common/lottery-classify.vue'
import vfooter from './common/vfooter.vue'

var bus = new Vue();


function callbackTpl(lotterys, curLottery, curforecast, load, d) {
    if(d.statuscode != '1'){
        return;
    }
    lotterys[curLottery].periods = d.periods;
    lotterys[curLottery].lotteryFormat = lotteryFormat(d.lottery);
    d.returnlist.map(function(item) {
        item.lotteryFormat = lotteryFormat(item.periodscon)
    })
    lotterys[curLottery].product[curforecast].pagecount = d.pagecount;
    lotterys[curLottery].product[curforecast].list = load && lotterys[curLottery].product[curforecast].list ? lotterys[curLottery].product[curforecast].list.concat(d.returnlist) : d.returnlist;
}

function lotteryFormat(str) {
    var ret = [];
    str.split('|').forEach(function(item, i) {
        ret[i] = item.split(',');
    })
    return ret;
}

function getData(params, callback) {
    $.ajax({
        url: '/forecast/forecastprivlist.jsp',
        data: params,
        dataType: 'json',
        success: function(d) {
            callback(d)
        }
    })
}
lotterys.map(function(item) { //初始化数据结构
    $.extend(item, {
        lotteryFormat: [
            [],
            []
        ],
        periods: '',
        curforecast: 0
    })
    item.product.map(function(_item) {
        _item.pagecount = 1;
        _item.page = 1;
    })
})

var pullRefreshArr = []
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
          bus.$emit('pulldown',pullRefreshEl)
        }
        /**
         * 上拉加载具体业务实现
         */
        function pullupRefresh() {
          bus.$emit('pullup',pullRefreshEl)
        }
    });
    document.querySelector('#slider1').addEventListener('slide', function(event) {
      bus.$emit('slide',event.detail.slideNumber)
    });
});

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

export default {
  name: 'index',
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
                pullRefreshArr[curLottery].scrollTo(0,0)
            }.bind(this));
        },
        changeLtype: function(index) {
            var curLottery = index,curforecast = 0;
            this.curLottery = curLottery;
            this.lotterys[curLottery].product[curforecast].page = 1;
            mui(`.mui-slider`).slider().gotoItem(index);
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
    mounted:function(){
      bus.$on('pulldown', function (pullRefreshEl) {//pulldown
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
    }
}
</script>

<style lang="scss">
  @import '../assets/css/mui.css';
  @import '../assets/css/base';
</style>
<style lang="scss" scoped>
  @import '../assets/css/index';
</style>