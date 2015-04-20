var jsdom=require("jsdom");
global.document = jsdom.jsdom('<!doctype html><html><body></body></html>');
global.window = document.parentWindow;
global.navigator=document.parentWindow.navigator;


var assert=require("assert");
var Interline=require("..").Interline;
var BaseView=require("..").BaseView;
var React=require("react/addons");
var TestUtils=React.addons.TestUtils;
var renderer=TestUtils.createRenderer();

describe("test Interlinemarkup",function(){
	it("interline markup occupy no width",function(){
		var il=React.createElement(Interline);
		var markups=[[1,0,{before:il}]];
		var ele=React.createElement(BaseView,{text:"abc",markups:markups});
		renderer.render(ele);
		var renderoutput=renderer.getRenderOutput();

		var c=TestUtils.renderIntoDocument(ele);
		console.log(c.getDOMNode().innerHTML);
	})

});
