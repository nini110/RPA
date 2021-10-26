<template>
	<!-- 第三方工具 -->
	<div class="ThirdPartyTools">
		<router-view/>
	</div>
</template>

<script>
export default {
  name: 'ThirdPartyTools',
  data(){
	return{

	}  
  },
}
</script>

<style lang="less">
	.ThirdPartyTools{
		width: 1200px;
		height: 100%;
		margin: 0 auto;
		.content{
			box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
			display: flex;
			flex-direction: row-reverse;
			padding-top: 90px;
			.txt{
				width: 975px;
				height: 1250px;
				background-color: #FFFFFF;
				font-size: 50px;
				text-align: center;
			}
		}
	}
</style>
