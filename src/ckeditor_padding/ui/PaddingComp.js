import React, { Component } from 'react'

class PaddingComp extends Component {
	constructor(props) { 
	    super(props);
	    
	    this.state={
	    		paddingLeft: '',
	    		paddingRight: '',
	    		paddingTop: '',
	    		paddingBottom: '',
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
			.padding_table td, .padding_table th {
				padding: 2px 5px !important;
				font-weight: bold !important;
			}
			.padding_table td input {
				border: solid thin darkgray !important;
				border-radius: 3px;
			}
			
		`}</style>
				
		
		<table className='padding_table'>
			<tbody>
				<tr>
					<th>Left</th>
					<td>:</td>
					<td>
						<input type='text' style={{width:50, padding:'0px 3px'}} 
						value={this.state.paddingLeft} 
						onChange={(event)=>this.setState({paddingLeft: event.target.value} )} 
						onBlur={()=>this.setState({paddingLeft: this.formatValue(event.target.value)}, ()=>this.onChangeHandle()) }></input>
					</td>
				</tr>
				
				<tr>
					<th>Right</th>
					<td>:</td>
					<td>
						<input type='text' style={{width:50, padding:'0px 3px'}} 
						value={this.state.paddingRight} 
						onChange={(event)=>this.setState({paddingRight: event.target.value} )} 
						onBlur={()=>this.setState({paddingRight: this.formatValue(event.target.value)}, ()=>this.onChangeHandle()) }></input>
					</td>
				</tr>
				
				<tr>
					<th>Top</th>
					<td>:</td>
					<td>
						<input type='text' style={{width:50, padding:'0px 3px'}} 
						value={this.state.paddingTop} 
						onChange={(event)=>this.setState({paddingTop: event.target.value} )} 
						onBlur={()=>this.setState({paddingTop: this.formatValue(event.target.value)}, ()=>this.onChangeHandle()) }></input>
					</td>
				</tr>
		
				<tr>
					<th>Bottom</th>
					<td>:</td>
					<td>
						<input type='text' style={{width:50, padding:'0px 3px'}} 
						value={this.state.paddingBottom} 
						onChange={(event)=>this.setState({paddingBottom: event.target.value} )} 
						onBlur={()=>this.setState({paddingBottom: this.formatValue(event.target.value)}, ()=>this.onChangeHandle()) }></input>
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
					this.state.paddingLeft, 
					this.state.paddingRight, 
					this.state.paddingTop, 
					this.state.paddingBottom
			);
		}
	}
	
	setValue(value){
		var values = {};
		if(!value) value = {};
		values.paddingLeft = get(value.left, '');
		values.paddingRight = get(value.right, '');
		values.paddingTop = get(value.top, '');
		values.paddingBottom = get(value.bottom, '');
		
		this.setState(values);
	}
	
	
}

export default PaddingComp