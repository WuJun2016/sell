<template>
  <div class="ratings" >
    <div class="ratings-header">
			<div class="header-left">
				<span class="score">{{seller.score}}</span>
				<span class="title">综合评分</span>
				<span class="rank">高于周边商家{{seller.rankRate}}%</span>
			</div>
			<div class="header-right">
				<div class="server-score">
					<span class="title">服务态度</span>
					<star :size="36" :score="seller.serviceScore"></star>
					<span class="score">{{seller.serviceScore}}</span>
				</div>
				<div class="food-score">
					<span class="title">商品评分</span>
					<star :size="36" :score="seller.foodScore"></star>
					<span class="score">{{seller.foodScore}}</span>
				</div>
				<div class="delivery-time">
					<span class="title">送达时间</span>
					<span class="time">{{seller.deliveryTime}}分钟</span>
				</div>
			</div>
		</div>
		<split></split>
		<div class="rating">
			<div class="rating-select">
				<ratingSelect :selectType="selectType" :onlyContent="onlyContent" :ratings="ratings" :isPrevent="false"></ratingSelect>
			</div>
			<div class="rating-list" ref="ratingList">
				<ul>
					<li v-for="rate in ratings" class="rating-item" v-show="needShow(rate.rateType, rate.text)">
						<img class="avatar" :src="rate.avatar" />
						<div class="content">
							<div class="rate-header">
								<span class="username">{{rate.username}}</span>
								<span class="time">{{ rate.rateTime | formatDate }}</span>
							</div>
							<div class="star-wrapper">
								<star :score="rate.score" :size="36"></star>
								<span class="delivery-time" v-show="rate.deliveryTime">{{rate.deliveryTime}}分钟送达</span>
							</div>
							<div class="text">{{rate.text}}</div>
							<div class="type">
								<i class="icon" :class="{'icon-thumb_up' : rate.rateType == 0, 'icon-thumb_down': rate.rateType == 1}"></i>
								<ul class="recommends">
									<li v-for="item in rate.recommend" class="text">{{item}}</li>
								</ul>
							</div>
						</div>
					</li>
				</ul>
			</div>
		</div>
  </div>
</template>

<script>
	import star from '../common/star'
	import split from '../common/split'
	import ratingSelect from '../common/ratingSelect'
	import BScroll from 'better-scroll'
	import Bus from '../../common/js/eventBus';
	import { formatDate } from '../../common/js/date'
	const ALL = 2

	export default {
		props: {
			seller: Object
		},
		components: {
			star,
			split,
			ratingSelect
		},
		data() {
			return {
				ratings: [],
				selectType: ALL,
				onlyContent: true
			}
		},
		created() {
			this.$http.get('/api/ratings').then(response => {
				response = response.body
				if(response.errno == 0) {
					this.ratings = response.data
					this.$nextTick(() => {
						this.scroll = new BScroll(this.$refs.ratingList, {
								click: true
						});
					});
				}
				Bus.$on('ratingtype.select', (type) => {
					this.selectType = type
				})
				Bus.$on('content.toggle', (onlyContent) => {
					this.onlyContent = onlyContent
				})
			})
		},
		methods: {
			needShow(type, text) {
				if (this.onlyContent && !text) {
					return false;
				}
				if (this.selectType === ALL) {
					return true;
				} else {
					return type === this.selectType;
				}
			}
		},
		filters: {
			formatDate(time) {
				let date = new Date(time);
				return formatDate(date, 'yyyy-MM-dd hh:mm');
			}
		}
	}
</script>

<style lang="stylus">
	@import '../../common/stylus/_mixin.styl'
	.ratings
		position: fixed
		top: 174px
		bottom: 0
		left: 0
		width: 100%
		overflow: hidden
		.ratings-header
			display flex
			align-items center
			padding 18px 0
			.header-left
				display flex
				flex-direction column
				align-items center
				flex 1
				.score
					font-size 24px
					color rgb(255,153,0)
					line-height 28px
					margin-bottom 6px
				.title
					font-size 12px
					color rgb(7,17,27)
					line-height 12px
					margin-bottom 8px
				.rank
					font-size 10px
					color rgb(147,153,159)
					line-height 18px
					margin-bottom 6px
			.header-right
					padding 0 24px
					border-left 1px solid #e6e7e8
					@media screen and (max-width: 320px)
						padding 0 4px
					.server-score, .food-score, .delivery-time
						display flex
						margin-bottom 8px
						font-size 12px
						line-height 18px
						color rgb(7,17,27)
						.title
							margin-right 12px
						.score
							margin-left 12px
							color rgb(255,153,0)
					.delivery-time
						.time
							font-size 12px
							color rgb(147,153,159)
							line-height 18px
		.rating-list
			position fixed
			bottom 0
			top 425px
			left  0
			width 100%
			overflow hidden
			.rating-item
				margin  0px 18px
				padding 18px 0
				display flex
				border-1px(rgba(7,17,27,0.2))
				.avatar
					width 28px
					height 28px
					margin-right 12px
				.content
					width 100%
					.rate-header
						margin-bottom 4px
						font-size 10px
						line-height 12px
						width 100%
						.username
							color rgb(7,17,27)
						.time
							color rgb(147,153,159)
							float right
					.star-wrapper
						display flex
						align-items center
						margin-bottom 6px
						.delivery-time
							margin-left 6px
							font-size 10px
							font-weight 200
							line-height 15px
							color rgb(147,153,159)
					.text
						margin-bottom 6px
						font-size 12px
						color rgb(7,17,27)
						line-height 18px
					.type
						display flex
						.icon
							width 16px
							height 16px
							font-size 12px
							color rgb(183,187,191)
							line-height 16px
							margin-right 8px
							&.icon-thumb_up
								color #00a0dc
						.recommends
							display flex
							flex-wrap wrap
							.text
								margin-right 8px
								margin-bottom 4px
								padding 0 6px
								border 1px solid rgba(7,17,27,0.1)
								border-radius 2px
								background rgb(255,255,255)
								font-size 9px
								color rgb(147,153,159)
								line-height 16px
								&:last-child
									margin-right 0










</style>

