/*
  Span's styles is created by merging styles of all tags covering the span.
*/
try {
  var React=require("react-native");
  var PureRenderMixin=null;
} catch(e) {
  var React=require("react/addons");
  var PureRenderMixin = React.addons.PureRenderMixin;
}
var E=React.createElement,PT=React.PropTypes;


var mergeStyles=function(styles) {
  if (!styles.length) return null;
  var out={};
  for (var i=0;i<styles.length;i++) {
    for (var key in styles[i]) {
      out[key]=styles[i][key];
    }
  }
  return out;
}
var SpanClass = React.createClass({
  displayName:"defaultSpan"
  ,mixins:[PureRenderMixin]
  ,propTypes:{
    tid:PT.array
    ,index:PT.number
    ,tags:PT.array.isRequired
    ,start:PT.number.isRequired
    ,tagStyles:PT.object
    ,onLeaveTag:PT.func
    ,onEnterTag:PT.func
  }
  ,getTagStyle:function(tid) {
    if (!tid) return {};
    var out=[];
    for (var i=0;i<tid.length;i++){
      var m=tid[i];
      var styles=this.props.styles;
      var tag=this.props.tags[m];
      tag.style&&out.push(tag.style);
      var type=tag.className;
      styles[type]&&out.push(styles[type]);
      styles[type+"_first"]&&out.push(styles[type+"_first"]);
      styles[type+"_last"]&&out.push(styles[type+"_last"]);        
    };
    return out;
  }
  ,getTagType:function(tid){
    if (!tid) return [];
    var out=[];
    for (var i=0;i<tid.length;i++){
      var m=tid[i];
      var styles=this.props.styles;
      var tag=this.props.tags[m];
      var type=tag.className;
      type&&out.push(type);
    }
    return out;
  }
  ,getTid:function(e) {
    var node=e.target;
    while (node&&typeof node.dataset["start"]=="undefined") {
      node=node.parentNode;
    }
    var tid=node.dataset["tid"];
    return tid;
  }
  ,onMouseEnter:function(e) {
    var tid=this.getTid(e);
    if(this.props.onEnterTag && tid) this.props.onEnterTag(tid);
  }
  ,onMouseLeave:function(e) {
    var tid=this.getTid(e);
    if(this.props.onLeaveTag && tid) this.props.onLeaveTag(tid);
  }
  ,render:function() {
    var styles=this.getTagStyle(this.props.tid);
    var style=mergeStyles(styles);
    var span=React.Text||"span";
    
    var props={"data-tid":this.props.tid,style:style,"data-start":this.props.start
    ,onMouseEnter:this.onMouseEnter,onMouseLeave:this.onMouseLeave};    
    props.className=this.getTagType(this.props.tid).join(" ");  //pass className as it's  
    if (style) {
      //work around, react doensn't apply style, don't why
      return E(span,props,E(span,{},this.props.children));
    }
    
    return E(span,props,this.props.children);
  }
});
module.exports=SpanClass;
