import './App.css'
import { Routes, Route } from 'react-router-dom'
import Calendar from 'Pages/Calendar'
import SignIn from 'Pages/SignIn'
import SignUp from 'Pages/SignUp'
import TodoBoard from 'Pages/TodoBoard'

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/home/diary" element={<Calendar />} />
        <Route path="/home/todo" element={<TodoBoard />} />
      </Routes>
    </div>
  )
}

export default App