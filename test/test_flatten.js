var assert=require("assert");
var API=require("ksana-layer");
var flatten=require("..").flatten;
var text="111222333";
var segid="a";
var createmarkups =function() {
	var doc=API.layerdoc.create();
	doc.put(segid,text);

	var M=API.layermarkup.create(doc);
	var m=M.createMarkup(segid,2,2,{tag:"twelve"});
	var m2=M.createMarkup(segid,5,2,{tag:"twenty three"});
	return {text:text, markups:M.markups[segid]};
}
var createoverlapmarkups =function() {
	var doc=API.layerdoc.create();
	doc.put(segid,text);

	var M=API.layermarkup.create(doc);
	var m=M.createMarkup(segid,2,4,{tag:"1222"});
	var m2=M.createMarkup(segid,4,4,{tag:"2223"});
	return {text:text, markups:M.markups[segid]};
}

describe("test flatten",function(){
	it("flatten",function(){
		var res=createmarkups();
		var M=flatten(res.markups);
		assert.deepEqual(M[2],[0]);
		assert.deepEqual(M[3],[0]);
		assert.deepEqual(M[4],undefined);
		assert.deepEqual(M[5],[1]);
		assert.deepEqual(M[6],[1]);
	});

	it("overlap",function(){
		var res=createoverlapmarkups();
		var M=flatten(res.markups);
		assert.deepEqual(M[2],[0]);
		assert.deepEqual(M[3],[0]);
		assert.deepEqual(M[4],[0,1]);
		assert.deepEqual(M[5],[0,1]);
		assert.deepEqual(M[6],[1]);
		assert.deepEqual(M[7],[1]);
	});

});