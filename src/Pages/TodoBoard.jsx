import { useState, useEffect } from 'react'
import Navigator from 'components/Navigator'
import { getTodo } from 'js/api'
import { Fa0, FaPlus } from 'react-icons/fa6'
import CreateTodoModal from '../components/CreateTodoModal'


const TodoBoard = () => {
  const [modal, setModal] = useState(false)
  const [state, setState] = useState('')
  const [todo, setTodo] = useState([])
  const [inProgress, setInProgress] = useState([])
  const [review, setReview] = useState([])
  const [done, setDone] = useState([])

  let prevent = false

  const getTodoList = async () => {
    if (prevent) return
    prevent = true
    setTimeout(() => {
      prevent = false
    }, 200)
    const result = await getTodo()
    if (typeof result === 'object') {
      const { todo, inProgress, review, done } = result?.data
      setTodo(todo)
      setInProgress(inProgress)
      setReview(review)
      setDone(done)
    }
  }

  useEffect(() => {
    if (modal === false)
      getTodoList()
  }, [modal])

  return (<>
    <div className="page column">
      <Navigator />
      <div className="kanban-board row">
        <div className="column status todo">
          <div className="title">
            <span>TODO</span>
            <div onClick={() => {
              setModal(true)
              setState('todo')
            }}>
              <FaPlus />
            </div>
          </div>
          {todo.map(({ title, contents }) => {
            return (<div className="list">
              <p>{title}</p>
              <span>{contents}</span>
            </div>)
          })}
        </div>
        <div className="column status inProgress">
          <div className="title">
            <span>IN-PROGRESS</span>
            <div onClick={() => {
              setModal(true)
              setState('inProgress')
            }}>
              <FaPlus />
            </div>
          </div>
          {inProgress.map(({ title, contents }) => {
            return (<div className="list">
              <p>{title}</p>
              <span>{contents}</span>
            </div>)
          })}
        </div>
        <div className="column status review">
          <div className="title">
            <span>REVIEW</span>
            <div onClick={() => {
              setModal(true)
              setState('review')
            }}>
              <FaPlus />
            </div>
          </div>
          {review.map(({ title, contents }) => {
            return (<div className="list">
              <p>{title}</p>
              <span>{contents}</span>
            </div>)
          })}
        </div>
        <div className="column status done">
          <div className="title">
            <span>DONE</span>
            <div onClick={() => {
              setModal(true)
              setState('done')
            }}>
              <FaPlus />
            </div>
          </div>
          {done.map(({ title, contents }) => {
            return (<div className="list">
              <p>{title}</p>
              <span>{contents}</span>
            </div>)
          })}
        </div>
      </div>
    </div>
    {modal ? <CreateTodoModal setModal={setModal} state={state} /> : ''}
  </>)
}

export default TodoBoard