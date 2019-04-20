		/**
		 * 时间轴
		 * author:EVA
		 */
		class TimeAxis{
			constructor(contentId,itemNum,config){
				let div = document.getElementById(contentId);
				this.canvas =  document.createElement('canvas');
				div.appendChild(this.canvas);
				this.ctx = this.canvas.getContext('2d');
				this.operaWidth = 0;
				this.canvas.width = Number(window.getComputedStyle(div, null).width.replace('px',''));
				this.canvasWidth = this.canvas.width - this.operaWidth;
				this.canvasHeight = this.canvas.height =  Number(window.getComputedStyle(div, null).height.replace('px',''));
				this.num = itemNum || this.num;
				
				//style配置
				this.strokeColor = config.strokeColor || "#bdbdbd";
				this.chooseFillColor = config.chooseFillColor || "#f5f6fa"
				this.chooseStrokeColor = config.chooseFillColor || "#4f98ff"
				
				this.timeId = 0;
				this.isMove = false;
				this.targetIndex = 0;
				this.event = {};
				this.dir = '';
				this.targetBlock = 0;
				this.initDate = '';
				this.targetData = [];
				this.draw(0,0);
				this.canvas.addEventListener('click',e=>{
					if(this.isMove){
						return ;
					}
					for(let i = 0;i<this.num;i++){
						if(e.layerX < this.canvasWidth/this.num * (i+1) && e.layerX >= this.canvasWidth/this.num * i){
							this.event['click'](this.targetData[i]);
							this.dir = 'center';
							this.targetBlock = i;
							this.draw(0,i);
						}
					}
				})
				
			}
			//指定特殊日期
			draw(offerX){ 
				this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
				this.ctx.strokeStyle =this.strokeColor ;
				this.targetData = [];
				for(var i = 0;i<this.num + 2;i++){
					let str = '';
					
					if(i != 0 && i != this.num + 1){
						str = this.getDetailDay(i-1+this.targetIndex);
						this.targetData.push(str);
					}
					let indexId = i - 1;
					if(this.dir == 'left'){
						indexId = i;
					}
					else if(this.dir == 'right'){
						indexId = i-2;
					}
					
					if(this.targetBlock == i){
						this.ctx.fillStyle= this.chooseFillColor; 
						this.ctx.fillRect((indexId+1)*this.canvasWidth/this.num - offerX + this.operaWidth/2 ,0,this.canvasWidth/this.num,this.canvasHeight);
						this.ctx.lineWidth=2;
						this.ctx.strokeStyle =this.chooseStrokeColor;
						this.ctx.strokeRect((indexId+1)*this.canvasWidth/this.num - offerX + this.operaWidth/2 ,0,this.canvasWidth/this.num,this.canvasHeight);
					}
					this.ctx.lineWidth = 1;
					this.ctx.strokeStyle =this.strokeColor;
					this.ctx.strokeRect((indexId)*this.canvasWidth/this.num - offerX + this.operaWidth/2 ,0,this.canvasWidth,this.canvasHeight);
					this.ctx.fillStyle = '#000'
					this.ctx.font="12px ''";
					this.ctx.fillText(str,(indexId)*this.canvasWidth/this.num - offerX + this.canvasWidth/this.num/2 - 30 +　this.operaWidth/2,30);
				}
				
				let points = (this.num +2) * 5;
				
				this.ctx.beginPath();
				
				for(i = 0;i<points;i++){
					let indexId = i;
					if(this.dir == 'left'){
						indexId = i + 7;
					}
					else if(this.dir == 'right'){
						indexId = i-7;
					}
					this.ctx.moveTo(this.canvasWidth/points * indexId - offerX, 0);
					this.ctx.lineTo(this.canvasWidth/points * indexId - offerX, 10);
					this.ctx.fill();
				}
				this.ctx.stroke();
//				工具条

//				this.ctx.beginPath();
//			    this.ctx.moveTo(0, 0);
//			    this.ctx.lineTo(this.operaWidth/2, 0);
//			    this.ctx.lineTo(this.operaWidth/2, this.canvasHeight);
//			    this.ctx.arcTo(0, this.canvasHeight, 0, this.canvasHeight-10, 10);
//			    this.ctx.arcTo(0, 0, this.operaWidth/2, 0, 10);
//			    this.ctx.fillStyle = '#333'
//			    this.ctx.closePath();
//			    this.ctx.fill();

//				this.ctx.beginPath();
//			    this.ctx.moveTo(10, 0);
//			    this.ctx.lineTo(0, 40);
//			    this.ctx.lineTo(10, 50);
//			    this.ctx.fillStyle = '#ff00ff'
//			    this.ctx.closePath();
//			    this.ctx.fill();
			}
			on(e,callBack){
				if(!this.event[e]){
					this.event[e] = callBack;
				}
			}
			upDate(offerX){
				
			}
			right(){
				this.dir = 'left';
				this.targetIndex++;
				this.targetBlock--;
				clearInterval(this.timeId);
				this.isMove = true;
				var orgX = 0;
				var targetX  = this.canvasWidth/this.num;
				this.timeId = setInterval(_=>{
					
					if(Math.abs(orgX) < targetX-1){
						orgX += (targetX - orgX) * 0.2;
						this.draw(orgX);
					}
					else{
						clearTimeout(this.timeId);
						this.isMove = false;
						orgX = targetX;
						this.draw(orgX);
					}
					
				},20)
			}
			left(){
				this.dir = 'right';
				this.targetIndex--;
				this.targetBlock++;
				clearInterval(this.timeId);
				this.isMove = true;
				var orgX = 0;
				var targetX  = this.canvasWidth/this.num;
				this.timeId = setInterval(_=>{
					
					if(Math.abs(orgX) < targetX-1){
						orgX += (targetX - orgX) * 0.2;
						this.draw(-orgX);
					}
					else{
						clearTimeout(this.timeId);
						this.isMove = false;
						orgX = targetX;
						this.draw(-orgX);
					}
					
				},20)
			}
			getDetailDay(offerNum){
				let date = new Date();
				if(this.initDate){
					date = new Date(this.initDate);
				}
				let result = '';

				let targetDate = new Date(date.getTime() + offerNum * 24*60*60*1000);
				let year = targetDate.getFullYear();
				let mounth = targetDate.getMonth()+1 > 9 ? targetDate.getMonth()+ 1 : '0' + String(targetDate.getMonth()+1);
				let dat = targetDate.getDate() > 9 ? targetDate.getDate() : '0' + String(targetDate.getDate());
				result = year + '-' + mounth + '-' + dat
				

				return result;
			}
			//外部设置日期
			setData(startDate,endDate){
				this.initDate = startDate;
				this.targetIndex = 0;
				this.targetBlock = 0;
				this.dir = '';
				this.draw(0,0);	
			}
			
		}
		
		export default TimeAxis
