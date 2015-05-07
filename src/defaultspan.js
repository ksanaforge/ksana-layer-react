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

var E=React.createElement;
var PT=React.PropTypes;

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
  ,propTypes:{
    tid:PT.array
    ,index:PT.number
    ,tags:PT.array.isRequired
    ,start:PT.number.isRequired
    ,tagStyles:PT.object
  }
  ,getInitialState:function() {
    return {span:React.Text||"span"}
  }
  ,getTagStyle:function(tid) {
    if (!tid) return {};
    var out=[];
    for (var i=0;i<tid.length;i++){
      var m=tid[i];
      var styles=this.props.styles;
      var tag=this.props.tags[m];
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
  ,render:function() {
    var styles=this.getTagStyle(this.props.tid);
    var style=mergeStyles(styles);
    var props={"data-index":this.props.index,
      "data-tid":this.props.tid,style:style,onClick:this.click,"data-start":this.props.start}
    
    props.className=this.getTagType(this.props.tid).join(" ");  //pass className as it's  
    if (style) props.style=style;

    return E(this.state.span,props,this.props.children);
  }
});
module.exports=SpanClass;
