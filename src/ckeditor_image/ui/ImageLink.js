import React, { Component } from 'react'

class ImageLink extends Component {
	constructor(props) { 
	    super(props);
	    
	    this.state={
				target:'',
				link:''
	    }
	    
	}
	
	setValue(values){
		var stateValues = {};
		for(let key in values){
			if(isset(values[key])){
				stateValues[key] = values[key];
			}else{
				stateValues[key] = '';
			}
		}
		this.setState(stateValues)
	}
	
	
	render(){
		return <div className="dropdown">
				<i style={{margin:'0px 2px'}} className="ck ck-button fa fa-chain dropdown-toggle" data-toggle="dropdown"></i>
				<div className='dropdown-menu' style={{padding:5}}>
					<input style={{padding:5, borderRadius:3, border:'solid thin darkgray', maxWidth:300}} type='text' value={this.state.link} onChange={(e)=>{this.setState({link: e.target.value})}}></input>
					<label style={{display:'flex', alignItems:'center'}}><input type="checkbox" checked={this.state.target == '_blank'} onChange={(e)=>{this.setState({target:e.target.checked?'_blank':''})}}></input> &nbsp;Open in new Tab</label>
					<div style={{display:'flex', justifyContent:'center'}}><button className="btn btn-primary" onClick={()=>{this.onSave()}} style={{padding:3}}>Save</button></div>
				</div>
			</div>
		
	}

	onSave(){
		if(this.props.onSave) this.props.onSave(this.state);
	}
	
	
	
	
}

export default ImageLink