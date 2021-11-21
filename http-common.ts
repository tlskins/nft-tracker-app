import axios from 'axios'

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_HOST,
  headers: {
    'Content-type': 'application/json',
  },
})

let session = undefined as string | undefined

export const setAuthHeader = ( auth: string ): void => {
  console.log( 'setting auth header: ', auth )
  // axios.defaults.headers.common['Authorization'] = auth
  session = auth
}

instance.interceptors.request.use( async config => {
  if ( session ) {
    config.headers.authorization = session
  }

  return config
}, error => Promise.reject( error ))

export default instance
