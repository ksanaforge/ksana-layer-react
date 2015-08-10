var FlattenView=require("./src/flattenview");
var SelectableView=require("./src/selectableview");
var InterlineView=require("./src/interlineview");
var LinkView=require("./src/linkview");

var textrange=require("./src/textrange");
var markuputil=require("./src/markuputil");
var PropEdit=require("./src/propedit");
//var BaseView=require("./src/baseview");
//var MultiSelectView=require("./src/multiselectview");
//var ReviseView=require("./src/reviseview");


//var RevisionView=require("./src/revisionview");

module.exports={FlattenView:FlattenView
	,SelectableView:SelectableView
	,InterlineView:InterlineView
	,LinkView:LinkView
//	,MultiLinkView:MultiLinkView
	,textrange:textrange
  ,markuputil:markuputil
  ,PropEdit:PropEdit
};