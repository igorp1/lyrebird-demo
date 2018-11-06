import React from 'react'
import { connect } from 'react-redux';


interface IndexProps {
    env : any
}
class Index extends React.Component<IndexProps>{

    render() {
        return (
            <h1>Hello : { this.props.env.ENV_NAME }</h1>
        )
    }

} 

const mapStateToProps = ({ env } : any) => ({
    env
})

 export default connect(mapStateToProps)(Index)
 