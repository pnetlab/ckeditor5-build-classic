
import React, { Component } from 'react'
import Loading from './common/Loading'
import axios from 'axios';


class FuncUploadModal extends Component {
	
	constructor(props) { 
	    super(props);
	    
	    this.id = Math.floor(Math.random() * 10000);
	    
	    this.state={
	    		files : [],
	    		directories : {},
	    		pwd : '',
	    		selects : {},
	    		value: '',
	    }
	    this.selects = {};
	    this.page = 1;
	    this.number = 20;
	    this.onSelect = get(this.props.onSelect, null);
	    
	}
	
	setOnSelect(onSelect){
		this.onSelect = onSelect;
	}
	
	modal(cmd='show'){
		if(cmd=='hide'){
			$("#file_mng_modal"+this.id).modal('hide');
		}else{
			$("#file_mng_modal"+this.id).modal();
			this.scand();
		}
	}
	
	updatePage(vector){
		var oldPage = this.page;
		if(vector == 'up'){
			if(count(this.state.files) >= this.number){
				this.page ++;
			}
		}else{
			this.page --;
		}
		if(this.page <= 0) this.page = 1;
		
		if(oldPage != this.page){
			this.scand();
		}
		
	}
	
	scand(){
		this.loading(true, 'Loading...');
		axios.request ({
		    url: this.props.link,
		    method: 'post',
		    data:{
		    		'column': this.props.column,
			    	'action': 'History',
			    	'page': this.page,
			    	'number': this.number,
		    	}
			})
			
	      .then(response => {
	    	  response = response['data'];
	    	  this.loading(false, 'Loading...');
	    	  if(response['result']){
	    		  this.setState({files: response['data']})
	    	  }else{
	    		  Swal(response['message'], response['data'], 'error');
	    	  }
	      })
	      
	      .catch(error => {
	    	  this.loading(false, 'Loading...');
	    	  console.log(error); 
	    	  Swal('Error', 'Unknow Error', 'error');
	      })
	}
	
	
	
	
	async deleteFiles(){
		var files = this.state.selects;
		for(let i in files){
			await this.deleteFile(files[i]);
		}
		this.scand();
	}
	
	deleteFile(file){
		this.loading(true, 'Deleting...')
		return axios.request ({
		    url: this.props.link,
		    method: 'post',
		    data:{
			    	'action': 'Delete',
			    	'file': file[FILE_PATH],
		    	}
			})
			
	      .then(response => {
	    	  this.loading(false, 'Deleting...');
	    	  response = response['data'];
	    	  if(response['result']){
	    		  delete(this.selects[file[FILE_PATH]]);
	    	  }else{
	    		  Swal(response['message'], response['data'], 'error');
	    	  }
	    	  
	      })
	      
	      .catch( error => {
	    	  this.loading(false, 'Deleting...');
	    	  console.log(error);
	    	  Swal('Error', 'Unknow Error', 'error');
	      })
	}
	
	async downloadFile(){
		var files = this.state.selects;
		for(let i in files){
			await this.readFile(files[i]);
		}
	}
	
	readFile(file){
		this.loading(true, 'Downloading...')
		return axios.request ({
			url: this.props.link, 
			method: 'post',
			data:{
				'action': 'Read',
				'file': file[FILE_PATH],
			},
			responseType: 'blob'
		})
		
		.then(response => {
			this.loading(false, 'Downloading...');
			response = response['data'];
			var blob = new Blob([response]);
    	    var a = document.createElement('a'); 
    	    a.download = file[FILE_NAME]; 
    	    a.href = URL.createObjectURL(blob); 
    	    a.click();
		})
		
		.catch( error => {
			this.loading(false, 'Downloading...')
			console.log(error);
			Swal('Error', 'Unknow Error', 'error');
		})
	}
	
