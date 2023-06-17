import React, { Component } from 'react'

class BladeComp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            blades : [],
            blade: '',
        }
    }


    render() {

        return <>

            <div style={{display:'flex', alignItems:'center', padding:5}}>
                <select value={this.state.blade} onChange={(ev)=>{this.setState({blade: ev.target.value})}} style={{padding:5, minWidth:100}}>
                    <option value=''></option>
                    {this.state.blades.map((item, key) => {
                        return <option key={key} value={item}>{item}</option>
                    })}
                </select>
                &nbsp;
                <button className='btn btn-primary' style={{padding:2}} onClick={this.onClickHandle.bind(this)}>Insert</button>
            </div>

        </>
    }

    setBlades(blades){
        this.setState({blades});
    }


    onClickHandle() {
        if (this.props.onClick) {
            this.props.onClick(this.state.blade);
        }
    }

}

export default BladeComp