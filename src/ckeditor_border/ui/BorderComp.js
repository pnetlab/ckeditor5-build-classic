import React, { Component } from 'react'
import ColorPicker from '../../ui/components/ColorPicker'
class BorderComp extends Component {
	constructor(props) { 
	    super(props);
	    
	    this.state={
	    		borderLeft: '',
	    		borderRight: '',
	    		borderTop: '',
	    		borderBottom: '',
	    		borderWeight: '',
	    		borderColor: '',
	    		borderRadius: '',
	    }
	    
	    this.lineStyle={
	    		'': '',
	    		solid: 'Solid',
	    		dashed : 'Dashed',
	    		dotted : 'Dotted',
	    		double : 'Double',
	    		groove : 'Groove',
	    		hidden : 'Hidden',
	    		none : 'None',
	    		outset: 'Outset',
	    		ridge: 'Ridge',
	    }
	    
	}
	
	
	render(){
		
		var lineStyleSelect = Object.keys(this.lineStyle).map((key)=>{
			return <option key={key} value={key}>{this.lineStyle[key]}</option>
		})
		
		return <>
		
		<style>{`
			.border_table td, .border_table th {
				padding: 2px 5px !important;
				font-weight: bold !important;
			}
			.border_table td input {
				border: solid thin darkgray !important;
				border-radius: 3px;
			}
			.border_table td select {
				border: solid thin darkgray !important;
				border-radius: 3px;
			}
			.border_demo{
				border: dashed thin #e3e3e3;
			}
			
		`}</style>
				
		
		<table className='border_table'>
			<tbody>
				<tr>
					<th>Left</th>
					<td>:</td>
					<td>
						<select style={{padding:'0px 3px'}} 
						value={this.state.borderLeft} 
						onChange={()=>this.setState({borderLeft: event.target.value}) }>
							{lineStyleSelect}
						</select>
					</td>
				</tr>
				
				<tr>
					<th>Right</th>
					<td>:</td>
					<td>
						<select style={{padding:'0px 3px'}} 
						value={this.state.borderRight} 
						onChange={()=>this.setState({borderRight: event.target.value}) }>
							{lineStyleSelect}
						</select>
					</td>
				</tr>
				
				<tr>
					<th>Top</th>
					<td>:</td>
					<td>
						<select style={{padding:'0px 3px'}} 
						value={this.state.borderTop} 
						onChange={()=>this.setState({borderTop: event.target.value}) }>
							{lineStyleSelect}
						</select>
					</td>
					
				</tr>
				
				<tr>
					<th>Bottom</th>
					<td>:</td>
					<td>
						<select style={{padding:'0px 3px'}} 
						value={this.state.borderBottom} 
						onChange={()=>this.setState({borderBottom: event.target.value}) }>
							{lineStyleSelect}
						</select>
					</td>
				</tr>
		
				<tr>
					<th>Weight</th>
					<td>:</td>
					<td>
						<input type='text' style={{width:50, padding:'0px 3px'}} 
						value={this.state.borderWeight} 
						onChange={(event)=>this.setState({borderWeight: event.target.value} )} 
						onBlur={()=>this.setState({borderWeight: this.formatValue(event.target.value)}) }></input>
					</td>
				</tr>
				<tr>
					<th>Radius</th>
					<td>:</td>
					<td>
					<input type='text' style={{width:50, padding:'0px 3px'}} 
						value={this.state.borderRadius} 
						onChange={(event)=>this.setState({borderRadius: event.target.value} )} 
						onBlur={()=>this.setState({borderRadius: this.formatValue(event.target.value)}) }></input>
					</td>
				</tr>
				
			</tbody>
			
		</table>
		<div style={{padding:5}}>
			<div className='border_demo' style={{
				height: 50,
				width: '100%',
				display:'flex',
				alignItems:'center',
				borderWidth: this.state.borderWeight,
				borderLeftStyle: this.state.borderLeft,
				borderRightStyle: this.state.borderRight,
				borderTopStyle: this.state.borderTop,
				borderBottomStyle: this.state.borderBottom,
				borderColor: this.state.borderColor,
				borderRadius: this.state.borderRadius,
				
			}}><span style={{margin:'auto', fontWeight:'bold'}}>Preview</span></div>
		</div>
		<div>
			<ColorPicker ref={color => this.colorPicker = color} onChange={(value)=>{ this.setState({borderColor: value});} }></ColorPicker>
		</div>
		
		<div></div>
		
		<div style={{textAlign:'center', padding:5}}>
			<button style={{margin:5, padding:5, border:'solid thin darkgray', borderRadius:4}} className="btn" onClick={()=>this.onChangeHandle()}>Apply</button>
		</div>
		
		</>
	}
	
	formatValue(value){
		if(value.match(/^\d+$/)){
			return value+'px'; 
		}else{
			return value;
		}
	}
	
	onChangeHandle(){
		if(this.props.onChange){
			
			this.props.onChange(this.state);
		}
	}
	
	setValue(value){
		var values = {};
		if(!value) value = {};
		values.borderLeft = get(value.borderLeft, '');
		values.borderRight = get(value.borderRight, '');
		values.borderTop = get(value.borderTop, '');
		values.borderBottom = get(value.borderBottom, '');
		values.borderWeight = get(value.borderWeight, '');
		values.borderColor = get(value.borderColor, '');
		values.borderRadius = get(value.borderRadius, '');
		this.colorPicker.setValue(values.borderColor);
		this.setState(values);
	}
	
	
}

export default BorderComp