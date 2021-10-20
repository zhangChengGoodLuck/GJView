import React from 'react';
import { renderRoutes } from "@/config/util" 

class MyCollection extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    render() {
        const { routes } = this.props
        return (
            <div>
                { renderRoutes(routes) }
            </div>
        )
    }
}

export default MyCollection;