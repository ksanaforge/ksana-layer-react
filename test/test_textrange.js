var assert=require("assert");
var textrange=require("..").textrange;


describe("test textrange",function(){
	var selections=textrange.create();
	it("add selection",function(){
		selections.add(3,5,"");
		selections.add(10,5,"");
		assert.deepEqual(selections.get(),[[3,5,""],[10,5,""]]);
	});

	it("remove selections",function(){
		selections.remove();
		assert.deepEqual(selections.get(),[]);	
	});

	it("set selection",function(){
		selections.set([[3,5,""]]);
		selections.set([[10,5,""]]);

		assert.deepEqual(selections.get(),[[10,5,""]]);	
	});

//012345
// aa
//   bb
	it("combine overlap selection",function(){
		selections.remove();
		selections.add(1,2,"aa");
		selections.add(3,2,"bb");

		assert.deepEqual(selections.get(),[[1,4,"aabb"]]);
	});

	//01234567890
    // ++   +++
    //  +++++
	it("overlap",function(){
		selections.remove();
		selections.add(1,2,"12");
		selections.add(6,3,"678");
		selections.add(2,5,"23456");
		assert.deepEqual(selections.get(),[[1,8,"12345678"]]);
	});

	//01234567890
    // ++   +++
    //   +++
	it("fill the hole",function(){
		selections.remove();
		selections.add(1,2,"12");
		selections.add(6,3,"678");
		selections.add(3,3,"345");
		assert.deepEqual(selections.get(),[[1,8,"12345678"]]);
	});

	//01234567890
    // ++   +++
    //   ++
	it("sort by start and len",function(){
		selections.remove();
		selections.add(1,2,"12");
		selections.add(6,3,"678");
		selections.add(3,2,"34");
		assert.deepEqual(selections.get(),[[1,4,"1234"],[6,3,"678"]]);
	});

	//01234567890
    //  +++
    // +   +
	it("append and prepend",function(){
		selections.remove();
		selections.add(2,3,"234");
		selections.add(1,1,"1");
		selections.add(5,1,"5");
		assert.deepEqual(selections.get(),[[1,5,"12345"]]);
	});

});

//2015/5/6, for clear markup in range
describe("test markup in range",function(){

	it("single markup , no selection",function(){
		var markups=[{s:2,l:1,id:'a'}];
		var ranges=[];
		var o=textrange.markupInRange(markups,ranges);
		assert.equal(o.length,0);
	});
	
	it("single markup , single selection",function(){
		var markups=[{s:2,l:1,id:'abc'}];
		var ranges=[2,2];
		var o=textrange.markupInRange(markups,ranges);
		assert.equal( o.length,1 );
		assert.equal( o[0].id , 'abc');
	});

	it("2 markups , one match, single selection",function(){
		var markups=[{s:2,l:1,id:'a2'},{s:10,l:1,id:'a1'}]; 
		var ranges=[2,2];
		var o=textrange.markupInRange(markups,ranges);
		assert.equal( o.length,1 );
		assert.equal( o[0].id , 'a2');
	});

	it("2 markups , all match, two selections",function(){
		var markups=[{s:2,l:1,id:'a2'},{s:10,l:1,id:'a1'}]; 
		var ranges=[[2,2],[10,2]];
		var o=textrange.markupInRange(markups,ranges);
		assert.equal( o.length,2 );
	});	

});