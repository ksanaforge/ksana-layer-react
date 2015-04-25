try {
  var React=require("react-native");
  var PureRenderMixin=null;
} catch(e) {
  var React=require("react/addons");
  var PureRenderMixin=React.addons.PureRenderMixin;
}
var E=React.createElement;
var PT=React.PropTypes;
var user=require("./user");

var Interline=require("./interline");
var markuputil=require("./markuputil");
var elementFromMarkup=require("./elementfrommarkup");
var BaseView=require("./baseview");
var selection=require("./selection");
var caretPos=require("./caretpos");

var RevisionView=React.createClass({
  //mixins: [React.addons.PureRenderMixin]
  onselect:function(start,len,thechar) {
    //console.log(this.props.index,start,len,thechar);
  }
  ,getInitialState:function() {
  	return {seloffset:-1,selidx:-1}
  }
  ,getDefaultProps:function() {
    return {text:""};
  }
  ,deactiveOverlapMarkup:function(start,len) {
    //set state to 0 for any overlap markup
    this.props.markups.forEach(function(m){
      if (!(start>=m.s+m.l || start+len<=m.s) ) {
        if (m.state) m.state=0;
      }
      if (start===m.s && m.state) m.state=0;
    });
  }
  ,activateMarkup:function(m) {
      this.deactiveOverlapMarkup(m.s,m.l);
      m.state=1;
  }
  ,deleteEmptyMarkup:function(m) {
    if (!m) return;
    if (m.l===0 && !m.t) {
      var i=this.props.markups.indexOf(m);
      if (i>-1) this.props.markups.splice(i,1);
    }
  }
  ,leave:function(m) {
    this.deleteEmptyMarkup(m);
    this.setState({seloffset:-1,selidx:-1,editing:false});
  }
  ,enter:function(offset,idx) {
    this.setState({seloffset:offset,selidx:idx});
  }

  ,onKeyPress:function(e) {
    if (e.target.nodeName==="INPUT") return;
    if (e.key===" ") {
      var sel=selection.get(this.getDOMNode());
      var start=sel.start,len=sel.len;
      if (start>-1 && len===0) {
        var n=markuputil.newMarkup(this.props.markups,start);
        this.action("edit",start,n);
      }
    }
    e.preventDefault();
  }
  ,action:function() {
  	var args=[];
    Array.prototype.push.apply( args, arguments );
    var action=args.shift();
    if (action==="enter") {
      this.enter(args[0],args[1]);
    	this.setState({editing:false});
    } else if (action==="leave") {
		  this.leave(args[0]);
    } else if (action==="edit") {
      this.enter(args[0],args[1]);
      this.setState({editing:true});
    } else if (action==="settext"){      
      var m=args[0];
      this.activateMarkup(m);
      m.t=args[1];
      this.leave(m);
    } else if (action=="movecaret") {
      var m=args[0];
      var direction=args[1];
      var caretpos=caretPos.create(this.props.text.substr(m.s));
      m.l=direction<0?caretpos.prev(m.l):caretpos.next(m.l);
      this.forceUpdate();
    } else if (action==="toggle") {
		  var m=args[0];
		  if (!m.state) this.activateMarkup(m);
		  else m.state=0;
      var that=this;
      setTimeout(function(){//wait until render finish
        that.refs.baseview.moveCaret(m.s);  
      },200);
    }
  }
  ,render:function() {
    var M=elementFromMarkup(this.props.markups||[],this.action,this.state.seloffset,this.state.selidx,this.state.editing);
    return E(BaseView,{index:this.props.index,ref:"baseview",allowKeys:[" "],
            showCaret:true,markups:M, onKeyPress:this.onKeyPress,onSelect:this.onselect, text:(this.props.text)}
    );
  }
});

module.exports=RevisionView;