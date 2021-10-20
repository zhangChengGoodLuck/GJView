import {Component} from 'react'

class Icon extends Component {
    constructor(props) {
        super(props);
        this.state = {  
        }
    }
    
    render() { 
        const { icon, type, customSize } = this.props || {icon: '', type: 'icon'}
        const size = {
            width: 14,
            height: 14,
            display: 'inline-block',
            ...customSize
        }
        return ( 
            type === 'icon' ? <i class={icon}/> : <img src={icon.default} style={size} alt='img'></img>
        );
    }
}
 
export default Icon;