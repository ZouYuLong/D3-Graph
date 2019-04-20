		/**
		 * s菜单
		 * author:EVA
		 */
		class Menu{
			constructor(contentId,itemNum,config){
				let div = document.getElementById(contentId);
				this.canvas =  document.createElement('canvas');
				div.appendChild(this.canvas);
				this.ctx = this.canvas.getContext('2d');
				this.operaWidth = 0;
				this.canvas.width = Number(window.getComputedStyle(div, null).width.replace('px',''));
				this.canvasWidth = this.canvas.width - this.operaWidth;
				this.canvasHeight = this.canvas.height =  Number(window.getComputedStyle(div, null).height.replace('px',''));
				
			}

			draw(){ 
				
			}
			
			
		}
		
		export default Menu
