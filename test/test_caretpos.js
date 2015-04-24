var assert=require("assert");
var caretPos=require('../src/caretpos');
describe("caret Pos for ascii",function(){
	var text="abcd";
	var caretpos=caretPos.create(text);

	it("init state",function(){
		assert.equal(caretpos.get(),0);
		
	});
	it("next",function(){
		assert.equal(caretpos.next(),1);
	});

	it("prev",function(){
		assert.equal(caretpos.prev(),0);
		assert.equal(caretpos.prev(),0);
	})
	it("next boundary",function(){
		assert.equal(caretpos.next(),1);
		assert.equal(caretpos.next(),2);
		assert.equal(caretpos.next(),3);
		assert.equal(caretpos.next(),4);
		assert.equal(caretpos.next(),4);
	});	
});

describe("caret Pos for Chinese",function(){
	var text="一𠀀三";
	var caretpos=caretPos.create(text);
	it("next",function(){
		assert.equal(caretpos.next(),1);
		assert.equal(caretpos.next(),3);
		assert.equal(caretpos.next(),4);
	});
	it("prev",function(){
		assert.equal(caretpos.prev(),3);
		assert.equal(caretpos.prev(),1);
	});
});
