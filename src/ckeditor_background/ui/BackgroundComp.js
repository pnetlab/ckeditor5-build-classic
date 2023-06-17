import React, { Component } from 'react'
import ColorPicker from '../../ui/components/ColorPicker';
import ImgMngtComp from '../../ui/components/ImgMngtComp';
import FileRepository from '@ckeditor/ckeditor5-upload/src/filerepository';
import { render } from 'react-dom'

class BackgroundComp extends Component {
	constructor(props) { 
	    super(props);
	    
	    this.state={
	    		backgroundImage: '',
	    		backgroundColor: '',
	    }
	    
	    
	    if(this.props.editor){
	    	
	    	var editor = this.props.editor
	    	this.fileRepository = editor.plugins.get( FileRepository );
	    	
	    	var mngtCfg = editor.config.get('image.imgmngt');
            this.onClick = get(mngtCfg['onClick'], ()=>{});
			this.browser = get(mngtCfg['browser'], false);
			this.decorator = get(mngtCfg['decorator'], file=>file);
            
           
	    }
	    
	}
	
	
	render(){
		
		
		
		return <>
		
		<div style={{
			display:'flex',
		    alignItems: 'center',
		    justifyContent: 'space-around',
		    padding: 5,
		}}>
			<div style={{cursor: 'pointer'}} onClick={()=>{this.uploadImage()}}><i className="fa fa-upload"></i>&nbsp;Upload</div>
			{this.browser ? <div style={{cursor: 'pointer'}} onClick={()=>{
				this.onClick((file)=>{this.setState({backgroundImage:this.decorator(file)}, ()=>this.onChangeHandle())})
			}}><i className="fa fa-folder-open-o"></i>&nbsp;Browser</div> : ''}
		</div>
		{ this.state.backgroundImage !== '' ?
			<div style={{padding:5, textAlign:'center', position:'relative'}}>
				
				<i style={{
					position: 'absolute',
					top:8,
					right:8,
					cursor:'pointer',
					color: '#ff6161',
				}} onClick={()=>this.setState({
					backgroundImage: '',
				})} className="fa fa-close"></i>
				
				<img style={{width:'100%'}} src={this.state.backgroundImage}></img>
				
			</div>
		
		: ''}
		
		<div style={{padding:5}}>
			<ColorPicker ref={color => this.colorPicker = color} onChange={(value)=>{ this.setState({backgroundColor: value});} }></ColorPicker>
		</div>
		
		<div></div>
		
		<div style={{textAlign:'center', padding:5}}>
			<button style={{margin:5, padding:5, border:'solid thin darkgray', borderRadius:4}} className="btn" onClick={()=>this.onChangeHandle()}>Apply</button>
		</div>
		
		</>
	}
	
	
	onChangeHandle(){
		if(this.props.onChange){
			this.props.onChange(this.state);
		}
	}
	
	setValue(value){
		var values = {};
		if(!value) value = {};
		values.backgroundImage = get(value.backgroundImage, '');
		values.backgroundColor = get(value.backgroundColor, '');
		this.colorPicker.setValue(values.backgroundColor);
		this.setState(values);
	}
	
	uploadImage(){
		  var x = document.createElement("input");
		  x.setAttribute("type", "file");
		  x.click();
		  x.onchange = (event)=>{
			  if(!event.target.files[0]) return;
			  if(!this.fileRepository) return;
			  var loader = this.fileRepository.createLoader( event.target.files[0] );
			  loader.upload().then((data)=>{this.setState({backgroundImage: data.default})});
		  };
	}
	
	
}

export default BackgroundComp