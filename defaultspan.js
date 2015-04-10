var React=require("react");
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
    ,styles:PT.object
  }
  ,getInitialState:function() {
    return {span:React.Text||"span"}
  }
  ,getMarkupStyle:function(mid) {
    if (!mid) return {};
    var out=[];
    return mid.map(function(m){
      return this.props.styles[this.props.markups[m][2].type];
    },this);
  }
  ,render:function() {
    var styles=this.getMarkupStyle(this.props.mid);
    var style=mergeStyles(styles);
    return E(this.state.span, {style:style,onClick:this.click,"data-start":this.props.start}, this.props.children);
  }
});
module.exports=SpanClass;
