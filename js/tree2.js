(function($){
	function Tree(element,option){
		this.nodes=option.nodes;
		this.callBack=option.callBack;
		this.element=element;
		this.checkBox=option.checkBox||false;
		this.init=function(){
			this.sloveNodes();//初始化Nodes数据格式
			var getStr=this.getStr();//得到str字符串
			this.element.empty().html(getStr);//添加html
			return this;
		};
		this.checkArray=[];
		this.bind=function(){
			var self=this;
			$(' li span', this.element).on('click',function() {
				var number = $(this).attr('number');
				self.callBack(self.nodes[number]);
				if(self.checkBox==true){
					if($(this).hasClass('checked')){
						$(this).removeClass('checked');
						var index=(self.checkArray.indexOf(self.nodes[number]));
						self.checkArray.splice(index,1)
					}else{
						$(this).addClass('checked');
						self.checkArray.push(self.nodes[number]);
					}
				}
				$(this).siblings().slideToggle("fast");
				
				
			});
			$("li .checked",this.element).on('click',function(){
				
			})
			return this;
		};
	};
	Tree.prototype={
		"sloveNodes":function(){
			var arr=[];
			
			[].push.apply(arr,this.nodes);
			
			for(var i = 0, length = arr.length; i < length; i++) {
				arr[i].number = i;
				arr[i].open = !arr[i].open
			}
			this.nodes=arr;
		},
		"getParent": function(id, array) { //得到有相同的pid的id
				var arr = [];
				for(var key in array) {
					if(array[key].pid == id) {
						arr.push(array[key])
					}
				}
				return arr;
		},
		"getData": function() { //用一个闭包保存str相同的拼接的的字符串 
			var str = "";
			var _self=this;
			return function(id, array, open) {
				var arr = _self.getParent(id, array); //得到当前节点
				if(arr.length > 0) {
					if(open) {
						str += '<ul style="display:none;" class="tree">'
					} else {
						str += '<ul>'
					}
					for(var key in arr) {
						if(_self.getParent(arr[key].id, array, arr[key]).length > 0) {
							str += '<li>' + '<span class="cir" number="' + arr[key].number + '">' + arr[key].name + '</span>';
							_self.nodes[arr[key].number].isParent = true; //判断是否是有子节点
						} else {
							str += '<li>' + '<span class="cir1" number="' + arr[key].number + '">' + arr[key].name + '</span>';
							_self.nodes[arr[key].number].isParent = false; //判断是否有子节点
						}
						arguments.callee(arr[key].id, array, arr[key].open); //用递归调用 
						str += '</li>';
					}
					str += '</ul>';
				}
				return str;
			}
		},
		"getArrayId": function(menuArry) { //这个方法用来求出单一的id
				var jsonId = {};
				var jsonPid = {}
				for(var i = 0; i < menuArry.length; i++) {
					jsonId[menuArry[i].id] = menuArry[i];
					jsonPid[menuArry[i].pid] = menuArry[i];
				}
				var temp = []
				for(var key in jsonPid) {
					if(!jsonId[key]) {
						temp.push({
							key: key,
							node: jsonPid[key]
						});
					}
				}
				return temp;
		},
		"getStr":function() {//获取所有的str
			var idArray = this.getArrayId(this.nodes); //获取单一的id集合
			var b = this.checkBox?this.getCheckBoxData():this.getData();
			for(var i = 0,item;item=idArray[i++];) {
				var str= b(item.key, this.nodes);
			}
			return str;
		},
		"getCheckBoxData" :function() { //用一个闭包保存str相同的拼接的的字符串 
			var str = "";
			var _self=this;
			return function(id, array, open) {
				var arr = _self.getParent(id, array); //得到当前节点
				if(arr.length > 0) {
					if(open) {
						str += '<ul style="display:none;">'
					} else {
						str += '<ul>'
					}
					for(var key in arr) {
						if(_self.getParent(arr[key].id, array, arr[key]).length > 0) {
							str += '<li>' + '<span class="cir treeBox"  number="' + arr[key].number + '">' + arr[key].name + '</span>';
							_self.nodes[arr[key].number].isParent = true; //判断是否是有子节点
						} else {
							str += '<li>' + '<span class="cir1 treeBox" number="' + arr[key].number + '">' + arr[key].name + '</span>';
							_self.nodes[arr[key].number].isParent = false; //判断是否有子节点
						}
						arguments.callee(arr[key].id, array, arr[key].open); //用递归调用 
						str += '</li>';
					}
					str += '</ul>';
				}
				return str;
			}
		}
		
	}
	$.fn.createTree=function(options){
		var defaluts={
			"nodes":[],//nodes节点
			"callBack":function(){},//点击的回调函数
			"treeBox":false
		};
		var ops=$.extend(defaluts,options);
		var element=$(this);
		var tree=new Tree(element,ops);
		tree.init().bind();
		return tree;
	};
})(jQuery)
