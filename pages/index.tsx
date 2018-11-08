import React from 'react'
import { connect } from 'react-redux'
import LyreBirdLoginButton from '../components/LyreBirdLoginButton';

interface IndexProps {
    env : any
    authState : string
    authToken : string
}
class Index extends React.Component<IndexProps>{

    get renderLogin() {
        return this.props.authToken ? '' : <LyreBirdLoginButton />
    }
    
    render() {
        return (
            <div>
                <h1>👋🏾 Hello</h1>
                <p>
                    Some really smart people in Montreal are using neural networks to recreate speech tonality and manerisms. <br/>
                    In other words, you can recreate your voice in a computer! <br />
                    With this developer portal you can get started harnessing the power of <a href='https://lyrebird.ai/' target='_blank'>Lyrebird</a>.
                </p>
                {/* <h3>{ this.props.env.LYREBIRD_CLIENT_ID }</h3> */}
                {this.renderLogin}

                <p style={{marginTop:'2em'}} >🍪 Please note that this website uses cookies.</p>
                
            </div>
        )
    }

} 

const mapStateToProps = ({ env, authToken } : any) => ({
    env, authToken
})

 export default connect(mapStateToProps)(Index)
 