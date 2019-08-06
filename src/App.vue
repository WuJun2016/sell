<template>
  <div>
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
import header from "@/components/header/header";
const ERR_OK = 0;

export default {
  components: {
    "v-header": header
  },
  data() {
    return {
      seller: {}
    };
  },
  created() {
    this.$http.get("/api/seller").then(response => {
      response = response.body;
      if (response.errno === ERR_OK) {
        this.seller = Object.assign({}, this.seller, response.data);
      }
		});
  }
};
</script>

<style lang="stylus">
	@import '~stylus/_mixin.styl'
	.tab {
		display flex
		width 100%
		line-height 39px
		position relative

		border-1px-bottom(rgba(7, 17, 27, 0.1))

		.tab-item {
			flex 1
			text-align center
		}
	}
</style>
