	
		/**
		 * D3  版本 V4.0
		 * author:EVA
		 * 图全局管理
		 */
		
		let constructHangle = false;
		
		const D3Manage = function(){
			if(!constructHangle){
				throw new Error('无法实例化的单例模块')
			}
			return {
				//创建图列
				createD3Graph(graphType,config){
					
				},	
			}
		}
			
		D3Manage.instance = null;
		D3Manage.getInstance = function(){
			if(!this.instance){
				constructHangle = true
				this.instance = new D3Manage();
				constructHangle = false;
			}
			return this.instance
		}
		
		export default D3Manage;
		
		
		
		
		
		

