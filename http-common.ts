import axios from 'axios'

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_HOST,
  headers: {
    'Content-type': 'application/json',
  },
})

export const setSession = ( auth: string ): void => {
  console.log( 'setting auth header: ', auth )
  // axios.defaults.headers.common['Authorization'] = auth
  // session = auth
  localStorage.setItem( 'auth', auth )
}

export const clearSession = (): void => {
  localStorage.clear()
}

export const getSession = (): string => {
  return localStorage.getItem( 'auth' )
}

instance.interceptors.request.use( async config => {
  const auth = getSession()
  if ( auth ) {
    config.headers.authorization = auth
  }

  return config
}, error => Promise.reject( error ))

export default instance
