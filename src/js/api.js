import axios, { post } from 'axios'
import { getCookie, removeCookie, setCookie } from './cookie'

const commonHeader = () => ({
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
    'Content-Type': 'application/json',
  },
})

const header = () => ({
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
    'Content-Type': 'application/json',
    'access-token': getCookie('myToken'),
  },
})

const formDataHeader = () => ({
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
    'Content-Type': 'multipart/form-data',
    'access-token': getCookie('myToken'),
  },
})

const errorHandling = async error => {
  const { status } = error?.response
  const { detail } = error?.response.data
  switch (status) {
    case 400:
      if (detail === 'Current password is incorrect')
        return alert('비밀번호가 틀렸습니다.')
      if (detail === 'User already exists')
        return alert('이미 가입된 아이디입니다.')
      break
    case 403:
      if (detail === 'LoginError')
        return alert('아이디 또는 비밀번호가 틀렸습니다.')
      else if (detail === 'PasswordError')
        return alert('기존 비밀번호가 틀렸습니다.')
      else if (detail === 'Refresh Token required')
        return alert('Refresh Token이 없습니다.')
      else if (detail === 'Invalid Refresh Token')
        return alert('Refresh Token이 유효하지 않습니다.')
      else if (detail === 'Refresh Token expired') {
        removeCookie('rfToken', { path: '/ ' })
        removeCookie('myToken', { path: '/ ' })
        window.location.reload()
        return alert('Refresh Token이 만료되었습니다.')
      }
      break
    case 401:
      if (detail === 'Access token is missing')
        return alert('Access Token이 없습니다.')
      else if (detail === 'Token expired') return await tokenReissue()
      else if (detail === 'Invalid token')
        return alert('Access Token이 유효하지 않습니다.')
      break
    case 405:
      if (detail === 'Required Credentials')
        return alert('자격 증명이 필요합니다.')
      else if (detail.include('파일 업로드 중'))
        return alert('파일 업로드 중 오류가 발생했습니다.')
      else if (detail.include('파일 삭제 중'))
        return alert('파일 삭제 중 오류가 발생했습니다.')
      else if (detail.include('파일 업데이트 중'))
        return alert('파일 업데이트 중 오류가 발생했습니다.')
      break
    case 500:
        return alert('서버 에러입니다. 잠시만 기다려 주세요.')
    default:
      return
  }
}

//~ 토큰 재발급
const tokenReissue = async () => {
  const headers = {
    'X-Requested-With': 'XMLHttpRequest',
    'Content-Type': 'application/json',
    'refresh-token': getCookie('rfToken'),
  }
  try {
    const result = await axios.get(`/api/refresh-token`, { headers })
    removeCookie('myToken')
    setCookie('myToken', result?.data?.access_token, {
      path: '/',
    })
    window.location.reload()
  } catch (error) {
    return await errorHandling(error)
  }
}

export const signIn = async (id, pw) => {
  try {
    return await axios.post(
      '/api/sign-in',
      { id: id, password: pw },
      commonHeader()
    )
  } catch (error) {
    return await errorHandling(error)
  }
}

export const signUp = async (id, name, pw, email) => {
  try {
    return await axios.post(
      '/api/sign-up',
      {
        id: id,
        name: name,
        password: pw,
        email: email,
      },
      commonHeader()
    )
  } catch (error) {
    return await errorHandling(error)
  }
}

export const editPw = async (pw, new_pw) => {
  try {
    return await axios.patch(
      '/api/edit-pw',
      { password: pw, new_password: new_pw },
      header()
    )
  } catch (error) {
    return await errorHandling(error)
  }
}

export const withdraw = async pw => {
  const headers = header()
  try {
    return await axios.delete('/api/withdraw', {
      headers: headers.headers,
      data: {
        password: pw,
      },
    })
  } catch (error) {
    return await errorHandling(error)
  }
}

export const getTodo = async () => {
  try {
    return await axios.get('/api/get-todo', header())
  } catch (error) {
    return await errorHandling(error)
  }
}

export const createTodo = async data => {
  try {
    return await axios.post('/api/create-todo', data, header())
  } catch (error) {
    return await errorHandling(error)
  }
}

export const deleteTodo = async todo_num => {
  try {
    return await axios.delete(`/api/delete-todo/${todo_num}`, header())
  } catch (error) {
    return await errorHandling(error)
  }
}

export const editTodo = async data => {
  try {
    return await axios.patch('/api/edit-todo', data, header())
  } catch (error) {
    return await errorHandling(error)
  }
}

export const getDiary = async year_month => {
  try {
    return await axios.get(`/api/get-diary/${year_month}`, header())
  } catch (error) {
    return await errorHandling(error)
  }
}

export const getDiaryDetail = async date => {
  try {
    return await axios.get(`/api/get-diary-detail/${date}`, header())
  } catch (error) {
    return await errorHandling(error)
  }
}

export const createDiary = async formData => {
  try {
    return await axios.post('/api/create-diary', formData, formDataHeader())
  } catch (error) {
    return await errorHandling(error)
  }
}

export const deleteDiary = async date => {
  try {
    return await axios.delete(`/api/delete-diary/${date}`, header())
  } catch (error) {
    return await errorHandling(error)
  }
}

export const editDiary = async formData => {
  try {
    return await axios.patch('/api/edit-diary', formData, formDataHeader())
  } catch (error) {
    return await errorHandling(error)
  }
}

export const getCommunityPosts = async () => {
  try {
    return await axios.get(`/api/get-posts`, header())
  } catch (error) {
    return await errorHandling(error)
  }
}

export const createPost = async formData => {
  try {
    return await axios.post('/api/create-post', formData, formDataHeader())
  } catch (error) {
    return await errorHandling(error)
  }
}

export const deletePost = async post_id => {
  try {
    return await axios.delete(`/api/delete-post/${post_id}`, header())
  } catch (error) {
    return await errorHandling(error)
  }
}

export const updatePost = async (post_id, formData) => {
  try {
    return await axios.patch(
      `/api/edit-post/${post_id}`,
      formData,
      formDataHeader()
    )
  } catch (error) {
    return await errorHandling(error)
  }
}
