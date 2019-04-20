<template>
	<div id='GlobalMenu' ref='GlobalMenu' @click="onClick">
		
	</div>
</template>

<script>
	import menu from './Menu.js'
	export default{
		data(){
			return {
			}
		},
		mounted(){
			this.init();
		},
		methods:{
			init(){
				let canvas = this.$refs.GlobalMenu
			},
			onClick(){
//				console.log(this.$el.parentElement,this.$el.parentNode)
				if(this.$el.parentElement){
					this.$el.parentElement.removeChild(this.$el);
				}
			}
		}
	}
</script>

<style scoped>
	#GlobalMenu{
		top: 50%;
		left: 50%;
		margin-top: -100px;
		margin-left: -100px;
		position: absolute;
		width: 200px;
		height: 200px;
		background: #42B983;
	}
</style>