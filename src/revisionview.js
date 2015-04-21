try {
  var React=require("react-native");
  var PureRenderMixin=null;
} catch(e) {
  var React=require("react/addons");
  var PureRenderMixin=React.addons.PureRenderMixin;
}
var E=React.createElement;
var PT=React.PropTypes;

var Interline=require("./interline");
var elementFromMarkup=require("./elementFromMarkup");
var BaseView=require("./baseview");
var RevisionView=React.createClass({
  //mixins: [React.addons.PureRenderMixin]
  onselect:function(start,len,thechar) {
    console.log(this.props.index,start,len,thechar);
  }
  ,getInitialState:function() {
  	return {seloffset:-1,selidx:-1}
  }
  ,deactiveOverlapMarkup:function(start,len) {
    //set state to 0 for any overlap markup
    this.props.markups.forEach(function(m){
      if (!(start>=m[0]+m[1] || start+len<=m[0]) ) {
        if (m[2].state) m[2].state=0;
      }
    });
  }
  ,action:function() {
  	var args=[];
    Array.prototype.push.apply( args, arguments );
    var action=args.shift();
    if (action==="enter") {
    	this.setState({seloffset:args[0],selidx:args[1]});	
    } else if (action==="leave") {
		  this.setState({seloffset:-1,selidx:-1});	
    } else if (action==="toggle") {
		  var m=args[0];
		  if (!m[2].state) {
        this.deactiveOverlapMarkup(m[0],m[1]);
        m[2].state=1;
      }
		  else m[2].state=0;
		  this.forceUpdate();
    }
  }
  ,render:function() {
    var markups=elementFromMarkup(this.props.markups||[],this.action,this.state.seloffset,this.state.selidx);
    return E(BaseView,{index:this.props.index,
            showCaret:true,markups:markups, onSelect:this.onselect, text:(this.props.text||"")}
    );
  }
});

module.exports=RevisionView;