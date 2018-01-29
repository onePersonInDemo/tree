var Class=function(parent){
			var klass=function(){
				this.init.apply(this.arguments);
			}
			
			klass.fn=klass.prototype;//当前类prototype的别名
			if(parent){//是否有父类  有就继承父类
				klass.prototype=parent.prototype;
			}
			klass.prototype.init=function(){}
			klass.extend=function(obj){//添加类方法
				for(var key in obj){
					klass[key]=obj[key]
				}
			}
			klass.include=function(obj){//给实例添加方法
				for(var key in obj){
					klass.fn[key]=obj[key]
				}
			}
			
			klass.extend({
					proxy:function(){//保持一致的上下文
						var self=this;
						return (function(){
								return func.apply(self,arguments);
						})
					},
					join:function(a,sep){//静态方法数组连接 返回一个字符串
						return Array.prototype.join.call(a,sep)
					},
					slice:function(a,from,to){//静态方法类数组对象变为数组 数组
						return Array.prototype.slice.call(a,from,to)
					},
					map:function(a,fun){//静态方法 数组映射
						return Array.prototype.map.call(a,fun);
					}
					
			})
						
			return klass;
		}
	