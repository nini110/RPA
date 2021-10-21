<template>
	<!-- 竞标监控 -->
	<div class="sankey">
		<div style="width: 100%; height: 80px;"></div>
		<div class="content">
			<div class="sankeyList">
				<div class="nav">
					<div class="item">
						<div class="title">
							小米手机8月1日-8月24日广告销售数据桑基图
						</div>
						<div class="sankey1">
							<div class="content" v-show="flag === true">
								<div style="width: 100%; height: 20px;"></div>
								<div class="select1">
									<div class="tops">【结论】</div>
									<div class="middle1" :class="flag2 === true?'is-active2':''">
										<div class="middleBG"></div>
										<div class="contents1">
											<div class="place">
												<div class="contentLift">
													<div style="width: 100%; height: 20px;"></div>
													<div class="diamond">
														<img src="../../assets/images/钻石.png" alt="">
													</div>
													<div class="characters">建议优化利益点</div>
												</div>
												<div class="contentRight">
													<div>小米10Pro计划</div>
													<div>小米11青春计划</div>
													<div>小米11至尊计划</div>
												</div>
											</div>
										</div>
										<div class="contents3">
											<div class="place">
												<div class="contentLift">
													<div style="width: 100%; height: 20px;"></div>
													<div class="diamond">
														<img src="../../assets/images/钻石.png" alt="">
													</div>
													<div class="characters">建议优化计划</div>
												</div>
												<div class="contentRight">
													<div>K40-计划</div>
													<div>米10s计划</div>
													<div>Note9-Pro计划</div>
												</div>
											</div>
										</div>
										<div class="contents4">
											<div class="place">
												<div class="contentLift">
													<div style="width: 100%; height: 20px;"></div>
													<div class="diamond">
														<img src="../../assets/images/钻石.png" alt="">
													</div>
													<div class="characters">备受欢迎单品SKU</div>
												</div>
												<div class="contentRight">
													<div>100009958327(小米11 5G)</div>
													<div>100019791894(小米11Pro)</div>
													<div>100019791982(小米11 Ultra)</div>
													<div>100018640834(K40)</div>
													<div>100021211862(K40游戏)</div>
													<div>100018642492(K40 Pro+)</div>
													<div>100016799390(Note9 Pro 5G)</div>
													<div>100016773624(Note9 5G)</div>
													<div>100016784108(Note9 4G)</div>
													<div>100011650799(Note10 5G)</div>
													<div>100022298852(Note10 Pro 5G)</div>
													<div>100019044460(小米10S)</div>
													<div>100019888160(小米11 青春)</div>
												</div>
											</div>
										</div>
									</div>
									<div class="bottom" :class="flag2 === false?'is-active3':''" @click="selectClick()">{{text}}
									</div>
								</div>
								<div id="main3"></div>
							</div>
						</div>
					</div>
				</div>
				<router-view />
			</div>
			
		</div>
	</div>
