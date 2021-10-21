import React from 'react';
import { renderRoutes } from "@/config/util"

class CityCollection extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    componentDidMount() {
    }


    render() {
        const { routes } = this.props
        return (
            <div>
                {renderRoutes(routes)}
            </div>
        )
    }
}

export default CityCollection;