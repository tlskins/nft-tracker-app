import http from '../http-common'
import { IUser, ICreateUserReq } from '../types/user'

class UserService {
  get = async ( walletPublicKey: string ): Promise<IUser | undefined> => {
    try {
      const user: IUser = await http.get( `users/${walletPublicKey}` )

      return user
    } catch( err ) {
      console.log( 'err getting user ', err )

      return
    }
  }

  create = async ( req: ICreateUserReq ): Promise<IUser | undefined> => {
    try {
      const resp: IUser = await http.post( '/users', req )

      return resp
    } catch( err ) {
      console.log( 'err creating ', err )

      return
    }
  }
}

export default new UserService()
