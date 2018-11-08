import React from 'react'
import Router from 'next/router';
import { bindActionCreators, Dispatch } from 'redux';
import { saveAuthToken } from '../src/redux-store/auth.store';
import { connect } from 'react-redux';
import { colors } from '../components/_common';
import LyreBirdLoginButton from '../components/LyreBirdLoginButton';
import Helpers from '../src/Helpers';


interface AuthProps {
    saveAuthToken : (token : string) => void
    authState : string
}

class Auth extends React.Component<AuthProps> {

    state = { error : '' }

    componentDidMount() {
        if(window.location.hash) this.handleHash(window.location.hash)
        else Router.push('/')
    }

    handleHash = (hash : string) => {

        hash = hash.substr(1)
        const params = hash.split('&')
            .map( paramStr=>{ const split = paramStr.split('='); return {[split[0]]:split[1]} }) 
            .reduce( (previous, current)=>({ ...previous, ...current }) )

        if( 'access_token' in params && 'token_type' in params && 'state' in params){
            if(params.token_type !== 'bearer') this.authError('The given token type was not valid')
            if(params.state !== this.props.authState) this.authError('The given state was not valid')
            
            this.props.saveAuthToken(params.access_token)
            Helpers.setCookie('access_token', params.access_token)
        }
        
        Router.push('/')
    }

    authError = ( error? : string) => {
        this.setState({error})
    }

    render() {
        return (
            <div>
                <h1>Authenticating ...</h1>
                <div hidden={!this.state.error}>
                    <h4 style={{color:colors.error}}>{this.state.error}</h4>
                    <LyreBirdLoginButton text='TRY AGAIN' />
                </div>
            </div>
        )
    }


}

const mapStateToProps = ({authState}:any) => ({authState})

const mapDispatchToProps = (dispatch : Dispatch) => ({
    saveAuthToken : bindActionCreators(saveAuthToken, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(Auth)



