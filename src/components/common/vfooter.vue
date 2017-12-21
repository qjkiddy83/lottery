<template>
	<nav class="mui-bar mui-bar-tab">
		<router-link to="/" v-bind:class='active==0?"mui-tab-item mui-active":"mui-tab-item"'>
	        <span class="mui-icon mui-icon-extra mui-icon-extra-heart-filled"></span>
	        <span class="mui-tab-label">上期测中</span>
	    </router-link>
	    <router-link to="curPredict" v-bind:class='active==1?"mui-tab-item mui-active":"mui-tab-item"'>
	        <span class="mui-icon iconfont icon-gupiao-copy"></span>
	        <span class="mui-tab-label">本期预测</span>
	    </router-link>
	    <a class="mui-tab-item" href="guess.html">
	        <span class="mui-icon iconfont icon-yin-yang"></span>
	        <span class="mui-tab-label">字诗图猜</span>
	    </a>
	    <a class="mui-tab-item" href="news.html">
	        <span class="mui-icon iconfont icon-news"></span>
	        <span class="mui-tab-label">彩票资讯</span>
	    </a>
	    <a class="mui-tab-item" href="my.html">
	        <span class="mui-icon mui-icon-extra mui-icon-extra-people"></span>
	        <span class="mui-tab-label">我的</span>
	    </a>
	</nav> 
</template>
<script type="text/javascript">
	export default {
		name : 'vfooter',
		props : ["active"]
	}
</script>