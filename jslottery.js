/*
 * @title Jslottery
 * @author Topthinking
 */
 var Jslottery = (function(){

	var global;
	
	function Jslottery(opt){
		var options = {
			scroll_dom:null,
			stop_position:null,
			speed:300,
			speedUp:50,
			speedDown:400,
			speed_up_position:3,
			speed_down_position:2,
			total_circle:1,
			scroll_dom_css_value:null,
			scroll_dom_attr:null,
			scroll_dom_css:null,
			callback:function(){}
		};

		this.options = this.js_extend(options,opt);
		
		this.fixs = {
			timeout:false,
			original_speed:null,
			curL:1,
			curC:0,
			num:null,
			steps:0,
			run:1,
			error:false,
			dom_style:{}
		};

		this.init();
	}

	Jslottery.prototype = {
		init:function(){
			global = this;
			global.judge_null();
			global.judge_dom();
			global.fixs.num = global.options.scroll_dom.length;	
			global.fixs.original_speed = global.options.speed;
			global.domstyle();
		},

		js_extend:function(destination,source){
			for (var property in source)
				destination[property] = source[property];
			return destination;
		},

		judge_null:function(){
			var self = global.options;
			if(self.scroll_dom==null || 
			   self.scroll_dom_attr==null || 
			   self.scroll_dom_css==null || 
			   self.scroll_dom_css_value==null ||
			   self.stop_position==null){
			   	global.fixs.error=true;
				self.callback({'status':'-1','data':'param error'});
			}
		},

		judge_dom:function(){
			var self = global.options;
			self.scroll_dom =  document.getElementById(self.scroll_dom)==null ? document.getElementsByClassName(self.scroll_dom) : document.getElementById(self.scroll_dom);
		},

		domstyle:function(){
			var self = global.options;
			for(var i=0;i<=global.fixs.num;i++){
				for(var j=0;j<global.fixs.num;j++){
					if(self.scroll_dom[j].getAttribute(self.scroll_dom_attr) == i){
						global.fixs.dom_style[i] = global.js_style(self.scroll_dom[j]);
					}
				}
			}
		},

		js_style:function(obj){
			if(obj.currentStyle){
				return obj.currentStyle[global.options.scroll_dom_css];
			}else{
				return getComputedStyle(obj,false)[global.options.scroll_dom_css];
			}
		},

		start:function(){
			if(global.fixs.error){
				global.options.callback({'status':'-1','data':'param error'});
				return false;
			}
			if(global.fixs.run)
				global.options.callback({'status':'0','data':'Jslottery will start running'});
			global.fixs.run=0;
			if(global.fixs.timeout){   
				global.fixs.curC=0;
				global.fixs.steps=0;
				global.options.speed = global.fixs.original_speed;
				global.fixs.timeout = false;			
				global.stop();
				clearTimeout(global.start);
				return false;
			}
			global.changeNext();
			setTimeout(global.start,global.options.speed);
		},

		stop:function(){
			global.options.callback({'status':'1','data':global});
			global.fixs.run=1;
		},

		speedUp:function(){
			if(global.fixs.steps==global.options.speed_up_position)
				global.options.speed = global.options.speedUp;
		},

		speedDown:function(){
			var tmp1 = global.options.stop_position-global.options.speed_down_position;
			var tmp2 = global.options.total_circle+1;
			if(tmp1<=0){
				tmp1 = global.fixs.num + tmp1;
				tmp2 = tmp2-1;
			}

			if(global.fixs.curL==tmp1 && global.fixs.curC==tmp2)
				global.options.speed = global.options.speedDown;
		},

		changeNext:function(){

			var self = global.options;
			global.fixs.steps++;
			
			if(global.fixs.curL==global.fixs.num+1){
				global.fixs.curL=1;
				global.fixs.curC++;
			}

			global.speedUp();

			global.speedDown();

			if(global.fixs.curL==self.stop_position && global.fixs.curC==self.total_circle+1){
				global.fixs.timeout = true;
			}

			global.start_scroll();
		},

		start_scroll:function(){
			var self = global.options, scroll_json = {}, original_json = {};

			scroll_json[self.scroll_dom_css] = self.scroll_dom_css_value;

			for(var i=0;i<=global.fixs.num;i++){

				if(self.scroll_dom[i].getAttribute(self.scroll_dom_attr)==global.fixs.curL){

					original_json[self.scroll_dom_css] = global.fixs.curL==1 ? global.fixs.dom_style[global.fixs.num] : global.fixs.dom_style[global.fixs.curL-1];
					self.scroll_dom[i].style.cssText=self.scroll_dom_css+":"+scroll_json[self.scroll_dom_css];
					
					for(var j=0;j<global.fixs.num;j++){
						if(global.fixs.curL==1){
							for(var k=0;k<global.fixs.num;k++){
								if(self.scroll_dom[k].getAttribute(self.scroll_dom_attr)==global.fixs.num){
									self.scroll_dom[k].style.cssText=self.scroll_dom_css+":"+original_json[self.scroll_dom_css];
								}
							}
						}else if(self.scroll_dom[j].getAttribute(self.scroll_dom_attr)==global.fixs.curL-1){
							self.scroll_dom[j].style.cssText=self.scroll_dom_css+":"+original_json[self.scroll_dom_css];
						}
					}

					global.fixs.curL++;
					return false;
				}
			}
		}
	};
	return Jslottery;
 })();