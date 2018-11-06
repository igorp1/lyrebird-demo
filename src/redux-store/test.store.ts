import { Dispatch } from 'redux'

// DEFAULT STATE
export const TestStoreDefaultState = {
    num : 0,
}

// REDUCERS
export const TestStoreReducer = ( state : any , action : any ) => {

    switch(action.type) {
        case TestStoreActions.SAVE_NUMBER:
            return { ...state, num:action.num }
        case TestStoreActions.ZERO_NUMBER:
            return { ...state, num:0 }
        case TestStoreActions.INC_NUMBER:
            return { ...state, num:state.num+1 }
        case TestStoreActions.DEC_NUMBER: 
            return { ...state, num:state.num-1 }
    }
}

// ACTIONS
export enum TestStoreActions {
    SAVE_NUMBER = 'SAVE_NUMBER',
    ZERO_NUMBER = 'ZERO_NUMBER',
    INC_NUMBER = 'INC_NUMBER',
    DEC_NUMBER = 'DEC_NUMBER'
}


export const saveNumber = (num : number) => {
    return (dispatch : Dispatch) => {
        return dispatch({ type: TestStoreActions.SAVE_NUMBER, num })
    }
}

export const zeroNumber = () => {
    return (dispatch : Dispatch) => {
        return dispatch({ type: TestStoreActions.ZERO_NUMBER })
    }
}


export const inncrementNumber = () => {
    return (dispatch : Dispatch) => {
        return dispatch({ type: TestStoreActions.INC_NUMBER })
    }
}


export const decrementnnumber = () => {
    return (dispatch : Dispatch) => {
        return dispatch({ type: TestStoreActions.DEC_NUMBER })
    }
}


