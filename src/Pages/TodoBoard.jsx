import { useState, useEffect } from 'react'
// import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { FaPlus } from 'react-icons/fa6'
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import { IoMdClose } from 'react-icons/io'
import Navigator from 'components/Navigator'
import CreateTodoModal from 'components/CreateTodoModal'
import { getTodo, deleteTodo } from 'js/api'

const TodoBoard = () => {
  const [modal, setModal] = useState(false)
  const [state, setState] = useState('')
  const [tasks, setTasks] = useState({
    todo: [],
    inProgress: [],
    review: [],
    done: [],
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

  useEffect(() => {
    if (!modal) getTodoList()
  }, [modal])

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

  const onDragEnd = (result) => {
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
                          setModal(true)
                          setState(columnId)
                        }}>
                          <FaPlus />
                        </div>
                      </div>
                      {safeColumnTasks.map(({ title, contents, todo_num }, idx) => (
                        <Draggable key={`${columnId}-${todo_num}`} draggableId={`${columnId}-${todo_num}`} index={idx}>
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="list"
                            >
                              <div className="row list-top">
                                <span className={`list-status ${columnId}`}>{columnId}</span>
                                <div onClick={() => deleteTodoList(todo_num)}><IoMdClose size={20} /></div>
                              </div>
                              <p>{title}</p>
                              <span>{contents}</span>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder} {/* 드래그된 항목을 위한 공간 예약 */}
                    </div>
                  )
                }}
              </Droppable>
            ))}
          </div>
        </DragDropContext>
      </div>
      {modal ? <CreateTodoModal setModal={setModal} state={state} /> : null}
    </>
  )
}

export default TodoBoard
