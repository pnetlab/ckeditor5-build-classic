import React, { Component } from 'react'
import { SketchPicker } from 'react-color';

class ColorPicker extends Component {
	
	constructor(props) {
	    super(props);
	    
	    this.state = {
			value: get(this.props.value, ''),
			color: '',
	    }
	    
	    this.colorlib=['#ffffff','#000000','#f44336', 
	                   '#e91e63', '#9c27b0', '#673ab7', 
	                   '#3f51b5', '#2196f3', '#03a9f4', 
	                   '#00bcd4', '#009688', '#4caf50', 
	                   '#8bc34a', '#cddc39', '#ffeb3b', 
	                   '#ffc107', '#ff9800', '#ff5722', 
	                   '#795548', '#9e9e9e', '#607d8b'];
	}
	
	initial(){
	}
	
	setValue(value){
		if(value == null) value = '';
		this.setState({value: value, color:value});
	}
	
	getValue(){
		var value = this.state.value;
		return value;
	}
	
	drawOptions(){
		var optionHtml = [];
		for(let i in this.colorlib){
			optionHtml.push(<div style={{background: this.colorlib[i],
				width: 15,
				height: 15,
				margin: 2,
			    borderRadius: 4,
			    border: 'solid thin #607D8B',
			
			}} className="color_item button" key={i} onClick={()=>{this.setState({value: this.colorlib[i]}, ()=>{this.onChangeHandle()}  )} }></div>) ;
		}
		return optionHtml;
	}
	
	
	render(){
		this.initial();
		
		return(
				<>
				<style>{`
					
					.color_item {
						width: 25px;
						height: 25px;
						margin: 2px;
						width: 25px;
					    height: 25px;
					    margin: 2px;
					    border-radius: 4px;
					    border: solid thin #607D8B;
						
					}

					.color_frame .sketch-picker{
						padding:0 !important;
						box-shadow: none !important;

					}
				`}</style>
				  
				  <div style={{padding:5}}>
				  
					 <input style={{ 
						 
						 background: this.state.value, 
						 fontWeight:'bold', 
						 textShadow: '-1px 0 white, 0 1px white, 1px 0 white, 0 -1px white',
						 padding: '0px 5px',
						 margin: '5px 0px',
						 border: 'solid thin #607D8B',
						 borderRadius: 4,
						 width: '100%',
					   }} 
				  	  type="text" 
					  onChange={(event)=>{this.setState({value: event.target.value}, ()=>{this.onChangeHandle()} )}}
				  	  value = {this.state.value}
					 ></input>
					  
				  	<div className="color_frame">
				  		{/* {this.drawOptions()} */}

						<SketchPicker
							color={ this.state.color }
							onChangeComplete={ (color)=>{
								var color = color.rgb;
								var value = `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`;
								this.setState({ color, value}, ()=>{this.onChangeHandle()} );
							} }
						/>
						
				    </div>
				    
				  </div>
				  
				</>
		)
	}
	
	onChangeHandle(){
		
		if(this.props.onChange){
			this.props.onChange(this.getValue());
		}
	}
	
}



export default ColorPicker;