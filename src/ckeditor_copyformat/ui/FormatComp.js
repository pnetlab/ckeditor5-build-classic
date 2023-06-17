import React, { Component } from 'react'

class FormatComp extends Component {
	constructor(props) { 
	    super(props);
	    
	    this.state={
	    		attributes: [],
	    		element: '',
	    }
	    this.click = true;
	    this.clickTimeout = null;
	}
	
	
	setValue(attributes){
		this.setState(attributes)
	}
	
	
	render(){
		if(this.state.element == ''){
			return <i className='fa fa-paste' title="Select an element and double click here to copy format" style={{ cursor: 'pointer', padding: '0px 3px'}}
			onDoubleClick={(event)=>{
				if(this.props.onDoubleClick) this.props.onDoubleClick();
			}}
			></i>
		}else{
			return <div className='btn btn-info' title="Select an element and click here to pate format" 
				style={{cursor: 'pointer', padding: '0px 3px', border:'solid thin darkgray', borderRadius:4, color: 'white', fontWeight: 'bold', background:'#17a2b8'}}
			
			onDoubleClick={(event)=>{
				this.click = false;
				if(this.props.onDoubleClick) this.props.onDoubleClick();
				
			}}
			
			onClick={()=>{
				clearTimeout(this.clickTimeout);
				this.clickTimeout = setTimeout(()=>{
					if(this.props.onClick && this.click){
						this.props.onClick(this.state.attributes, this.state.element); 
					}
					this.click = true;
				}, 300)
				
			}}
			
			
			
			>
			{this.state.element[0].toUpperCase() + this.state.element.substring(1)}</div>
		}
	}
	
}

export default FormatComp