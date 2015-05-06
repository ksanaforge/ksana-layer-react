
var keyboard_mixin={
	arrowkeys:function(){return ["ArrowRight","ArrowLeft","ArrowUp","ArrowDown","PageUp","PageDown","Home","End"]},
	onkeydown:function(e) {
		var nodename=e.target.nodeName;
		if (nodename==="INPUT" || nodename==="TEXTAREA") return;
		var allowkeys=this.state.allowkeys||[];
		if (allowkeys.indexOf(e.key)>-1 || (e.ctrlKey && e.keyCode===67)) return; //allow ctrl+c

		e.preventDefault();
	}
}
module.exports=keyboard_mixin;