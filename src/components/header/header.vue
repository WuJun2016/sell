<template>
  <div id="header">
    <div class="content-wrapper">
      <div class="avatar">
        <img :src="seller.avatar" width="64" height="64" alt="商店头像" />
      </div>
      <div class="content">
        <div class="titile">
          <span class="brand"></span>
          <span class="name">{{seller.name}}</span>
        </div>
        <div class="description">{{seller.description}}/{{seller.deliveryTime}}分钟送达</div>
        <div v-if="seller.supports" class="support">
          <span class="icon" :class="classMap[seller.supports[0].type]"></span>
          <span class="text">{{seller.supports[0].description}}</span>
        </div>
      </div>
			<div class="support-count" @click="showDetail()">
				<span class="count" v-if="seller.supports">{{seller.supports.length}}个</span>
				<i class="icon-keyboard_arrow_right"></i>
			</div>
    </div>
    <div class="bulletin-wrapper" @click="showDetail()">
			<span class="bulletin-title"></span>
			<span class="bulletin-text">{{seller.bulletin}}</span>
			<i class="icon-keyboard_arrow_right"></i>
		</div>
		<div class="background">
				<img :src="seller.avatar" width="100%" height="100%">
		</div>
		<transition name="fade">
			<div v-show="detailShow" class="detail">
				<div class="detail-wrapper">
					<div class="detail-main">
						<h1 class="name">{{seller.name}}</h1>
						<div class="wrapper-Star">
							<v-star :score="seller.score" size="48"></v-star>
						</div>
						<v-line-text text='优惠信息'></v-line-text>
						<ul v-if="seller.supports" class="supports">
							<li
								class="support-item"
								v-for="item,index in seller.supports"
								:key="index"
							>
								<span class="icon" :class="classMap[seller.supports[index].type]"></span>
								<span class="description">{{seller.supports[index].description}}</span>
							</li>
						</ul>
						<v-line-text text='商家公告'></v-line-text>
						<div class="bulletin">
							<p class="content">{{seller.bulletin}}</p>
						</div>
					</div>
				</div>
				<div class="detail-close">
					<i class="icon-close" @click="hiddenDetail()"></i>
				</div>

			</div>
		</transition>
  </div>
</template>

<script>
	import star from '../common/star'
	import lineText from '../common/lineText'

	export default {
		props: {
			seller: {
				type: Object,
				required: true
			}
		},
		data() {
			return {
				detailShow: false
			}
		},
		methods: {
			showDetail() {
				this.detailShow = true
			},
			hiddenDetail() {
				this.detailShow = false
			}
		},
		created() {
			this.classMap = ['decrease', 'discount', 'guarantee', 'invoice', 'special']
		},
		components: {
			'v-star': star,
			'v-line-text': lineText
		}
	};
</script>

<style lang="stylus">
 	@import '~stylus/_mixin.styl'

	#header
		color #fff
		position relative
		overflow hidden
		background #999
		.content-wrapper
			padding 24px 12px 18px 24px
			display flex
			position relative
			img
			 border-radius 2px
			.content
				font-size 14px
				margin-left 16px
				.titile
					margin 2px 0 8px 0
					display flex
					.brand
						width 30px
						height 18px
						bg-image('./img/brand')
						background-size 30px 18px
						background-repeat no-repeat
						margin-right 6px
					.name
						font-size 16px
						line-height 18px
						font-weight bold
						color rgb(255, 255, 255)
				.description
					margin-bottom 10px
					font-size 12px
					line-height 12px
				.support
					display flex
					.icon
						margin-right 4px
						width 12px
						height 12px
						background-repeat no-repeat
						background-size 12px 12px
						&.decrease
							bg-image('./img/decrease_1')
						&.discount
							bg-image('./img/discount_1')
						&.guarantee
							bg-image('./img/guarantee_1')
						&.invoice
							bg-image('./img/invoice_1')
						&.special
							bg-image('./img/special_1')
					.text
						font-size 10px
						line-height 12px;
			.support-count
				position absolute
				right 12px
				bottom 18px
				padding 0 8px
				height 24px
				border-radius 8px
				background-color rgba(0,0,0,0.2)
				cursor pointer
				.count
					line-height 24px
					font-size 10px
				.icon-keyboard_arrow_right
					font-size 10px
					line-height 24px
		.bulletin-wrapper
			height 28px
			padding 0 22px 0 12px
			position relative
			white-spacenowrap;
			overflow hidden
			text-overflow ellipsis
			background-color rgba(7,17,27,0.2)
			.bulletin-title
				display inline-block
				margin-top 8px
				vertical-align top
				width 24px
				height 12px
				bg-image('./img/bulletin')
				background-size 22px 12px
				background-repeat no-repeat
				align-items center
			.bulletin-text
				vertical-align top
				line-height 28px;
				margin 0 4px
				font-size 10px
			.icon-keyboard_arrow_right
				position absolute
				top 8px
				right 12px
				font-size 10px
		.background
			position absolute
			top 0
			left 0
			width 100%
			height 100%
			z-index -1
			filter blur(10px)

		.detail
			position fixed
			top 0
			z-index 1000
			width 100%
			height 100%
			backdrop-filter blur(5px)
			background-color rgba(7, 17, 27, 0.8)
			&.fade-enter-active, &.fade-leave-active
				transition opacity .5s
			&.fade-enter, &.fade-leave-to
				opacity 0
			.detail-wrapper
				min-height 100%
				.detail-main
					margin 0 36px
					padding-top 64px
					padding-bottom 64px
					.name
						line-height 16px
						text-align center
						font-size 16px
						font-weight 700
					.wrapper-Star
						display flex
						justify-content center
						margin 18px 0 28px
						padding 2px 0
					.supports
						margin 24px auto 28px
						.support-item
							padding 0 12px
							margin-bottom 12px
							display flex
							align-items center
							.icon
								margin-right 6px
								width 16px
								height 16px
								background-repeat no-repeat
								background-size 16px 16px
								&.decrease
									bg-image('./img/decrease_1')
								&.discount
									bg-image('./img/discount_1')
								&.guarantee
									bg-image('./img/guarantee_1')
								&.invoice
									bg-image('./img/invoice_1')
								&.special
									bg-image('./img/special_1')
							&last-child
								margin-bottom 0
							.description
								font-size 12px;
								line-height 12p
					.bulletin
						margin-top 24px;
						padding 0 12px
						.content
							font-size 12px
							font-weight 200
							line-height 24px
							color #fff
			.detail-close
				margin -64px auto 0
				width 32px
				height 32px
				font-size 32px
				color rgba(255,255,255,0.5)
</style>
