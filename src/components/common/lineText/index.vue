<template>
	<div class="text-line">
		<span class="line"></span>
		<span class="text">{{text}}</span>
		<span class="line"></span>
	</div>
</template>
<script>
	export default {
		props: ['text']
	}
</script>
<style lang="stylus">
	.text-line
		display: flex
		justify-content: center
		align-items: center
		.line
			flex: 1
			border-bottom: 1px solid rgba(255,255,255,0.2)
		.text
			padding: 0 12px
			font-weight: 700
			font-size: 14px
</style>

