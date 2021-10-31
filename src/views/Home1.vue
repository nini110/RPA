<template>
	<div class="home">
		<div class="boxContent">
			<div class="box">
				<div class="chunk">
					<div class="chunkTitle">京准通工具</div>
					<div class="chunkItem" @click="routerLink('/layout/beijingMustPass/DMP')">
						<div class="item">
							<div class="itemLitile">
								<div class="img img1"></div>
								<div class="text">
									<div class="title">DMP</div>
									<div class="title-b">
										<div>批量化</div>
										<div>快速创建人群</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div class="chunkItem" @click="routerLink('/layout/beijingMustPass/jingdongBooth')">
						<div class="item">
							<div class="itemLitile">
								<div class="img img2"></div>
								<div class="text">
									<div class="title">京东展位</div>
									<div class="title-b">
										<div>批量化创建</div>
										<div>京东展位计划</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div class="chunkItem" @click="routerLink('/layout/beijingMustPass/jingdongDirectInvestment')">
						<div class="item">
							<div class="itemLitile">
								<div class="img img3"></div>
								<div class="text">
									<div class="title">京东直投</div>
									<div class="title-b">
										<div>京东展位</div>
										<div>批量化创建工具</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div class="chunkItem" @click="routerLink('/layout/beijingMustPass/peopleOriented')">
						<div class="item">
							<div class="itemLitile">
								<div class="img img4"></div>
								<div class="text">
									<div class="title">京腾人群定向</div>
									<div class="title-b">批量化快速创建人群</div>
								</div>
							</div>
						</div>
					</div>
					<div class="chunkItem" @click="routerLink('/layout/beijingMustPass/rubiksCube')">
						<div class="item">
							<div class="itemLitile">
								<div class="img img5"></div>
								<div class="text">
									<div class="title">京腾魔方</div>
									<div class="title-b">
										<div>批量化快速创建</div>
										<div>京腾人群</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div class="chunk">
					<div class="chunkTitle">大数据工具</div>
					<div class="chunkItem" @click="routerLink('/layout/bigData/numberOfLaneCrowd')">
						<div class="item">
							<div class="itemLitile">
								<div class="img img6"></div>
								<div class="text">
									<div class="title">数坊人群圈选</div>
									<div class="title-b">
										<div>京东批量人群</div>
										<div>维度圈定工具</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div class="chunkItem" @click="routerLink('/layout/bigData/marketingActivityCrowds')">
						<div class="item">
							<div class="itemLitile">
								<div class="img img7"></div>
								<div class="text">
									<div class="title">营销活动人群</div>
									<div class="title-b">
										<div>京东数坊</div>
										<div>营销人群追踪工具</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div class="chunkItem" @click="routerLink('/layout/bigData/customAnalysisCreation')">
						<div class="item">
							<div class="itemLitile">
								<div class="img img8"></div>
								<div class="text">
									<div class="title">数坊自定义分析</div>
									<div class="title-b">
										<div>京东数坊</div>
										<div>自定义分析工具</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div class="chunkItem" @click="routerLink('/layout/bigData/crowdCrossAndMergeDifferenceSet')">
						<div class="item">
							<div class="itemLitile">
								<div class="img img9"></div>
								<div class="text">
									<div class="title">数坊交并差集</div>
									<div class="title-b">
										<div>数坊已有人群</div>
										<div>交并差集</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div class="chunkItem" @click="routerLink('/layout/bigData/marketingPopulationTracking')">
						<div class="item">
							<div class="itemLitile">
								<div class="img img10"></div>
								<div class="text">
									<div class="title">营销人群追踪</div>
									<div class="title-b">
										<div>创建营销活动</div>
										<div>追踪报告</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div class="chunk">
					<div class="chunkTitle">数据应用</div>
					<div class="chunkItem" @click="routerLink('/layout/dataApplication/spiritSharkTabulation')">
						<div class="item">
							<div class="itemLitile">
								<div class="img img11"></div>
								<div class="text">
									<div class="title">灵鲨制表</div>
									<div class="title-b">自定义报表工具</div>
								</div>
							</div>
						</div>
					</div>
					<div class="chunkItem" @click="routerLink('/layout/dataApplication/biddingForMonitoring')">
						<div class="item">
							<div class="itemLitile">
								<div class="img img12"></div>
								<div class="text">
									<div class="title">竞标监控</div>
									<div class="title-b">
										<div>监控竞标项目</div>
										<div>消耗情况及时提醒</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div class="chunkItem" @click="routerLink('/layout/dataApplication/sankey')">
						<div class="item">
							<div class="itemLitile">
								<div class="img img13"></div>
								<div class="text">
									<div class="title">桑基图数据</div>
									<div class="title-b">桑基图数据</div>
								</div>
							</div>
						</div>
					</div>
					<div class="noback"></div>
					<div class="noback"></div>
				</div>
				<div class="chunk">
					<div class="chunkTitle">图片视频工具</div>
					<div class="chunkItem" @click="routerLink('/layout/videoTools/pictureProcessing')">
						<div class="item">
							<div class="itemLitile">
								<div class="img img14"></div>
								<div class="text">
									<div class="title">图片处理</div>
									<div class="title-b">
										<div>一键调整</div>
										<div>图片尺寸和大小</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div class="chunkItem" @click="routerLink('/layout/videoTools/cutOut')">
						<div class="item">
							<div class="itemLitile">
								<div class="img img15"></div>
								<div class="text">
									<div class="title">截取</div>
									<div class="title-b">
										<div>通过预设的锚点</div>
										<div>智能截取视频</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div class="chunkItem" @click="routerLink('/layout/videoTools/piece')">
						<div class="item">
							<div class="itemLitile">
								<div class="img img16"></div>
								<div class="text">
									<div class="title">拼合</div>
									<div class="title-b">
										<div>将视频图片音频</div>
										<div>智能拼合成视频</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div class="noback"></div>
					<div class="noback"></div>
				</div>
				<div class="chunk">
					<div class="chunkTitle">巨量千川</div>
					<div class="chunkItem" @click="routerLink('/layout/thirdPartyTools/item')">
						<div class="item">
							<div class="itemLitile">
								<div class="img img17"></div>
								<div class="text">
									<div class="title">音果Desk</div>
									<div class="title-b">
										<div>数智投一体</div>
										<div>效质翻倍</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div class="noback"></div>
					<div class="noback"></div>
					<div class="noback"></div>
					<div class="noback"></div>
				</div>
				<div class="chunk">
					<div class="chunkTitle">公域数据获取</div>
					<div class="chunkItem" @click="routerLink('/layout/publicDomainDataAcquisition/jingdongBidding')">
						<div class="item">
							<div class="itemLitile">
								<div class="img img18"></div>
								<div class="text">
									<div class="title">京东招标</div>
									<div class="title-b">
										<div>招标信息爬取入库</div>
										<div>发送变更通知</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div class="chunkItem" @click="routerLink('/layout/publicDomainDataAcquisition/activePageSKU')">
						<div class="item">
							<div class="itemLitile">
								<div class="img img19"></div>
								<div class="text">
									<div class="title">活动页面SKU</div>
									<div class="title-b">
										<div>批量获取</div>
										<div>京东活动页商品SKU</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div class="chunkItem" @click="routerLink('/layout/publicDomainDataAcquisition/howToMonitor')">
						<div class="item">
							<div class="itemLitile">
								<div class="img img20"></div>
								<div class="text">
									<div class="title">京东市场监控</div>
									<div class="title-b">
										<div>了解京东特定市场</div>
										<div>每日变化</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div class="chunkItem" @click="routerLink('/layout/publicDomainDataAcquisition/brandSKUAcquisition')">
						<div class="item">
							<div class="itemLitile">
								<div class="img img21"></div>
								<div class="text">
									<div class="title">品牌SKU获取</div>
									<div class="title-b">获取某一店铺品牌下SKU</div>
								</div>
							</div>
						</div>
					</div>
					<div class="noback"></div>
				</div>
			</div>
		</div>

	</div>
