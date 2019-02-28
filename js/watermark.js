(function(window) {
	/**
	 * js水印插件
	 * 自动在body底部生成一个水印
	 * auth：zhangdaren
	 * date：20190218
	 * version: v1.0
	 * 
	 * */
	var canvas = null;
	var setting = {
		text: "水印测试", //水印内容，将来支持数组和图片
		fontSize: "24", //字体大小
		color: "#000", //水印字体颜色
		opacity: 0.1, //水印透明度
		rotate: 20, //水印旋转角度
		spaceX: 10, //间隔
		spaceY: 10, //间隔
	};
	var ww; //屏幕宽度
	var wh; //屏幕高度
	var ctx;

	function watermark(option) {
		return new watermark.prototype.init(option);
	}
	watermark.prototype = {
		constructor: watermark,
		init: function(option) {
			if(option && Object.keys(option).length > 0) {
				//
				setting.text = option.text;
				setting.fontSize = option.fontSize || setting.fontSize;
				setting.color = option.color || setting.color;
				setting.opacity = option.opacity || setting.opacity;
				setting.rotate = option.rotate || setting.rotate;
				setting.spaceX = option.spaceX || setting.spaceX;
				setting.spaceY = option.spaceY || setting.spaceY;
			}

			ww = document.body.clientWidth;
			wh = document.body.clientHeight;
			//
			canvas = document.createElement("canvas");
			canvas.style = "position:absolute; z-index:0; width:100%;height:100%;left:0;top:0";
			canvas.setAttribute("width", ww);
			canvas.setAttribute("height", wh);
			document.body.append(canvas);

			ctx = canvas.getContext("2d");

			//渲染
			watermark.prototype.render();
		},
		render() {
			watermark.prototype.clear();
			//
			ctx.font = setting.fontSize + "px Calibri";
			ctx.textAlign = 'center';
			ctx.textBaseline = 'bottom';
			ctx.fillStyle = setting.color;
			ctx.globalAlpha = setting.opacity; //这里是设置全局的透明度

			//获取文本宽高
			var txtWidth = ctx.measureText(setting.text).width;
			//单个文字宽高
			var singleTxtHeight = ctx.measureText("鹏").width;
			//横向数量，这里加2是为了补全一些情况 
			var columnNum = parseInt(ww / txtWidth + 2);
			//文字的高度，与旋转的角度有关
			var txtHeight = Math.abs(singleTxtHeight * Math.sin(setting.rotate * Math.PI / 180) * setting.text.length); // * setting.text.length;
			//行数
			var rowNum = parseInt(wh / txtHeight);

			for(var i = 0; i < rowNum; i++) {
				var y = (txtHeight + setting.spaceY) * i;
				for(var j = 0; j < columnNum; j++) {
					var x = (txtWidth + setting.spaceX) * j;
					//保存上次状态
					ctx.save();
					//旋转canvas
					rotateContext(ctx, x, y, -setting.rotate);
					ctx.fillText(setting.text, x, y);  
					//回到上次状态 //用于重置canvas的旋转
					ctx.restore(); 
				}
			}
		},
		clear() {
			ctx.clearRect(0, 0, ww, wh);
		}
	};

	//确保是以(x,y)为中心进行旋转，而不是简单的以画布原点旋转
	function rotateContext(ctx, x, y, degree) {
		ctx.translate(x, y);
		ctx.rotate(degree * Math.PI / 180);
		ctx.translate(-x, -y);
	}

	function onResize() {
		//重新获取window宽高
		ww = document.body.clientWidth;
		wh = document.body.clientHeight;
		//重新设置canvas宽高
		canvas.setAttribute("width", ww);
		canvas.setAttribute("height", wh);
		//重绘
		watermark.prototype.clear();
		watermark.prototype.render();
	}

	window.onresize = function() {
		throttle(onResize, window);
	}

	//函数节流
	function throttle(method, context) {
		clearTimeout(method.tId);
		method.tId = setTimeout(function() {
			method.call(context);
		}, 500);
	}

	window.watermark = watermark;
})(window);