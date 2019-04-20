<template>
	<div class="force full"></div>
</template>

<script>
	import D3Force from  '@/utils/d3/D3Force'
	import {data1,data2} from '@/utils/d3/Data'


	export default {
		
		data() {
			return {
				graph:'',
				d:{},
			}
		},
		mounted() {
			this.init();
			console.log(1);
		},
		methods: {
			init() {
		
				let open = true;
				this.d = {
					nodes:data2.nodes,
					links:data2.links,
				}
				
				
				this.graph = new D3Force().init({
					nodeClass:'.force',
					relationshipRotation:true,
				},{
					nodeType:'circle',//rect
					vNodeColor:'#ff00ff'
				}).setData(this.d.nodes,this.d.links)
				
				this.graph.on('click',e=>{
					if(e.type == 'vnode'){
						if(open){
							this.d.nodes.push({id:'C',name:'C',type:'node'})
							this.d.nodes.push({id:'C1',name:'C',type:'node'})
							this.d.nodes.push({id:'C2',name:'C',type:'node'})

							
							this.d.links.push({sign:'AC',source:'A',target:'C'})
							this.d.links.push({sign:'AC1',source:'A',target:'C1'})
							this.d.links.push({sign:'AC2',source:'A',target:'C2'})
							
							this.graph.setData(this.d.nodes,this.d.links)
						}
						else{
							this.d.nodes.pop();
							this.d.nodes.pop();
							this.d.nodes.pop();
							
							this.d.links.pop();
							this.d.links.pop();
							this.d.links.pop();
							
							this.graph.setData(this.d.nodes,this.d.links)
						}
						open = !open;
						
					}
				});

				
//				this.graph.
			}
		}
	}
</script>

<style scoped>

</style>