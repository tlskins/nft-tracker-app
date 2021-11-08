import { GlobalStateInterface, ActionType } from './types'
import { initialState } from './index'

const Reducer = ( state: GlobalStateInterface, action: ActionType ): any => {
  switch ( action.type ) {
  case 'SET_USER':
    return {
      ...state,
      user: action.payload,
    }
  case 'PURGE_STATE':
    return initialState
  default:
    return state
  }
}

export default Reducer
