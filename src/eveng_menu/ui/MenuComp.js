import React, { Component } from 'react'
import ColorPicker from '../../ui/components/ColorPicker'
class MenuComp extends Component {
	constructor(props) { 
	    super(props);
	    
	    
	    
	}
	
	
	render(){
		return <div 
			style={{color:'#337ab7', fontWeight:'bold', cursor:'pointer'}} 
			className='ck ck-button ck-button_with-text' 
			onClick={()=>this.onClickHandle()}>
				<i className='fa fa-list-ul' style={{color:'#337ab7'}}></i>&nbsp;Menu</div>
	}
	
	
	
	onClickHandle(){
		if(this.props.onClick){
			
			this.props.onClick(this.state);
		}
	}
	
	
	
	
}

export default MenuComp