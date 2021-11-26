<template>
  <el-drawer 
    :title="'当前关键词： '+openDrawerInfo.keyword" 
    :visible.sync="drawer" 
    direction="rtl"
    @close="closeEvent"
    >
    <el-table :data="drawerData">
       	<el-table-column prop="changeDta" align="center" label="日期" min-width="100" fixed="left">
		</el-table-column>
		<el-table-column prop="changeInfo" align="center" label="调价详情" min-width="100" fixed="left">
		</el-table-column>
    </el-table>
  </el-drawer>
</template>
<script>
export default {
    name: 'Drawer',
    props: {
        openDrawerInfo: {
            type: Object,
            default: null
        }
    },
    data() {
        return {
            drawer: true,
            drawerData: [
                {
                    changeDta: '2021-11-17',
                    changeInfo: '1.3 -  1.4'
                },
                {
                    changeDta: '2021-11-28',
                    changeInfo: '1.4 -  1.5'
                },                
                {
                    changeDta: '2021-11-19',
                    changeInfo: '1.5 -  1.6'
                },
                {
                    changeDta: '2021-11-20',
                    changeInfo: '1.6 -  1.7'
                },
                {
                    changeDta: '2021-11-21',
                    changeInfo: '1.7 -  1.8'
                },                
            ]
        }
    },
    created() {
    },
    methods: {
        closeEvent() {
            const vm = this;
            vm.$emit('close')
        }
    }
};
</script>
<style lang="less" scoped>

</style>
