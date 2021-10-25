import axios from 'axios'

export default axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_HOST,
  headers: {
    'Content-type': 'application/json',
  },
})
