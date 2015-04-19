try {
	var React=require("react-native");
	var PureRenderMixin=null;
} catch(e) {
	var React=require("react/addons");
	var PureRenderMixin = React.addons.PureRenderMixin;
}

var E=React.createElement;
var PT=React.PropTypes;
var Interline=React.createClass({
	displayName:"InterlineView"
	,mixins:[PureRenderMixin]
	,onClick:function() {

	}
	,render:function(){
		return E("span",{style:{position:"relative"}},
			E("div",{style:{position:"absolute",left:0,top:"0.6em"},size:2,onKeyDown:this.onKeyDown,onKeyPress:this.onKeyPress}
				,E("span",{onClick:this.clickMe,style:{borderStyle:"dotted",borderColor:"silver",fontSize:"50%",color:"yellow",borderWidth:1
					,borderRadius:"50%",cursor:"pointer",verticalAlign:"top",backgroundColor:"drakgray",height:"0.5em",width:"0.5em"}},"叶")));


	}
});

module.exports=Interline;