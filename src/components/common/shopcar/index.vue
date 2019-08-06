<template>
	<div>
		<div class="shopcar">
			<div class="content" @click="toggleList">
				<div class="content-left">
					<div class="logo-wrapper">
						<div class="logo" :class="{highlight: totalCount > 0}">
							<span class="icon-shopping_cart icon"></span>
						</div>
						<div class="totalCount" v-show="totalCount > 0">{{totalCount}}</div>
					</div>
					<div class="price" :class="{highlight: totalCount > 0}">¥ {{totalPrice}}</div>
					<div class="desc" >另需配送费 ¥ {{deliveryPrice}}元</div>
				</div>
				<div class="content-right" @click.stop.prevent="pay()">
					<div class="pay" :class="{'not-enough': totalPrice < minPrice, 'enough': totalPrice > minPrice}">
						{{ payDesc }}
					</div>
				</div>
			</div>
			<div class="ball-container">
				<transition-group tag="p" name="drop" @before-enter="beforeEnter" @enter="enter" @after-enter="afterEnter">
					<div v-for="ball,key in balls" :key="ball.key" v-show="ball.show" class="ball">
						<div class="inner inner-hook"></div>
					</div>
				</transition-group>
			</div>
			<transition name="fold">
				<div class="shopcart-list" v-show="listShow">
					<div class="list-header">
						<h1 class="title">购物车</h1>
						<span class="empty" @click="empty">清空</span>
					</div>
					<div class="list-content" ref="listContent">
						<ul>
							<li class="food" v-for="food in selectFood">
								<span class="name">{{food.name}}</span>
								<div class="price">
									<span>¥ {{food.price * food.count}}</span>
								</div>
								<div class="cartcontrol-wrapper">
									<v-cart-control :food="food"></v-cart-control>
								</div>
							</li>
						</ul>
					</div>
				</div>
			</transition>
		</div>
		<transition name="fade">
			<div class="list-mask" v-show="listShow" @click="hideList"></div>
		</transition>
	</div>
</template>
<script>
	import CartControl from '../cartControl'
	import BScroll from 'better-scroll'
	export default {

		props: {
			deliveryPrice: {
				type: Number,
				default: 0
			},
			minPrice: {
				type: Number,
				default: 0
			},
			selectFood: {
				type: Array,
				default: function(){
					return []
				}
			}
		},
		created() {
		},
		data() {
			return {
				balls: [
					{
						key: 1,
						show: false
					}, {
						key: 2,
						show: false
					}, {
						key: 3,
						show: false
					}, {
						key: 4,
						show: false
					}, {
						key: 5,
						show: false
					}
				],
				dropBalls: [],
				fold: false
			}
		},
		computed: {
			totalPrice() {
				let total = 0;
				this.selectFood.forEach(food => {
					total += food.price * food.count
				})
				return total
			},
			totalCount() {
				let totalCount = 0;
				this.selectFood.forEach(food => {
					totalCount += food.count
				})
				return totalCount
			},
			payDesc() {
				if(this.totalPrice === 0) {
					return `¥${this.minPrice}元起送`
				} else if(this.totalPrice < this.minPrice) {
					let diff = this.minPrice - this.totalPrice;
					return `还差¥${diff}元起送`
				} else{
					return '去结算'
				}
			},
			listShow() {
				if (!this.totalCount) {
					this.fold = true;
					return false;
				}
				let show = !this.fold;
				if (show) {
					this.$nextTick(() => {
						if (!this.scroll) {
							this.scroll = new BScroll(this.$refs.listContent, {
									click: true
							});
						} else {
							// 重新计算better-scroll高度
							this.scroll.refresh();
						}
					});
				}
				return show
			}
		},
		methods: {
			drop(el) {
				for (let i = 0; i < this.balls.length; i++) {
					let ball = this.balls[i];
					if (!ball.show) {
						ball.show = true;
						// 保存el
						ball.el = el;
						this.dropBalls.push(ball);
						return;
					}
				}
			},
			beforeEnter(el) {
				let count = this.balls.length;
				while (count--) {
					let ball = this.balls[count];
					if (ball.show) {
						// getBoundingClientRect 这个方法返回一个矩形对象，包含四个属性：left、top、right和bottom
						let rect = ball.el.getBoundingClientRect();
						let x = rect.left - 32;
						let y = -(window.innerHeight - rect.top - 22);

						el.style.display = '';

						el.style.webkitTransform = `translate3d(0, ${y}px, 0)`;
						el.style.transform = `translate3d(0, ${y}px, 0)`;

						let inner = el.getElementsByClassName('inner-hook')[0];
						inner.style.webkitTransform = `translate3d(${x}px, 0, 0)`;
						inner.style.transform = `translate3d(${x}px, 0, 0)`;
					}
				}
			},
			enter(el) {
				/* 触发浏览器重绘 */
				let rf = el.offsetHeight;

				this.$nextTick(() => {
					el.style.webkitTransform = 'translate3d(0, 0, 0)';
					el.style.transform = 'translate3d(0, 0, 0)';

					let inner = el.getElementsByClassName('inner-hook')[0];
					inner.style.webkitTransform = 'translate3d(0, 0, 0)';
					inner.style.transform = 'translate3d(0, 0, 0)';
				});
			},
			afterEnter(el) {
				let ball = this.dropBalls.shift();
				if (ball) {
					ball.show = false;
					el.style.display = 'none';
				}
			},
			toggleList() {
				if(!this.totalCount) {
					return;
				}
				this.fold = !this.fold
			},
			empty() {
				this.selectFood.forEach((food) => {
					food.count = 0
				});
			},
			hideList() {
				this.fold = true
			},
			pay() {
				if(this.totalPrice < this.minPrice){
					return;
				}
				window.alert(`支付${this.totalPrice}元`);
			}
		},
		components: {
			'v-cart-control': CartControl
		}
	}
