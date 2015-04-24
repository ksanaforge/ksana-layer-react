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


describe("caret Pos for Tibetan",function(){ //only skip dependent vowels
	var text="རསྟེབཅོམ་བ";  //valid caret point "|ར|སྟེ|བ|ཅོ|མ|་|བ"
	var caretpos=caretPos.create(text);
	it("next",function(){
		assert.equal(caretpos.next(),1);
		assert.equal(caretpos.next(),4);
		assert.equal(caretpos.next(),5);
		assert.equal(caretpos.next(),7);
		assert.equal(caretpos.next(),8);
		assert.equal(caretpos.next(),9);
		assert.equal(caretpos.next(),10);
	});
	it("prev",function(){
		assert.equal(caretpos.prev(),9);
		assert.equal(caretpos.prev(),8);
		assert.equal(caretpos.prev(),7);
		assert.equal(caretpos.prev(),5);
		assert.equal(caretpos.prev(),4);
		assert.equal(caretpos.prev(),1);
		assert.equal(caretpos.prev(),0);
		assert.equal(caretpos.prev(),0);
	});
});

describe("arbitrary char pos to valid caret pos",function(){
	var text="རསྟེབཅོམ་བ";  //valid caret point "|ར|སྟེ|བ|ཅོ|མ|་|བ"
	var caretpos=caretPos.create(text);

	it("check if char pos is valid",function(){
		assert.equal(caretpos.valid(1),true);
		assert.equal(caretpos.valid(2),false);
		assert.equal(caretpos.valid(3),false);
	});

	it("next stop from invalid position",function(){
		assert.equal(caretpos.next(2),4);
		assert.equal(caretpos.next(3),4);
	});

	it("prev stop from invalid position",function(){
		assert.equal(caretpos.prev(2),1);
		assert.equal(caretpos.prev(3),1);
		assert.equal(caretpos.prev(4),1);
		assert.equal(caretpos.prev(5),4);
	})

});

describe("next token and prev token",function(){
	var text="རསྟེབཅོམ་བ";  //valid caret point "|ར|སྟེ|བ|ཅོ|མ|་|བ"
	var caretpos=caretPos.create(text);

	it("next token",function(){
		assert.equal(caretpos.nextToken(),"ར");
		assert.equal(caretpos.nextToken(),"སྟེ");
		assert.equal(caretpos.nextToken(),"བ");
		assert.equal(caretpos.nextToken(),"ཅོ");
		assert.equal(caretpos.nextToken(),"མ");
		assert.equal(caretpos.nextToken(),"་");
		assert.equal(caretpos.nextToken(),"བ");
		assert.equal(caretpos.nextToken(),"");
	});
	it("previous token",function(){
		assert.equal(caretpos.prevToken(),"བ");
		assert.equal(caretpos.prevToken(),"་");
		assert.equal(caretpos.prevToken(),"མ");
		assert.equal(caretpos.prevToken(),"ཅོ");
		assert.equal(caretpos.prevToken(),"བ");
		assert.equal(caretpos.prevToken(),"སྟེ");
		assert.equal(caretpos.prevToken(),"ར");
		assert.equal(caretpos.prevToken(),"");
	});

});