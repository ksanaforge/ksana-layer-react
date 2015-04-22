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
    //console.log(this.props.index,start,len,thechar);
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
  ,activateMarkup:function(m) {
      this.deactiveOverlapMarkup(m[0],m[1]);
      m[2].state=1;
  }
  ,leave:function() {
    this.setState({seloffset:-1,selidx:-1,editing:false});
  }
  ,enter:function(offset,idx) {
    this.setState({seloffset:offset,selidx:idx});
  }
  ,action:function() {
  	var args=[];
    Array.prototype.push.apply( args, arguments );
    var action=args.shift();
    if (action==="enter") {
      this.enter(args[0],args[1]);
    	this.setState({editing:false});
    } else if (action==="leave") {
		  this.leave();
    } else if (action==="edit") {
      console.log('edit',args[0],args[1])
      this.enter(args[0],args[1]);
      this.setState({editing:true});
    } else if (action==="settext"){      
      var m=args[0];
      this.activateMarkup(m);
      m[2].t=args[1];
      this.leave();
    } else if (action==="delete"){
      //delete markup
    } else if (action==="toggle") {
		  var m=args[0];
		  if (!m[2].state) this.activateMarkup(m);
		  else m[2].state=0;
      var that=this;
      setTimeout(function(){//wait until render finish
        that.refs.baseview.moveCaret(m[0]);  
      },200);
    }
  }
  ,render:function() {
    var markups=elementFromMarkup(this.props.markups||[],this.action,this.state.seloffset,this.state.selidx,this.state.editing);
    return E(BaseView,{index:this.props.index,ref:"baseview",
            showCaret:true,markups:markups, onSelect:this.onselect, text:(this.props.text||"")}
    );
  }
});

module.exports=RevisionView;