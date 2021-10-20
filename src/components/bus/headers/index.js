import { Component } from 'react'
import './index.scss'

class Headers extends Component {
    constructor(props) {
        super(props);
        this.state = {  }
    }
    render() { 
        return ( 
            <div className='headers'>
                <h4>公共数据·归集</h4>
            </div>
        );
    }
}
 
export default Headers;