import React, { Component } from 'react';

class Box extends Component {
	constructor(props) { 
	    super(props);
	    
	    this.editor = this.props.editor;
	    this.writer = this.props.writer;

    	var boxView = this.writer.createContainerElement( 'div',{style:"width:50px;height:50px"});
 	   	//this.boxDom = this.editor.editing.view.domConverter.viewToDom(boxView, document);
    	this.boxDom = <div>test</div>;
        this.editor.editing.view.domConverter.bindElements(this.boxDom, boxView)
	    
	}
	
	
	render(){
		return <div>{this.boxDom}</div>
	}
	
	
	
}

export default Box