
var singleStyle=function(state,selected) {
	var style={borderStyle:"solid",borderColor:"gray",fontSize:"50%",color:"silver",borderWidth:1
			,borderRadius:"20%",cursor:"pointer",verticalAlign:"top",
			backgroundColor:"drakgray",height:"0.5em",width:"0.5em"};

	if (selected) {
		style.borderColor="lightyellow";
	} else if (state==1) {
		style.borderColor="green";
	}
	return style;
}

var multiStyle=function(activemarkup) {
	var style={borderStyle:"solid",borderColor:"gray",fontSize:"50%",color:"silver",borderWidth:1
			,borderRadius:"20%",cursor:"pointer",verticalAlign:"top",
			backgroundColor:"drakgray",height:"0.5em",width:"0.5em"};

	if (activemarkup&&activemarkup.state==1) {
		style.borderColor="green";
	}
	return style;	
}
var buttonStyle=function() {
	var style={fontSize:"35%",borderStyle:"solid",borderColor:"gray",borderRadius:"25%",cursor:"pointer"};
	return style;	
}
var noteEditStyle=function(){
	var style={fontSize:"100%",position:"absolute",outline:"none",borderRadius:"5px"};
	return style;		
}

var selectedStyle={"backgroundColor":"highlight",color:"black"};


module.exports={handlerTop:"-1.2em",noteTop:"1.8em",noteEditTop:"2.2em",
	singleStyle:singleStyle,
	multiStyle:multiStyle,
	buttonStyle:buttonStyle, noteStyle:noteEditStyle, selectedStyle: selectedStyle};