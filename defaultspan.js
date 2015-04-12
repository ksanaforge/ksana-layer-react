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
  var out={};
  for (var i=0;i<styles.length;i++) {
    for (var key in styles[i]) {
      out[key]=styles[i][key];
    }
  }
  return out;
}
var SpanClass = React.createClass({
  propTypes:{
    mid:PT.array
    ,markups:PT.array.isRequired
    ,start:PT.number.isRequired
    ,markupStyles:PT.object
  }
  ,getInitialState:function() {
    return {span:React.Text||"span"}
  }
  ,getMarkupStyle:function(mid) {
    if (!mid) return {};
    var out=[];
    for (var i=0;i<mid.length;i++){
      var m=mid[i];
      var markup=this.props.markups[m];
      var type=markup[2].type;
      this.props.markupStyles[type]?out.push(this.props.markupStyles[type]):0;
      this.props.markupStyles[type+"_first"]?out.push(this.props.markupStyles[type+"_first"]):0;
      this.props.markupStyles[type+"_last"]?out.push(this.props.markupStyles[type+"_last"]):0;
    };
    return out;
  }
  ,render:function() {
    var styles=this.getMarkupStyle(this.props.mid);
    var style=mergeStyles(styles);
    return E(this.state.span, {style:style,onClick:this.click,"data-start":this.props.start}, this.props.children);
  }
});
module.exports=SpanClass;
