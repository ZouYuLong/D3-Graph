	
		/**
		 * D3  版本 V4.0
		 * author:EVA
		 * 图全局管理
		 * 对所有基础元素的创建基于这个管理空间  
		 */
		
		var D3Manage = function(){
			this.head = '';
			this.platformTypeImg = {};//平台状态
			this.analyseTypeImg = [];//分析状态
			this.imgs = {};//其他图标
			return {
				//设置相关图片数据
				setImgConfig(platform,analyse,imgs){
					this.platformTypeImg = platform;
					this.analyseTypeImg = analyse;
					this.imgs = imgs;
				},
				setHead(val){
					this.head = val;
				},
				//转换头像地址
				getHeadUrl(url){
			       return "https://192.168.4.166/GetImageByUrl?uri="+encodeURIComponent(url);
			    },
				//创建图列
				createD3Graph(graphType,config){
					if(graphType == D3Manage.GRAPH_TYPE_GXTP || graphType == D3Manage.GRAPH_TYPE_GXHD || graphType == D3Manage.GRAPH_TYPE_GXQR){
						graph = new D3Force();
						graph.initForce(config);
					}
					else if(graphType == D3Manage.GRAPH_TYPE_GXCC){//关系层次
						graph = new D3Circle();
						graph.initCircle(config);
					}
					else if(graphType == D3Manage.GRAPH_TYPE_GXGT){//共同属性
						graph = new D3CommonPro();
						graph.initCircle(config);
					}
					
					return graph;
				},
				//创建种子节点(archive)
				createSeedNodeArchive(g,_data){
					let node = d3.select(g);
//					let data = g.__data__;
					let data = _data ? _data: (g.__data__ || {});
					
					
					node.append('circle')
					    .attr('r',function(){
					    	if(data.isRankArchive){//层次图
					    		return '20'
					    	}
					    	else{//其他
					    		return '30'
					    	}
					    }).attr('fill','#F3F3F3')
					node.append('image')
					    .attr('xlink:href',this.imgs['archive'])
					    .attr('width',function(){
					    	if(data.isRankArchive){//层次图
					    		return '20'
					    	}
					    	else{//其他
					    		return '30'
					    	}
					    })
					    .attr('height',function(){
					    	if(data.isRankArchive){//层次图
					    		return '20'
					    	}
					    	else{//其他
					    		return '30'
					    	}
					    })
					    .attr('borderRadius','5px')
					    .attr('x',function(){
					    	if(data.isRankArchive){//层次图
					    		return '-10'
					    	}
					    	else{//其他
					    		return '-15'
					    	}
					    })
					    .attr('y',function(){
					    	if(data.isRankArchive){//层次图
					    		return '-10'
					    	}
					    	else{//其他
					    		return '-15'
					    	}
					    })
						node.append('text')
				        .text(data.name).attr('width',80).attr('text-anchor','middle') 
						.attr('fill','#dbe6f5')
					    .attr('y','50')
					return node;
					    
				},
				//创建种子节点(target)
				createSeedNode(g){
					d3.select(g).select('g').remove();
					let node = d3.select(g).append('g');
					
					
					let data = g.__data__;
	
					
//					try{
//						head = this.getHeadUrl(data.element.headUrl);
//					}catch(err){
//						head = this.head;
//					}
					
					node.append('rect')
			    	    .attr('width','60').attr('height','60').attr('x','-30').attr('y','-30')
			    	    .attr('stroke','#ff0000')
			    	    .attr('stroke-width','2')
			    	    .attr('rx','5').attr('ry','5')
//				        .attr("fill",'rgba(0,0,255,0)');
//						.attr("fill",'#ff0000');
						.attr('fill','#5cbfde')
				    let errorImg =     this.imgs['error'];
				    
				    
				    let name = data.name.length > 20? data.name.substr(0,20) + '...' : data.name;

					node.append('text')
				        .text(name).attr('width',80).attr('text-anchor','middle') 
						.attr('fill','#dbe6f5')
					    .attr('y','45')
					    
					node.append('text')
				        .text(data.element.targetName || '').attr('width',80).attr('text-anchor','middle') 
						.attr('fill','#dbe6f5')
					    .attr('y','60')
				},
				//创建虚拟节点
				createVirtulNode(g){
					let node = d3.select(g);
					let data = g.__data__;
					
					d3.select(g).append('rect')
			    	    .attr('width','30').attr('height','30').attr('x','-15').attr('y','-15')
			    	    .attr('rx','5').attr('ry','5')
				        .attr("fill",function(){
				        	if(data.vnodeStatus){
				        		return '#42b69e'
				        	}
				        	else{
				        		return '#498ae6'
				        	}
				        })
					node.append('text')
				        .text(data.count).attr('width',30).attr('text-anchor','middle') 
						.attr('fill','#dbe6f5')
					    .attr('y','5')
				},
				//创建子节点
				createChildNode(g,_data){
					
					d3.select(g).select('g').remove();
					let node = d3.select(g).append('g');

					let data = _data ? _data: (g.__data__ || {});
	
					node.attr('class','svgG');
					
					
					
					node.append('rect')
					    	    .attr('width','40').attr('height','40').attr('x','-20').attr('y','-20')
					    	    .attr('rx','5').attr('ry','5')
						        .attr("fill",'#5cbfde');	        
  
	

					let name = '';
					if(data.name){
						name = data.name.length > 10? data.name.substr(0,10) + '...' : data.name;
					}
					    
					node.append('text')
				        .text(name).attr('width',40).attr('text-anchor','middle') 
						.attr('fill','#dbe6f5')
					    .attr('y','35')
					    
					node.append('text')
				        .text(data.targetName || '').attr('width',40).attr('text-anchor','middle') 
						.attr('fill','#dbe6f5')
					    .attr('y','50')
					return node;
				},
				
			}
		}
			
		D3Manage.GRAPH_TYPE_GXTP = 1;//关系拓扑
		D3Manage.GRAPH_TYPE_GXHD = 2;//关系互动
		D3Manage.GRAPH_TYPE_GXQR = 3;//关系强弱
		
		D3Manage.GRAPH_TYPE_GXCC = 4;//关系层次
		D3Manage.GRAPH_TYPE_GXGT = 5;//共同属性
		
		D3Manage.instance = null;
		D3Manage.getInstance = function(){
			if(!this.instance){
				this.instance = new D3Manage();
			}
			return this.instance
		}
		
		export default D3Manage
		
		
		
		
		
		

