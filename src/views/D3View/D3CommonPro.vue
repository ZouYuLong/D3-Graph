<template>
	<div class="common graphCommonContent full" ></div>
</template>

<script>
	import D3Com from  '@/utils/d3/D3CommonPro'
	import data from '@/utils/d3/Data'

	export default {
		
		data() {
			return {
				graph:'',
			}
		},
		mounted() {
			this.init();
		},
		methods: {
			init() {
				this.graph = new D3Com().init({
					nodeClass:'.common',
				});
				let nodes = [];
				let pros = [];
				for(let i = 0;i<24;i++){
					let index = Math.random();
					let pro = [];
					if(index <0.3){
						pro = ['A','B'];
					}
					else if(index > 0.3 && index < 0.5){
						pro = ['A','C'];
					}
					else if(index > 0.5){
						pro = ['B','C'];
					}
					else{
						pro = ['A'];
					}
					nodes.push({
						id:	String.fromCharCode(i+65),
						name:String.fromCharCode(i+65),
						attrs:pro
					})
				}
				console.log(nodes);
				
				this.graph.setData({
					nodes:nodes,
					attrs:[
						{
							id:'A',
							name:'A',
							attributeType:'BaseInfo',
							level:'2',
						},
						{
							id:'B',
							name:'B',
							attributeType:'AchievementInfo',
							level:'4',
						},{
							id:'C',
							name:'C',
							attributeType:'ContactInfo',
							level:'6',
						},{
							id:'D',
							name:'D',
							attributeType:'ContactInfo',
							level:'6',
							color:'#000'
						}
						
					]
				})

			}
		}
	}
</script>

<style lang='scss'>
	.graphCommonContent{
		.leaf circle {
		  fill: #ff7f0e;
		  fill-opacity: 1;
		}
		.fill-opacity3{
			 fill-opacity: .5;
		}
		.fill-opacity1{
			 fill-opacity: .1;
		}
		text {
		  font: 10px sans-serif;
		  text-anchor: middle;
		}
		.curveArea{
			fill-opacity: .2;
			transition: all 0.5s !important;
		}
		.alpha2{
			opacity: 0.2
		}
		.alpha3{
			opacity: 0.3
		}
		.alpha4{
			opacity: 0.4
		}
		.alpha0{
			opacity: 0;
		}
	}
	
</style>