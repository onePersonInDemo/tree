(function($) {

	$.fn.createTree = function(options) {
		var defaluts = {
			"nodes": ""
		}; {
			for(var i = 0, length = options.nodes.length; i < length; i++) {
				options.nodes[i].number = i;
				options.nodes[i].open = !options.nodes[i].open
			}
		}
		var ops = $.extend(defaluts, options);
		var tools = {
			"getParent": function(id, array) { //得到有相同的pid的id
				var arr = [];
				for(var key in array) {
					if(array[key].pid == id) {
						arr.push(array[key])
					}
				}
				return arr;
			},
			getData: function() { //用一个闭包保存str相同的拼接的的字符串 
				var str = "";
				return function(id, array, open) {
					var arr = tools.getParent(id, array); //得到当前节点
					if(arr.length > 0) {
						if(open) {
							str += '<ul style="display:none;">'
						} else {
							str += '<ul>'
						}
						for(var key in arr) {
							if(tools.getParent(arr[key].id, array, arr[key]).length > 0) {
								str += '<li>' + '<span class="cir" number="' + arr[key].number + '">' + arr[key].name + '</span>';
								ops.nodes[arr[key].number].isParent = true; //判断是否是有子节点
							} else {
								str += '<li>' + '<span class="cir1" number="' + arr[key].number + '">' + arr[key].name + '</span>';
								ops.nodes[arr[key].number].isParent = false; //判断是否有子节点
							}
							arguments.callee(arr[key].id, array, arr[key].open); //用递归调用 
							str += '</li>'
						}
						str += '</ul>'
					}
					return str;
				}
			},
			getArrayId: function(menuArry) { //这个方法用来求出单一的id
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
			}

		};

		function getStr() {
			var idArray = tools.getArrayId(ops.nodes); //获取单一的id集合
			var b = new tools.getData();
			for(var i = 0; i < idArray.length; i++) {
				var bb = b(idArray[i].key, ops.nodes);
			}
			return bb;
		}
		var cc = getStr(); //获取所有的ul节点
		$(this).empty().html(cc); //添加节点
		$(' li span', this).click(function() {
			var number = $(this).attr('number');
			ops.onClick(ops.nodes[number]);
			$(this).siblings().slideToggle("fast")
		})
	}
})(jQuery)