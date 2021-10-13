import ReconnectingWebSocket from "reconnecting-websocket";
export default function CreateWbsocket(options){
	const {
		wsUrl='',
		onopen=function(e){return false},
		onerror=function(e){return false},
		onclose=function(e){return false},
		onmessage=function(e){return false}
	} = options;
	this._ws = null;
	this.wsUrl = wsUrl;       		//地址
	this.onopenCallback = onopen;
	this.onerrorCallback = onerror;
	this.oncloseCallback = onclose;
	this.onmessageCallback = onmessage;
	this.init();
}
CreateWbsocket.prototype = {
	init:function(){
		this.connect();
	},
	connect:function(){
		this._ws = new ReconnectingWebSocket(this.wsUrl);
		this._ws.onopen = this.onopenFun.bind(this);
    	this._ws.onerror = this.onerrorFun.bind(this);
   		this._ws.onclose = this.oncloseFun.bind(this);
   		this._ws.onmessage = this.onmessage.bind(this);
	},
	onopenFun:function(e){
		this.onopenCallback(e,this._ws);
	},
	onerrorFun:function(e){
		this.onerrorCallback(e);
		console.log(e);
	},
	oncloseFun:function(e){
		this.oncloseCallback(e);
		console.log(e);
	},
	onmessage:function(e){
		this.onmessageCallback(e);
	}
}
