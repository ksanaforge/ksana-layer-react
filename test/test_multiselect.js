var assert=require("assert");
var multiselect=require("..").multiselect;


describe("test Multiselect",function(){
	var selections=multiselect.create();
	it("add selection",function(){
		selections.add(3,5);
		selections.add(10,5);
		assert.deepEqual(selections.get(),[[3,5],[10,5]]);
	});

	it("remove selections",function(){
		selections.remove();
		assert.deepEqual(selections.get(),[]);	
	});

	it("set selection",function(){
		selections.set(3,5);
		selections.set(10,5);

		assert.deepEqual(selections.get(),[[10,5]]);	
	});

	it("combine overlap selection",function(){
		selections.remove();
		selections.add(1,2);
		selections.add(3,2);

		assert.deepEqual(selections.get(),[[1,4]]);
	});

	//01234567890
    // ++   +++
    //  +++++
	it("overlap",function(){
		selections.remove();
		selections.add(1,2);
		selections.add(6,3);
		selections.add(2,5);
		assert.deepEqual(selections.get(),[[1,8]]);
	});

	//01234567890
    // ++   +++
    //   +++
	it("fill the hole",function(){
		selections.remove();
		selections.add(1,2);
		selections.add(6,3);
		selections.add(3,3);
		assert.deepEqual(selections.get(),[[1,8]]);
	});

	//01234567890
    // ++   +++
    //   ++
	it("sort by start and len",function(){
		selections.remove();
		selections.add(1,2);
		selections.add(6,3);
		selections.add(3,2);
		assert.deepEqual(selections.get(),[[1,4],[6,3]]);
	});

	//01234567890
    //  +++
    // +   +
	it("append and prepend",function(){
		selections.remove();
		selections.add(2,3);
		selections.add(1,1);
		selections.add(5,1);
		assert.deepEqual(selections.get(),[[1,5]]);
	});

});