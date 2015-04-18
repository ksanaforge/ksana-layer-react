var getPos=function(node,off){
    var sel=window.getSelection(), pos=0, thechar='';
    if (off>=node.length) {
    	if (node.parentNode.nextSibling) {
		    pos=parseInt(node.parentNode.nextSibling.dataset['start']);
	    	thechar=node.parentNode.nextSibling.innerText[0];
    	} else { //at end of span
    		thechar=node.parentNode.innerText[off-1];
    		pos=parseInt(node.parentNode.dataset['start'])+off;
    	}
    } else {
    	if (node.data) thechar=node.data[off];
	    pos=parseInt(node.parentNode.dataset['start'])+off;
    }
    return {thechar:thechar,pos:pos};
}
// return the span containing the pos
var posInSpan=function(children,pos) {
	for (var i=0;i<children.length;i++) {
		var spanstart=parseInt(children[i].dataset.start);
		if (spanstart>pos) {
			laststart=parseInt(children[i-1].dataset.start);
			return {idx:i-1,element:children[i-1], offset:pos-laststart};
		}
	}
	laststart=parseInt(children[children.length-1].dataset.start);
	return {idx:children.length-1,element:children[children.length-1], offset:pos-laststart };
}
var restore=function(domnode,oldsel) {
    if (!oldsel) return;
	var span=posInSpan(domnode.childNodes,oldsel.start+oldsel.len)

    var range = document.createRange();
    if (span.element.nodeType!==3 && span.element.childNodes[0].nodeType===3) {
    	span.element=span.element.childNodes[0];
    }
    range.setStart(span.element ,span.offset);
    range.setEnd( span.element,span.offset);
    var sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
}

var get=function(e) {
    var sel=window.getSelection();
    if (!sel.baseNode) return;
    var off=getPos(sel.baseNode,sel.baseOffset);
    var off2=getPos(sel.extentNode,sel.extentOffset);
    var p1=sel.baseNode.parentElement,p2=sel.extentNode.parentElement;
    if (p1.nodeName!="SPAN"||p2.nodeName!="SPAN") return;

    if (sel.extentNode && off2.pos>off.pos) {
    	sel.empty();
	}
	return {start:off.pos,len:off2.pos-off.pos,thechar:off.thechar};
}

module.exports={get:get,restore:restore};