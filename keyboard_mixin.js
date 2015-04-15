var allowkeys=["ArrowRight","ArrowLeft","ArrowUp","ArrowDown","PageUp","PageDown"];
var keyboard_mixin={
	onkeydown:function(e) {
		if (allowkeys.indexOf(e.key)>-1 || (e.ctrlKey && e.keyCode===67)) return;
		e.preventDefault();
		if (e.keyCode==77) {
			this.markSelection(e);
		}
		e.preventDefault();
	},
	onkeypress:function(e) {
		
	}
}
module.exports=keyboard_mixin;