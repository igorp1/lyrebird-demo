import thunkMiddleware from 'redux-thunk'
import { createStore, applyMiddleware, Action } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'

// ⚡️ 1. load store setup
import { TestStoreDefaultState, TestStoreReducer } from './test.store'
import { EnvStoreDefaultState } from './env.store'

// ⚡️ 2. register default states here
const defaultState = {
    ...TestStoreDefaultState,
    ...EnvStoreDefaultState
} 

// REDUCERS
export const reducer = (state = defaultState, action : Action ) => {

    // ⚡️ 3. register all reducers here separated by ||
    const newState = 
        TestStoreReducer(state, action) 

    return newState || state

}

// INIT
export default function initializeStore (initialState = defaultState) {
    return createStore(reducer, initialState as any, composeWithDevTools(applyMiddleware(thunkMiddleware)) )
}
