	/**
	 * D3版本 V4.0 + 
	 * author:EVA
	 */
			

			
			var D3Map = function(){
				var svg;          			   //最外层svg节点（唯一）
				var content;				   //svg内部容器（唯一）
				var areas;					   //区块（path）集合
				var svgWidth = 1600;           //svg默认宽度
				var svgHeight = 800;		   //svg默认高度
				var eventDic = {};			   //事件管理
				var linear;					   //线性比例尺颜色
				
				var maxValueText;              //文本最大值
				var mapData = '';
				return {
					/*
					 * 参数 param{
					 *   nodeClass,''
					 * 	 width,1600
					 *   height,300
					 * }, 地图JSON
					 */
					initMap(option,e){
						
//*********************************************地图绘制***********************************************/
						mapData = e;
						
						var nodeClass = option.nodeClass || document.body;
						svg = d3.select(nodeClass).append('svg');
//						console.log(svg);
//						svg.attr('width',svgWidth);
//						svg.attr('height',svgHeight);
						svg.attr('width','100%');
						svg.attr('height','100%');
						content = svg.append('g');
	
						svgWidth = svg._groups[0][0].clientWidth;
						svgHeight = svg._groups[0][0].clientHeight;
						
						let targetT = d3.zoomTransform(0).translate(
	                			0,0
	                	).scale(1);
						
						content.attr("transform", function(){
							return 'translate(0,0)';
						});
						d3.zoom().transform(svg,targetT);
						

						
						var zoom = d3.zoom()              //设置zoom参数       
							         .scaleExtent([1, 10])          //放大倍数
							//       .translateExtent([[0,0], [areaWidth, areaHeight]])//移动的范围
							         .extent([[0, 0], [svgWidth, svgHeight]]) 
							         .on("zoom", function(){
							         	
									  	content.attr("transform", d3.event.transform);
								     });
				        svg.call(zoom); 	
				        
				        

						var projection = d3.geoMercator().fitSize([svgWidth, svgHeight], mapData);

						var mapPath = d3.geoPath().projection(projection)

						areas = content.selectAll('path').data(mapData.features)
				                .enter().append('path').attr('d',mapPath).attr('fill',function(d){
				                	return '#333'
				                }).attr('stroke','#07a5ff').attr('stroke-width','1')
				                  .on('mouseover',function(d){
									d3.select(this).transition().duration(400).attr('fill','#07a5ff')
				                })
				                  .on('mouseout',function(d){
				                	d3.select(this).transition().duration(400).attr('fill','#333')

				                })

				        var texts = content.append("g")
							.selectAll("text")
							.data(mapData.features)
							.enter().append("text")
							.text(function(d){return d.properties.name;})
//							.attr('fill','#fff')
							.attr("transform", function(d) {
								var centroid = mapPath.centroid(d),
								x = centroid[0],
								y = centroid[1];
								return "translate(" + x + ", " + y + ")";
							})
//							.attr('fill','#FFF')
							.attr('font-size','10px');

				        var point = [
				        	{
				        		lat:31.2438430000001,
				        		lng:121.487345
				        	}
				       ]
				        
				        
				        
//				        var geoP = d3.geoPath().projection(p);
				        
//				        console.log(geoP); 
				        
				       
					        
				                
  //*********************************************比例尺***********************************************/	
					},

					setData(_data){
						
						var data = [];
						var lngLat = [];
						for(var i=0;i<_data.length;i++){
							
							let str = _data[i].lng + _data[i].lat;
				
				            if(lngLat.indexOf(str) == -1){
				            	lngLat.push(str);
				                data.push(_data[i]);
				            }
				        }
					
						
						
						let p = d3.geoMercator().fitSize([svgWidth, svgHeight], mapData);
						 content.append("g")
				        	.selectAll("circle")
				        	.data(data)
				        	.enter().append('circle')
					        .attr('r','2').attr('fill','#ece59d')
//					        .attr('stroke-width','')
					        .attr('fill-opacity','0.2')
					        .attr('class','c')
					        .attr("transform", function(d) {
					        	
//					        	d.lng = d.lng.toFixed(2)
//					        	console.log(d);
					       
//					        		console.log(i);
						        	var centroid = p([d.lng,d.lat]),
									x = centroid[0],
									y = centroid[1];
									return "translate(" + x + ", " + y + ")";

					        })
							
					}
				}
				function createMsg(){

				}
			}
