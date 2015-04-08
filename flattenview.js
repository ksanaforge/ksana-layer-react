try {
	var React=require("react-native");
	var PureRenderMixin=null;
} catch(e) {
	var React=require("react/addons");
	var PureRenderMixin = React.addons.PureRenderMixin;
}


var E=React.createElement;
var PT=React.PropTypes;

//  create less span for overlap markup.
//  each span holds an array of markups id in props.mid
//  props.start is the starting offset of the text snippnet in the span
//  [ array of markup at 0, array of markups at 1 ... ]

var spreadMarkup=function(markups){
	var out=[];
	for (var i=0;i<markups.length;i++) {
		var m=markups[i];
		var start=m[0],len=m[1];
		for (var j=start;j<start+len;j++) {
			if (!out[j]) out[j]=[];
			out[j].push(i);
		}
	}
	for (var i=0;i<out.length;i++) {
		out[i]&&out[i].sort(function(a,b){return a-b});
	}
	return out;
}

var FlattenView=React.createClass({
	mixins: [PureRenderMixin]
	,getDefaultProps:function() {
		return {span:React.Text||"span", div:React.View||"div"};
	}
	,componentWillMount:function() {
		this.spreaded=spreadMarkup(this.props.markups);		
	}
	,componentWillReceiveProps:function() {
		this.spreaded=spreadMarkup(this.props.markups);	
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
			if (!this.sameArray(this.spreaded[i],previous)) {
				if (textnow) {
					out.push(E(this.props.span,{key:out.length,mid:previous,start:textstart},textnow ));
					textstart=i;
				}
				textnow="";
			}
			previous=this.spreaded[i]?JSON.parse(JSON.stringify(this.spreaded[i])):null; 
			if (i>this.spreaded.length) break;
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

FlattenView.spreadMarkup=spreadMarkup; //for test only
module.exports=FlattenView;