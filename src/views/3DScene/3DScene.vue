<template>

</template>

<script>
	let scene,camera,render;
	let pointGeo,earth,point;
	let offer = 0;
	import logo from '../../assets/logo.png'
	import world from '../../assets/world.jpg'
	import peopleData from './population909500.json'
	
	export default{
		data(){
			return {
				
			}
		},
		methods:{
			init(){
				this.$nextTick(_=>{
					scene = new THREE.Scene();
					camera = new THREE.PerspectiveCamera(60,window.innerWidth/window.innerHeight,1,2000);
					render = new THREE.WebGLRenderer();
					render.setClearColor('#999')
					render.setSize(window.innerWidth,window.innerHeight);
					document.body.appendChild(render.domElement);
					
					camera.position.z = 5;
					
					
					let pointChildGeo = new THREE.BoxGeometry(0.01,0.01,0.01);
		            let material = new THREE.MeshBasicMaterial({color:0xff0000});
		            point = new THREE.Mesh(pointChildGeo,material);
					
					pointGeo = new THREE.Geometry();
					var geometry = new THREE.SphereGeometry(1,16,16);
					var matral = new THREE.MeshBasicMaterial({
						map:new THREE.TextureLoader().load(world)
					})
					earth = new THREE.Mesh(geometry,matral);
					camera.lookAt(earth.position)
					scene.add(earth);
					
					this.rendered();
//					this.addData(peopleData[1][1])
				})
			},
			rendered(){
				requestAnimationFrame(this.rendered);
				render.render(scene,camera)
				
				offer += 0.01
				camera.position.x = Math.sin(offer) * 5;
				camera.position.z = Math.cos(offer) * 5;
				camera.lookAt(earth.position);
			},
			addData(e){
				for(let i = 0;i<e.length;i+=3){
					var lat = e[i];
					var lng = e[i + 1];
					var pointData = e[i + 2];
//					latLngToPosition(lat,lng,pointData);
					
					var phi = (lat-90) * Math.PI / 180;
				    var theta = (180-lng) * Math.PI / 180;
				
				    point.position.x = Math.sin(phi) * Math.cos(theta) * 1;
				    point.position.y = Math.cos(phi) * 1;
				    point.position.z = Math.sin(phi) * Math.sin(theta) * 1;
					
					
					point.lookAt(earth.position);
					point.scale.z = -pointData * 100;
					point.updateMatrix();
					point.geometry.Material = new THREE.MeshBasicMaterial({color:0xff0f12})
					pointGeo.merge(point.geometry,point.matrix);
				}
				var mesh = new THREE.Mesh(pointGeo);
				scene.add(mesh);
			}
		},
		mounted(){
			this.init();
		}
	}
</script>

<style>
</style>