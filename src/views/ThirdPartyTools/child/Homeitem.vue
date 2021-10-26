<template>
  <div class="homeitem" style="height: 100%">
	  <strategy></strategy>
  </div>
</template>

<script>
import strategy from '@/components/jvliangqianchuan/strategy/strategy.vue'
export default {
  name: 'Homeitem',
  components: {
    strategy
  }
}
</script>
<style lang="less" scoped>
	@import '@/views/index.less';

</style>
