import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { FaBars, FaGripVertical, FaEdit } from 'react-icons/fa'
import {
  RiLogoutBoxRLine,
  RiCalendarTodoFill,
  RiTodoLine,
  RiUserCommunityFill
} from 'react-icons/ri'
import { removeCookie } from 'js/cookie'
import UserEditModal from './UserEditModal'

const Navigator = () => {
  const [dropDown, setDropDown] = useState(false)
  const [modal, setModal] = useState(false)
  const [siteMap, setSiteMap] = useState(false)
  const [currentPage, setCurrentPage] = useState('')

  const navigate = useNavigate()
  const location = useLocation()

  const loginFn = () => {
    removeCookie('myToken', { path: '/' })
    removeCookie('rfToken', { path: '/' })
    navigate('/')
  }

  useEffect(() => {
    setCurrentPage(location.pathname.split('/')[2])
  }, [])

  return (
    <>
      <div className='row navigator'>
        <div className={`site-map column ${siteMap ? 'on' : ''}`}>
          <div className='column' onClick={() => navigate('/home/diary')}>
            <RiCalendarTodoFill
              size={80}
              className={currentPage === 'diary' ? 'active' : ''}
            />
            <span className={currentPage === 'diary' ? 'active' : ''}>
              일기
            </span>
          </div>
          <div className='column' onClick={() => navigate('/home/todo')}>
            <RiTodoLine
              size={80}
              className={currentPage === 'todo' ? 'active' : ''}
            />
            <span className={currentPage === 'todo' ? 'active' : ''}>
              투두리스트
            </span>
          </div>
          <div className='column' onClick={() => navigate('/home/community')}>
            <RiUserCommunityFill
              size={80}
              className={currentPage === 'community' ? 'active' : ''}
            />
            <span className={currentPage === 'community' ? 'active' : ''}>
              커뮤니티
            </span>
          </div>
        </div>
        <div
          className={`site-map-btn ${siteMap ? 'on' : ''}`}
          onClick={() => setSiteMap(!siteMap)}
        >
          <FaGripVertical size={30} />
        </div>
        <div onClick={() => setDropDown(!dropDown)}>
          <FaBars size={30} />
        </div>
        {dropDown ? (
          <>
            <div className='column drop-down-menu'>
              <div className='row' onClick={() => setModal(true)}>
                <FaEdit /> <span>회원 정보 수정</span>
              </div>
              <div className='row red' onClick={loginFn}>
                <RiLogoutBoxRLine /> <span>로그아웃</span>
              </div>
            </div>
          </>
        ) : (
          ''
        )}
      </div>
      {modal ? <UserEditModal setModal={setModal} /> : ''}
    </>
  )
}

export default Navigator
