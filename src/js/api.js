import axios from 'axios'
import { getCookie, removeCookie, setCookie } from './cookie'

const header = () => ({
  headers: {
    'Content-Type': 'application/json',
    'access-token': getCookie('myToken'),
  },
})

const formDataHeader = () => ({
  headers: {
    'Content-Type': 'multipart/form-data',
    'access-token': getCookie('myToken'),
  },
})

const errorHandling = async error => {
  const { status } = error?.response
  const { detail } = error?.response.data
  switch (status) {
    case 403:
      if (detail === 'LoginError')
        return alert('아이디 또는 비밀번호가 틀렸습니다.')
      else if (detail === 'withDrawError')
        return alert('비밀번호가 틀렸습니다.')
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
      if (
        detail.include('Database query error') ||
        detail === 'Internal Server Error'
      )
        return alert('서버 에러')
      break
    default:
      return
  }
}

//~ 토큰 재발급
const tokenReissue = async () => {
  const headers = {
    'Content-Type': 'application/json',
    'refresh-token': getCookie('rfToken'),
  }
  try {
    const result = await axios.get(`http://backend-service/refresh-token`, { headers })
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
    return await axios.post('http://backend-service/sign-in', { id: id, password: pw })
  } catch (error) {
    return await errorHandling(error)
  }
}

export const signUp = async (id, name, pw, email) => {
  try {
    return await axios.post('http://backend-service/sign-up', {
      id: id,
      name: name,
      password: pw,
      email: email
    })
  } catch (error) {
    return await errorHandling(error)
  }
}

export const editPw = async (pw, new_pw) => {
  try {
    return await axios.patch(
      'http://backend-service/edit-pw',
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
    return await axios.delete('http://backend-service/withdraw', {
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
    return await axios.get('http://backend-service/get-todo', header())
  } catch (error) {
    return await errorHandling(error)
  }
}

export const createTodo = async data => {
  try {
    return await axios.post('http://backend-service/create-todo', data, header())
  } catch (error) {
    return await errorHandling(error)
  }
}

export const deleteTodo = async todo_num => {
  try {
    return await axios.delete(`http://backend-service/delete-todo/${todo_num}`, header())
  } catch (error) {
    return await errorHandling(error)
  }
}

export const editTodo = async data => {
  try {
    return await axios.patch('http://backend-service/edit-todo', data, header())
  } catch (error) {
    return await errorHandling(error)
  }
}

export const getDiary = async year_month => {
  try {
    return await axios.get(`http://backend-service/get-diary/${year_month}`, header())
  } catch (error) {
    return await errorHandling(error)
  }
}

export const getDiaryDetail = async date => {
  try {
    return await axios.get(`http://backend-service/get-diary-detail/${date}`, header())
  } catch (error) {
    return await errorHandling(error)
  }
}

export const createDiary = async formData => {
  try {
    return await axios.post('http://backend-service/add-diary', formData, formDataHeader())
  } catch (error) {
    return await errorHandling(error)
  }
}

export const deleteDiary = async date => {
  try {
    return await axios.delete(`http://backend-service/delete-diary/${date}`, header())
  } catch (error) {
    return await errorHandling(error)
  }
}

export const editDiary = async formData => {
  try {
    return await axios.patch('http://backend-service/edit-diary', formData, formDataHeader())
  } catch (error) {
    return await errorHandling(error)
  }
}