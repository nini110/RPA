<template>
	<!-- 截取 -->
	<div class="CutOut">
		<div class="content">
			<div class="form">
				<div class="txt">开发中。。。</div>
			</div>
		</div>
	</div>
</template>

<script>
</script>

<style lang="less">
	.CutOut{
		width: 1200px;
		margin: 0 auto;
		.content{
			min-height: 1250px;
			padding-top: 90px;
			box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
			display: flex;
			flex-direction: row-reverse;
			.form{
				width: 975px;
				background-color: #fff;
				.txt{
					font-size: 50px;
					width: 500px;
					height: 200px;
					margin: 0 auto;
					text-align: center;
				}
			}
		}
	}
</style>
