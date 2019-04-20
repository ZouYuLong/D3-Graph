	
	
	
	import img from '@/assets/logo.png'
	
	export let data1 = {
		nodes:[
			{id:'A',name:'A',type:'node',imgUrl:img},
			{id:'B',name:'B',type:'node',imgUrl:img},
			
			{id:'D',name:'24',type:'vnode'},
			
			{id:'C',name:'C',type:'node'},
			{id:'C1',name:'C',type:'node'},
			{id:'C2',name:'C',type:'node'},
			{id:'C3',name:'C',type:'node'},
			{id:'C4',name:'C',type:'node'},
			{id:'C5',name:'C',type:'node'},
		],
		links:[
			{sign:'AC',source:'A',target:'C',name:'AC'},
			{sign:'AC1',source:'A',target:'C1',name:'AC'},
			{sign:'AC2',source:'A',target:'C2',name:'AC'},
			{sign:'AC3',source:'A',target:'C3',name:'AC'},
			{sign:'AC4',source:'A',target:'C4',name:'AC'},
			{sign:'AC5',source:'A',target:'C5',name:'AC'},
			{sign:'AB',source:'B',target:'A',name:'AC',isCurve:true},
			{sign:'AB',source:'B',target:'A',name:'AC',isCurve:true},
			{sign:'AB',source:'B',target:'A',name:'AC'},
			{sign:'AD',source:'A',target:'D',name:'',bidirection:true},
		]
	}


	
	export let data2 = {
		nodes:[
			{id:'A',name:'A',type:'node',imgUrl:img},
			{id:'B',name:'B',type:'node',imgUrl:img},
			{id:'D',name:'3',type:'vnode'},
		],
		links:[
			{sign:'AB',source:'B',target:'A',name:'次要关系',isCurve:true},
			{sign:'AB',source:'B',target:'A',name:'次要关系',isCurve:true},
			{sign:'AB',source:'B',target:'A',name:'主动关系'},
			{sign:'AD',source:'A',target:'D',name:'',bidirection:true,distance:200},
		]
	}