	render () {
		
		var files = [];
		
		for ( let i in this.state.files){
			var fileName = this.state.files[i][FILE_NAME];
			files.push(<div title={this.state.files[i][FILE_PATH]} className='file_item' key={i}>
				<label style={{justifyContent: 'center'}}>
					<input checked={isset(this.state.selects[this.state.files[i][FILE_PATH]]) && this.state.selects[this.state.files[i][FILE_PATH]]} 
					onChange={(event)=>{
						if (window.event.ctrlKey){
							if(event.target.checked){
								this.selects[this.state.files[i][FILE_PATH]] = this.state.files[i];
							}else{
								delete(this.selects[this.state.files[i][FILE_PATH]]);
							}
						}else{
							this.selects = [];
							this.selects[this.state.files[i][FILE_PATH]] = this.state.files[i];
						}
						
						this.setState({
							selects: this.selects,
							value: this.props.onClick(this.state.files[i][FILE_PATH]),
						});
						
						
					}} 
					
					className='file_select' type='checkbox'></input>
					
					<div className='file_icon'>
						<div><img style={{maxWidth: '80%'}} src={this.props.link + '?action=Read&file=' + this.state.files[i][FILE_PATH]}/></div>
						<div className='file_name'>{fileName}</div>
					</div>
					
				</label>
				
			</div>)
		}
		
		  return(
				<>
				<div className="modal fade" id={"file_mng_modal"+this.id}> 
					<div className="modal-dialog modal-lg modal-dialog-centered">
						<div className="modal-content">
	
							<div className="modal-header">
								<h4 className="modal-title">{this.state.pwd}</h4>
								<button type="button" className="close" data-dismiss="modal">&times;</button>
							</div>
							
							<div className="modal-body" style={{textAlign: 'initial'}}>
							<input type='text' style={{padding:5, marginBottom:15, width:'100%', border:'solid thin darkgray', borderRadius:4}} 
								value={this.state.value} onChange={(event)=>{this.setState({value: event.target.value})}}
								placeholder='Image link'/>
							<div style={{display: 'flex'}}>
							
								<div style={{marginLeft: 0}}>
									<div>
										<div style={{display: 'flex'}}>
										  {this.page == 1 ? '' : <div><span className='file_page button' onClick={()=>this.updatePage('down')}>{'<'}</span></div>}
										  {count(this.state.files) < this.number? '' : <div><span className='file_page button' onClick={()=>this.updatePage('up')}>{'>'}</span></div>}
										</div>
									</div>
								</div>
								
								<div style={{marginRight: 0, marginLeft: 'auto', display:'flex'}}> 
									<div className="button" title="Delete selected" onClick={() => {this.deleteFiles()}} style={{display: 'flex'}}>
								 		<i className="fa fa-trash"></i>&nbsp;Delete
								 	</div>
								 	<div className="button" title="Download selected" onClick={() => {this.downloadFile()}} style={{display: 'flex'}}>
								 		<i className="fa fa-save"></i>&nbsp;Download
								 	</div>
								 	<div className="button" title="Refresh" onClick={() => {this.scand()}} style={{display: 'flex'}}>
								 		<i className="fa fa-refresh"></i>&nbsp;Refresh
								 	</div>
								 </div>
							 </div>
							 
								<div className='file_container'>
									<style>{`
										.file_container {
											display: flex;
											flex-wrap: wrap;
											margin-top: 15px;
										}
										.file_item {
										    border-radius: 5px;
										    padding: 5px;
										    text-align: center;
										    width: 100px;
										    align-items: center;
										    overflow: hidden;
										    margin: 4px;
											position: relative;
										}
										.file_name {
											width: 100%;
											font-size: small;
											margin-top: 5px;
											color: #607D8B;
										}
										.file_icon {
											padding: 5px;
								    		border-radius: 4px;
										}
										.file_icon i{
											font-size: 50px;
											color: #607D8B;
											-webkit-text-stroke: 1px white;
											cursor: pointer;
										}
										.file_name:hover {
										    overflow: auto;
										    text-overflow: unset;
										}
										.file_select {
											display:none;
										}
										.file_page {
											line-height: 1.25;
										    color: #607d8b;
										    background-color: #fff;
										    border: 1px solid #dee2e6;
										    padding: 5px 10px;
										    border-radius: 4px;
										    margin: 2px;
										}
										.file_select:checked ~ .file_icon {
										    background: #e5e5e5;
										}
									`}</style>
								
								{files}
								</div>
								
							</div>
							
							<div  className="modal-footer"> 
						  		<button type="button" className="btn btn-primary" onClick={()=>{this.props.onSelect(this.state.value); this.modal('hide');}}>{'Select'}</button>
						  		<button type="button" className="btn btn-danger" data-dismiss="modal">Close</button>
					        </div>
							
						</div>
					</div>
					
					<Loading ref={(loading) => {if(loading) this.loading = loading.loading }}/>
					
					
				</div>
				
				</>
		)  
	}
}

export default FuncUploadModal;


	  