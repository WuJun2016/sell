<template>
	<div class="goods">
		<div class="menu-wrapper" ref="menuWrapper">
			<ul>
				<li
					v-for="item,index in goods" class="menu-item"
					:class="{'current': currentIndex === index}"
					@click="selectMenu(index, $event)"
				>
					<span class="text">
						<span class="icon" :class="classMap[item.type]" v-show="item.type > 0"></span>
						<span class="name">{{item.name}}</span>
					</span>
				</li>
			</ul>
		</div>
		<div class="foods-wrapper" ref="foodsWrapper">
			<ul>
				<li class="food-list food-list-hook" v-for="item in goods">
					<h2 class="title">{{item.name}}</h2>
					<div class="food" v-for="food in item.foods">
						<img class="icon" :src="food.image" alt="">
						<div class="info">
							<span class="name">{{food.name}}</span>
							<span class="description" v-show="food.description">{{food.description}}</span>
							<div>
								<span class="sell-count">月售{{food.sellCount}}份</span>
								<span class="rating">好评率{{food.rating}}</span>
							</div>
							<div class="choose">
								<span class="price">¥ {{food.price}}</span>
								<span class="old-price" v-show="food.oldPrice">¥ {{food.oldPrice}}</span>
								<span class="cart-wrapper">
									<v-cart-control :food="food"></v-cart-control>
								</span>
							</div>
						</div>

					</div>
				</li>
			</ul>

		</div>
		<v-shop-car
			:delivery-price="seller.deliveryPrice"
			:min-price="seller.minPrice"
			:selectFood="selectFood"
			ref="shopcart"
		>
		</v-shop-car>
	</div>
</template>

<script>
import BScroll from 'better-scroll'
import CartControl from '../common/cartControl'
import shopCar from '../common/shopcar'
import Bus from '../../common/js/eventBus';
const ERR_OK = 0;


export default {
  props: ["seller"],
  data() {
    return {
			goods: [],
			listHeight: [],
			scrollY: 0,
			classMap: ['decrease', 'discount', 'guarantee', 'invoice', 'special']
    };
  },
  created() {
    this.$http.get("/api/goods").then(response => {
			response = response.body;
      if (response.errno == ERR_OK) {
				this.goods = response.data
				this.$nextTick( () => {
					this._initScroll()
					this._calculateHeight()
				})
      }
		});
		Bus.$on('cart.add', el => {
			this.$nextTick(() => {
				this.$refs.shopcart.drop(el);
			})
		});
	},
	computed: {
		currentIndex() {
			for(let i=0; i<this.listHeight.length; i++) {
				let height1 = this.listHeight[i]
				let height2 = this.listHeight[i+1] || 999999
				let y = Math.abs(this.scrollY)
				if(this.scrollY >= height1 && this.scrollY < height2) {
					return i
				}
			}
			return 0
		},
		selectFood() {
			let foods = [];
			this.goods.forEach(good => {
				good.foods.forEach(food => {
					if(food.count>0) {
						foods.push(food)
					}
				})
			})
			return foods
		}
	},
	methods: {
		selectMenu(index, event) {
			if(!event._constructed) {
				return;
			}
			let foodList = this.$refs.foodsWrapper.getElementsByClassName('food-list-hook');
			let el = foodList[index];
			this.foodsScroll.scrollToElement(el, 300);

		},
		_initScroll() {
			this.menuScroll = new BScroll(this.$refs.menuWrapper, {
				click: true
			});
			this.foodsScroll = new BScroll(this.$refs.foodsWrapper, {
				click: true,
				probeType: 3
			});

			this.foodsScroll.on('scroll', pos => {
				this.scrollY = Math.abs(pos.y)
			})
		},
		_calculateHeight() {
			let foodList = this.$refs.foodsWrapper.getElementsByClassName('food-list-hook')
			let height = 0;

			this.listHeight.push(height)
			for(let i=0; i<foodList.length; i++) {
				let item = foodList[i];
				height+=item.clientHeight;
				this.listHeight.push(height)
			}
		}
	},
	components: {
		'v-shop-car': shopCar,
		'v-cart-control': CartControl
	}
};
</script>
<style lang="stylus" scoped>
	@import '../../common/stylus/_mixin.styl'

	.goods
		display: flex
		position: absolute
		top: 176px
		bottom: 0px
		width: 100%
		overflow: hidden
		.menu-wrapper
			flex 0 0 80px
			width 80px
			background rgb(243,245,247)
			.menu-item
				height 54px
				padding 0 12px
				box-sizing border-box
				display table
				line-height 14px
				font-size 0px
				color rgb(7,17,27)
				cursor pointer
				&.current
					position relative
					z-index 10
					margin-top -1px
					background #fff
					font-weight 700
					.text
						border-nono()
				.text
					display table-cell
					width 56px
					border-1px(rgba(7,17,27,0.1))
					vertical-align middle
					font-size 0px
					.name
						vertical-align top
						font-size 12px
					.icon
						margin-right 2px
						display inline-block
						width 12px
						height 12px
						background-repeat no-repeat
						background-size 12px 12px
						&.decrease
							bg-image('./img/decrease_3')
						&.discount
							bg-image('./img/discount_3')
						&.guarantee
							bg-image('./img/guarantee_3')
						&.invoice
							bg-image('./img/invoice_3')
						&.special
							bg-image('./img/special_3')
		.foods-wrapper
			flex 1
			.food-list
				.title
					box-sizing border-box
					height 26px
					padding-left 28px
					line-height 26px
					border-left 2px solid #d9dde1
					background #f3f5f7
					font-size 12px
					color rgb(147,153,159)
				.food
					box-sizing border-box
					display flex
					margin 18px
					padding-bottom 18px
					border-1px(rgba(7,17,27,0.1))
					&:last-child
						border-none()
						margin-bottom 0px
					.icon
						width 57px
						height 57px
					.info
						display flex
						flex-direction column
						margin-left 10px
						.name
							font-size 14px
							color rgb(7,17,27)
							line-height 14px
							margin 2px 0 8px 0
						.description,.sell-count,.rating
							margin-bottom 8px
							font-size 10px
							color rgb(147,153,159)
							line-height 10px
						.rating
							margin-left 12px
						.price
							font-size 14px
							color rgb(240,20,20)
							font-weight 700
							line-height 24px
						.old-price
							font-size 10px
							color rgb(147,153,159)
							font-weight 500
							line-height 24px
							text-decoration line-through
						.cart-wrapper
							position: absolute;
							right: 0;
							bottom: 12px;

</style>



