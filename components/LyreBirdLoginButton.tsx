import React from 'react'
import { connect } from "react-redux";


interface LyreBirdLoginButtonProps{
    env : any
    authState : string
    text? : string 
}
class LyreBirdLoginButton extends React.Component<LyreBirdLoginButtonProps> {

    get lyrebirdAuthLink() {
        const base = 'https://myvoice.lyrebird.ai/authorize?'
        const response_type = 'token'
        const client_id = this.props.env.LYREBIRD_CLIENT_ID
        const redirect_uri = this.props.env.LYREBIRD_REDIRECT_URI
        const scope = 'voice'
        const state = this.props.authState
        const params : { [key:string]:string } = {response_type, client_id, redirect_uri, scope, state}
    
        return base.concat(
            Object.keys(params).map( key => `${key}=${params[key]}`).join('&')
        )
    }

    render(){
        return (
            <a href={this.lyrebirdAuthLink} ><button className='highlight'>{ this.props.text || 'LOG IN WITH LYREBIRD'}</button></a>
        )
    }

}



const mapStateToProps = ({ env, authState } : any) => ({ env, authState })
export default connect(mapStateToProps)(LyreBirdLoginButton)
 