</template>
<script>
	export default {
		name: 'sankey',
		data() {
			return {
				myChart1: null,
				myChart2: null,
				myChart3: null,
				flag: true,
				flag1: true,
				flag2: false,
				text: '展开',
				option3: {
					title: {
						text: ''
					},
					tooltip: {
						trigger: 'item',
						triggerOn: 'mousemove',
						formatter: function(data) {
							return data.name + " : " + data.value.toFixed(2);
						}
					},
					series: [{
						type: 'sankey',
						data: [],
						links: [],
						emphasis: {
							focus: 'adjacency'
						},
						levels: [{
							depth: 0,
							itemStyle: {
								color: '#FAD876'
							},
							lineStyle: {
								color: 'source',
								opacity: 0.6
							}
						}, {
							depth: 1,
							itemStyle: {
								color: '#b3cde3'
							},
							lineStyle: {
								color: 'source',
								opacity: 0.6
							}
						}, {
							depth: 2,
							itemStyle: {
								color: '#ccebc5'
							},
							lineStyle: {
								color: 'source',
								opacity: 0.6
							}
						}, {
							depth: 3,
							itemStyle: {
								color: '#decbe4'
							},
							lineStyle: {
								color: 'source',
								opacity: 0.6
							}
						}],
						lineStyle: {
							curveness: 0.5
						}
					}]
				}
			}
		},
		methods: {
			tabClick1() {
				this.flag = !this.flag;
				this.flag2 = false;
			},
			tabClick2() {
				this.flag1 = !this.flag1;
				this.flag2 = false;
			},
			selectClick() {
				this.flag2 = !this.flag2
				if (this.flag2) {
					this.text = '展开'
				} else {
					this.text = '收起'
				}
			}
		},
		created() {
			let data3 = {'data': [{'name': '京东展位', 'itemStyle': {'color': '#FAD876'}}, {'name': '京东快车', 'itemStyle': {'color': '#FAD876'}}, {'name': '品牌聚效', 'itemStyle': {'color': '#FAD876'}}, {'name': '海投', 'itemStyle': {'color': '#FAD876'}}, {'name': '购物触点', 'itemStyle': {'color': '#FAD876'}}, {'name': '小米11-计划', 'itemStyle': {'color': '#8FB3FC'}}, {'name': '小米11Pro计划', 'itemStyle': {'color': '#8FB3FC'}}, {'name': '小米11至尊计划', 'itemStyle': {'color': '#8FB3FC'}}, {'name': '小米11青春计划', 'itemStyle': {'color': '#8FB3FC'}}, {'name': 'K40-计划', 'itemStyle': {'color': '#8FB3FC'}}, {'name': 'K40P计划', 'itemStyle': {'color': '#8FB3FC'}}, {'name': 'K40游戏计划', 'itemStyle': {'color': '#8FB3FC'}}, {'name': 'Note9-4G计划', 'itemStyle': {'color': '#8FB3FC'}}, {'name': 'Note9-5G计划', 'itemStyle': {'color': '#8FB3FC'}}, {'name': 'Note9-Pro计划', 'itemStyle': {'color': '#8FB3FC'}}, {'name': 'Note10-计划', 'itemStyle': {'color': '#8FB3FC'}}, {'name': 'Note10Pro计划', 'itemStyle': {'color': '#8FB3FC'}}, {'name': '米10s计划', 'itemStyle': {'color': '#8FB3FC'}}, {'name': 'MIX-FOLD计划', 'itemStyle': {'color': '#8FB3FC'}}, {'name': 'K30S计划', 'itemStyle': {'color': '#8FB3FC'}}, {'name': 'MIX4计划', 'itemStyle': {'color': '#8FB3FC'}}, {'name': 'K81A计划', 'itemStyle': {'color': '#8FB3FC'}}, {'name': '小米平板5-计划', 'itemStyle': {'color': '#8FB3FC'}}, {'name': '小米平板5Pro计划', 'itemStyle': {'color': '#8FB3FC'}}, {'name': '荣耀magic拦截计划计划', 'itemStyle': {'color': '#8FB3FC'}}, {'name': '高端聚合页计划', 'itemStyle': {'color': '#8FB3FC'}}, {'name': '店铺首页计划', 'itemStyle': {'color': '#8FB3FC'}}, {'name': '高端人群计划', 'itemStyle': {'color': '#8FB3FC'}}, {'name': '全场景计划', 'itemStyle': {'color': '#8FB3FC'}}, {'name': '经典海投计划计划', 'itemStyle': {'color': '#8FB3FC'}}, {'name': '小米11', 'itemStyle': {'color': '#8FE5C3'}}, {'name': '小米11pro', 'itemStyle': {'color': '#8FE5C3'}}, {'name': '小米11 Ultra', 'itemStyle': {'color': '#8FE5C3'}}, {'name': '小米11青春', 'itemStyle': {'color': '#8FE5C3'}}, {'name': 'K40', 'itemStyle': {'color': '#8FE5C3'}}, {'name': 'K40Pro', 'itemStyle': {'color': '#8FE5C3'}}, {'name': 'K40游戏版', 'itemStyle': {'color': '#8FE5C3'}}, {'name': 'Note9 4G', 'itemStyle': {'color': '#8FE5C3'}}, {'name': 'Note9 5G', 'itemStyle': {'color': '#8FE5C3'}}, {'name': 'Note9 Pro', 'itemStyle': {'color': '#8FE5C3'}}, {'name': 'Note10', 'itemStyle': {'color': '#8FE5C3'}}, {'name': 'Note10 Pro', 'itemStyle': {'color': '#8FE5C3'}}, {'name': '小米10s', 'itemStyle': {'color': '#8FE5C3'}}, {'name': '小米fold', 'itemStyle': {'color': '#8FE5C3'}}, {'name': 'K30S', 'itemStyle': {'color': '#8FE5C3'}}, {'name': 'MIX4', 'itemStyle': {'color': '#8FE5C3'}}, {'name': '小米平板5', 'itemStyle': {'color': '#8FE5C3'}}, {'name': '小米平板5Pro', 'itemStyle': {'color': '#8FE5C3'}}], 'links': [{'source': '京东展位', 'target': '小米11-计划', 'value': 6688071}, {'source': '京东展位', 'target': '小米11Pro计划', 'value': 1694848}, {'source': '京东展位', 'target': '小米11至尊计划', 'value': 1752551}, {'source': '京东展位', 'target': '小米11青春计划', 'value': 2520599}, {'source': '京东展位', 'target': 'K40-计划', 'value': 0}, {'source': '京东展位', 'target': 'K40P计划', 'value': 6314967}, {'source': '京东展位', 'target': 'K40游戏计划', 'value': 1340002}, {'source': '京东展位', 'target': 'Note9-4G计划', 'value': 0}, {'source': '京东展位', 'target': 'Note9-5G计划', 'value': 4771104}, {'source': '京东展位', 'target': 'Note9-Pro计划', 'value': 0}, {'source': '京东展位', 'target': 'Note10-计划', 'value': 0}, {'source': '京东展位', 'target': 'Note10Pro计划', 'value': 7989816}, {'source': '京东展位', 'target': '米10s计划', 'value': 0}, {'source': '京东展位', 'target': 'MIX-FOLD计划', 'value': 0}, {'source': '京东展位', 'target': 'K30S计划', 'value': 0}, {'source': '京东展位', 'target': 'MIX4计划', 'value': 768841}, {'source': '京东展位', 'target': 'K81A计划', 'value': 0}, {'source': '京东展位', 'target': '小米平板5-计划', 'value': 0}, {'source': '京东展位', 'target': '小米平板5Pro计划', 'value': 38786}, {'source': '京东展位', 'target': '荣耀magic拦截计划计划', 'value': 0}, {'source': '京东展位', 'target': '高端聚合页计划', 'value': 0}, {'source': '京东展位', 'target': '店铺首页计划', 'value': 0}, {'source': '京东展位', 'target': '高端人群计划', 'value': 0}, {'source': '京东展位', 'target': '全场景计划', 'value': 0}, {'source': '京东展位', 'target': '经典海投计划计划', 'value': 0}, {'source': '京东快车', 'target': '小米11-计划', 'value': 9820553}, {'source': '京东快车', 'target': '小米11Pro计划', 'value': 22108642}, {'source': '京东快车', 'target': '小米11至尊计划', 'value': 3645159}, {'source': '京东快车', 'target': '小米11青春计划', 'value': 7734505}, {'source': '京东快车', 'target': 'K40-计划', 'value': 20369036}, {'source': '京东快车', 'target': 'K40P计划', 'value': 21940056}, {'source': '京东快车', 'target': 'K40游戏计划', 'value': 4191244}, {'source': '京东快车', 'target': 'Note9-4G计划', 'value': 6810121}, {'source': '京东快车', 'target': 'Note9-5G计划', 'value': 11245749}, {'source': '京东快车', 'target': 'Note9-Pro计划', 'value': 8387763}, {'source': '京东快车', 'target': 'Note10-计划', 'value': 6210727}, {'source': '京东快车', 'target': 'Note10Pro计划', 'value': 11136308}, {'source': '京东快车', 'target': '米10s计划', 'value': 2879127}, {'source': '京东快车', 'target': 'MIX-FOLD计划', 'value': 0}, {'source': '京东快车', 'target': 'K30S计划', 'value': 0}, {'source': '京东快车', 'target': 'MIX4计划', 'value': 2528897}, {'source': '京东快车', 'target': 'K81A计划', 'value': 69626}, {'source': '京东快车', 'target': '小米平板5-计划', 'value': 1875698}, {'source': '京东快车', 'target': '小米平板5Pro计划', 'value': 688481}, {'source': '京东快车', 'target': '荣耀magic拦截计划计划', 'value': 0}, {'source': '京东快车', 'target': '高端聚合页计划', 'value': 0}, {'source': '京东快车', 'target': '店铺首页计划', 'value': 0}, {'source': '京东快车', 'target': '高端人群计划', 'value': 0}, {'source': '京东快车', 'target': '全场景计划', 'value': 0}, {'source': '京东快车', 'target': '经典海投计划计划', 'value': 0}, {'source': '品牌聚效', 'target': '小米11-计划', 'value': 0}, {'source': '品牌聚效', 'target': '小米11Pro计划', 'value': 0}, {'source': '品牌聚效', 'target': '小米11至尊计划', 'value': 0}, {'source': '品牌聚效', 'target': '小米11青春计划', 'value': 0}, {'source': '品牌聚效', 'target': 'K40-计划', 'value': 0}, {'source': '品牌聚效', 'target': 'K40P计划', 'value': 0}, {'source': '品牌聚效', 'target': 'K40游戏计划', 'value': 0}, {'source': '品牌聚效', 'target': 'Note9-4G计划', 'value': 0}, {'source': '品牌聚效', 'target': 'Note9-5G计划', 'value': 0}, {'source': '品牌聚效', 'target': 'Note9-Pro计划', 'value': 0}, {'source': '品牌聚效', 'target': 'Note10-计划', 'value': 0}, {'source': '品牌聚效', 'target': 'Note10Pro计划', 'value': 0}, {'source': '品牌聚效', 'target': '米10s计划', 'value': 0}, {'source': '品牌聚效', 'target': 'MIX-FOLD计划', 'value': 0}, {'source': '品牌聚效', 'target': 'K30S计划', 'value': 0}, {'source': '品牌聚效', 'target': 'MIX4计划', 'value': 0}, {'source': '品牌聚效', 'target': 'K81A计划', 'value': 0}, {'source': '品牌聚效', 'target': '小米平板5-计划', 'value': 0}, {'source': '品牌聚效', 'target': '小米平板5Pro计划', 'value': 0}, {'source': '品牌聚效', 'target': '荣耀magic拦截计划计划', 'value': 0}, {'source': '品牌聚效', 'target': '高端聚合页计划', 'value': 0}, {'source': '品牌聚效', 'target': '店铺首页计划', 'value': 0}, {'source': '品牌聚效', 'target': '高端人群计划', 'value': 0}, {'source': '品牌聚效', 'target': '全场景计划', 'value': 0}, {'source': '品牌聚效', 'target': '经典海投计划计划', 'value': 0}, {'source': '海投', 'target': '小米11-计划', 'value': 0}, {'source': '海投', 'target': '小米11Pro计划', 'value': 0}, {'source': '海投', 'target': '小米11至尊计划', 'value': 0}, {'source': '海投', 'target': '小米11青春计划', 'value': 0}, {'source': '海投', 'target': 'K40-计划', 'value': 0}, {'source': '海投', 'target': 'K40P计划', 'value': 0}, {'source': '海投', 'target': 'K40游戏计划', 'value': 0}, {'source': '海投', 'target': 'Note9-4G计划', 'value': 0}, {'source': '海投', 'target': 'Note9-5G计划', 'value': 0}, {'source': '海投', 'target': 'Note9-Pro计划', 'value': 0}, {'source': '海投', 'target': 'Note10-计划', 'value': 0}, {'source': '海投', 'target': 'Note10Pro计划', 'value': 0}, {'source': '海投', 'target': '米10s计划', 'value': 0}, {'source': '海投', 'target': 'MIX-FOLD计划', 'value': 0}, {'source': '海投', 'target': 'K30S计划', 'value': 0}, {'source': '海投', 'target': 'MIX4计划', 'value': 0}, {'source': '海投', 'target': 'K81A计划', 'value': 0}, {'source': '海投', 'target': '小米平板5-计划', 'value': 0}, {'source': '海投', 'target': '小米平板5Pro计划', 'value': 0}, {'source': '海投', 'target': '荣耀magic拦截计划计划', 'value': 0}, {'source': '海投', 'target': '高端聚合页计划', 'value': 0}, {'source': '海投', 'target': '店铺首页计划', 'value': 0}, {'source': '海投', 'target': '高端人群计划', 'value': 0}, {'source': '海投', 'target': '全场景计划', 'value': 0}, {'source': '海投', 'target': '经典海投计划计划', 'value': 39308784}, {'source': '购物触点', 'target': '小米11-计划', 'value': 3205399}, {'source': '购物触点', 'target': '小米11Pro计划', 'value': 2227786}, {'source': '购物触点', 'target': '小米11至尊计划', 'value': 377819}, {'source': '购物触点', 'target': '小米11青春计划', 'value': 2917234}, {'source': '购物触点', 'target': 'K40-计划', 'value': 8356964}, {'source': '购物触点', 'target': 'K40P计划', 'value': 6322257}, {'source': '购物触点', 'target': 'K40游戏计划', 'value': 3458980}, {'source': '购物触点', 'target': 'Note9-4G计划', 'value': 2770544}, {'source': '购物触点', 'target': 'Note9-5G计划', 'value': 5165159}, {'source': '购物触点', 'target': 'Note9-Pro计划', 'value': 2279923}, {'source': '购物触点', 'target': 'Note10-计划', 'value': 1889156}, {'source': '购物触点', 'target': 'Note10Pro计划', 'value': 4242714}, {'source': '购物触点', 'target': '米10s计划', 'value': 1804474}, {'source': '购物触点', 'target': 'MIX-FOLD计划', 'value': 0}, {'source': '购物触点', 'target': 'K30S计划', 'value': 0}, {'source': '购物触点', 'target': 'MIX4计划', 'value': 738933}, {'source': '购物触点', 'target': 'K81A计划', 'value': 11264}, {'source': '购物触点', 'target': '小米平板5-计划', 'value': 183944}, {'source': '购物触点', 'target': '小米平板5Pro计划', 'value': 104597}, {'source': '购物触点', 'target': '荣耀magic拦截计划计划', 'value': 0}, {'source': '购物触点', 'target': '高端聚合页计划', 'value': 0}, {'source': '购物触点', 'target': '店铺首页计划', 'value': 0}, {'source': '购物触点', 'target': '高端人群计划', 'value': 0}, {'source': '购物触点', 'target': '全场景计划', 'value': 0}, {'source': '购物触点', 'target': '经典海投计划计划', 'value': 0}, {'source': '小米11-计划', 'target': '小米11', 'value': 6714360}, {'source': '小米11-计划', 'target': '小米11pro', 'value': 1755489}, {'source': '小米11-计划', 'target': '小米11 Ultra', 'value': 617856}, {'source': '小米11-计划', 'target': '小米11青春', 'value': 516339}, {'source': '小米11-计划', 'target': 'K40', 'value': 2530518}, {'source': '小米11-计划', 'target': 'K40Pro', 'value': 1207231}, {'source': '小米11-计划', 'target': 'K40游戏版', 'value': 1301262}, {'source': '小米11-计划', 'target': 'Note9 4G', 'value': 268605}, {'source': '小米11-计划', 'target': 'Note9 5G', 'value': 221814}, {'source': '小米11-计划', 'target': 'Note9 Pro', 'value': 258706}, {'source': '小米11-计划', 'target': 'Note10', 'value': 162165}, {'source': '小米11-计划', 'target': 'Note10 Pro', 'value': 799029}, {'source': '小米11-计划', 'target': '小米10s', 'value': 1856341}, {'source': '小米11-计划', 'target': '小米fold', 'value': 58994}, {'source': '小米11-计划', 'target': 'K30S', 'value': 99361}, {'source': '小米11-计划', 'target': 'MIX4', 'value': 173968}, {'source': '小米11-计划', 'target': '小米平板5', 'value': 0}, {'source': '小米11-计划', 'target': '小米平板5Pro', 'value': 0}, {'source': '小米11Pro计划', 'target': '小米11', 'value': 3687469}, {'source': '小米11Pro计划', 'target': '小米11pro', 'value': 14469783}, {'source': '小米11Pro计划', 'target': '小米11 Ultra', 'value': 1884817}, {'source': '小米11Pro计划', 'target': '小米11青春', 'value': 328345}, {'source': '小米11Pro计划', 'target': 'K40', 'value': 1290423}, {'source': '小米11Pro计划', 'target': 'K40Pro', 'value': 782022}, {'source': '小米11Pro计划', 'target': 'K40游戏版', 'value': 524625}, {'source': '小米11Pro计划', 'target': 'Note9 4G', 'value': 144837}, {'source': '小米11Pro计划', 'target': 'Note9 5G', 'value': 107675}, {'source': '小米11Pro计划', 'target': 'Note9 Pro', 'value': 185492}, {'source': '小米11Pro计划', 'target': 'Note10', 'value': 60850}, {'source': '小米11Pro计划', 'target': 'Note10 Pro', 'value': 519623}, {'source': '小米11Pro计划', 'target': '小米10s', 'value': 987521}, {'source': '小米11Pro计划', 'target': '小米fold', 'value': 36996}, {'source': '小米11Pro计划', 'target': 'K30S', 'value': 59575}, {'source': '小米11Pro计划', 'target': 'MIX4', 'value': 293844}, {'source': '小米11Pro计划', 'target': '小米平板5', 'value': 0}, {'source': '小米11Pro计划', 'target': '小米平板5Pro', 'value': 0}, {'source': '小米11至尊计划', 'target': '小米11', 'value': 412296}, {'source': '小米11至尊计划', 'target': '小米11pro', 'value': 726917}, {'source': '小米11至尊计划', 'target': '小米11 Ultra', 'value': 2812709}, {'source': '小米11至尊计划', 'target': '小米11青春', 'value': 74007}, {'source': '小米11至尊计划', 'target': 'K40', 'value': 416203}, {'source': '小米11至尊计划', 'target': 'K40Pro', 'value': 121899}, {'source': '小米11至尊计划', 'target': 'K40游戏版', 'value': 350095}, {'source': '小米11至尊计划', 'target': 'Note9 4G', 'value': 60912}, {'source': '小米11至尊计划', 'target': 'Note9 5G', 'value': 21563}, {'source': '小米11至尊计划', 'target': 'Note9 Pro', 'value': 54786}, {'source': '小米11至尊计划', 'target': 'Note10', 'value': 25679}, {'source': '小米11至尊计划', 'target': 'Note10 Pro', 'value': 145575}, {'source': '小米11至尊计划', 'target': '小米10s', 'value': 205958}, {'source': '小米11至尊计划', 'target': '小米fold', 'value': 77992}, {'source': '小米11至尊计划', 'target': 'K30S', 'value': 30487}, {'source': '小米11至尊计划', 'target': 'MIX4', 'value': 46892}, {'source': '小米11至尊计划', 'target': '小米平板5', 'value': 0}, {'source': '小米11至尊计划', 'target': '小米平板5Pro', 'value': 0}, {'source': '小米11青春计划', 'target': '小米11', 'value': 434811}, {'source': '小米11青春计划', 'target': '小米11pro', 'value': 171451}, {'source': '小米11青春计划', 'target': '小米11 Ultra', 'value': 79880}, {'source': '小米11青春计划', 'target': '小米11青春', 'value': 5010903}, {'source': '小米11青春计划', 'target': 'K40', 'value': 2508112}, {'source': '小米11青春计划', 'target': 'K40Pro', 'value': 296230}, {'source': '小米11青春计划', 'target': 'K40游戏版', 'value': 635611}, {'source': '小米11青春计划', 'target': 'Note9 4G', 'value': 263517}, {'source': '小米11青春计划', 'target': 'Note9 5G', 'value': 229094}, {'source': '小米11青春计划', 'target': 'Note9 Pro', 'value': 649448}, {'source': '小米11青春计划', 'target': 'Note10', 'value': 169158}, {'source': '小米11青春计划', 'target': 'Note10 Pro', 'value': 1383862}, {'source': '小米11青春计划', 'target': '小米10s', 'value': 504022}, {'source': '小米11青春计划', 'target': '小米fold', 'value': 0}, {'source': '小米11青春计划', 'target': 'K30S', 'value': 128945}, {'source': '小米11青春计划', 'target': 'MIX4', 'value': 43593}, {'source': '小米11青春计划', 'target': '小米平板5', 'value': 0}, {'source': '小米11青春计划', 'target': '小米平板5Pro', 'value': 0}, {'source': 'K40-计划', 'target': '小米11', 'value': 415217}, {'source': 'K40-计划', 'target': '小米11pro', 'value': 827769}, {'source': 'K40-计划', 'target': '小米11 Ultra', 'value': 175268}, {'source': 'K40-计划', 'target': '小米11青春', 'value': 486742}, {'source': 'K40-计划', 'target': 'K40', 'value': 18439284}, {'source': 'K40-计划', 'target': 'K40Pro', 'value': 2546777}, {'source': 'K40-计划', 'target': 'K40游戏版', 'value': 1873388}, {'source': 'K40-计划', 'target': 'Note9 4G', 'value': 186767}, {'source': 'K40-计划', 'target': 'Note9 5G', 'value': 144746}, {'source': 'K40-计划', 'target': 'Note9 Pro', 'value': 419532}, {'source': 'K40-计划', 'target': 'Note10', 'value': 82828}, {'source': 'K40-计划', 'target': 'Note10 Pro', 'value': 1386113}, {'source': 'K40-计划', 'target': '小米10s', 'value': 744181}, {'source': 'K40-计划', 'target': '小米fold', 'value': 26997}, {'source': 'K40-计划', 'target': 'K30S', 'value': 344257}, {'source': 'K40-计划', 'target': 'MIX4', 'value': 79085}, {'source': 'K40-计划', 'target': '小米平板5', 'value': 0}, {'source': 'K40-计划', 'target': '小米平板5Pro', 'value': 0}, {'source': 'K40P计划', 'target': '小米11', 'value': 956478}, {'source': 'K40P计划', 'target': '小米11pro', 'value': 1306283}, {'source': 'K40P计划', 'target': '小米11 Ultra', 'value': 213451}, {'source': 'K40P计划', 'target': '小米11青春', 'value': 211824}, {'source': 'K40P计划', 'target': 'K40', 'value': 8851989}, {'source': 'K40P计划', 'target': 'K40Pro', 'value': 17848679}, {'source': 'K40P计划', 'target': 'K40游戏版', 'value': 1542163}, {'source': 'K40P计划', 'target': 'Note9 4G', 'value': 186867}, {'source': 'K40P计划', 'target': 'Note9 5G', 'value': 129757}, {'source': 'K40P计划', 'target': 'Note9 Pro', 'value': 261944}, {'source': 'K40P计划', 'target': 'Note10', 'value': 89423}, {'source': 'K40P计划', 'target': 'Note10 Pro', 'value': 848557}, {'source': 'K40P计划', 'target': '小米10s', 'value': 1105579}, {'source': 'K40P计划', 'target': '小米fold', 'value': 17998}, {'source': 'K40P计划', 'target': 'K30S', 'value': 229603}, {'source': 'K40P计划', 'target': 'MIX4', 'value': 79684}, {'source': 'K40P计划', 'target': '小米平板5', 'value': 0}, {'source': 'K40P计划', 'target': '小米平板5Pro', 'value': 0}, {'source': 'K40游戏计划', 'target': '小米11', 'value': 95975}, {'source': 'K40游戏计划', 'target': '小米11pro', 'value': 331073}, {'source': 'K40游戏计划', 'target': '小米11 Ultra', 'value': 31193}, {'source': 'K40游戏计划', 'target': '小米11青春', 'value': 71487}, {'source': 'K40游戏计划', 'target': 'K40', 'value': 2188242}, {'source': 'K40游戏计划', 'target': 'K40Pro', 'value': 502124}, {'source': 'K40游戏计划', 'target': 'K40游戏版', 'value': 4910072}, {'source': 'K40游戏计划', 'target': 'Note9 4G', 'value': 61911}, {'source': 'K40游戏计划', 'target': 'Note9 5G', 'value': 24072}, {'source': 'K40游戏计划', 'target': 'Note9 Pro', 'value': 76805}, {'source': 'K40游戏计划', 'target': 'Note10', 'value': 27178}, {'source': 'K40游戏计划', 'target': 'Note10 Pro', 'value': 309396}, {'source': 'K40游戏计划', 'target': '小米10s', 'value': 106478}, {'source': 'K40游戏计划', 'target': '小米fold', 'value': 8999}, {'source': 'K40游戏计划', 'target': 'K30S', 'value': 63473}, {'source': 'K40游戏计划', 'target': 'MIX4', 'value': 18996}, {'source': 'K40游戏计划', 'target': '小米平板5', 'value': 0}, {'source': 'K40游戏计划', 'target': '小米平板5Pro', 'value': 0}, {'source': 'Note9-4G计划', 'target': '小米11', 'value': 3999}, {'source': 'Note9-4G计划', 'target': '小米11pro', 'value': 226110}, {'source': 'Note9-4G计划', 'target': '小米11 Ultra', 'value': 5999}, {'source': 'Note9-4G计划', 'target': '小米11青春', 'value': 24199}, {'source': 'Note9-4G计划', 'target': 'K40', 'value': 167790}, {'source': 'Note9-4G计划', 'target': 'K40Pro', 'value': 17426}, {'source': 'Note9-4G计划', 'target': 'K40游戏版', 'value': 122966}, {'source': 'Note9-4G计划', 'target': 'Note9 4G', 'value': 5329525}, {'source': 'Note9-4G计划', 'target': 'Note9 5G', 'value': 558461}, {'source': 'Note9-4G计划', 'target': 'Note9 Pro', 'value': 172586}, {'source': 'Note9-4G计划', 'target': 'Note10', 'value': 357592}, {'source': 'Note9-4G计划', 'target': 'Note10 Pro', 'value': 308219}, {'source': 'Note9-4G计划', 'target': '小米10s', 'value': 13366}, {'source': 'Note9-4G计划', 'target': '小米fold', 'value': 0}, {'source': 'Note9-4G计划', 'target': 'K30S', 'value': 6897}, {'source': 'Note9-4G计划', 'target': 'MIX4', 'value': 5799}, {'source': 'Note9-4G计划', 'target': '小米平板5', 'value': 0}, {'source': 'Note9-4G计划', 'target': '小米平板5Pro', 'value': 0}, {'source': 'Note9-5G计划', 'target': '小米11', 'value': 54986}, {'source': 'Note9-5G计划', 'target': '小米11pro', 'value': 149265}, {'source': 'Note9-5G计划', 'target': '小米11 Ultra', 'value': 12796}, {'source': 'Note9-5G计划', 'target': '小米11青春', 'value': 152779}, {'source': 'Note9-5G计划', 'target': 'K40', 'value': 1196909}, {'source': 'Note9-5G计划', 'target': 'K40Pro', 'value': 210287}, {'source': 'Note9-5G计划', 'target': 'K40游戏版', 'value': 629330}, {'source': 'Note9-5G计划', 'target': 'Note9 4G', 'value': 2690984}, {'source': 'Note9-5G计划', 'target': 'Note9 5G', 'value': 9625772}, {'source': 'Note9-5G计划', 'target': 'Note9 Pro', 'value': 1890480}, {'source': 'Note9-5G计划', 'target': 'Note10', 'value': 1199462}, {'source': 'Note9-5G计划', 'target': 'Note10 Pro', 'value': 2024777}, {'source': 'Note9-5G计划', 'target': '小米10s', 'value': 53554}, {'source': 'Note9-5G计划', 'target': '小米fold', 'value': 0}, {'source': 'Note9-5G计划', 'target': 'K30S', 'value': 34985}, {'source': 'Note9-5G计划', 'target': 'MIX4', 'value': 23696}, {'source': 'Note9-5G计划', 'target': '小米平板5', 'value': 0}, {'source': 'Note9-5G计划', 'target': '小米平板5Pro', 'value': 0}, {'source': 'Note9-Pro计划', 'target': '小米11', 'value': 19398}, {'source': 'Note9-Pro计划', 'target': '小米11pro', 'value': 32963}, {'source': 'Note9-Pro计划', 'target': '小米11 Ultra', 'value': 0}, {'source': 'Note9-Pro计划', 'target': '小米11青春', 'value': 114977}, {'source': 'Note9-Pro计划', 'target': 'K40', 'value': 351396}, {'source': 'Note9-Pro计划', 'target': 'K40Pro', 'value': 37739}, {'source': 'Note9-Pro计划', 'target': 'K40游戏版', 'value': 113508}, {'source': 'Note9-Pro计划', 'target': 'Note9 4G', 'value': 386639}, {'source': 'Note9-Pro计划', 'target': 'Note9 5G', 'value': 856764}, {'source': 'Note9-Pro计划', 'target': 'Note9 Pro', 'value': 6159406}, {'source': 'Note9-Pro计划', 'target': 'Note10', 'value': 178654}, {'source': 'Note9-Pro计划', 'target': 'Note10 Pro', 'value': 2064291}, {'source': 'Note9-Pro计划', 'target': '小米10s', 'value': 38168}, {'source': 'Note9-Pro计划', 'target': '小米fold', 'value': 0}, {'source': 'Note9-Pro计划', 'target': 'K30S', 'value': 18592}, {'source': 'Note9-Pro计划', 'target': 'MIX4', 'value': 0}, {'source': 'Note9-Pro计划', 'target': '小米平板5', 'value': 0}, {'source': 'Note9-Pro计划', 'target': '小米平板5Pro', 'value': 0}, {'source': 'Note10-计划', 'target': '小米11', 'value': 11797}, {'source': 'Note10-计划', 'target': '小米11pro', 'value': 14109}, {'source': 'Note10-计划', 'target': '小米11 Ultra', 'value': 17997}, {'source': 'Note10-计划', 'target': '小米11青春', 'value': 68518}, {'source': 'Note10-计划', 'target': 'K40', 'value': 439623}, {'source': 'Note10-计划', 'target': 'K40Pro', 'value': 27233}, {'source': 'Note10-计划', 'target': 'K40游戏版', 'value': 352390}, {'source': 'Note10-计划', 'target': 'Note9 4G', 'value': 1137014}, {'source': 'Note10-计划', 'target': 'Note9 5G', 'value': 1267625}, {'source': 'Note10-计划', 'target': 'Note9 Pro', 'value': 394390}, {'source': 'Note10-计划', 'target': 'Note10', 'value': 2367283}, {'source': 'Note10-计划', 'target': 'Note10 Pro', 'value': 1395613}, {'source': 'Note10-计划', 'target': '小米10s', 'value': 29661}, {'source': 'Note10-计划', 'target': '小米fold', 'value': 0}, {'source': 'Note10-计划', 'target': 'K30S', 'value': 14194}, {'source': 'Note10-计划', 'target': 'MIX4', 'value': 0}, {'source': 'Note10-计划', 'target': '小米平板5', 'value': 0}, {'source': 'Note10-计划', 'target': '小米平板5Pro', 'value': 0}, {'source': 'Note10Pro计划', 'target': '小米11', 'value': 104101}, {'source': 'Note10Pro计划', 'target': '小米11pro', 'value': 336014}, {'source': 'Note10Pro计划', 'target': '小米11 Ultra', 'value': 44294}, {'source': 'Note10Pro计划', 'target': '小米11青春', 'value': 489165}, {'source': 'Note10Pro计划', 'target': 'K40', 'value': 2966121}, {'source': 'Note10Pro计划', 'target': 'K40Pro', 'value': 368365}, {'source': 'Note10Pro计划', 'target': 'K40游戏版', 'value': 1459968}, {'source': 'Note10Pro计划', 'target': 'Note9 4G', 'value': 586314}, {'source': 'Note10Pro计划', 'target': 'Note9 5G', 'value': 665869}, {'source': 'Note10Pro计划', 'target': 'Note9 Pro', 'value': 1760823}, {'source': 'Note10Pro计划', 'target': 'Note10', 'value': 456019}, {'source': 'Note10Pro计划', 'target': 'Note10 Pro', 'value': 12236258}, {'source': 'Note10Pro计划', 'target': '小米10s', 'value': 215035}, {'source': 'Note10Pro计划', 'target': '小米fold', 'value': 0}, {'source': 'Note10Pro计划', 'target': 'K30S', 'value': 201314}, {'source': 'Note10Pro计划', 'target': 'MIX4', 'value': 67388}, {'source': 'Note10Pro计划', 'target': '小米平板5', 'value': 0}, {'source': 'Note10Pro计划', 'target': '小米平板5Pro', 'value': 0}, {'source': '米10s计划', 'target': '小米11', 'value': 330115}, {'source': '米10s计划', 'target': '小米11pro', 'value': 142233}, {'source': '米10s计划', 'target': '小米11 Ultra', 'value': 81185}, {'source': '米10s计划', 'target': '小米11青春', 'value': 97247}, {'source': '米10s计划', 'target': 'K40', 'value': 478255}, {'source': '米10s计划', 'target': 'K40Pro', 'value': 193708}, {'source': '米10s计划', 'target': 'K40游戏版', 'value': 79480}, {'source': '米10s计划', 'target': 'Note9 4G', 'value': 29403}, {'source': '米10s计划', 'target': 'Note9 5G', 'value': 21976}, {'source': '米10s计划', 'target': 'Note9 Pro', 'value': 34740}, {'source': '米10s计划', 'target': 'Note10', 'value': 5196}, {'source': '米10s计划', 'target': 'Note10 Pro', 'value': 105401}, {'source': '米10s计划', 'target': '小米10s', 'value': 2898354}, {'source': '米10s计划', 'target': '小米fold', 'value': 8999}, {'source': '米10s计划', 'target': 'K30S', 'value': 40083}, {'source': '米10s计划', 'target': 'MIX4', 'value': 6299}, {'source': '米10s计划', 'target': '小米平板5', 'value': 0}, {'source': '米10s计划', 'target': '小米平板5Pro', 'value': 0}, {'source': 'MIX-FOLD计划', 'target': '小米11', 'value': 0}, {'source': 'MIX-FOLD计划', 'target': '小米11pro', 'value': 0}, {'source': 'MIX-FOLD计划', 'target': '小米11 Ultra', 'value': 0}, {'source': 'MIX-FOLD计划', 'target': '小米11青春', 'value': 0}, {'source': 'MIX-FOLD计划', 'target': 'K40', 'value': 0}, {'source': 'MIX-FOLD计划', 'target': 'K40Pro', 'value': 0}, {'source': 'MIX-FOLD计划', 'target': 'K40游戏版', 'value': 0}, {'source': 'MIX-FOLD计划', 'target': 'Note9 4G', 'value': 0}, {'source': 'MIX-FOLD计划', 'target': 'Note9 5G', 'value': 0}, {'source': 'MIX-FOLD计划', 'target': 'Note9 Pro', 'value': 0}, {'source': 'MIX-FOLD计划', 'target': 'Note10', 'value': 0}, {'source': 'MIX-FOLD计划', 'target': 'Note10 Pro', 'value': 0}, {'source': 'MIX-FOLD计划', 'target': '小米10s', 'value': 0}, {'source': 'MIX-FOLD计划', 'target': '小米fold', 'value': 0}, {'source': 'MIX-FOLD计划', 'target': 'K30S', 'value': 0}, {'source': 'MIX-FOLD计划', 'target': 'MIX4', 'value': 0}, {'source': 'MIX-FOLD计划', 'target': '小米平板5', 'value': 0}, {'source': 'MIX-FOLD计划', 'target': '小米平板5Pro', 'value': 0}, {'source': 'K30S计划', 'target': '小米11', 'value': 0}, {'source': 'K30S计划', 'target': '小米11pro', 'value': 0}, {'source': 'K30S计划', 'target': '小米11 Ultra', 'value': 0}, {'source': 'K30S计划', 'target': '小米11青春', 'value': 0}, {'source': 'K30S计划', 'target': 'K40', 'value': 0}, {'source': 'K30S计划', 'target': 'K40Pro', 'value': 0}, {'source': 'K30S计划', 'target': 'K40游戏版', 'value': 0}, {'source': 'K30S计划', 'target': 'Note9 4G', 'value': 0}, {'source': 'K30S计划', 'target': 'Note9 5G', 'value': 0}, {'source': 'K30S计划', 'target': 'Note9 Pro', 'value': 0}, {'source': 'K30S计划', 'target': 'Note10', 'value': 0}, {'source': 'K30S计划', 'target': 'Note10 Pro', 'value': 0}, {'source': 'K30S计划', 'target': '小米10s', 'value': 0}, {'source': 'K30S计划', 'target': '小米fold', 'value': 0}, {'source': 'K30S计划', 'target': 'K30S', 'value': 0}, {'source': 'K30S计划', 'target': 'MIX4', 'value': 0}, {'source': 'K30S计划', 'target': '小米平板5', 'value': 0}, {'source': 'K30S计划', 'target': '小米平板5Pro', 'value': 0}, {'source': 'MIX4计划', 'target': '小米11', 'value': 299526}, {'source': 'MIX4计划', 'target': '小米11pro', 'value': 418399}, {'source': 'MIX4计划', 'target': '小米11 Ultra', 'value': 380507}, {'source': 'MIX4计划', 'target': '小米11青春', 'value': 126543}, {'source': 'MIX4计划', 'target': 'K40', 'value': 717232}, {'source': 'MIX4计划', 'target': 'K40Pro', 'value': 100068}, {'source': 'MIX4计划', 'target': 'K40游戏版', 'value': 309776}, {'source': 'MIX4计划', 'target': 'Note9 4G', 'value': 92879}, {'source': 'MIX4计划', 'target': 'Note9 5G', 'value': 66547}, {'source': 'MIX4计划', 'target': 'Note9 Pro', 'value': 74813}, {'source': 'MIX4计划', 'target': 'Note10', 'value': 64845}, {'source': 'MIX4计划', 'target': 'Note10 Pro', 'value': 299350}, {'source': 'MIX4计划', 'target': '小米10s', 'value': 266529}, {'source': 'MIX4计划', 'target': '小米fold', 'value': 134986}, {'source': 'MIX4计划', 'target': 'K30S', 'value': 21491}, {'source': 'MIX4计划', 'target': 'MIX4', 'value': 424127}, {'source': 'MIX4计划', 'target': '小米平板5', 'value': 0}, {'source': 'MIX4计划', 'target': '小米平板5Pro', 'value': 0}, {'source': 'K81A计划', 'target': '小米11', 'value': 0}, {'source': 'K81A计划', 'target': '小米11pro', 'value': 4868}, {'source': 'K81A计划', 'target': '小米11 Ultra', 'value': 17894}, {'source': 'K81A计划', 'target': '小米11青春', 'value': 6567}, {'source': 'K81A计划', 'target': 'K40', 'value': 19632}, {'source': 'K81A计划', 'target': 'K40Pro', 'value': 0}, {'source': 'K81A计划', 'target': 'K40游戏版', 'value': 11575}, {'source': 'K81A计划', 'target': 'Note9 4G', 'value': 5025}, {'source': 'K81A计划', 'target': 'Note9 5G', 'value': 0}, {'source': 'K81A计划', 'target': 'Note9 Pro', 'value': 1569}, {'source': 'K81A计划', 'target': 'Note10', 'value': 2198}, {'source': 'K81A计划', 'target': 'Note10 Pro', 'value': 5397}, {'source': 'K81A计划', 'target': '小米10s', 'value': 3399}, {'source': 'K81A计划', 'target': '小米fold', 'value': 0}, {'source': 'K81A计划', 'target': 'K30S', 'value': 0}, {'source': 'K81A计划', 'target': 'MIX4', 'value': 0}, {'source': 'K81A计划', 'target': '小米平板5', 'value': 0}, {'source': 'K81A计划', 'target': '小米平板5Pro', 'value': 0}, {'source': '小米平板5-计划', 'target': '小米11', 'value': 38790}, {'source': '小米平板5-计划', 'target': '小米11pro', 'value': 61490}, {'source': '小米平板5-计划', 'target': '小米11 Ultra', 'value': 71983}, {'source': '小米平板5-计划', 'target': '小米11青春', 'value': 20361}, {'source': '小米平板5-计划', 'target': 'K40', 'value': 132136}, {'source': '小米平板5-计划', 'target': 'K40Pro', 'value': 34792}, {'source': '小米平板5-计划', 'target': 'K40游戏版', 'value': 43162}, {'source': '小米平板5-计划', 'target': 'Note9 4G', 'value': 17376}, {'source': '小米平板5-计划', 'target': 'Note9 5G', 'value': 31034}, {'source': '小米平板5-计划', 'target': 'Note9 Pro', 'value': 23666}, {'source': '小米平板5-计划', 'target': 'Note10', 'value': 10691}, {'source': '小米平板5-计划', 'target': 'Note10 Pro', 'value': 83682}, {'source': '小米平板5-计划', 'target': '小米10s', 'value': 39489}, {'source': '小米平板5-计划', 'target': '小米fold', 'value': 8999}, {'source': '小米平板5-计划', 'target': 'K30S', 'value': 6997}, {'source': '小米平板5-计划', 'target': 'MIX4', 'value': 151168}, {'source': '小米平板5-计划', 'target': '小米平板5', 'value': 1250162}, {'source': '小米平板5-计划', 'target': '小米平板5Pro', 'value': 0}, {'source': '小米平板5Pro计划', 'target': '小米11', 'value': 7798}, {'source': '小米平板5Pro计划', 'target': '小米11pro', 'value': 28763}, {'source': '小米平板5Pro计划', 'target': '小米11 Ultra', 'value': 31094}, {'source': '小米平板5Pro计划', 'target': '小米11青春', 'value': 6297}, {'source': '小米平板5Pro计划', 'target': 'K40', 'value': 67622}, {'source': '小米平板5Pro计划', 'target': 'K40Pro', 'value': 22043}, {'source': '小米平板5Pro计划', 'target': 'K40游戏版', 'value': 48638}, {'source': '小米平板5Pro计划', 'target': 'Note9 4G', 'value': 9910}, {'source': '小米平板5Pro计划', 'target': 'Note9 5G', 'value': 37775}, {'source': '小米平板5Pro计划', 'target': 'Note9 Pro', 'value': 9884}, {'source': '小米平板5Pro计划', 'target': 'Note10', 'value': 18086}, {'source': '小米平板5Pro计划', 'target': 'Note10 Pro', 'value': 43806}, {'source': '小米平板5Pro计划', 'target': '小米10s', 'value': 25192}, {'source': '小米平板5Pro计划', 'target': '小米fold', 'value': 29997}, {'source': '小米平板5Pro计划', 'target': 'K30S', 'value': 4598}, {'source': '小米平板5Pro计划', 'target': 'MIX4', 'value': 135578}, {'source': '小米平板5Pro计划', 'target': '小米平板5', 'value': 0}, {'source': '小米平板5Pro计划', 'target': '小米平板5Pro', 'value': 258494}, {'source': '荣耀magic拦截计划计划', 'target': '小米11', 'value': 0}, {'source': '荣耀magic拦截计划计划', 'target': '小米11pro', 'value': 0}, {'source': '荣耀magic拦截计划计划', 'target': '小米11 Ultra', 'value': 0}, {'source': '荣耀magic拦截计划计划', 'target': '小米11青春', 'value': 0}, {'source': '荣耀magic拦截计划计划', 'target': 'K40', 'value': 0}, {'source': '荣耀magic拦截计划计划', 'target': 'K40Pro', 'value': 0}, {'source': '荣耀magic拦截计划计划', 'target': 'K40游戏版', 'value': 0}, {'source': '荣耀magic拦截计划计划', 'target': 'Note9 4G', 'value': 0}, {'source': '荣耀magic拦截计划计划', 'target': 'Note9 5G', 'value': 0}, {'source': '荣耀magic拦截计划计划', 'target': 'Note9 Pro', 'value': 0}, {'source': '荣耀magic拦截计划计划', 'target': 'Note10', 'value': 0}, {'source': '荣耀magic拦截计划计划', 'target': 'Note10 Pro', 'value': 0}, {'source': '荣耀magic拦截计划计划', 'target': '小米10s', 'value': 0}, {'source': '荣耀magic拦截计划计划', 'target': '小米fold', 'value': 0}, {'source': '荣耀magic拦截计划计划', 'target': 'K30S', 'value': 0}, {'source': '荣耀magic拦截计划计划', 'target': 'MIX4', 'value': 0}, {'source': '荣耀magic拦截计划计划', 'target': '小米平板5', 'value': 0}, {'source': '荣耀magic拦截计划计划', 'target': '小米平板5Pro', 'value': 0}, {'source': '高端聚合页计划', 'target': '小米11', 'value': 0}, {'source': '高端聚合页计划', 'target': '小米11pro', 'value': 0}, {'source': '高端聚合页计划', 'target': '小米11 Ultra', 'value': 0}, {'source': '高端聚合页计划', 'target': '小米11青春', 'value': 0}, {'source': '高端聚合页计划', 'target': 'K40', 'value': 0}, {'source': '高端聚合页计划', 'target': 'K40Pro', 'value': 0}, {'source': '高端聚合页计划', 'target': 'K40游戏版', 'value': 0}, {'source': '高端聚合页计划', 'target': 'Note9 4G', 'value': 0}, {'source': '高端聚合页计划', 'target': 'Note9 5G', 'value': 0}, {'source': '高端聚合页计划', 'target': 'Note9 Pro', 'value': 0}, {'source': '高端聚合页计划', 'target': 'Note10', 'value': 0}, {'source': '高端聚合页计划', 'target': 'Note10 Pro', 'value': 0}, {'source': '高端聚合页计划', 'target': '小米10s', 'value': 0}, {'source': '高端聚合页计划', 'target': '小米fold', 'value': 0}, {'source': '高端聚合页计划', 'target': 'K30S', 'value': 0}, {'source': '高端聚合页计划', 'target': 'MIX4', 'value': 0}, {'source': '高端聚合页计划', 'target': '小米平板5', 'value': 0}, {'source': '高端聚合页计划', 'target': '小米平板5Pro', 'value': 0}, {'source': '店铺首页计划', 'target': '小米11', 'value': 0}, {'source': '店铺首页计划', 'target': '小米11pro', 'value': 0}, {'source': '店铺首页计划', 'target': '小米11 Ultra', 'value': 0}, {'source': '店铺首页计划', 'target': '小米11青春', 'value': 0}, {'source': '店铺首页计划', 'target': 'K40', 'value': 0}, {'source': '店铺首页计划', 'target': 'K40Pro', 'value': 0}, {'source': '店铺首页计划', 'target': 'K40游戏版', 'value': 0}, {'source': '店铺首页计划', 'target': 'Note9 4G', 'value': 0}, {'source': '店铺首页计划', 'target': 'Note9 5G', 'value': 0}, {'source': '店铺首页计划', 'target': 'Note9 Pro', 'value': 0}, {'source': '店铺首页计划', 'target': 'Note10', 'value': 0}, {'source': '店铺首页计划', 'target': 'Note10 Pro', 'value': 0}, {'source': '店铺首页计划', 'target': '小米10s', 'value': 0}, {'source': '店铺首页计划', 'target': '小米fold', 'value': 0}, {'source': '店铺首页计划', 'target': 'K30S', 'value': 0}, {'source': '店铺首页计划', 'target': 'MIX4', 'value': 0}, {'source': '店铺首页计划', 'target': '小米平板5', 'value': 0}, {'source': '店铺首页计划', 'target': '小米平板5Pro', 'value': 0}, {'source': '高端人群计划', 'target': '小米11', 'value': 0}, {'source': '高端人群计划', 'target': '小米11pro', 'value': 0}, {'source': '高端人群计划', 'target': '小米11 Ultra', 'value': 0}, {'source': '高端人群计划', 'target': '小米11青春', 'value': 0}, {'source': '高端人群计划', 'target': 'K40', 'value': 0}, {'source': '高端人群计划', 'target': 'K40Pro', 'value': 0}, {'source': '高端人群计划', 'target': 'K40游戏版', 'value': 0}, {'source': '高端人群计划', 'target': 'Note9 4G', 'value': 0}, {'source': '高端人群计划', 'target': 'Note9 5G', 'value': 0}, {'source': '高端人群计划', 'target': 'Note9 Pro', 'value': 0}, {'source': '高端人群计划', 'target': 'Note10', 'value': 0}, {'source': '高端人群计划', 'target': 'Note10 Pro', 'value': 0}, {'source': '高端人群计划', 'target': '小米10s', 'value': 0}, {'source': '高端人群计划', 'target': '小米fold', 'value': 0}, {'source': '高端人群计划', 'target': 'K30S', 'value': 0}, {'source': '高端人群计划', 'target': 'MIX4', 'value': 0}, {'source': '高端人群计划', 'target': '小米平板5', 'value': 0}, {'source': '高端人群计划', 'target': '小米平板5Pro', 'value': 0}, {'source': '全场景计划', 'target': '小米11', 'value': 0}, {'source': '全场景计划', 'target': '小米11pro', 'value': 0}, {'source': '全场景计划', 'target': '小米11 Ultra', 'value': 0}, {'source': '全场景计划', 'target': '小米11青春', 'value': 0}, {'source': '全场景计划', 'target': 'K40', 'value': 0}, {'source': '全场景计划', 'target': 'K40Pro', 'value': 0}, {'source': '全场景计划', 'target': 'K40游戏版', 'value': 0}, {'source': '全场景计划', 'target': 'Note9 4G', 'value': 0}, {'source': '全场景计划', 'target': 'Note9 5G', 'value': 0}, {'source': '全场景计划', 'target': 'Note9 Pro', 'value': 0}, {'source': '全场景计划', 'target': 'Note10', 'value': 0}, {'source': '全场景计划', 'target': 'Note10 Pro', 'value': 0}, {'source': '全场景计划', 'target': '小米10s', 'value': 0}, {'source': '全场景计划', 'target': '小米fold', 'value': 0}, {'source': '全场景计划', 'target': 'K30S', 'value': 0}, {'source': '全场景计划', 'target': 'MIX4', 'value': 0}, {'source': '全场景计划', 'target': '小米平板5', 'value': 0}, {'source': '全场景计划', 'target': '小米平板5Pro', 'value': 0}, {'source': '经典海投计划计划', 'target': '小米11', 'value': 1744971}, {'source': '经典海投计划计划', 'target': '小米11pro', 'value': 2149561}, {'source': '经典海投计划计划', 'target': '小米11 Ultra', 'value': 2473909}, {'source': '经典海投计划计划', 'target': '小米11青春', 'value': 622237}, {'source': '经典海投计划计划', 'target': 'K40', 'value': 10922638}, {'source': '经典海投计划计划', 'target': 'K40Pro', 'value': 2339782}, {'source': '经典海投计划计划', 'target': 'K40游戏版', 'value': 3980767}, {'source': '经典海投计划计划', 'target': 'Note9 4G', 'value': 1655898}, {'source': '经典海投计划计划', 'target': 'Note9 5G', 'value': 863509}, {'source': '经典海投计划计划', 'target': 'Note9 Pro', 'value': 987328}, {'source': '经典海投计划计划', 'target': 'Note10', 'value': 551923}, {'source': '经典海投计划计划', 'target': 'Note10 Pro', 'value': 2323460}, {'source': '经典海投计划计划', 'target': '小米10s', 'value': 1508212}, {'source': '经典海投计划计划', 'target': '小米fold', 'value': 342965}, {'source': '经典海投计划计划', 'target': 'K30S', 'value': 1059053}, {'source': '经典海投计划计划', 'target': 'MIX4', 'value': 3320811}, {'source': '经典海投计划计划', 'target': '小米平板5', 'value': 0}, {'source': '经典海投计划计划', 'target': '小米平板5Pro', 'value': 0}], 'conclusion': {'add': '', 'optimization': ''}}



			this.option3.series[0].data = data3.data;
			this.option3.series[0].links = data3.links;
		},
		mounted() {	
			this.myChart3 = this.$echarts.init(document.getElementById("main3"));
			this.myChart3.setOption(this.option3, true);
		}
	}
