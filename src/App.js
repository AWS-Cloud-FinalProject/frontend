import './App.css'
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom'
import Calendar from 'Pages/Calendar'
import SignIn from 'Pages/SignIn'
import SignUp from 'Pages/SignUp'
import TodoBoard from 'Pages/TodoBoard'
import { getCookie } from './js/cookie'

const App = () => {
  return (
    <div>
      <Routes>
        <Route
          path='/'
          element={
            <Navigate
              to={getCookie('myToken') ? '/home/diary' : '/sign-in'}
              replace
            />
          }
        />
        <Route path='/sign-in' element={<SignIn />} />
        <Route path='/sign-up' element={<SignUp />} />
        <Route path='/home/diary' element={<Calendar />} />
        <Route path='/home/todo' element={<TodoBoard />} />
        <Route
          path='*'
          element={
            <Navigate
              to={getCookie('myToken') ? '/home/diary' : '/sign-in'}
              replace
            />
          }
        />
      </Routes>
    </div>
  )
}

export default App
