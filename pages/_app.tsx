// LIB
import React from 'react'
import App, { Container } from 'next/app'
import { NextContext, NextComponentType } from 'next'

import  { Store } from 'redux'
import { Provider } from 'react-redux'
import withRedux from 'next-redux-wrapper'

// STORE
import initializeStore from '../src/redux-store/main.store'
// import { UiStoreActions } from '../src/redux-store/ui.store'
// import { UserStoreActions } from '../src/redux-store/user.store'

// COMPONENTS
import Layout from '../components/Layout'


interface ContextWithStore extends NextContext {
    store : Store
}
interface AppProps {
    Component : NextComponentType, 
    pageProps : any, 
    store : Store 
}
class _App extends App<AppProps> {

    static async getInitialProps({ Component, ctx } : { Component: NextComponentType, ctx:NextContext }) {

        const context = ctx as ContextWithStore
        const pageProps = Component.getInitialProps ? await Component.getInitialProps(context) : {}
        
        // context.store.dispatch({type: UserStoreActions.SAVE_TOKEN , token});

        return { pageProps }
    }

    componentDidMount(){
        document.addEventListener("keydown", this.handleHotKeys)
    }

    componentWillUnmount(){
        document.removeEventListener("keydown", this.handleHotKeys)
    }

    // HOT KEYS
    handleHotKeys = (e : KeyboardEvent) => {
        if(e.metaKey){
            switch(e.key){
                case 'k': return this.quickAction()
                // more ?
            }
        }
    }

    quickAction = () => {
        console.log('K')
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