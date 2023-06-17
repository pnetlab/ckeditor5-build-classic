import React, { Component } from 'react'


class EditHtmlModal extends Component {

	constructor(props) {
		super(props);
		this.id = makeId();

		this.state = {
			content: '',
			name: '',
			classname: '',
			id: '',
		}
	}

	modal(cmd = 'show') {
		if (cmd == 'hide') {
			$("#HtmlModal" + this.id).modal('hide');
		} else {
			$("#HtmlModal" + this.id).modal();
		}
	}

	format(html) {
		var tab = '\t';
		var result = '';
		var indent= '';
	
		html.split(/>\s*</).forEach(function(element) {
			if (element.match( /^\/\w/ )) {
				indent = indent.substring(tab.length);
			}
	
			result += indent + '<' + element + '>\r\n';
	
			if (element.match( /^<?\w[^>]*[^\/]$/ )) { 
				indent += tab;              
			}
		});
	
		return result.substring(1, result.length-3);
	}

	setValue(data) {
		if(data.content) data.content = this.format(data.content);
		this.setState(data);
	}

	setOnSave(onSave) {
		this.onSave = onSave
	}

	render() {
		return (
			<>
				<style>{`
					.html_form_input{
						border: solid thin darkgray;
						padding: 0px 5px;
						border-radius: 5px;
						width: 100px;
					}
				`}</style>
				<div className="modal fade" id={"HtmlModal" + this.id}>
					<div className="modal-dialog modal-lg modal-dialog-centered">
						<div className="modal-content">

							<div className="modal-header">
								<h4 className="modal-title">{this.state.name}</h4>
								<button type="button" className="close" data-dismiss="modal">&times;</button>
							</div>

							<div className="modal-body" style={{ textAlign: 'initial' }}>
								<div>{`<${this.state.name} id="`}
									<input className='html_form_input' type='text' value={this.state.id} onChange={e => this.setState({ id: e.target.value })}></input>
									{`" class="`}
									<input className='html_form_input' type='text' value={this.state.classname} onChange={e => this.setState({ classname: e.target.value })}></input>
									{`">`}
								</div>
								<textarea className='html_form_input' value={this.state.content} onChange={(e) => { this.setState({ content: e.target.value }) }} style={{ width: '100%', minHeight: 200, marginTop:15 }}></textarea>
								<div>{`</${this.state.name}>`}</div>
							</div>

							<div className="modal-footer">
								<button type="button" className="btn btn-primary" onClick={() => {
									if (this.onSave) {
										this.onSave(this.state)
									}
								}}>Save</button>
								<button type="button" className="btn btn-danger" data-dismiss="modal">Close</button>
							</div>

						</div>
					</div>
				</div>

			</>
		)
	}
}
export default EditHtmlModal