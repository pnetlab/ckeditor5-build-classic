import React, { Component } from 'react'
import Menu from '../menu/Menu.js'
import scss from '@root/assets/css/constants'

class Layout extends Component {
	
	constructor(props) {
	    super(props);
	    
	    this.state = {
	    	menu: this.loadDefault()
	    }
	    
	}
	
	loadDefault(){
		if( App.isMobile() ) {
	    	 return status = 'closed';
	    }else {
	    	return '';
	    }
	}
	
	render () { 
		return(
				
		  <div style={{minHeight: '100%'}}>
		  
		  	<style>{`
				.modal {
					left: ${this.state.menu == '' ? scss.menu_left : 0};
		  			max-width: ${screen.width * 1.25}
				}
			`}</style>
			
	  
		  	  <Menu layout = {this}></Menu>
		  
		      <div className = {"main "+this.state.menu}>
				  	{this.props.children}
			  </div>
			  
		  </div>	
		  );
	}
}
export default Layout
	  