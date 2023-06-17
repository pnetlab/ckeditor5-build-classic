import React, { Component } from 'react'
import InputMultiSelect from '../../ui/components/InputMultiSelect';

class PositionComp extends Component {
	constructor(props) { 
	    super(props);
	    
	    this.state={
	    		'classname': '',
	    		'id': '',
	    		'display': '',
	    		'position': '',
	    		'overflow': '',
	    		'cursor': '',
	    		'float': '',
	    		'flexWrap': '',
	    		'flexDirection': '',
	    		'flexGrow': '',
	    		'alignSelf': '',
	    		'alignItems': '',
	    		'justifyContent': '',
	    		'top': '',
	    		'right': '',
	    		'left': '',
				'bottom': '',
				'alignment': '',
	    }
	    
	    this.displays = {
	    		'none': 'None',
	    		'inline-block': 'Inline',
	    		'block': 'Block',
	    		'flex': 'Flex',
	    }
	    
	    this.displayOptions = {};
	    
	    for(let display in this.displays){
	    	this.displayOptions['d-'+display] = this.displays[display];
	    	this.displayOptions['d-sm-'+display] = 'Small ' + this.displays[display];
	    	this.displayOptions['d-md-'+display] = 'Medium ' + this.displays[display];
	    	this.displayOptions['d-lg-'+display] = 'Large ' + this.displays[display];
	    }
	    
	    this.overflowOptions = {
	    		'': '',
	    		auto: 'Auto',
	    		hidden: 'Hidden',
	    }
	    
	    this.cursorOptions = {
	    		'': '',
	    		alias: 'Alias',
	    		auto: 'Auto',
	    		pointer: 'Pointer',
	    		
	    }
	    this.floatOptions = {
	    		'': '',
	    		left: 'Left',
	    		right: 'Right',
	    		none: 'None',
	    		
	    }
	    this.positionOptions = {
				'': '',
	    		absolute: 'Absolute',
	    		fixed: 'Fixed',
	    		relative: 'Relative',
	    }
	    
	    this.flexwrapOptions = {
	    		'': '',
	    		wrap: 'Wrap',
	    		nowrap: 'No Wrap',
	    }
	    
	    this.flexDirectionOptions = {
	    		'': '',
	    		column: 'Column',
	    		row: 'Row',
	    		'column-reverse': 'Column Reverse',
	    		'row-reverse': 'Row Reverse',
	    }
	    this.flexAlignOptions = {
	    		'': '',
	    		stretch: 'Stretch',
	    		center: 'Center',
	    		'flex-start': 'Start',
	    		'flex-end': 'End',
	    }
	    
	    this.flexJustifyOptions = {
	    		'': '',
	    		'center': 'Center',
	    		'flex-start': 'Start',
	    		'flex-end': 'End',
	    		'space-between': 'Space Between',
	    		'space-around': 'Space Around',
	    }
	    this.alignmentOptions = {
	    		'': '',
	    		'center': 'Center',
	    		'end': 'End',
	    		'justify': 'Justify',
	    		'left': 'Left',
	    		'right': 'Right',
	    }
	    
	}
	
	
	setValue(values){
		for(let i in values){
			if(!isset(values[i])){
				values[i] = ''
			}
		}
		
		if(isset(values['display'])){
			this.inputDisplay.setValue(values['display'].split(" "));
		}
		
		this.setState(values);
	}
	
	
	render(){
		return <div style={{padding:5}}>
		
		<style>{`
			.position_table td, .position_table th {
				padding: 2px 5px !important;
				font-weight: bold !important;
			}
			.position_table td input, .position_table td select  {
				border: solid thin darkgray !important;
				border-radius: 3px;
			}
			.position_table th{
				white-space: nowrap;
			}
			
		`}</style>
				
		
		<table className='position_table'>
			<tbody>
				<tr>
					<th>Class Name</th>
					<td>:</td>
					<td>
						<input type='text' style={{width:100, padding:'0px 3px'}} 
						value={this.state.classname} 
						onChange={(event)=>this.setState({classname: event.target.value} )} 
						onBlur={()=>this.setState({classname: event.target.value}, ()=>this.onChangeHandle()) }></input>
					</td>
				</tr>
				
				<tr>
					<th>ID</th>
					<td>:</td>
					<td>
						<input type='text' style={{width:100, padding:'0px 3px'}} 
						value={this.state.id} 
						onChange={(event)=>this.setState({id: event.target.value} )} 
						onBlur={()=>this.setState({id: event.target.value}, ()=>this.onChangeHandle()) }></input>
					</td>
				</tr>
				
				<tr>
					<th>Overflow</th>
					<td>:</td>
					<td>
						<select style={{width:100, padding:'0px 3px'}} 
						value={this.state.overflow} 
						onChange={()=>this.setState({overflow: event.target.value}, ()=>this.onChangeHandle()) }>
						
							{Object.keys(this.overflowOptions).map((key)=>{
								return <option key={key} value={key}>{this.overflowOptions[key]}</option>
							})}
							
						</select>
					</td>
				</tr>
		
				<tr>
					<th>Cursor</th>
					<td>:</td>
					<td>
						<select style={{width:100, padding:'0px 3px'}} 
						value={this.state.cursor} 
						onChange={()=>this.setState({cursor: event.target.value}, ()=>this.onChangeHandle()) }>
						
							{Object.keys(this.cursorOptions).map((key)=>{
								return <option key={key} value={key}>{this.cursorOptions[key]}</option>
							})}
							
						</select>
					</td>
				</tr>
				
				
				<tr>
					<th>Float</th>
					<td>:</td>
					<td>
						<select style={{width:100, padding:'0px 3px'}} 
						value={this.state.float} 
						onChange={()=>this.setState({float: event.target.value}, ()=>this.onChangeHandle()) }>
						
							{Object.keys(this.floatOptions).map((key)=>{
								return <option key={key} value={key}>{this.floatOptions[key]}</option>
							})}
							
						</select>
					</td>
				</tr>

				<tr>
					<th>Alignment</th>
					<td>:</td>
					<td>
						<select style={{width:100, padding:'0px 3px'}} 
						value={this.state.alignment} 
						onChange={()=>this.setState({alignment: event.target.value}, ()=>this.onChangeHandle()) }>
						
							{Object.keys(this.alignmentOptions).map((key)=>{
								return <option key={key} value={key}>{this.alignmentOptions[key]}</option>
							})}
							
						</select>
					</td>
				</tr>
				
				<tr>
					<th>Position</th>
					<td>:</td>
					<td>
						<select style={{ width:100, padding:'0px 3px'}} 
						value={this.state.position} 
						onChange={()=>this.setState({position: event.target.value}, ()=>this.onChangeHandle()) }>
						
							{Object.keys(this.positionOptions).map((key)=>{
								return <option key={key} value={key}>{this.positionOptions[key]}</option>
							})}
							
						</select>
					</td>
				</tr>
				
				{(this.state.position == 'relative')? <></>
				: <tr>
					<td colSpan="3">
						<div style={{margin: 10, border: 'solid thin darkgray', borderRadius: 4, position:'relative', height:100}}>
							<div style={{position: 'absolute', left: '35%', top: -10, background: 'aliceblue'}}>
							<input type='text' style={{width:50, padding:'0px 3px'}} 
								value={this.state.top} 
								onChange={(event)=>this.setState({top: event.target.value} )} 
								onBlur={()=>this.setState({top: this.formatValue(event.target.value)}, ()=>this.onChangeHandle()) }></input>
							</div>
							
							<div style={{position: 'absolute', left: '35%', bottom: -10, background: 'aliceblue'}}>
							<input type='text' style={{width:50, padding:'0px 3px'}} 
								value={this.state.bottom} 
								onChange={(event)=>this.setState({bottom: event.target.value} )} 
								onBlur={()=>this.setState({bottom: this.formatValue(event.target.value)}, ()=>this.onChangeHandle()) }></input>
							</div>
							
							<div style={{position: 'absolute', top: '35%', left: -10, background: 'aliceblue'}}>
							<input type='text' style={{width:50, padding:'0px 3px'}} 
								value={this.state.left} 
								onChange={(event)=>this.setState({left: event.target.value} )} 
								onBlur={()=>this.setState({left: this.formatValue(event.target.value)}, ()=>this.onChangeHandle()) }></input>
							</div>
							
							<div style={{position: 'absolute', top: '35%', right: -10, background: 'aliceblue'}}>
							<input type='text' style={{width:50, padding:'0px 3px'}} 
								value={this.state.right} 
								onChange={(event)=>this.setState({right: event.target.value} )} 
								onBlur={()=>this.setState({right: this.formatValue(event.target.value)}, ()=>this.onChangeHandle()) }></input>
							</div>
							
						</div>
					</td>
				</tr>
				}
				
				<tr>
					<th>Display</th>
					<td>:</td>
					<td>
						<InputMultiSelect 
							style={{border:'solid thin darkgray', borderRadius:4, cursor:'pointer', width:100, overflow: 'hidden', textOverflow: 'ellipsis'}}
				    		options = {this.displayOptions}
				    		ref = {input => {this.inputDisplay = input}}
					    	onChange = {()=>this.setState({display: this.inputDisplay.getValue().join(' ')}, ()=>this.onChangeHandle()) }
						>
						</InputMultiSelect>
					</td>
				</tr>
				
				<tr>
					<th>Flex Grow</th>
					<td>:</td>
					<td>
						<input type='number' style={{width:100, padding:'0px 3px'}} 
						value={this.state.flexGrow} 
						onChange={(event)=>this.setState({flexGrow: event.target.value} )} 
						onBlur={()=>this.setState({flexGrow: event.target.value}, ()=>this.onChangeHandle()) }></input>
					</td>
				</tr>
				
				<tr>
					<th>Align Self</th>
					<td>:</td>
					<td>
						<select style={{width:100, padding:'0px 3px'}} 
						value={this.state.alignSelf} 
						onChange={()=>this.setState({alignSelf: event.target.value}, ()=>this.onChangeHandle()) }>
						
							{Object.keys(this.flexAlignOptions).map((key)=>{
								return <option key={key} value={key}>{this.flexAlignOptions[key]}</option>
							})}
							
						</select>
					</td>
				</tr>
				{/flex/.test(this.state.display)?<>
					<tr>
						<th>Flex Wrap</th>
						<td>:</td>
						<td>
							<select style={{width:100, padding:'0px 3px'}} 
							value={this.state.flexWrap} 
							onChange={()=>this.setState({flexWrap: event.target.value}, ()=>this.onChangeHandle()) }>
							
								{Object.keys(this.flexwrapOptions).map((key)=>{
									return <option key={key} value={key}>{this.flexwrapOptions[key]}</option>
								})}
								
							</select>
						</td>
					</tr>
					
					
					<tr>
						<th>Flex Direction</th>
						<td>:</td>
						<td>
							<select style={{width:100, padding:'0px 3px'}} 
							value={this.state.flexDirection} 
							onChange={()=>this.setState({flexDirection: event.target.value}, ()=>this.onChangeHandle()) }>
							
								{Object.keys(this.flexDirectionOptions).map((key)=>{
									return <option key={key} value={key}>{this.flexDirectionOptions[key]}</option>
								})}
								
							</select>
						</td>
					</tr>
					
					<tr>
						<th>Justify Content</th>
						<td>:</td>
						<td>
							<select style={{width:100, padding:'0px 3px'}} 
							value={this.state.justifyContent} 
							onChange={()=>this.setState({justifyContent: event.target.value}, ()=>this.onChangeHandle()) }>
							
								{Object.keys(this.flexJustifyOptions).map((key)=>{
									return <option key={key} value={key}>{this.flexJustifyOptions[key]}</option>
								})}
								
							</select>
						</td>
					</tr>
					
					<tr>
						<th>Align Items</th>
						<td>:</td>
						<td>
							<select style={{width:100, padding:'0px 3px'}} 
							value={this.state.alignItems} 
							onChange={()=>this.setState({alignItems: event.target.value}, ()=>this.onChangeHandle()) }>
							
								{Object.keys(this.flexAlignOptions).map((key)=>{
									return <option key={key} value={key}>{this.flexAlignOptions[key]}</option>
								})}
								
							</select>
						</td>
					</tr>
					
				</>
				: <></>}
				
				
			</tbody>
			
		</table>
		
		</div>
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
					this.state
			);
		}
	}
	
	
	
	
}

export default PositionComp