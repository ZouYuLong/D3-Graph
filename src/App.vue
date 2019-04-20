<template>
	<div class='full mainView'>
		<div class="nav full">
			<router-link to="/force">
				<p class='btn'>force</p>
			</router-link>
			<router-link to="/common">
				<p class='btn'>com</p>
			</router-link>
		</div>
		<div class='main-content full'>
			<router-view></router-view>
		</div>
	</div>
	
</template>
<script>
	export default{
		data(){
			return {
				
			}
		},
		methods:{

		}
	}
</script>
<style>
	*{
		margin: 0;
		padding: 0;
		text-decoration: none;
	}
</style>
<style lang="scss" scoped>
	.btn{
		display: block;
		height: 40px;
		
		line-height: 40px;
		color: #fff;
		text-align: center;
		cursor: pointer;
	}
	.mainView{
		display: flex;
	}
	.nav{
		width: 60px;
		background: #42B983;
	}
	.main-content{
		box-sizing: border-box;
		padding: 5px;
	}
	
</style>