/*
	Core markup display component,
	"flatten" text, markups (with styles) to single layer.
*/
try {
	var React=require("react-native");
	var PureRenderMixin=null;
} catch(e) {
	var React=require("react/addons");
	var PureRenderMixin=React.addons.PureRenderMixin;
}
var update=React.addons.update;
var E=React.createElement;
var spreadMarkup=require("./interline/markuputil").spreadMarkup;
var caretPos=require("./caretpos");
var defaultSpan=require("./defaultspan");
var PT=React.PropTypes;
var styles=require("./interline/styles");
var FlattenView=React.createClass({
	mixins:[PureRenderMixin]
	,propTypes:{
		text:React.PropTypes.string.isRequired
		,markups:PT.object
		,markupStyles:PT.object
		,span:PT.node 
		,style:PT.object
		,allowKeys:PT.array
		,onMouseUp:PT.func,onKeyDown:PT.func ,onKeyUp:PT.func	,onKeyPress:PT.func
	}
	,getDefaultProps:function() {
		return {markups:{},markupStyles:{},span:defaultSpan};
	}
	,markupAtPos:[] // hold covering markups given a text position
	,componentWillMount:function() {
		this.style=this.props.style||{};
		if (!this.style.lineHeight||!this.style.outline) {
			this.style=update(this.style,{$merge:{
				outline : "0px solid transparent", lineHeight:"180%"
			}});
		}
		this.markupStyles=this.props.markupStyles;
		!this.markupStyles._selected_ && 
		(this.markupStyles=update(this.markupStyles,{$merge:{_selected_:styles.selected_style}}));
		this.markupAtPos=spreadMarkup(this.props.markups);
	}
	,componentWillReceiveProps:function(nextProps) {
		this.markupAtPos=spreadMarkup(nextProps.markups);
	}
	,renderSpan:function(out,start,end,spantext,mid) {
		var before=[],after=[], markups=this.props.markups;
		(mid||[]).map(function(m){ 
			if (markups[m].before&& start===markups[m].s) { 
				before.push(markups[m].before);
			}
		});
		before.length && out.push(E(React.Text||"span",{key:"b"+start},before));

		out.push(E(this.props.span,{index:this.props.index,
					markupStyles:this.markupStyles,key:'s'+start, markups:markups,mid:mid,start:start}
				,spantext )
		);

		(mid||[]).map(function(m){ 
			if (markups[m].after && end===markups[m].s+markups[m].l) {
				after.push(markups[m].after);
			} 
		});
		
		after.length && out.push(E(React.Text||"span",{key:"a"+start},after));
		return out;
	}
	,renderChildren:function() {
		var sameArray=function(a1,a2) {
			if (!a1 && !a2) return true; //both are empty
			if ((!a1 && a2) || (a1 && !a2) ) return false;
			return a1.toString()===a2.toString(); //one dimensional array
		}
		var out=[], spantext="" ,start=0, previous=["impossible item"] ;
		var caretpos=caretPos.create(this.props.text);

		while (caretpos.get()<this.props.text.length) {
			var i=caretpos.get();
			if (!sameArray(this.markupAtPos[i],previous)) {
				spantext && (out=this.renderSpan(out,start,i,spantext,previous));
				start=i;
				spantext="";
			}
			previous=(this.markupAtPos[i]&&this.markupAtPos[i].length)?JSON.parse(JSON.stringify(this.markupAtPos[i])):null; 
			if (i>this.markupAtPos.length) break;
			spantext += caretpos.nextToken();
		}
		spantext=this.props.text.substr(start);
		spantext && (out=this.renderSpan(out,start,i,spantext,previous));
		return out;
	}
	,render:function() {
		return E(React.View||"div",{ spellCheck:false, style:this.style, onMouseUp:this.props.onMouseUp
						,onKeyDown:this.props.onKeyDown, onKeyUp:this.props.onKeyUp ,onKeyPress:this.props.onKeyPress }
					,this.renderChildren());
				}
});
module.exports=FlattenView;