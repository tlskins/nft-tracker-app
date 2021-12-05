import { Dispatch } from 'react'
import { IUser, ICollectionMapping } from '../types/user'

export interface GlobalStateInterface {
  user?: IUser;
  collMaps?: [ICollectionMapping];
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

