import React, { Component } from 'react'

class MarginComp extends Component {
	constructor(props) { 
	    super(props);
	    
	    this.state={
	    		marginLeft: '',
	    		marginRight: '',
	    		marginTop: '',
	    		marginBottom: '',
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
		return <>
		
		<style>{`
			.margin_table td, .margin_table th {
				padding: 2px 5px !important;
				font-weight: bold !important;
			}
			.margin_table td input {
				border: solid thin darkgray !important;
				border-radius: 3px;
			}
			
		`}</style>
				
		
		<table className='margin_table'>
			<tbody>
				<tr>
					<th>Left</th>
					<td>:</td>
					<td>
						<input type='text' style={{width:50, padding:'0px 3px'}} 
						value={this.state.marginLeft} 
						onChange={(event)=>this.setState({marginLeft: event.target.value} )} 
						onBlur={()=>this.setState({marginLeft: this.formatValue(event.target.value)}, ()=>this.onChangeHandle()) }></input>
					</td>
				</tr>
				
				<tr>
					<th>Right</th>
					<td>:</td>
					<td>
						<input type='text' style={{width:50, padding:'0px 3px'}} 
						value={this.state.marginRight} 
						onChange={(event)=>this.setState({marginRight: event.target.value} )} 
						onBlur={()=>this.setState({marginRight: this.formatValue(event.target.value)}, ()=>this.onChangeHandle()) }></input>
					</td>
				</tr>
				
				<tr>
					<th>Top</th>
					<td>:</td>
					<td>
						<input type='text' style={{width:50, padding:'0px 3px'}} 
						value={this.state.marginTop} 
						onChange={(event)=>this.setState({marginTop: event.target.value} )} 
						onBlur={()=>this.setState({marginTop: this.formatValue(event.target.value)}, ()=>this.onChangeHandle()) }></input>
					</td>
				</tr>
		
				<tr>
					<th>Bottom</th>
					<td>:</td>
					<td>
						<input type='text' style={{width:50, padding:'0px 3px'}} 
						value={this.state.marginBottom} 
						onChange={(event)=>this.setState({marginBottom: event.target.value} )} 
						onBlur={()=>this.setState({marginBottom: this.formatValue(event.target.value)}, ()=>this.onChangeHandle()) }></input>
					</td>
				</tr>
				
			</tbody>
			
		</table>
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
			this.props.onChange(
					this.state.marginLeft, 
					this.state.marginRight, 
					this.state.marginTop, 
					this.state.marginBottom
			);
		}
	}
	
	setValue(value){
		var values = {};
		if(!value) value = {};
		values.marginLeft = get(value.left, '');
		values.marginRight = get(value.right, '');
		values.marginTop = get(value.top, '');
		values.marginBottom = get(value.bottom, '');
		
		this.setState(values);
	}
	
	
}

export default MarginComp