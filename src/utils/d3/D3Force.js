		import D3Manage from './D3Manage.js'
		
		/**
		 * D3版本 V4.0+
		 * author:EVA
		 * API:
		 * 		initForce()
		 * 		play()
	     * 	    stop()
		 * 		setData()
		 * 修改内容：
		 *   支持多曲线与直线并存
		 *   优化计算增加性能
		 */

		var D3Force = function(){
			
			var _option;
			            //关系强弱，关系拓展，关系交互
			var skinColor = '#55acee';	   //皮肤颜色
			var curveColor = '#f79f5f'	   //曲线颜色
			var nodeRadius = 30;		   //node节点半径
			var svgWidth = 1300;           //svg默认宽度
			var svgHeight = 800;		   //svg默认高度
			var simulation;				   //力仿真模型
			var svg;          			   //最外层svg节点（唯一）
			var content;				   //svg内部容器（唯一）
			var nodes;					   //node节点
			var link;					   //link多重关系直线
			var curve;					   //link的多重关系节点
			var relationship;			   //关系字段
			var relationshipRotation = false;	   //关系文字是否旋转
			var relationShipCircle = true  //关系节点连接的外园周
			var needArrow = false ;        //是否需要箭头
			var onStatus = true;		   //运动状态 
			var eventDic = {};			   //事件管理
			var defaultImg;
			var curveControlAngleCoefficient = 10;   //曲线曲率阈值
			var curveStep = 30;			    //梯度增幅系数
			var maxStrokeWidth = 20		   //最宽度
			var nodeData = []
			

			
			//manybody参数
			var manybody_strength = -2000;  //默认的电荷力系强度，正为引力，负为斥力
			//collide参数
			
			var color = d3.scaleOrdinal(d3.schemeCategory20);  //颜色刻度尺
			
			return {
				/*
				 *初始化力学模型
				 * 参数 param{
				 *   nodeClass,''
				 * 	 width,1600
				 *   height,800
				 *   manyBodyStrength,-1000  电荷力强度
				 * }
				 */
				init(option){
					if(!option){
						throw new Error('illgal param !'); 
					}
					_option = option
					
					skinColor = option.skinColor || skinColor;
					
					manybody_strength = option.manyBodyStrength || manybody_strength;
					defaultImg = option.defaultImg;
					relationshipRotation = option.relationshipRotation || relationshipRotation;
					relationShipCircle = option.relationShipCircle || relationShipCircle;
					needArrow = option.needArrow || needArrow
					
					var nodeClass = option.nodeClass || document.body;
					svg = d3.select(nodeClass).append('svg');

					svg.attr('width','100%');
					svg.attr('height','100%');
					
					svgHeight = svg._groups[0][0].clientHeight;
					svgWidth = svg._groups[0][0].clientWidth;
					
					content = svg.append('g');
					simulation = d3.forceSimulation()
					               .force('link',d3.forceLink().id(function(d){return d.id}))//数据的寻径,标识(根据需要的数据可做修改)
					               .force('charge',d3.forceManyBody().strength(manybody_strength))//电荷力默认强度
					               .force('x',d3.forceX(svgWidth/2))
					               .force('y',d3.forceY(svgHeight/2))
					
					var zoom = d3.zoom()
						  .scaleExtent([0.1,1.5])//缩放比例
						  .on('zoom',function(){
						  	content.attr("transform", d3.event.transform);
					    })
					svg.call(zoom);
					
					var defs = svg.append('defs');
					var marker = defs.append('marker')
					                 .attr('id','arrow')
//					                 .attr("markerUnits","strokeWidth")  
			                         .attr("markerWidth","12")  
			                         .attr("markerHeight","12")  
			                         .attr("viewBox","0 0 12 12")   
			                         .attr("refX","6")  
			                         .attr("refY","6")  
			                         .attr("orient","auto")
			                         .append('path')
			                         .attr('d','M2,2 L10,6 L2,10  L2,2')
			                         .attr('fill',skinColor)
			                         
			        var markerDashed = defs.append('marker')
					                 .attr('id','arrowDashed')
			                         .attr("markerWidth","12")  
			                         .attr("markerHeight","12")  
			                         .attr("viewBox","0 0 12 12")   
			                         .attr("refX","6")  
			                         .attr("refY","6")  
			                         .attr("orient","auto")
			                         .append('path')
			                         .attr('d','M2,2 L10,6 L2,10  L2,2')
			                         .attr('fill','#f79f5f')
					return this;
				},
				//重置参数
				//针对颜色特殊处理
				resetConfig(option){
					skinColor = option.skinColor || skinColor;
				},
				//还原物理引擎状态
				play(){
					if(nodeData && nodeData.length){
						nodeData.forEach(item => {
							item.move = true;
							item.fx = null;
				 			item.fy = null;
						})
					}
					
					if(simulation){
						 simulation.force('charge',d3.forceManyBody().strength(manybody_strength));
			             simulation.force('x',d3.forceX(svgWidth/2))
			             simulation.force('y',d3.forceY(svgHeight/2)); 
			             simulation.force('link').strength(function(link){
				           	 return 1;//力度
				         }) 
			             onStatus = true;
					}
				},
				//暂定物理引擎
				stop(){
					if(simulation){
			            simulation.force('charge',null)//电荷力默认强度
			            simulation.force('x',null)
			            simulation.force('y',null);
			            simulation.force('link').strength(function(link){
				           	 return 0;//力度
				         }) 
			            onStatus = false;
					}
				},
				//对于单一按钮通用方法
				pauseOrRecovery () {
					if(simulation){
						if(onStatus){
							this.stop();
						}
						else{
							this.play();
						}
					}
				},
				clear(){
					simulation.stop();
					content.selectAll('g').remove();
				},
				on(eventName,callBack){
					if(!eventName || !callBack){
						throw new Error('参数错误')
					}
					if(!eventDic[eventName]){
						eventDic[eventName] = callBack;
					}
				},
				off(eventName){
					if(eventDic[eventName]){
						eventDic[eventName] = null;
						delete eventDic[eventName];
					}
				},
				//修改虚拟节点方法状态
				changeVNode(node,value){
//					 nodes.append('rect')
//			    	     .attr('width','40').attr('height','40').attr('x','-20').attr('y','-20')
//			    	     .attr('rx','5').attr('ry','5')
//				         .attr("fill", '#16a9b5');
					if(value){

						d3.select(node).append('rect')
			    	     		.attr('width','30').attr('height','30')
			    	     		.attr('stroke','#000').attr('stroke-dasharray','5,5')
				         		.attr("fill", 'none');
					}
					else{
//						node.select('path').remove();
					}  
				},
				
				makeSVG(tag, attributes){  
				    var elem = document.createElement(tag);  
				    for (var attribute in attributes) {  
				        var value = attributes[attribute];    
				        elem.setAttribute( attribute, value);  
				    }  
				    return elem;  
				} ,
				//刷新指定node
				upDataNode(nodeData){
					
					nodes._groups[0].forEach(item => {
						let data = item.__data__
						if(data.id == nodeData.id){
							if(item.__data__.type == 'GraphTargetSeed' || item.__data__.type == 'GraphSWSeed'){
								D3Manage.getInstance().createSeedNode(item);
							}
							else if(item.__data__.type == 'VirtualNode'){
								D3Manage.getInstance().createVirtulNode(item);
							}
							else if(item.__data__.type == 'GraphArchiveSeed'){
								D3Manage.getInstance().createSeedNodeArchive(item);
							}
							else{
								D3Manage.getInstance().createChildNode(item);
							}
						}
					})
				},
				setData($nodes,$links){
					
					nodeData = $nodes;
					this.clear();
					//增加移动属性
					$nodes.forEach(item => {
						if(item.move == undefined){
							item.move = true;
						}
					})
					//针对多重关系需要特殊处理
					checkoutLinks($links);

					relationship = content.append('g')
					                      .attr('class','relationship')
										  .selectAll('text')
										  
										  .data($links)
										  .enter().append('text').text(function(d){return d.relationshipCN})
										  .attr('style','cursor: pointer;')
										  .attr('fill',function(d){
										     if(d.dashed || d.isCurve){
										     	return curveColor
										     }
										  	 return skinColor;
										  })
										  
				         				  .attr('text-anchor','middle')
				         				  .on('click',function(d){
													window.event.preventDefault();
													if(eventDic['click']){
														//第一个参数 数据，第二个参数dom节点
														eventDic['click'](d,this);
													}
				         				  })

					//节点总容器
					nodes = content.append('g')
					              .attr('class','nodes')
					              .selectAll('g')
					              .data($nodes)
					              .enter().append('g')
					              .call(d3.drag()
					          			  .on("start", dragstarted)
								          .on("drag", dragged)
								          .on("end", dragended));
					
					//创建不同类别的node
					nodes._groups[0].forEach(item => {
						if(item.__data__.type == 'GraphTargetSeed' || item.__data__.type == 'GraphSWSeed'){
							D3Manage.getInstance().createSeedNode(item);
						}
						else if(item.__data__.type == 'VirtualNode'){
							D3Manage.getInstance().createVirtulNode(item);
						}
						else if(item.__data__.type == 'GraphArchiveSeed'){
							D3Manage.getInstance().createSeedNodeArchive(item);
						}
						else{
							D3Manage.getInstance().createChildNode(item);
						}
					})
					
					simulation.nodes($nodes)
					          .on('tick',ticked);
					          
					simulation.force('link')
					          .links($links)
					          .distance(300)
					          .strength(function(link){
					           	 return 0.5;//力度
					          }) 
					//缓动稳定状态
				    simulation.alphaTarget(0.8).restart();
				    if(timeOutId){
				    	clearTimeout(timeOutId);
				    }
				    timeOutId = setTimeout(function(){
				    	 simulation.alphaTarget(0.0).restart();
				    }.bind(this),2000); 

					//节点右键事件抛出
					nodes.on('contextmenu',function(e){
						window.event.preventDefault();
						if(eventDic['contextmenu']){
							//第一个参数 数据，第二个参数dom节点
							eventDic['contextmenu'](e,this);
						}
					}).on('click',function(e){
						
						window.event.preventDefault();
						if(eventDic['click']){
							//第一个参数 数据，第二个参数dom节点
							eventDic['click'](e,this);
						}
					})  
					return this;
					 
				}
				
			}
			var timeOutId = 0;
			//多重关系处理-绘制曲线
			function checkoutLinks(relations){
				//特殊处理--去除重复关系
//				for(var i = 0;i<relations.length;i++){
//					for(var j = 0;j<relations.length - 1 - i;j++){
//						var item1 = relations[i];
//						var item2 = relations[i + 1 + j];
//						if(item1.sign == item2.sign && item1.relationshipCN == item2.relationshipCN){
//							relations.splice(i,1);
//						}
//					}
//				}
				
				
				//找到第一层，过滤多重关系
				let r = {};
				let moreLinkR = [];//多重关系直线
				let moreCurveR = [];//多重关系曲线
				relations.forEach(item => {
					item.curveId = null;
					delete item.curveId;
					if(!r[item.sign]){
						r[item.sign] = [];
						r[item.sign].push(item);
					}
					else{
						r[item.sign].push(item);
					}
				})
				//增加多重关系的梯度层级
				for(let node in r){
					let arr = r[node] || [];
					if(arr.length >= 0){
						//有多重关系
						let len = arr.length;
//						if(len <= 1){
//							break;
//						}
						let arrCs = [];
						let arrLs = [];
						for(let i = 0;i<arr.length;i++){
							if(arr[i].isCurve){
								arrCs.push(arr[i])
							}
							else{
								arrLs.push(arr[i])
							}
						}
						if(arrCs.length % 2 != 0){
							arrCs.push('');
						}
						arrCs.forEach((item,index) => {
							if(item){
								if(arrCs.length % 2==0){
									item.curveId = Number(index - Math.ceil(arrCs.length/2) + 0.5);
									console.log(Number(index - Math.ceil(arrCs.length/2)))
								}
								else{
									item.curveId = Number(index - Math.ceil(arrCs.length/2) + 1);
								}
	//							console.log(item.curveId)
								if(item.curveId > 0){ 
									item.curveId += Math.ceil(arrLs.length/2);
								}
								else if(item.curveId < 0){
									item.curveId -= Math.ceil(arrLs.length/2);
								}
								//直线-曲线标识
//								if(item.isCurve){
									moreCurveR.push(item);
//								}
//								else{
//									moreLinkR.push(item);
//								}
							}
							
						})
						if(arrLs.length > 1){
							arrLs.forEach((item,index) => {
								if(arrLs.length % 2==0){
									item.curveId = Number(index - Math.ceil(arrLs.length/2) + 0.5);
								}
								else{
									item.curveId = Number(index - Math.ceil(arrLs.length/2) + 1);
								}
								//直线-曲线标识
//								if(item.isCurve){
									moreCurveR.push(item);
							})
						}
						else if(arrLs.length == 1){
							arrLs[0].curveId = 0;
							moreCurveR.push(arrLs[0]);
						}
					}
				}

			                   
				curve = content.append('g').selectAll('path').data(moreCurveR).enter().append('path').attr('class',function(e){
									if(e.type == 'StrengthWeaknessRelationShip'){
										return 'forceLinks';
									}

								})
			                   .attr('fill','none').attr('stroke',function(d){
			                   		if(d.isCurve){
			                   			return curveColor
			                   		}
			                   		else{
			                   			return skinColor;
			                   		}
			                   		if(d.dashed){
			                   			return curveColor;
			                   		}
			                   		else{
//			                   			return skinColor;
										
			                   		}
			                   		return curveColor;
			                   }).attr('stroke-dasharray',function(d){
			                   		if(d.dashed){
			                   			return '4';
			                   		}
			                   		else{
			                   			return 0;
			                   		}
			                   }).attr('stroke-width',function(d){
			                   	
			                   		if(d.strength && d.strength != 0){
			                   			
			                   			let width = d.strength + 1;
			                   			if(Number(width) > maxStrokeWidth){
			                   				width = maxStrokeWidth;
			                   				
			                   			}
			                   			return String(width)
			                   		}
			                   		
			                   		if(d.isCurve){
			                   			return '1';
			                   		}
			                   		return '2';
			                   		
			                   }).attr("marker-end",function(d){
			                   			if(d.strength && d.strength != 0){
			                   				//有粗细就不要箭头
			                   				return;
			                   			}
			                   			if(needArrow){
			                   				if(d.isCurve){
			                   					return "url(#arrowDashed)";
			                   				}
			                   				else{
			                   					return "url(#arrow)";
			                   				}

			                   			}
			                   			else{
			                   				return '';
			                   			}
										
			                   			
									  	
							   })
//				curve.on('click',function(e){
//					console.log(e);
//						window.event.preventDefault();
//						if(eventDic['click']){
//							//第一个参数 数据，第二个参数dom节点
//							eventDic['click'](e,this);
//						}
//					}) 

			}
			function getCurveControlA(sx,sy,tx,ty){
				
				return Math.tan(curveControlAngleCoefficient * Math.PI / 180) * (Math.sqrt(Math.pow(sx - tx,2) + Math.pow(sy - ty,2)) >> 1)
				
			}
			function ticked() {
				//单一关系线条
//			    links.attr("x1", function(d) { return d.source.x; })
//			         .attr("y1", function(d) { return d.source.y; })
//			         .attr("x2", function(d) { return d.target.x; })
//			         .attr("y2", function(d) { return d.target.y; });
			    curve.attr('d',function(d){
					//计算bez 控制点
					let angle = Math.atan2(d.target.y - d.source.y,d.target.x - d.source.x) * 180 / Math.PI;

					let step = d.curveId * curveStep;//梯度递增幅度
					
					let sourceX,sourceY,p1_X,p1_Y,targetX,targetY;
					
					let targetR = nodeRadius + 20;//外园周;
					
					let sourceR = nodeRadius + 20;//外园周;

					if(!relationShipCircle){
						targetR = 0;
						sourceR = 0;
					}
					
					sourceX = d.source.x + sourceR * Math.cos(angle * Math.PI / 180); 
					sourceY = d.source.y + sourceR * Math.sin(angle * Math.PI / 180);

					targetX = d.target.x - targetR * Math.cos(angle * Math.PI / 180); 
					targetY = d.target.y - targetR * Math.sin(angle * Math.PI / 180);
					
					
					let stepSinAngle = step * Math.sin((angle) * Math.PI / 180);                   
					let stepCosAngle = step * Math.cos((angle) * Math.PI / 180);
//					let computedOffer = Math.tan(curveControlAngleCoefficient * Math.PI / 180) * (Math.sqrt(Math.pow(sourceX - targetX,2) + Math.pow(sourceY - targetY,2)) >> 1);
					let computedOffer = getCurveControlA(sourceX,targetX,sourceY,targetY);
					let controlSinOffer,controlCosOffer;
					
					if(d.isCurve){
						controlSinOffer = stepSinAngle > 0 ? stepSinAngle + computedOffer :  stepSinAngle - computedOffer;
						controlCosOffer = stepCosAngle > 0 ? stepCosAngle + computedOffer :  stepCosAngle - computedOffer;
					}
					else{
						controlSinOffer = stepSinAngle;
						controlCosOffer = stepCosAngle;
					}

					if((angle > -90 && angle < 90)){
						
						p1_X = ((sourceX + targetX) >> 1)  - controlSinOffer  ;
						p1_Y = ((sourceY + targetY) >> 1)  + controlCosOffer;

						
						targetX -=   stepSinAngle/2;
						targetY +=   stepCosAngle/2;
				
						sourceX -=  stepSinAngle/2;
						sourceY +=  stepCosAngle/2;
					}
					else {
						p1_X = ((sourceX + targetX) >> 1)  + controlSinOffer;
						p1_Y = ((sourceY + targetY) >> 1)  - controlCosOffer;

						
						targetX +=  stepSinAngle/2;
						targetY -=  stepCosAngle/2;
				
						sourceX +=  stepSinAngle/2;
						sourceY -=  stepCosAngle/2;
					}
					
			    	let M = 'M' + sourceX + ' ' + sourceY;
					let Q = 'Q' + p1_X + ' ' + p1_Y + ',' + targetX + ' ' + targetY;
					
			    	return M + Q;
			    })
			    //关系文字
			    relationship.attr('x',function(d){
		    					if(d.curveId){
		    						return (d.source.x + d.target.x) >> 1
		    					}
		    					else{
		    						return (d.source.x + d.target.x) >> 1
		    					}
			    					
			    			})
			    			.attr('y',function(d){
			    					let angle = Math.atan2(d.target.y - d.source.y,d.target.x - d.source.x) * 180 / Math.PI;
			    					if(d.curveId){
			    						if(!d.isCurve){
			    							if(d.curveId < 0){
				    							return ((d.source.y + d.target.y) >> 1) + d.curveId * curveStep - 10;
				    						}
				    						else{
				    							return ((d.source.y + d.target.y) >> 1) + d.curveId * curveStep;
				    						}
			    						}
			    						else{
			    							//曲线文字与线条衔接有误差，之后进行优化
			    							let computedOffer = getCurveControlA(d.source.x,d.target.x,d.source.y,d.target.y);
			    							if(d.curveId < 0){
				    							return ((d.source.y + d.target.y) >> 1) - computedOffer - 10;
				    						}
				    						else{
				    							return ((d.source.y + d.target.y) >> 1) + computedOffer + 10;
				    						}
			    						}
	
			    					}
			    					else{
			    						
			    						if(d.strength){
			    							
			    							let offseY =  d.strength
			    							if(d.strength > maxStrokeWidth){
			    								offseY =  maxStrokeWidth
			    							}
			    							return ((d.source.y + d.target.y) >> 1) - 5 - offseY
			    						}
			    						return ((d.source.y + d.target.y) >> 1) - 5
			    					}
			    			})
			    //文字旋转			
			   	if(relationshipRotation){
			   		relationship.attr('transform',function(d){
	    				var dx = (d.source.x + d.target.x) >> 1;
	    				var dy = (d.source.y + d.target.y) >> 1;
						var angle = Math.atan2(d.target.y - d.source.y,d.target.x - d.source.x) * 180 / Math.PI;
						if(angle <= 90 && angle >= -90){
							return 'rotate(' + angle + ' '+ dx + ' ' +dy  + ')';
						}
						else{
							angle = angle - 180;
							return 'rotate(' + angle + ' '+ dx + ' ' +dy  + ')';
						}
				        
	    			}) 
			   	}
			    					
			    //节点
			    nodes.attr('transform',function(d){
			    	return 'translate(' + d.x +',' +d.y +')';
			    })
			}
			function checckArrowPos(d){

				var tan = Math.atan2(d.target.y,d.target.x);
				var orgP = {
					x : nodeRadius * Math.cos(Math.atan2(d.target.y,d.target.x) * 180 / Math.PI) + d.source.x,
					y : nodeRadius * Math.sin(Math.atan2(d.target.y,d.target.x)) + d.source.y,
				}
				return orgP;
			}
			
			function dragstarted(d) {
			  if (!d3.event.active) simulation.alphaTarget(0.3).restart();
			  d.fx = d.x;
			  d.fy = d.y;
			}
			
			function dragged(d) {
			  d.fx = d3.event.x;
			  d.fy = d3.event.y; 
			}
			function dragended(d) {
			  if (!d3.event.active) simulation.alphaTarget(0);
			  d.move = false;
			  if(d.move){
			  	 d.fx = null;
				 d.fy = null;
			  }
			  else{
//			     d.fx = null;
//				 d.fy = null;
			  }
			}	
		}
		
		export default D3Force

		
		
		

