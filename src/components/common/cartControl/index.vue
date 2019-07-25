<template>
	<div class="cart-control">
		<transition name="move">
			<div
				class="cart-dec"
				@click="decCart($event)" v-show="food.count> 0"
			>
					<span class="inner icon-remove_circle_outline"></span>
			</div>
		</transition>
		<div class="num" v-show="food.count > 0">{{food.count}}</div>
		<div class="cart-add icon-add_circle" @click.stop.prevent="addCart($event)"></div>
	</div>
</template>
<script>
	import Vue from 'vue'
	import Bus from '../../../common/js/eventBus';

	export default {
		props: {
			food: {
				type: Object
			}
		},
		methods: {
			addCart(event) {

				if(!event._constructed) {
					return;
				}
				if(!this.food.count){
					Vue.set(this.food, 'count', 1)
				} else {
					this.food.count++
				}
				Bus.$emit('cart.add', event.target);
			},
			decCart(event) {
				if(!event._constructed) {
					return;
				}
				this.food.count--
			},
		},
	}
</script>
<style lang="stylus" scoped>
	.cart-control
		display flex
		.cart-dec
			width 24px
			height 24px
			border-radius 50%
			.inner
				font-size 24px
				line-height 24px
				text-align center
				color rgb(0, 160, 220)
			&.move-enter-active, &.move-leave-active
				transition: all .5s;
				transform: translate3d(0, 0, 0);
				.inner
					transition: all .5s;
					transform: rotate(0deg);
			&.move-enter, &.move-leave-active
				opacity: 0;
				transform: translate3d(24px, 0, 0);
				.inner
					transform: rotate(180deg);


		.cart-add
			font-size 24px
			line-height 24px
			text-align center
			color rgb(0, 160, 220)
		.num
			width 24px
			line-height 24px
			text-align center
			color rgb(147,153,159)
			font-size 10px


</style>

