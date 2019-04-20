
	/**
	 * D3  版本 V4.0
	 * author:EVA
	 * D3 UI工厂
	 * 对所有基础元素的创建基于这个管理空间  
	 */

	(function(){
		function D3UI(){};
		D3UI.createNode = function(g){
			d3.select(g).select('g').remove();
				let node = d3.select(g).append('g');
				let data = g.__data__;
				node.append('rect')
		    	    .attr('width','60').attr('height','60').attr('x','-30').attr('y','-30')
		    	    .attr('stroke','#ff0000')
		    	    .attr('stroke-width','2')
		    	    .attr('rx','5').attr('ry','5')
					.attr('fill','#5cbfde')
					
			    node.append('image')
				    .attr('xlink:href',data.imgUrl)
				    .attr('width','56')
				    .attr('height','56')
				    .attr('borderRadius','5px')
				    .attr('x','-28')
				    .attr('y','-28')		
				    
			    let name = data.name.length > 20? data.name.substr(0,20) + '...' : data.name;
	
				node.append('text')
			        .text(name).attr('width',80).attr('text-anchor','middle') 
					.attr('fill','#dbe6f5')
				    .attr('y','45')
		}
		D3UI.createLineStyle = function(s){
			s.attr('fill','none').attr('stroke',function(d){
               		if(d.isCurve){
               			return '#f79f5f'
               		}
               		else{
               			return skinColor;
               		}
               })
               .attr('stroke-width',function(d){
               	
               		if(d.strength && d.strength != 0){
               			
               			let width = d.strength + 1;
               			if(Number(width) > maxStrokeWidth){
               				width = maxStrokeWidth;
               				
               			}
               			return String(width)
               		}
               		return '2';
             
               }).attr("marker-end",function(d){
               			if(d.bidirection){
               				return ''
  
               			}
               			else{
             				if(d.isCurve){
               					return "url(#arrowDashed)";
               				}
               				else{
               					return "url(#arrow)";
               				}
               			} 	
			   })
		}
		window.D3UI = D3UI
	})()
