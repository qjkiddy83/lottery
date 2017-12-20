<template>
	<section class="lottery-classify mui-scroll-wrapper mui-slider-indicatorcode mui-segmented-control mui-segmented-control-inverted">
        <div class="mui-scroll">
            <ul>
                <li v-for="(item,index) in lotterys" v-bind:data-code="item.code" v-bind:data-index="index" v-bind:class="index==curLottery?'active':''" v-on:click="change">
                    {{ item.name }}
                </li>
            </ul>
        </div>
    </section>
</template>
<script type="text/javascript">
	export default {
		name : 'lottery-classify',
		props : ["lotterys","curLottery"],
		methods : {
			change(event){
				this.$emit('change',event.target.dataset.index)
			}
		}
	}
</script>