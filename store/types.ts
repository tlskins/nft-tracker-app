import { Dispatch } from 'react'
import { IUser, ILanding } from '../types/user'

export interface GlobalStateInterface {
  user?: IUser;
  landing?: ILanding;
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

