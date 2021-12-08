<template>
	<!-- 大数据工具 -->
	<div style="height: 100%">
		<IptComp :toolType="toolType"></IptComp>
	</div>
</template>

<script>
	import IptComp from '@/components/iptTable/index.vue'
	export default {
		name: 'BigData',
		components: {
			IptComp
		},
		data() {
			return {
				toolType: '0'
			};
		},
		watch: {
			$route: {
				handler(newval, oldval) {
					const vm = this;
					switch (newval.name) {
						case 'Number':
							this.toolType = '2';
							break;
						case 'Activity':
							this.toolType = '6';
							break;
						case 'Analysis':
							this.toolType = '7';
							break;
						case 'Difference':
							this.toolType = '3';
							break;
						case 'Population':
							this.toolType = '10';
							break;
					}
				},
				immediate: true,
				deep: true
			}
		},
		methods: {

		},
		created() {

		}
	}
</script>

<style lang="less" scoped>
</style>
