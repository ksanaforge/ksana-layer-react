var jsdom=require("jsdom");
global.document = jsdom.jsdom('<!doctype html><html><body></body></html>');
global.window = document.parentWindow;
global.navigator=document.parentWindow.navigator;

//must have window, document , navigator before requiring React or React component.

var Component=require("..");

var React=require("react/addons")
var TestUtils=React.addons.TestUtils;

// A super simple DOM ready for React to render into
// Store this DOM and the window in global scope ready for React to access

var renderer=TestUtils.createRenderer();

describe("test",function(){
	it("render layerdoc",function(){

		//var c=renderer.render(React.createElement("div",{},"xyz"));
		var c=TestUtils.renderIntoDocument(React.createElement(Component,{label:"xyz"}));
		var btn=React.findDOMNode(c.refs.btn);
		console.log(btn.innerHTML)
		TestUtils.Simulate.click(btn);
		//console.log('q',renderer.getRenderOutput())
		console.log("q",c.getDOMNode().outerHTML);
		//console.log(c.getRenderOutput());
		//console.log("a",c)
	});
/*
	it("shallow",function(){
		var c=renderer.render(React.createElement(Component,{label:"xyz"}));
		console.log('q',renderer.getRenderOutput())
	});
*/
})	
