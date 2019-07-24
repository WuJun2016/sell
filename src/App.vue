<template>
	<div id='app'>
		<v-header :seller="seller"></v-header>
		<div class="tab">
			<div class="tab-item">
				<router-link to="/goods">商品</router-link>
			</div>
			<div class="tab-item">
				<router-link to="/ratings">评论</router-link>
			</div>
			<div class="tab-item">
				<router-link to="/seller">商家</router-link>
			</div>
		</div>

		<router-view :seller="seller"></router-view>

	</div>
</template>

<script>
	import header from './components/header/header'
	const ERR_OK = 0;

	export default {
		data() {
			return {
				seller:{}
			}
		},
		created(){
			this.$http.get('/api/seller').then( response => {
				response = response.body;
				if(response.errno === ERR_OK){
					this.seller = Object.assign({}, this.seller, response.data);
				}
			})
		},
		components:{
			'v-header':header
		}
	}
</script>

<style lang="stylus" scoped>
	.tab
		display: flex
		width: 100%
		height: 40px
		line-height: 40px
		position: relative
		&::after
			content: ''
			position: absolute
			bottom: 0
			left: 0
			display: block
			width: 100%
			border-top: 1px solid rgba(7,17,22,0.1)
		.tab-item
			flex: 1
			text-align: center
</style>
