import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);
export default new Router({
//	mode: "hash",
	routes: [
//		{
//			path: "/",
//			redirect: '/force'
//			
//		},
		{
			path: '/force',
			name: "force",
			component: _ => import("./views/D3View/D3Force.vue")
		},
		{
			path: "/map",
			name: "map",
			component: _ => import("./views/D3View/D3Map.vue")
		},
		{
			path: "/common",
			name: "common",
			component: _ => import("./views/D3View/D3CommonPro.vue")
		}
	]
})