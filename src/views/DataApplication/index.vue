<template>
	<!-- 数据应用 -->
	<div class="DataApplication">
		<router-view/>
	</div>
</template>

<script>
export default {
  name: 'DataApplication',
  data() {
    return {

    };
  },
  methods:{
	
  },
  created() {
  }
}
</script>

<style lang="less">
  .DataApplication {
    padding-top: 60px;
    height: 100%;
    box-sizing: border-box;
  }
</style>
