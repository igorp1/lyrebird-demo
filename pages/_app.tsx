// LIB
import React from 'react'
import App, { Container } from 'next/app'
import { NextContext, NextComponentType } from 'next'

import  { Store} from 'redux'
import { Provider } from 'react-redux'
import withRedux from 'next-redux-wrapper'

// STORE
import initializeStore from '../src/redux-store/main.store'

// COMPONENTS
import Layout from '../components/Layout'
import { AuthStoreActions } from '../src/redux-store/auth.store';
import Helpers from '../src/Helpers';


interface ContextWithStore extends NextContext {
    store : Store
}
interface AppProps {
    Component : NextComponentType
    pageProps : any 
    store : Store 
    authState : string
    saveAuthToken : (access_token : string) => void
}
class _App extends App <AppProps> {

    static async getInitialProps({ Component, ctx } : { Component: NextComponentType, ctx:NextContext }) {

        const context = ctx as ContextWithStore
        const pageProps = Component.getInitialProps ? await Component.getInitialProps(context) : {}
        
        const authToken = Helpers.readCookie('access_token', ctx.req)
        context.store.dispatch({type: AuthStoreActions.SAVE_ACCESS_TOKEN, authToken });

        return { pageProps }
    }

    render () {
        const { Component, pageProps, store } = this.props
        return (
            <Container>
                <Provider store={store}>
                    <Layout>
                        <Component {...pageProps} />
                    </Layout>
                </Provider>
            </Container>
        )
    }
}

export default withRedux(initializeStore)(_App)