</script>
<style lang="stylus" scoped>
	@import '../../../common/stylus/_mixin.styl'

	.shopcar
		position fixed
		left 0
		bottom 0px
		width 100%
		height 48px
		z-index 50
		background rgb(20,29,39)
		.content
			display flex
			background #141727
			height 100%
			.content-left
				flex 1
				display flex
				align-items center
				.logo-wrapper
					box-sizing border-box
					position relative
					top -10px
					margin 0 12px
					padding 6px
					width 56px
					height 56px
					border-radius 50%
					background #141727
					.logo
						background #2b343c
						width 44px
						height 44px
						border-radius 50%
						text-align center
						cursor pointer
						&.highlight
							background rgb(0,160,220)
						.icon
							display inline-block
							color rgba(255,255,255,0.4)
							text-align center
							line-height 44px
							font-size 24px
					.totalCount
						position absolute
						top 0
						right 0
						width 24px
						height 16px
						line-height 16px
						text-align center
						border-radius 16px
						font-size 9px
						background rgb(240,20,20)
						box-shadow 0 4px 8px rgba(0,0,0,0.4)
						color #fff

				.price
					font-size 16px
					line-height 24px
					font-weight 700
					padding-right 12px
					color #919396
					border-right 1px solid
					&.highlight
						color #fff
				.desc
					margin-left 12px
					font-weight 500
					font-size 12px
					line-height 24px
					color #919396



			.content-right
				flex 0 0 105px
				width 105px
				background rgb(43,51,59)
				.pay
					height 48px
					line-height 48px
					text-align center
					font-size 12px
					color rgba(255,255,255,0.4)
					font-weight 700
					&.not-enougth
						background #2b333b
					&.enough
						background #00b43c
						color #fff
		.ball-container
			.ball
				position fixed
				left 32px
				bottom 22px
				z-index 200
				.inner
					width: 16px;
					height: 16px;
					border-radius: 50%;
					background: rgb(0, 160, 220);
				&.drop-enter-active
					transition: all .4s cubic-bezier(.49, -0.29, .75, .41);
					.inner
						transition all 0.4s
		.shopcart-list
			position absolute
			top  0
			left 0
			z-index -1
			width 100%
			transform: translate3d(0, -100%, 0)
			&.fold-enter-active, &.fold-leave-active
				transition all .5s
				transform translate3d(0, -100%, 0)
			&.fold-enter, &.fold-leave-active
				transform translate3d(0, 0, 0)
			.list-header
				height 40px
				line-height 40px
				padding 0 18px
				background #f3f5f7
				border-bottom 1px solid rgba(7, 17, 27, .1)
				.title
					float left
					font-size 14px
					color rgb(7, 17, 27)
				.empty
					float right
					font-size 12px
					color rgb(0, 160, 220)
			.list-content
				padding 0 18px
				max-height 217px
				background #fff
				overflow hidden
				.food
					position relative
					padding 12px 0
					box-sizing border-box
					border-1px(rgba(7, 17, 27, .1))
					.name
						line-height 24px
						font-size 14px
						color rgb(7, 17, 27)
					.price
						position absolute
						right 90px
						bottom 12px
						line-height 24px
						font-weight 700
						font-size 14px
						color rgb(240, 20, 20)
					.cartcontrol-wrapper
						position absolute
						bottom 6px
						right 0
	.list-mask
		position fixed
		top 0
		left 0
		width 100%
		height 100%
		z-index 40
		background rgba(7, 17, 27, .6)
		backdrop-filter blur(10px)
		&.fade-enter-active, .fade-leave-active
			transition all .5s
		.fade-enter, .fade-leave-active
			opacity 0
</style>
