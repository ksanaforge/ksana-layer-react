var assert=require("assert");
var API=require("ksana-layer");
       // 01234567890
var text="aaabbbcccdd";
var segid="a";


var React=require("react/addons")
var TestUtils=React.addons.TestUtils;

var renderer=TestUtils.createRenderer();
var BaseView=require("..").BaseView;


var createoverlapmarkups =function() {
	var doc=API.layerdoc.create();
	doc.put(segid,text);

	var M=API.layermarkup.create(doc);
	var m=M.createMarkup(segid,2,4,{tag:"abbb"});
	var m2=M.createMarkup(segid,4,4,{tag:"bbcc"});
	return {text:text, markups:M.markups[segid]};
}

describe("test BaseView",function(){
	it("spread markup to span",function(){
		var res=createoverlapmarkups();
		var M=BaseView.spreadMarkup(res.markups);
		assert.deepEqual(M[2],[0]);
		assert.deepEqual(M[3],[0]);
		assert.deepEqual(M[4],[0,1]);
		assert.deepEqual(M[5],[0,1]);
		assert.deepEqual(M[6],[1]);
		assert.deepEqual(M[7],[1]);
	});

	it("check rendered output",function(){
		var res=createoverlapmarkups();
		var ele=React.createElement(BaseView,res);
		renderer.render(ele);
		var renderoutput=renderer.getRenderOutput();
		var C=renderoutput.props.children;

		//console.log(C.map(function(c){return c.key+"_"+c.props.children}));
		
		assert.equal(C.length,11);
		assert.equal(C[0].props.children,"aa")
		assert.equal(C[0].props.start,0);
		assert.equal(C[0].props.mid,null);

		//console.log(React.renderToString(ele))
		assert.equal(C[2].props.children,"ab");
		assert.equal(C[2].props.start,2);
		assert.deepEqual(C[2].props.mid,[0]);
		
		assert.equal(C[5].props.children,"bb");
		assert.deepEqual(C[5].props.mid,[0,1]); //overlap
		
		assert.equal(C[8].props.children,"cc");
		assert.deepEqual(C[8].props.mid,[1]);
		
		assert.equal(C[10].props.children,"cdd");
		assert.equal(C[10].props.mid,null);
	});

});