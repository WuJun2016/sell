<template>
  <div class="seller-detail" ref="sellerDetail">
    <div ref="sellerContent">
      <div class="header">
        <div class="name">{{seller.name}}</div>
        <div class="star-wrapper">
          <Star :size="36" score="4"></Star>
          <span class="num">(661)</span>
          <span class="sell-count">月售680单</span>
        </div>
        <div class="info">
          <div class="price">
            <span class="title">起送价</span>
            <span class="text">
							{{seller.minPrice}}
              <span class="unit">元</span>
            </span>
          </div>
          <div class="fee">
            <span class="title">{{seller.description}}</span>
            <span class="text">
							{{seller.deliveryPrice}}
              <span class="unit">元</span>
            </span>
          </div>
          <div class="time">
            <span class="title">平均配送时间</span>
            <span class="text">
							{{seller.deliveryTime}}
              <span class="unit">分钟</span>
            </span>
          </div>
        </div>
				<div class="favorite" @click="toggleFavorite">
					<i class="icon-favorite" :class="{'active': favorite}"></i>
					<span class="text">{{ favoriteText }}</span>
				</div>
      </div>
			<split></split>
			<div class="content">
				<div class="title">活动与公共</div>
				<p class="text">{{seller.bulletin}}</p>
				<ul>
					<li v-for="support in seller.supports" class="support">
						<i class="icon" :class="classMap[support.type]"></i>
						<span class="text">{{support.description}}</span>
					</li>
				</ul>
			</div>
			<split></split>
			<div class="pics">
				<h1 class="title">商家实景</h1>
				<div class="pic-wrapper" ref="picWrapper">
					<ul class="pic-list" ref="picList">
						<li class="pic-item" v-for="pic in seller.pics">
							<img :src="pic" width="120" height="90">
						</li>
					</ul>
				</div>
			</div>
			<split></split>
			<div class="seller-info">
				<div class="title">商家信息</div>
				<ul>
					<li v-for="info in seller.infos" class="info">{{info}}</li>
				</ul>
			</div>
    </div>
  </div>
</template>

<script>
	import BScroll from 'better-scroll'
	import Star from "../common/star";
	import Split from '../common/split'
	import { saveToLocal, loadFromLocal } from '../../common/js/store';
	export default {
		props: {
			seller: Object
		},
		data(){
			return {
				classMap: ['decrease', 'discount', 'guarantee', 'invoice', 'special'],
				favorite: (() => {
					return loadFromLocal(this.seller.id, 'favorite', false);
				})()
			}
		},
		components: {
			Star,
			Split
		},
		watch: {
			'seller'(){
				this._initScroll()
			}
		},
		computed: {
			favoriteText() {
				return this.favorite ? '已收藏' : '收藏';
			}
		},
		methods: {
			_initScroll() {
				let picWidth = 120;
				let margin = 6;
				this.$nextTick(() => {
					this.scroll = new BScroll(this.$refs.sellerDetail, {
						click: true
					})
					console.log(this.$refs.sellerDetail.style.width)
					if(this.seller.pics) {
						let width = (picWidth + margin) * this.seller.pics.length - margin;
						this.$refs.picList.style.width = width + 'px';
						this.picScroll = new BScroll(this.$refs.picWrapper, {
								click: true,
								scrollX: true,
								eventPassthrough: 'vertical'
						});
					}
				});
			},
			toggleFavorite(event) {
				if (!event._constructed) {
						return;
				}
				this.favorite = !this.favorite;
					saveToLocal(this.seller.id, 'favorite', this.favorite);
			}
		},
		mounted(){
			this._initScroll()
		},
	};
</script>

<style lang='stylus'>
	@import '../../common/stylus/_mixin.styl'

	.seller-detail
		position absolute
		bottom 0px
		top 176px
		left 0
		overflow hidden
		width: 100%;
		.header
			position relative
			box-sizing border-box
			padding 18px
			.title
				font-size 14px
				color rgb(7,17,27)
				line-height 14px
				margin-bottom 12px
			.name
				margin-bottom 8px
				font-size 14px
				color rgb(7,17,27)
				line-height 14px
			.star-wrapper
				display flex
				margin-bottom 18px
				line-height 18px
				.num
					margin-left 8px
					font-size 10px
				.sell-count
					margin-left 12px
					font-size 10px
					color rgb(77, 85,93)
			.info
				padding 18px 0
				border-top: 1px solid (rgba(7,17,27,0.1))
				display flex
				flex 1
				.price, .fee, .time
					display flex
					flex-direction column
					align-items center
					flex 1
					border-right 1px solid rgba(7,17,27,0.1)
					.title
						font-size 10px
						color rgb(147,153,159)
						line-height 20px
						margin-bottom 4px
					.text
						font-size 24px
						font-weight 200
						color rgb(7,17,27)
						line-height 24px
						.unit
							font-size 10px
							color rgb(77,85,93)
				.time
					border-right none
			.favorite
				position absolute
				top 18px
				right 11px
				display flex
				width: 50px;
				flex-direction column
				text-align: center;
				.icon-favorite
					font-size 24px
					color: #d4d6d9;
					margin-bottom 4px
					justify-content center
					align-items center
					&.active
						color rgb(240,20,20)
				.text
					line-height 10px
					font-size 10px
					color rgb(77, 85, 93)
		.content
			margin 18px
			.title
				font-size 14px
				color rgb(7,17,27)
				line-height 14px
				margin-bottom 12px
			>.text
				padding 0 12px
				font-size 12px
				font-weight 200
				color rgb(240,20,20)
				line-height 24px
				margin-bottom 16px
			.support
				border-top 1px solid rgba(7,17,27,0.1)
				padding 16px 12px
				display flex
				align-items center
				.icon
					width 16px
					height 16px
					margin-right 6px
					background-repeat no-repeat
					background-size 16px 16px
					&.decrease
						bg-image('./img/decrease_4')
					&.discount
						bg-image('./img/discount_4')
					&.guarantee
						bg-image('./img/guarantee_4')
					&.invoice
						bg-image('./img/invoice_4')
					&.special
						bg-image('./img/special_4')
				.text
					font-size 12px
					font-weight 200
					color rgb(7,17,27)
					line-height 16px
		.pics
			padding: 18px;
			.title
				margin-bottom: 12px;
				line-height: 14px;
				color: rgb(7, 17, 27);
				font-size: 14px;
			.pic-wrapper
				width: 100%;
				overflow: hidden;
				white-space: nowrap;
				.pic-list
					font-size: 0;
					display flex
					overflow hidden
					.pic-item
						display: inline-block;
						margin-right: 6px;
						width: 120px;
						height: 90px;
						&:last-child
							margin: 0;

		.seller-info
			margin 16px
			.title
				font-size 14px
				color rgb(7,17,27)
				line-height 14px
				margin-bottom 12px
			.info
				border-top 1px solid rgba(7,17,27,0.1)
				padding 16px 12px
				align-items center
				line-height 16px
				font-size 12px
				font-weight 200
				color rgb(7,17,27)
</style>

