import { Dispatch } from 'react'
import { IUser } from '../types/user'

export interface GlobalStateInterface {
  user?: IUser;
  persistenceType: string;
}

export type ActionType = {
  type: string;
  payload?: any;
};

export type ContextType = {
  globalState: GlobalStateInterface;
  dispatch: Dispatch<ActionType>;
};