</script>

<style lang="less" scoped>
	/deep/input {
		border-radius: 0 !important;
	}

	.w320 {
		width: 320px;
	}

	.sankey {
		// width: 100%;
		height: 1700px;
		margin-left: 250px;

		.content {
			width: 1560px;
			height: 1500px;
			margin-top: 20px;
			background-color: #fff;
			box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
			padding: 20px 20px 30px 20px;
			.sankeyList {
				width: 100%;
				height: 1400px;
				.nav {
					width: 100%;
					height: 500px;
					margin: 0 auto;
					background: url(../../assets/images/数智投网页-a.jpg);
			
					background-size: 100% auto;
					.item {
						width: 100%;
						height: 1550px;
			
						.title {
							width: 1000px;
							height: 100px;
							line-height: 100px;
							color: #FFF;
							font-size: 40px;
							margin: 0 auto;
							text-align: center;
							border-radius: 10px;
							background-color: #42ADF1;
						}
			
						.titles {
							display: flex;
							flex-wrap: nowrap;
							justify-content: space-evenly;
							width: 800px;
							margin: 0 auto;
			
							div {
								width: 200px;
								font-size: 35px;
								color: #fff;
							}
						}
			
						.cards {
							width: 960px;
							height: 850px;
							margin: 0 auto;
							margin-top: 50px;
			
							.text {
								display: flex;
								flex-wrap: nowrap;
								justify-content: space-evenly;
			
								div {
									font-size: 80px;
									font-style: italic;
									text-shadow: 5px 10px 10px #585858;
									color: #fff;
								}
							}
			
							.chunk {
								margin-top: 20px;
								display: flex;
			
								.chunkItem:nth-child(2) {
									margin: 0 90px;
								}
			
								.chunkItem {
									width: 260px;
									height: 520px;
									background-color: #fff;
									border-radius: 10px;
									box-shadow: 1px 5px 5px #888888;
			
									.icon1 {
										background: url(../../assets/images/data.png);
									}
			
									.icon2 {
										background: url(../../assets/images/capacity.png);
									}
			
									.icon3 {
										background: url(../../assets/images/data2.png);
									}
			
									.icons {
										width: 96px;
										height: 100px;
										margin: 0 auto;
										background-size: 100%;
										margin-top: 60px;
									}
			
									.text1 {
										font-size: 30px;
										text-align: center;
										color: #3C77F0;
									}
			
									.lines {
										width: 60px;
										height: 8px;
										border-radius: 5px;
										background-color: #444444;
										margin: 10px auto;
									}
			
									.text2 {
										font-size: 25px;
										color: #666666;
										text-align: center;
									}
			
									.text3 {
										font-size: 20px;
										color: #666666;
										text-align: center;
										margin-top: 50px;
									}
								}
							}
						}
			
						.sankey1 {
							width: 1080px;
							// height: 500px;
							margin: 0 auto;
							.topBtn {
								width: 520px;
								margin: 0 auto;
								display: flex;
			
								div {
									width: 250px;
									height: 40px;
									background-color: #47B1F2;
									text-align: center;
									border-radius: 10px;
									font-size: 18px;
									line-height: 40px;
									margin: 0 5px;
									color: #fff;
								}
			
								.is-active {
									background-color: #fff;
									color: #3C77F0;
									border: 1px solid #fff;
								}
							}
			
							.content {
								width: 1080px;
								height: 1100px;
								border-radius: 10px;
								background-color: #fff;
								box-shadow: 0px 5px 5px 1px #888888;
								margin-top: 50px;
								position: relative;
			
								.con2-titles {
									width: 200px;
									height: 40px;
									font-size: 30px;
									text-align: center;
									color: #3C77F0;
									margin: 0 auto;
								}
			
								.title-lines {
									width: 150px;
									border-radius: 15px;
									height: 5px;
									background-color: #000;
									margin: 10px auto;
								}
			
								.Names {
									text-align: center;
									font-size: 20px;
									color: #3C77F0;
								}
			
								.tabs {
									width: 100%;
									display: flex;
									flex-wrap: nowrap;
									justify-content: space-evenly;
			
									div {
										width: 540px;
										height: 40px;
										line-height: 40px;
										text-align: center;
										font-size: 18px;
										color: #345597;
										background-color: #ECF5FF;
										border-radius: 5px;
									}
			
									.is-active1 {
										color: #fff;
										background-color: #3C77F0;
									}
								}
			
								.select,
								.select1 {
									width: 380px;
									// height: 90px;
									position: absolute;
									top: 180px;
									left: 80px;
									z-index: 99;
			
									.tops {
										width: 380px;
										height: 40px;
										background-color: #3C77F0;
										border-radius: 10px;
										font-size: 30px;
										text-align: center;
										line-height: 40px;
										color: #fff;
									}
			
									.middle,
									.middle1 {
										width: 380px;
										height: 500px;
										position: relative;
										border: 1px solid #3C77F0;
			
										.middleBG {
											width: 100%;
											height: 100%;
											background-color: #ccc;
											opacity: 0.5;
											position: absolute;
											z-index: -1;
										}
			
										.contents1,
										.contents2,
										.contents3,
										.contents4 {
											width: 100%;
											height: 120px;
											margin: 0 auto;
											display: flex;
											position: absolute;
											top: 60px;
			
											.place {
												display: flex;
												width: 260px;
												margin: 0 auto;
			
												.contentLift {
													width: 120px;
													height: 120px;
													background-color: #fff;
													color: #3C77F0;
													border-radius: 10px;
			
													.diamond {
														width: 31px;
														height: 31px;
														margin: 0 auto;
			
														img {
															width: 31px;
															height: 31px;
														}
													}
			
													.characters {
														width: 85px;
														height: 50px;
														margin: 0 auto;
														font-size: 20px;
														text-align: center;
													}
												}
			
												.contentRight {
													div {
														width: 120px;
														height: 26px;
														color: #fff;
														font-size: 12px;
														font-weight: normal;
														line-height: 26px;
														text-align: center;
														border-radius: 10px;
														background-color: #3C77F0;
														margin: 10px 10px;
													}
												}
											}
			
										}
			
										.contents2 {
											top: 280px;
										}
			
										.contents3 {
											top: 200px;
										}
			
										.contents4 {
											top: 350px;
			
											.place {
												width: 100%;
												display: inline-block;
			
												.contentLift {
													margin: 0 auto;
												}
			
												.contentRight {
													width: 370px;
													margin: 0 auto;
													display: flex;
													flex-wrap: wrap;
													margin-top: 20px;
			
													div {
														width: 175px;
														height: 30px;
														line-height: 30px;
														border-radius: 5px;
														font-size: 12px;
														margin: 5px;
													}
												}
											}
										}
									}
			
									.middle1 {
										height: 800px;
									}
			
									.bottom {
										width: 380px;
										height: 30px;
										background-color: #E5E5E5;
										border-radius: 10px;
										text-align: center;
										color: #3C77F0;
										font-weight: 600;
										line-height: 30px;
									}
			
									.is-active2 {
										display: none;
									}
			
									.is-active3 {
										background-color: #3C77F0;
										color: #fff;
									}
								}
			
								.select1 {
									top: 30px;
								}
			
								#main1,
								#main2,
								#main3 {
									width: 1000px;
									height: 1000px;
									margin-left: 80px;
									// margin-top: 100px;
								}
							}
						}
					}
				}
			}
		}
	}
</style>
