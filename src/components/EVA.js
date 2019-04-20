	
		/**
		 *
		 */
		
		let constructHangle = false;
		
		const EVA = function(){
			if(!constructHangle){
				throw new Error('无法实例化的单例模块')
			}
			return {
				register(){
					
				},
				destroy(){
					
				},
				show(){
					
				},
				hide(){
					
				}
			}
		}
			
		EVA.instance = null;
		EVA.getInstance = function(){
			if(!this.instance){
				constructHangle = true
				this.instance = new EVA();
				constructHangle = false;
			}
			return this.instance
		}
		
		export default EVA;
		
		
		
		
		
		

