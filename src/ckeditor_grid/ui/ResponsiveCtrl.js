import React, { Component } from 'react'

class ResponsiveCtrl extends Component {
	constructor(props) { 
	    super(props);
	    
	    this.state={
	    		responsive: '',
	    		ratio: '',
	    		order: '',
	    }
	    
	    this.responsiveRange = {
	    		'': 'Fixed',
	    		sm: 'Small',
	    		md: 'Medium',
	    		lg: 'Large'
	    }
	    
	    this.ratioRange = {
	    		"": "", 1:1, 2:2, 3:3, 4:4, 5:5, 6:6, 7:7, 8:8, 9:9, 10:10, 11:11, 12:12,
	    }
	    
	    this.orderRange = {
	    		'' : '',
	    		'order-sm-0': 'Small 0',
	    		'order-sm-1': 'Small 1',
	    		'order-sm-2': 'Small 2',
	    		'order-sm-3': 'Small 3',
	    		'order-sm-4': 'Small 4',
	    		'order-sm-5': 'Small 5',
	    		'order-sm-6': 'Small 6',
	    		'order-sm-7': 'Small 7',
	    		'order-sm-8': 'Small 8',
	    		'order-sm-9': 'Small 9',
	    		'order-sm-10': 'Small 10',
	    		'order-sm-11': 'Small 11',
	    		'order-sm-12': 'Small 12',
	    		'order-md-0': 'Medium 0',
	    		'order-md-1': 'Medium 1',
	    		'order-md-2': 'Medium 2',
	    		'order-md-3': 'Medium 3',
	    		'order-md-4': 'Medium 4',
	    		'order-md-5': 'Medium 5',
	    		'order-md-6': 'Medium 6',
	    		'order-md-7': 'Medium 7',
	    		'order-md-8': 'Medium 8',
	    		'order-md-9': 'Medium 9',
	    		'order-md-10': 'Medium 10',
	    		'order-md-11': 'Medium 11',
	    		'order-md-12': 'Medium 12',
	    		'order-lg-0': 'Large 0',
	    		'order-lg-1': 'Large 1',
	    		'order-lg-2': 'Large 2',
	    		'order-lg-3': 'Large 3',
	    		'order-lg-4': 'Large 4',
	    		'order-lg-5': 'Large 5',
	    		'order-lg-6': 'Large 6',
	    		'order-lg-7': 'Large 7',
	    		'order-lg-8': 'Large 8',
	    		'order-lg-9': 'Large 9',
	    		'order-lg-10': 'Large 10',
	    		'order-lg-11': 'Large 11',
	    		'order-lg-12': 'Large 12',
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
		return <div style={{display: 'flex', alignItems: 'center'}}>
		
			&nbsp;<div style={{borderLeft:'solid thin darkgray', top:0, bottom:0, alignSelf: 'stretch'}}></div>&nbsp;
			{'Responsive'} 
			<div style={{display: 'flex', alignItems: 'center', borderRadius:4, marginLeft:3}}>
			
				<select value={this.state.responsive} onChange={(event)=>this.setState({responsive: event.target.value}, ()=>{this.onChangeHandle()} )}>
				{Object.keys(this.responsiveRange).map((key)=>{
					return <option key={key} value={key}>{this.responsiveRange[key]}</option>
				})}
				</select>
				
			</div>
			&nbsp;<div style={{borderLeft:'solid thin darkgray', top:0, bottom:0, alignSelf: 'stretch'}}></div>&nbsp;
			{'Ratio'} 
			<div style={{display: 'flex', alignItems: 'center', borderRadius:4, marginLeft:3}}>
			
				<select value={this.state.ratio} onChange={(event)=>this.setState({ratio: event.target.value}, ()=>{this.onChangeHandle()} )}>
				{Object.keys(this.ratioRange).map((key)=>{
					return <option key={key} value={key}>{this.ratioRange[key]}</option>
				})}
				</select>
				
			</div>
			
			&nbsp;<div style={{borderLeft:'solid thin darkgray', top:0, bottom:0, alignSelf: 'stretch'}}></div>&nbsp;
			{'Order'} 
			<div style={{display: 'flex', alignItems: 'center', borderRadius:4, marginLeft:3}}>
			
				<select value={this.state.order} onChange={(event)=>this.setState({order: event.target.value}, ()=>{this.onChangeHandle()} )}>
				{Object.keys(this.orderRange).map((key)=>{
					return <option key={key} value={key}>{this.orderRange[key]}</option>
				})}
				</select>
				
			</div>
			
		</div>
	}
	
	onChangeHandle(){
		if(this.props.onChange){
			this.props.onChange(this.state);
		}
	}
	
	
}

export default ResponsiveCtrl