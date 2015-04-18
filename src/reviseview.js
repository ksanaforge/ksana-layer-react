try {
	var React=require("react-native");
	var PureRenderMixin=null;
} catch(e) {
	var React=require("react/addons");
	var PureRenderMixin = React.addons.PureRenderMixin;
}
var BaseView=require("./baseview");
var keyboard_mixin=require("./keyboard_mixin");
var selection=require("./selection");

var E=React.createElement;
var PT=React.PropTypes;
var Input=React.createClass({
	componentDidMount:function() {
		var n=this.getDOMNode();
		if (this.props.editing) {
			setTimeout(function(){n.focus()},100);
		}
	}
	,onKeyDown:function(e) {
		e.stopPropagation();
	}
	,onKeyPress:function(e) {
		e.stopPropagation();		
	}
	,clickMe:function(e) {
		console.log(e)
		e.stopPropagation()
	}
	,render:function() {
		return E("span",{style:{position:"relative"}},
			E("div",{style:{position:"absolute",left:0,top:"0.6em"},size:2,onKeyDown:this.onKeyDown,onKeyPress:this.onKeyPress}
				,E("span",{onClick:this.clickMe,style:{borderStyle:"dotted",borderColor:"silver",fontSize:"50%",color:"yellow",borderWidth:1
					,borderRadius:"50%",cursor:"pointer",verticalAlign:"top",backgroundColor:"drakgray",height:"0.5em",width:"0.5em"}},"叶")));

		//return E("input",{size:2,onKeyDown:this.onKeyDown,onKeyPress:this.onKeyPress});
	}
})
var ReviseView=React.createClass({
	displayName:"RevisionView"
	,mixins:[keyboard_mixin]
	,getInitialState:function() {
		var allowkeys=keyboard_mixin.arrowkeys();
		allowkeys.push("Enter");
		allowkeys.push(" ");
		return {markups:this.props.markups||[],allowkeys:allowkeys, selection:[]};
	}
	,addP:function() {
		var sel=selection.get();
		var markups=this.state.markups;
		markups.push([sel.start,0,{before:E("br")}]);
		this.setState({markups:markups});
	}
	,addText:function() {
		var sel=selection.get();
		var markups=this.state.markups;
		markups.push([sel.start,0,{before:E(Input,{size:2,editing:true})}]);
		this.setState({markups:markups});
	}
	,onkeypress:function(e) {
		if (e.key=="Enter") {
			this.addP();
			e.preventDefault();
		} else if (e.key==" ") {
			this.addText();
			e.preventDefault();
		}
	}
	,getDefaultProps:function() {
		return {markupStyles:{}};
	}
	,onSelect:function(start,len,thechar,modifier) {
		var markups=this.state.markups;

		markups=markups.filter(function(m){
			return m[2].type!=="selected";
		});
		if (len>0) markups.push([start,len,{type:"selected"}]);

		this.setState({selection:[start,len],markups:markups});
		this.props.onSelect&& this.props.onSelect(start,len,thechar,modifier,selection);
	}	
	,render:function(){
		return E(BaseView,
				{showCaret:this.props.showCaret,index:this.props.index,
					text:this.props.text,markups:this.state.markups,
					onSelect:this.onSelect,markupStyles:this.state.markupStyles,
					onKeyDown:this.onkeydown,
					onKeyPress:this.onkeypress,
					onSelect:this.onSelect
				},
				this.props.children
			);

	}
});

module.exports=ReviseView;