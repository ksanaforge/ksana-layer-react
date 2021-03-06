/**
    Return text position at system caret 
    @param {object} DOM node holding the text
    @param {object} baseNode or extendNode node return by system getSelection
    @param {number} offset from the selected node
*/
var getPos=function(rootele,node,off){
    if (!node) return;
    while (node && node.parentElement!==rootele) node=node.parentElement;
    while (node && !node.dataset.start) node=node.nextSibling;
    if (!node) return -1;

    var pos=parseInt(node.dataset.start)+off;
    return pos;
}
/**
    Return the span and offset containing the pos (return by getPos)
    @param {array} spans
    @param {number} text position
*/
var posInSpan=function(children,pos) {
    var lasti;
	for (var i=0;i<children.length;i++) {
        if (!children[i].dataset.start)continue;
		var spanstart=parseInt(children[i].dataset.start);
		if (spanstart>pos) {
			laststart=parseInt(children[lasti].dataset.start);
			return {idx:i-1,element:children[lasti], offset:pos-laststart};
		}
        lasti=i;
	}
	laststart=parseInt(children[children.length-1].dataset.start);
	return {idx:children.length-1,element:children[children.length-1], offset:pos-laststart };
}
/**
    Set Caret to a saved selection
*/
var restore=function(domnode,oldsel) {
    if (!oldsel) return;
	var span=posInSpan(domnode.childNodes,oldsel.start+oldsel.len)
    if (!span) return;
    if (!span.element.childNodes[0])return;

    var range = document.createRange();
    if (span.element.nodeType!==3 && span.element.childNodes[0].nodeType===3) {
    	span.element=span.element.childNodes[0];
    }
    if (span.offset>span.element.length) {
        range.setStart(span.element, 0);
        range.setEnd( span.element, 0);
    } else {
        range.setStart(span.element ,span.offset);
        range.setEnd( span.element,span.offset);        
    }
    var sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
}
/**
    Get the start and len of current selection
    @param {object} root domnode holding the text
*/
var get=function(rootele) {
    var sel=window.getSelection();
    if (!sel.baseNode) return;

    var off=getPos(rootele,sel.anchorNode,sel.anchorOffset);
    var off2=getPos(rootele,sel.focusNode,sel.focusOffset);

    var p1=sel.anchorNode.parentElement,p2=sel.focusNode.parentElement;
    if (p1.nodeName!="SPAN"||p2.nodeName!="SPAN") return;

    var start=off,len=off2-off;
    if (len<0) {
        start=off2;
        len=off-off2;
    }
	return {start:start,len:len, selection:sel};
}

module.exports={get:get,restore:restore};