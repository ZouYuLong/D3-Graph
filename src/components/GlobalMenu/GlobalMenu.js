	import menuVue from './GlobalMenu.vue'
	
	const MyDirective = {
		install:function(Vue){
			let MenuClass = Vue.extend(menuVue);
			let menu = new MenuClass({
				el:document.createElement('span')
			})
			console.log(menu.$el)
			Vue.prototype.showGlobalMenu = _=>{
				document.body.appendChild(menu.$el);
			}
		}
	}
	export default MyDirective
	
	
