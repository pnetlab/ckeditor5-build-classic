import React, { Component } from 'react'

class SizeCtrl extends Component {
	constructor(props) { 
	    super(props);
	    
	    this.state={
	    		value: '',
	    		unit: '',
	    }
	}
	
	
	setValue(value, unit){
		if(isset(value) && isset(unit)){
			this.setState({
				value, unit
			})
		}
		
	}
	
	
	render(){
		return <div style={{display: 'flex', alignItems: 'center'}}>
			{this.props.label} 
			<div style={{display: 'flex', alignItems: 'center', border:'solid thin darkgray', borderRadius:4, marginLeft:3}}>
			
				<input type='text' style={{width:30, padding:'0px 3px', textAlign: 'center', border:'none'}} 
				value={this.state.value} onChange={(event)=>this.setState({value: event.target.value.replace(/[^\d]/g, "")} )} onBlur={()=>{this.onChangeHandle()}}></input>
				
				<select value={this.state.unit} onChange={(event)=>this.setState({unit: event.target.value}, ()=>{this.onChangeHandle()} )} style={{border:'none'}}>
				{this.props.units.map((item, key)=>{
					return <option key={key} value={item}>{item}</option>
				})}
				</select>
				
			</div>
		</div>
	}
	
	onChangeHandle(){
		if(this.props.onChange){
			this.props.onChange(this.state.value, this.state.unit);
		}
	}
	
	
}

export default SizeCtrl