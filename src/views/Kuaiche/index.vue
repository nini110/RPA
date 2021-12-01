<template>
  <!-- 第三方工具 -->
  <div class="BeijingMustPass">
    <router-view />
  </div>
</template>

<script>
export default {
  name: "ThirdPartyTools",
  data() {
    return {};
  },
};
</script>

<style lang="less">
	.BeijingMustPass {
		padding-top: 60px;
		height: 100%;
		box-sizing: border-box;
	}
</style>
