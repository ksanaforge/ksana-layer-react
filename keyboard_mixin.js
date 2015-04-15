
var keyboard_mixin={
	arrowkeys:function(){return ["ArrowRight","ArrowLeft","ArrowUp","ArrowDown","PageUp","PageDown"]},
	onkeydown:function(e) {
		var allowkeys=this.state.allowkeys||[];
		if (allowkeys.indexOf(e.key)>-1 || (e.ctrlKey && e.keyCode===67)) return;
		if (e.keyCode==77) {
			this.markSelection(e);
		}
		e.preventDefault();
	}
}
module.exports=keyboard_mixin;