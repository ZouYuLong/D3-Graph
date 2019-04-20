<template>
	<div class="force full"></div>
</template>

<script>
	import D3Force from  '@/utils/d3/D3Force'
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
				this.graph = new D3Force().initForce({
					nodeClass:'.force',
					relationshipRotation:true,
					needArrow:true,
				});


				this.graph.setData(data.nodes,data.links);
			}
		}
	}
</script>

<style>
</style>