</template>

<script>
	export default {
		data() {
			return {
				flag1:false,
			};
		},
		components: {},
		methods: {
			routerLink(path){
					  this.$router.push(path)
			}
		},
		created() {},
		mounted() {},
	}
</script>
<style lang="less">
	.home {
		background: url(../assets/images/homeBackground.jpg);
		background-size: cover;
		width: 100%;
		min-height: 975px;
		height: 100vh;
		display: flex;
		justify-content: center;
		align-items: center;
		.boxContent {
			display: flex;
			.box {
				.chunk {
					display: flex;
					.chunkTitle{
						width: 50px;
						height: 130px;
						writing-mode: vertical-lr;
						background-color: #1a1a1a;
						opacity: 0.8;
						line-height: 50px;
						color: #818182;
						text-align: center;
						display: flex;
						flex-direction: column;
						div {
							width: 50px;
							height: 130px;
							writing-mode: vertical-lr;
							line-height: 50px;
							color: #818182;
							text-align: center;
						}
					}
					.chunkTitle:hover{
						color: #818182!important;
					}
					.chunkItem, .noback {
						transition: all .6s linear;
						width: 230px;
						height: 130px;
						opacity: 0.8;
						border-right: none;
						border-bottom: none;
						background-image: linear-gradient(to bottom right, rgba(26, 27, 35, 0.3), rgba(255, 255, 255, 0.1), rgba(26, 27, 35, 0.3));
						background-color: #1a1a1a;
						opacity: 0.8;
						display: flex;
						align-items: center;
						.item {
							margin: 0 auto;
							display: flex;
							align-items: center;
							.itemLitile{
								width: 100%;
								display: flex;
								.img {
									width: 80px;
									height: 100px;
									background: no-repeat;
								}
								.img1{
									background: url(../assets/images/hg_01.png);
									background-size: 100%;
								}
								.img2{
									background: url(../assets/images/hg_02.png);
									background-size: 100%;
								}
								.img3{
									background: url(../assets/images/hg_03.png);
									background-size: 100%;
								}
								.img4{
									background: url(../assets/images/hg_04.png);
									background-size: 100%;
								}
								.img5{
									background: url(../assets/images/hg_05.png);
									background-size: 100%;
								}
								.img6{
									background: url(../assets/images/hg_06.png);
									background-size: 100%;
								}
								.img7{
									background: url(../assets/images/hg_07.png);
									background-size: 100%;
								}
								.img8{
									background: url(../assets/images/hg_08.png);
									background-size: 100%;
								}
								.img9{
									background: url(../assets/images/hg_09.png);
									background-size: 100%;
								}
								.img10{
									background: url(../assets/images/hg_10.png);
									background-size: 100%;
								}
								.img11{
									background: url(../assets/images/hg_11.png);
									background-size: 100%;
								}
								.img12{
									background: url(../assets/images/hg_12.png);
									background-size: 100%;
								}
								.img13{
									background: url(../assets/images/hg_13.png);
									background-size: 100%;
								}
								.img14{
									background: url(../assets/images/hg_14.png);
									background-size: 100%;
								}
								.img15{
									background: url(../assets/images/hg_15.png);
									background-size: 100%;
								}
								.img16{
									background: url(../assets/images/hg_16.png);
									background-size: 100%;
								}
								.img17{
									background: url(../assets/images/hg_17.png);
									background-size: 100%;
								}
								.img18{
									background: url(../assets/images/hg_18.png);
									background-size: 100%;
								}
								.img19{
									background: url(../assets/images/hg_19.png);
									background-size: 100%;
								}
								.img20{
									background: url(../assets/images/hg_20.png);
									background-size: 100%;
								}
								.img21{
									background: url(../assets/images/hg_21.png);
									background-size: 100%;
								}
								.text{
									width: 135px;
									display: flex;//主要是这两行代码
									align-items:center;//主要是这两行代码
									.title{
										width: 135px;
										text-align: center;
										color: #FFFFFF;
									}
									.title-b{
										width: 135px;
										display: none;
										text-align: center;
									}
								}
							}			
						}
					}
					.chunkItem:hover{
						transform: scale(1.1);
						background-color: #fff;
						cursor: pointer;
						border-radius: 0px;
						z-index: 10;
						// background: #1a1a1a;
						// box-shadow: inset 34px 34px 41px #0a0a0a,
						//             inset -34px -34px 41px #2a2a2a;
						.item{
							.itemLitile{
								.title{
									display: none;
								}
								.title-b{
									display: block;
									color: #2b64ff;
									font-size: 12px;
									line-height: 22px;
								}
								.img1{
									background: url(../assets/images/zh_01.png);
									background-size: 100%;
								}
								.img2{
									background: url(../assets/images/zh_02.png);
									background-size: 100%;
								}
								.img3{
									background: url(../assets/images/zh_03.png);
									background-size: 100%;
								}
								.img4{
									background: url(../assets/images/zh_04.png);
									background-size: 100%;
								}
								.img5{
									background: url(../assets/images/zh_05.png);
									background-size: 100%;
								}
								.img6{
									background: url(../assets/images/zh_06.png);
									background-size: 100%;
								}
								.img7{
									background: url(../assets/images/zh_07.png);
									background-size: 100%;
								}
								.img8{
									background: url(../assets/images/zh_08.png);
									background-size: 100%;
								}
								.img9{
									background: url(../assets/images/zh_09.png);
									background-size: 100%;
								}
								.img10{
									background: url(../assets/images/zh_10.png);
									background-size: 100%;
								}
								.img11{
									background: url(../assets/images/zh_11.png);
									background-size: 100%;
								}
								.img12{
									background: url(../assets/images/zh_12.png);
									background-size: 100%;
								}
								.img13{
									background: url(../assets/images/zh_13.png);
									background-size: 100%;
								}
								.img14{
									background: url(../assets/images/zh_14.png);
									background-size: 100%;
								}
								.img15{
									background: url(../assets/images/zh_15.png);
									background-size: 100%;
								}
								.img16{
									background: url(../assets/images/zh_16.png);
									background-size: 100%;
								}
								.img17{
									background: url(../assets/images/zh_17.png);
									background-size: 100%;
								}
								.img18{
									background: url(../assets/images/zh_18.png);
									background-size: 100%;
								}
								.img19{
									background: url(../assets/images/zh_19.png);
									background-size: 100%;
								}
								.img20{
									background: url(../assets/images/zh_20.png);
									background-size: 100%;
								}
								.img21{
									background: url(../assets/images/zh_21.png);
									background-size: 100%;
								}
							}
						}
					}
				}
				.chunk:hover{
					.chunkTitle{
						color: #2b64ff;
					}
				}
			}
		}
	}
	@media screen and (max-width:1500px){
		.home{
			.boxContent{
				.box{
					.chunk{
						.chunkTitle{
							width: 40px;
							height: 104px;
							line-height: 40px;
							font-size: 14px;
							div {
								width: 40px;
								height: 104px;
								line-height: 40px;
							}
						}
						.chunkItem, .noback{
							width: 180px;
							height: 104px;
							.item{
								.itemLitile{
									.img{
										width: 64px;
										height: 80px;
									}
									.text{
										font-size: 14px;
										width: 108px;
										.title{
											width: 108px;
										}
										.title-b{
											width: 108px;
										}
									}
								}
							}
						}
					}
				}
			}
		}
	}
</style>
