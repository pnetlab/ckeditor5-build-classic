import React, { Component } from 'react'

class HtmlComp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            classname: '',
            id: '',
        }
    }


    render() {

        return <>

            <style>{`
			.html_form_table td, .html_form_table th {
				padding: 2px 5px !important;
				font-weight: bold !important;
			}
			.html_form_table td input {
				border: solid thin darkgray !important;
				border-radius: 3px;
			}
			
		`}</style>


            <table className='html_form_table'>
                <tbody>
                    <tr>
                        <th>Name</th>
                        <td>:</td>
                        <td>
                            <input type='text' style={{ width: 50, padding: '0px 3px' }}
                                value={this.state.name}
                                onChange={(event) => this.setState({ name: event.target.value })}
                            ></input>
                        </td>
                    </tr>
                    <tr>
                        <th>Class</th>
                        <td>:</td>
                        <td>
                            <input type='text' style={{ width: 50, padding: '0px 3px' }}
                                value={this.state.classname}
                                onChange={(event) => this.setState({ classname: event.target.value })}
                            ></input>
                        </td>
                    </tr>
                    <tr>
                        <th>ID</th>
                        <td>:</td>
                        <td>
                            <input type='text' style={{ width: 50, padding: '0px 3px' }}
                                value={this.state.id}
                                onChange={(event) => this.setState({ id: event.target.value })}
                            ></input>
                        </td>
                    </tr>



                </tbody>

            </table>


            <div style={{ display: 'flex', justifyContent: 'center', padding: 5 }}>
                <button className='btn btn-primary' style={{ padding: 2 }} onClick={this.onClickHandle.bind(this)}>Insert</button>
            </div>

        </>
    }


    onClickHandle() {
        if (this.props.onClick) {
            this.props.onClick(this.state);
        }
    }

}

export default HtmlComp