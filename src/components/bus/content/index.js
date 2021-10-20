import React from 'react';
import style from './index.module.scss' 

class ComponentContent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {  }
    }
    render() { 
        const { head, content } = this.props
        return (
           <div className={style.container}>
               {
                   head !== '' &&
                   <div className={style.head}>
                       { head }
                   </div>
               }
               {
                   content !== '' &&
                   <div className={style.content}>
                       { content }
                   </div>
               }
           </div> 
        );
    }
}
 
export default ComponentContent;