import { useState, useEffect } from 'react'
import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd'
import { FaPlus } from 'react-icons/fa6'
import { IoMdClose } from 'react-icons/io'
import { MdOutlineModeEdit } from 'react-icons/md'
import Navigator from 'components/Navigator'
import { getTodo, deleteTodo, createTodo, editTodo } from 'js/api'

const TodoBoard = () => {
  const [create, setCreate] = useState(false)
  const [edit, setEdit] = useState(false)
  const [state, setState] = useState('')
  const [tasks, setTasks] = useState({
    todo: [],
    inProgress: [],
    review: [],
    done: [],
  })
  const [createTask, setCreateTask] = useState({
    title: '',
    contents: '',
  })
  const [editTask, setEditTask] = useState({
    todo_num: null,
    todo_order: null,
    status: '',
    title: '',
    contents: '',
  })

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
      setTasks({ todo, inProgress, review, done })
    }
  }

  const deleteTodoList = async (todo_num) => {
    const result = await deleteTodo(todo_num)
    if (typeof result === 'object' && result?.data?.message === 'Todo Delete Success') {
      getTodoList()
    }
  }

  const createTodoFn = async () => {
    if (createTask.title === '') return alert('할 일 제목을 입력해 주세요.')
    else if (createTask.contents === '') return alert('할 일 내용을 입력해 주세요.')
    else {
      const order = tasks[state] === undefined ? 0 : tasks[state].length
      const data = {
        status: state,
        title: createTask.title,
        contents: createTask.contents,
        todo_order: order,
      }
      const result = await createTodo(data)
      if (typeof result === 'object' && result?.data?.message === 'Todo Create Successfully') {
        setCreate(false)
        setCreateTask({
          title: '',
          contents: '',
        })
        getTodoList()
      }
    }
  }

  const editTodoFn = async (opt, data) => {
    if (opt === 'fullEdit') {
      if (editTask.title === '') return alert('할 일 제목을 입력해 주세요.')
      else if (editTask.contents === '') return alert('할 일 내용을 입력해 주세요.')
    }
    const result = await editTodo(opt === 'fullEdit' ? editTask : data)
    if (typeof result === 'object' && result?.data?.message === 'Todo updated successfully') {
      getTodoList()
    }
  }

  useEffect(() => {
    getTodoList()
  }, [])

  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    const animation = requestAnimationFrame(() => setEnabled(true))

    return () => {
      cancelAnimationFrame(animation)
      setEnabled(false)
    }
  }, [])

  if (!enabled) {
    return null
  }

  const onDragEnd = async (result) => {
    const { source, destination } = result

    if (!destination) return // 유효한 드롭 위치가 없으면 종료

    const sourceColumn = source.droppableId
    const destinationColumn = destination.droppableId

    // 같은 컬럼 내에서 순서만 변경하는 경우
    if (sourceColumn === destinationColumn) {
      const updatedTasks = Array.from(tasks[sourceColumn])
      const [movedItem] = updatedTasks.splice(source.index, 1) // 이동할 항목 제거
      updatedTasks.splice(destination.index, 0, movedItem) // 새로운 위치에 항목 삽입

      setTasks((prev) => ({
        ...prev,
        [sourceColumn]: updatedTasks, // 해당 컬럼 내에서만 순서 변경
      }))

      await editTodoFn('orderEdit', { ...movedItem, todo_order: destination.index, status: destinationColumn })
    }
    // 다른 컬럼으로 이동하는 경우
    else {
      const sourceTasks = Array.from(tasks[sourceColumn])
      const destinationTasks = Array.from(tasks[destinationColumn])

      const [movedItem] = sourceTasks.splice(source.index, 1) // 이동할 항목 제거
      destinationTasks.splice(destination.index, 0, movedItem) // 새로운 위치에 항목 삽입

      setTasks((prev) => ({
        ...prev,
        [sourceColumn]: sourceTasks,
        [destinationColumn]: destinationTasks,
      }))

      await editTodoFn('columnEdit', { ...movedItem, status: destinationColumn, todo_order: destination.index })
    }
  }

  return (
    <>
      <div className="page column">
        <Navigator />
        <DragDropContext
          onDragEnd={onDragEnd} // `tasks`와 `setTasks`는 여기서 직접 사용
          dragHandleSelector="div"
          shouldRespectForcePress={true}
          transitionDuration={0.2} // 빠른 애니메이션
        >
          <div className="kanban-board row">
            {Object.entries(tasks).length > 0 && Object.entries(tasks).map(([columnId, columnTasks]) => (
              <Droppable key={columnId} droppableId={columnId}>
                {(provided) => {
                  // columnTasks가 배열이 아닐 경우 빈 배열로 설정
                  const safeColumnTasks = Array.isArray(columnTasks) ? columnTasks : []

                  return (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`column status ${columnId}`}
                    >
                      <div className="title">
                        <span>{columnId.toUpperCase() === 'INPROGRESS' ? 'IN-PROGRESS' : columnId.toUpperCase()}</span>
                        <div onClick={() => {
                          setState(columnId)
                          setCreate(true)
                        }}>
                          <FaPlus />
                        </div>
                      </div>
                      {safeColumnTasks.map(({ title, contents, todo_num, todo_order }, idx) => (
                        <Draggable key={`${columnId}-${todo_num}`} draggableId={`${columnId}-${todo_num}`} index={idx}>
                          {(provided) => (
                            editTask.todo_num === todo_num && edit ? (
                              <div className="list edit-task-form">
                                <span className={`list-status ${columnId}`}>{columnId}</span>
                                <input
                                  type="text"
                                  value={editTask.title}
                                  onChange={(e) => setEditTask({ ...editTask, title: e.target.value })}
                                />
                                <textarea
                                  value={editTask.contents}
                                  onChange={(e) => setEditTask({ ...editTask, contents: e.target.value })}
                                />
                                <button className="btn" onClick={() => editTodoFn('fullEdit')}>수정</button>
                              </div>
                            ) : (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className="list"
                              >
                                <div className="row list-top">
                                  <span className={`list-status ${columnId}`}>{columnId}</span>
                                  <div className="row">
                                    <MdOutlineModeEdit size={25} onClick={() => {
                                      setEditTask({ todo_num, todo_order, title, contents, status: columnId })
                                      setEdit(true)
                                    }} />
                                    <IoMdClose size={25} onClick={() => deleteTodoList(todo_num)} />
                                  </div>
                                </div>
                                <p>{title}</p>
                                <span>{contents}</span>
                              </div>
                            )
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder} {/* 드래그된 항목을 위한 공간 예약 */}
                      {state === columnId && create && (
                        <div className="new-task-form list">
                          <span className={`list-status ${columnId}`}>{columnId}</span>
                          <input
                            type="text"
                            placeholder="할 일 제목"
                            value={createTask.title}
                            onChange={(e) => setCreateTask({ ...createTask, title: e.target.value })}
                          />
                          <textarea
                            placeholder="할 일 내용"
                            value={createTask.contents}
                            onChange={(e) => setCreateTask({ ...createTask, contents: e.target.value })}
                          />
                          <button className="btn" onClick={() => createTodoFn()}>할 일 생성</button>
                        </div>
                      )}
                    </div>
                  )
                }}
              </Droppable>
            ))}
          </div>
        </DragDropContext>
      </div>
    </>
  )
}

export default TodoBoard
