import { Inter } from 'next/font/google'
import { useState } from 'react'
import { format } from 'date-fns'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const [todo, setTodo] = useState([])
  const [newTodo, setNewTodo] = useState('')

  const getRandomNumber = () => {
    return Math.floor(Math.random() * 9999)
  }

  const handleKeyUp = (key) => {
    if (key === 'Enter' && newTodo) {
      const randomNumber = getRandomNumber()
      
      const newItem = {
        id: `item-${randomNumber}`,
        content: newTodo
      }

      setTodo(todo.concat(newItem))

      setNewTodo('')
    }
  }

  const handleDelete = (id) => {
    if (id > -1) {
      setTodo(todo.slice(0, id).concat(todo.slice(id+1)))
    }
  }

  const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list)
    const [removed] = result.splice(startIndex, 1)
    result.splice(endIndex, 0, removed)
    return result
  }

  const handleOnDragEnd = (result) => {
    const { destination, source } = result

    if (!destination) {
      return
    }

    const items = reorder(todo, source.index, destination.index)

    setTodo(items)
  }

  return (
    <>
    <div className="flex justify-center pt-40">
      <div className="max-w-sm w-full shadow-lg bg-white p-8 rounded-xl opacity-70">
        
        <div className="flex justify-center cursor-default bg-gray-200 rounded-3xl px-4 py-1 color-gray hover:scale-110 transition-all">
          <img className="object-cover rounded-full w-16 h-16 m-2" src="https://avatars.githubusercontent.com/u/52646391?v=4" alt="codrkai" />
          <div className="w-full p-3">
            <p className="text-3xl text-gray-600">Todo List</p>
            <p className="text-sm">{format(new Date(), 'MMMM d, yyyy')}</p>
          </div>
        </div>

        <div className="relative mt-10">
          <div className="absolute inset-y-0 left-2 flex items-center pl-3 pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-plus-circle" viewBox="0 0 16 16"> <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/> <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/></svg>
          </div>
          <input type="text" id="newTodo" value={newTodo} onChange={(e) => setNewTodo(e.target.value)} onKeyUp={(e) => handleKeyUp(e.key)} className="block w-full pl-10 p-2 border-4 rounded-full bg-gray-600 text-white" placeholder="new todo item" />
        </div>

        <DragDropContext onDragEnd={handleOnDragEnd}>
          <Droppable droppableId="droppable">
          {(droppableProvided) => (
            <div 
              {...droppableProvided.droppableProps} 
              ref={droppableProvided.innerRef}
            >
              <ul className="block w-full pt-6">
              {
                todo?.map( (item, index) => {
                  return (
                    <Draggable draggableId={item.id} key={item.id} index={index}>
                      {(draggableProvided) => (
                        <div 
                          {...draggableProvided.draggableProps} 
                          {...draggableProvided.dragHandleProps} 
                          ref={draggableProvided.innerRef}
                        >
                          <li key={item.id} className="w-full border-2 rounded-xl mt-2 hover:border-blue-300">
                            <input id={index} type="checkbox" className="float-left block w-6 h-6 m-3" />
                            <button id={index} onClick={() => handleDelete(index)} className="float-right w-7 h-7 m-2.5 rounded-2xl bg-red-700 text-gray-200 shadow-md hover:bg-red-500 hover:scale-105">x</button>
                            <label htmlFor={index} className="block w-full p-3">{item.content}</label>
                          </li>
                        </div>
                      )}
                    </Draggable>
                  )
                })
              }
              </ul>
              {droppableProvided.placeholder}
            </div>
          )}
          </Droppable>
        </DragDropContext>

      </div>
    </div>
    </>
  )
}
