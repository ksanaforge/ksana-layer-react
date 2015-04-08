var React=require("react/addons");
var PureRenderMixin = React.addons.PureRenderMixin;
var flatten=require("./flatten");

var E=React.createElement;
var PT=React.PropTypes;

//  create less span for overlap markup.
//  each span holds an array of markups id in props.mid
//  props.start is the starting offset of the text snippnet in the span

var FlattenView=React.createClass({
	mixins: [PureRenderMixin]
	,getDefaultProps:function() {
		return {span:"span", div:"div"};
	}
	,componentWillMount:function() {
		this.flatten=flatten(this.props.markups);		
	}
	,componentWillReceiveProps:function() {
		this.flatten=flatten(this.props.markups);	
	}
	,propTypes:{
		text:PT.string.isRequired
		,markups:PT.array.isRequired
		,span:PT.oneOfType([PT.string,PT.object]) //should be a ReactClass
		,div:PT.oneOfType([PT.string,PT.object]) //should be a ReactClass
	}
	,click:function() {
		this.setState({content:"hello"});
	}
	,sameArray:function(a1,a2) {
		if (!a1 && !a2) return true;
		if (!a1 && a2) return false;
		if (a1 && !a2) return false;
		return JSON.stringify(a1)===JSON.stringify(a2);
	}
	,renderChildren:function() {
		var out=[], textnow="" ,textstart=0;
		var previous=["impossible item"] ;

		for (var i=0;i<this.props.text.length;i++) {
			if (!this.sameArray(this.flatten[i],previous)) {
				if (textnow) {
					out.push(E(this.props.span,{key:out.length,mid:previous,start:textstart},textnow ));
					textstart=i;
				}
				textnow="";
			}
			previous=this.flatten[i]?JSON.parse(JSON.stringify(this.flatten[i])):null; 
			if (i>this.flatten.length) break;
			textnow +=this.props.text[i];
		}
		textnow=this.props.text.substr(textstart) ;
		if (textnow) out.push(E(this.props.span,{key:out.length,mid:previous,start:textstart}, textnow));
		return out;
	}
	,render:function(){
		return E(this.props.div,this.props,this.renderChildren());
	}
});
module.exports=FlattenView;