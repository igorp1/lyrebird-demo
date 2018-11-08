import { Dispatch } from 'redux'
import getConfig from 'next/config'
const { publicRuntimeConfig : {module: { AUTH_STATE } } } = getConfig()

// DEFAULT STATE
export const AuthStoreDefaultState = {
    authState : AUTH_STATE,
    authUserToken : ''
}

// REDUCERS
export const AuthStoreReducer = ( state : any , {authState, authToken, type} : any ) => {

    switch(type) {
        case AuthStoreActions.SAVE_AUTH_STATE:
            return { ...state, authState }
        case AuthStoreActions.SAVE_ACCESS_TOKEN:
            return { ...state, authToken }
    }
}

// ACTIONS
export enum AuthStoreActions {
    SAVE_AUTH_STATE = 'SAVE_AUTH_STATE',
    SAVE_ACCESS_TOKEN = 'SAVE_ACCESS_TOKEN'
}


export const saveAuthState = (authState : string) => {
    return (dispatch : Dispatch) => {
        return dispatch({ type: AuthStoreActions.SAVE_AUTH_STATE, authState })
    }
}

export const saveAuthToken = (authToken : string) => {
    return (dispatch : Dispatch) => {
        return dispatch({ type: AuthStoreActions.SAVE_ACCESS_TOKEN, authToken })
    }
}


