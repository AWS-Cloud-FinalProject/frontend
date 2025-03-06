import axios from 'axios'
import { getCookie } from './cookie'

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

export const signIn = async (id, pw) => {
  try {
    return await axios.post('/api/sign-in', { id: id, password: pw })
  } catch (error) {
    return console.log(error)
  }
}

export const signUp = async (id, name, pw) => {
  try {
    return await axios.post('/api/sign-up', { id: id, name: name, password: pw })
  } catch (error) {
    return console.log(error)
  }
}

export const editPw = async (pw, new_pw) => {
  try {
    return await axios.patch('/api/edit-pw', { password: pw, new_password: new_pw }, header())
  } catch (error) {
    return console.log(error)
  }
}

export const withdraw = async (pw) => {
  const headers = header()
  try {
    return await axios.delete('/api/withdraw', {
      headers: headers.headers,
      data: {
        password: pw,
      },
    })
  } catch (error) {
    return console.log(error)
  }
}

export const getTodo = async () => {
  try {
    return await axios.get('/api/get-todo', header())
  } catch (error) {
    return console.log(error)
  }
}

export const createTodo = async (data) => {
  try {
    return await axios.post('/api/create-todo', data, header())
  } catch (error) {
    return console.log(error)
  }
}

export const deleteTodo = async (todo_num) => {
  try {
    return await axios.delete(`/api/delete-todo/${todo_num}`, header())
  } catch (error) {
    return console.log(error)
  }
}

export const editTodo = async (data) => {
  try {
    return await axios.patch('/api/edit-todo', data, header())
  } catch (error) {
    return console.log(error)
  }
}

export const getDiary = async year_month => {
  try {
    return await axios.get(`/api/get-diary/${year_month}`, header())
  } catch (error) {
    return console.log(error)
  }
}

export const getDiaryDetail = async date => {
  try {
    return await axios.get(`/api/get-diary-detail/${date}`, header())
  } catch (error) {
    return console.log(error)
  }
}

export const createDiary = async formData => {
  try {
    return await axios.post('/api/add-diary', formData, formDataHeader())
  } catch (error) {
    return console.log(error)
  }
}