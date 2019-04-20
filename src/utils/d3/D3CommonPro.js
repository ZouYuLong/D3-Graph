/**
 * D3版本 V4.0 +
 * author:EVA
 */

var D3CommonPro = function() {

	var _option;
	var skinColor = '#5cbfde'; //皮肤颜色
	var svgWidth = 1300; //svg默认宽度
	var svgHeight = 800; //svg默认高度
	var svg; //最外层svg节点（唯一）
	var content; //svg内部容器（唯一）
	var curve; //关系线
	var data;
	var arc;
	var eventDic = {}; //事件管理
	var pie;
	var pack;

	var nodes = []; //总node
	var nodePos = [];

	var nodeData = [];
	var attrData = [];
	var nodeGraphData = [];
	var attrGraphData = {
		children: [{
				name: '基础信息',
				type: 'BaseInfo',
				color: '#e8615e',
				id:'A',
//				children: []
			},
			{
				name: '联系信息',
				type: 'ContactInfo',
				color: '#69a0fb',
//				children: [],
				id:'B'
			},
			{
				name: '成就信息',
				type: "AchievementInfo",
				color: '#44b5af',
//				children: []
				id:'C'
			}
		]
	}
	
	var color = d3.scaleOrdinal(d3.schemeCategory20); //颜色刻度尺
	var dataset = []

	return {

		init(option) {
			if(!option) {
				throw new Error('illgal param !');
			}
			_option = option

			var nodeClass = option.nodeClass || document.body;
			svg = d3.select(nodeClass).append('svg');
			svg.attr('width', '100%');
			svg.attr('height', '100%');

			svgWidth = svg._groups[0][0].clientWidth;
			svgHeight = svg._groups[0][0].clientHeight;
			content = svg.append('g');
			pie = d3.pie().sort(null).value(function(e) {
				return e;
			})
			arc = d3.arc().innerRadius(svgHeight/2 - 20).outerRadius(svgHeight/2).padAngle(0.02);
			pack = d3.pack().size([svgWidth, svgHeight]).padding(80);

			return this;

		},
		on(eventName, callBack) {
			if(!eventName || !callBack) {
				throw new Error('参数错误')
			}
			if(!eventDic[eventName]) {
				eventDic[eventName] = callBack;
			}
			return this;
		},
		off(eventName) {
			if(eventDic[eventName]) {
				eventDic[eventName] = null;
				delete eventDic[eventName];
			}
			return this;
		},
		//关闭外层颜色
		changeColor(color) {

			childCircle.attr('stroke', color);
		},
		setData(data) {
			svg.selectAll('g').remove();
			attrGraphData.children[0].children = [];
			attrGraphData.children[1].children = [];
			attrGraphData.children[2].children = [];
			dataset = [];
			nodeData = data.nodes;
			attrData = data.attrs;

			attrData.forEach(attrItem => {
				attrGraphData.children.forEach(item => {
					if(attrItem.attributeType == item.type) {
						item.children.push(Object.assign({
							size: attrItem.level,
							color: item.color
						}, attrItem))
					}
				})
			})
			console.log(attrGraphData);
			console.log(attrData);
			nodeData.forEach(item => {
				if(item.type == "GraphArchiveSeed") {
					dataset.push(3);
				} else {
					dataset.push(1);
				}
			})

			var pieData = pie(dataset);
			//转换两次换过去缓过来。。
			pieData = pieData.map((item, index) => {
				//现在是按照等分来计算，以后如果需要非等分，需要另外字段处理
				return Object.assign(item, nodeData[index])
			})

			var arcs = svg.selectAll(".arcNode")
				.data(pieData)
				.enter()
				.append("g").attr('class', 'arcNode')
				.attr("transform", "translate(" + svgWidth / 2 + "," + svgHeight / 2 + ")");

			arcs.append('text').attr('width', '100').attr('style',function(){
				return 'font-size:20px'; 
			}).text(function(d) {
				return d.name;
			}).attr('transform', function(d) {
				let angle = (d.endAngle + d.startAngle) / 2 - 90 * Math.PI / 180;
				let tAngle = angle * 180 / Math.PI;
				if(tAngle > 90) {
					tAngle += -180;
					//			         		d3.select(this).attr('text-anchor','end')
				} else {
					//			         		d3.select(this).attr('text-anchor','start')
				}
				let dx = Math.cos(angle) * 420;
				let dy = Math.sin(angle) * 420;

				return 'translate(' + dx + ',' + dy + ')rotate(' + tAngle + ')';
			})

			//属性
			var root = d3.hierarchy(attrGraphData).sum(function(d) {
				console.log(d);
				return d.size;
			}).sort(function(a, b) {
				return b.value - a.value;
			});
			

			
			var node = svg.selectAll('.node').data(pack(root).descendants()).enter().append('g').attr('class', function(d) {
				if(d.children) {
					return 'node'
				} else {
					return 'child'
				}
			}).attr('transform', function(d) {
//				console.log(d);
				attrData.forEach(item => {
					if(d.data.id == item.id) {
						item.dx = d.x - svgWidth / 2 + 20;
						item.dy = d.y - svgHeight / 2;
						item.color = d.data.color;
					}
				})
				if(d.x && d.y) {
					return "translate(" + (d.x + 20) + "," + d.y + ")";
				}
			})
			node.append("circle")
				.attr('fill', function(d) {
					if(d.data.color) {
						return d.data.color;
					}
				}).attr('stroke', '#000')
				.attr("r", function(d) {
					if(!d.data.children) {
						attrData.forEach(item => {
							if(d.data.id == item.id) {
								item.color = d.data.color;
							}
						})
						return d.r;
					}
				}).on('mouseenter', function(d) {
					d3.selectAll('.curveArea').attr('class', function(e) {
						if(d3.select(this).attr('id') == d.data.id) {
							return 'curveArea';
						} else {
							return 'curveArea alpha0';
						}
					})

				}).on('mouseout', function(d) {
					if(eventDic['mouseout']) {
						eventDic['mouseout'](d);
					}
					d3.selectAll('.curveArea').attr('class', 'curveArea')
				}).on('mousemove', function(d) {
					window.event.preventDefault();
					if(eventDic['mousemove']) {
						eventDic['mousemove'](d);
					}
				}).on('click', function(d) {
					window.event.preventDefault();
					if(eventDic['click']) {
						eventDic['click'](d);
					};
				})

			//曲面
			attrData.forEach((item, indexNumber) => {
				arcs.append("path")
					.attr("d", function(d) {

		            	if(d.attrs.indexOf(item.id) != -1){
			            	d3.select(this).attr('id',item.id);

							return graphCircleArea(d, indexNumber);
		            	}
					})
					.attr('class', 'curveArea')
					.attr("fill", function(d, i) {
						return d.color;
					})
			})
			//

			//圆饼
			arcs.append("path")
				.attr("fill", function(d, i) {
					//			            	if(d.type == 'GraphTargetSeed'){
					return '#2ebddd';
					//			            	}
					//			            	else if(d.type == 'GraphArchiveSeed'){
					//			            		return '#ffb584';
					//			            	}

				}).attr("d", function(d) {
					return arc(d)
				})
			//			           
		}

	}

	function graphCircleArea(d, id) {

		let node = arc(d);
		node = node.substr(0, node.indexOf('Z'));
		//获取椭圆弧路径第一个点
		let pos1Str = node.substr(0, node.indexOf('A'));
		let pos1Arr = node.split('A').pop().split(',');
		let pos1 = {
			dy: Number(pos1Arr.pop()),
			dx: Number(pos1Arr.pop())
		};
		//获取椭圆弧末端
		let pos2Str = node.substring(node.indexOf('A'), node.indexOf('L'));
		let pos2Arr = node.split('L')[1].split(',')
		let xStr = pos2Arr.shift()
		let yStr = pos2Arr.shift();

		let pos2 = {
			dx: Number(xStr),
			dy: Number(yStr.substr(0, yStr.indexOf('A'))),
		}

		//随机一个 目标点
		var randoms = parseInt(Math.random() * attrData.length);
		//       	 var targetPos = attrData[randoms];//随机一个目标点
		var targetPos = attrData[id];
		d.color = targetPos.color;
		d.FUCK = targetPos.id;

		let posAngle = checkoutPos(pos1, pos2, targetPos);
		let offer = Math.random() > 0.5 ? -40 : 40;
		//计算曲线控制点
		let curve1Angle = Math.atan(pos1.dy - targetPos.dy, pos1.dx - targetPos.dx)
		let curve1Pos = {
			dx: (Number(pos1.dx) + Number(targetPos.dx)) / 2 + offer,
			dy: (Number(pos1.dy) + Number(targetPos.dy)) / 2 + offer,
		}

		let curve2Angle = Math.atan(pos2.dy - targetPos.dy, pos2.dx - targetPos.dx)
		let curve2Pos = {
			dx: (Number(pos2.dx) + Number(targetPos.dx)) / 2 + offer,
			dy: (Number(pos2.dy) + Number(targetPos.dy)) / 2 + offer,
		}

		//曲线指令

		let c1 = 'C' + [pos2.dx, pos2.dy, curve2Pos.dx, curve2Pos.dy, targetPos.dx, targetPos.dy].join(',');
		let c2 = 'C' + [targetPos.dx, targetPos.dy, curve1Pos.dx, curve1Pos.dy, pos1.dx, pos1.dy].join(',');

		//覆盖掉最后的画图指令
		let index = node.lastIndexOf('L');
		let Agraph = node.substring(index);
		node = node.replace(Agraph, 'L' + pos2.dx + ',' + pos2.dy + c1 + c2 + 'Z');
//		console.log(node);
		return node;
	}
	//监测节点定位距离判定
	function checkoutPos(p1, p2, target) {
		let center = {
			dx: (p1.dx + p2.dx) / 2,
			dy: (p1.dy + p2.dy) / 2,
		}
		let angle = Math.atan2(target.dy - center.dy, target.dx - center.dx);
		return angle * 180 / Math.PI;
	}

	function ticked() {

	}

	function setPos() {

	}

}

export default D3CommonPro