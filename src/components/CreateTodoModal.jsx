import { useState } from 'react'
import { MdCancel } from 'react-icons/md'
import { createTodo } from '../js/api'

const CreateTodoModal = ({ setModal, state }) => {
  const [title, setTitle] = useState('')
  const [contents, setContents] = useState('')

  const createTodoFn = async () => {
    if (title === '') return alert('할 일 제목을 입력해 주세요.')
    else if (contents === '') return alert('할 일 내용을 입력해 주세요.')
    else {
      const data = {
        status: state,
        title: title,
        contents: contents,
      }
      const result = await createTodo(data)
      if (typeof result === 'object' && result?.data?.message === 'Todo Create Successfully') {
        alert('할 일 생성이 완료되었습니다.')
        return setModal(false)
      }
    }

  }

  return (
    <div className="modal-bg">
      <div className="modal create-todo-modal column">
        <div className="exit-btn" onClick={() => setModal(false)}><MdCancel size={35} /></div>
        <input type="text" placeholder="할 일 제목" className="todo-title" value={title}
               onChange={e => setTitle(e.target.value)} />
        <textarea placeholder="할 일 내용" className="todo-contents" value={contents}
                  onChange={e => setContents(e.target.value)} />
        <button className="create-todo-btn" onClick={createTodoFn}>할 일 생성</button>
      </div>
    </div>
  )
}

export default CreateTodoModal