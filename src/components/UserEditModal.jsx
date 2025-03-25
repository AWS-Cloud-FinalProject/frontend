import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { IoExit } from 'react-icons/io5'
import { PiPasswordDuotone } from 'react-icons/pi'
import { MdCancel } from 'react-icons/md'
import { editPw, withdraw } from 'js/api'
import { removeCookie } from 'js/cookie'

const UserEditModal = ({ setModal }) => {
  const [step, setStep] = useState('default')
  const [currentPw, setCurrentPw] = useState('')
  const [newPw, setNewPw] = useState('')
  const [repeatNewPw, setRepeatNewPw] = useState('')
  const [withdrawCheck, setWithdrawCheck] = useState(false)

  const navigate = useNavigate()

  const editPwFn = async () => {
    if (currentPw === '') return alert('기존 비밀번호를 입력해 주세요.')
    else if (newPw === '') return alert('새 비밀번호를 입력해 주세요.')
    else if (repeatNewPw === '')
      return alert('새 비밀번호 확인을 입력해 주세요.')
    else if (newPw !== repeatNewPw)
      return alert('비밀번호 확인을 제대로 입력해 주세요.')
    else {
      const result = await editPw(currentPw, newPw)
      if (
        typeof result === 'object' &&
        result?.data?.message === 'Password updated successfully'
      ) {
        alert('비밀번호가 변경되었습니다.')
        return setModal(false)
      }
    }
  }

  const withdrawFn = async () => {
    if (currentPw === '') return alert('비밀번호를 입력해 주세요.')
    else if (!withdrawCheck) return alert('회원 탈퇴에 체크해 주세요.')
    else {
      const result = await withdraw(currentPw)
      if (
        typeof result === 'object' &&
        result?.data?.message === 'User Withdraw Success'
      ) {
        alert('이용해 주셔서 감사합니다.')
        removeCookie('myToken', { path: '/' })
        removeCookie('rfToken', { path: '/' })
        navigate('/')
      }
    }
  }

  return (
    <div className='modal-bg'>
      <div className='modal user-edit-modal column'>
        <div className='exit-btn' onClick={() => setModal(false)}>
          <MdCancel size={35} />
        </div>
        {step === 'default' && (
          <div className='row'>
            <div className='column' onClick={() => setStep('changePw')}>
              <PiPasswordDuotone size={50} />
              <p>비밀번호 변경</p>
            </div>
            <div className='column' onClick={() => setStep('withdraw')}>
              <IoExit size={50} />
              <p>회원 탈퇴</p>
            </div>
          </div>
        )}
        {step === 'changePw' && (
          <>
            <div className='column input-form change-pw'>
              <span>비밀번호 변경</span>
              <input
                type='password'
                placeholder='기존 비밀번호'
                value={currentPw}
                onChange={e => setCurrentPw(e.target.value)}
              />
              <input
                type='password'
                placeholder='새 비밀번호'
                value={newPw}
                onChange={e => setNewPw(e.target.value)}
              />
              <input
                type='password'
                placeholder='새 비밀번호 확인'
                value={repeatNewPw}
                onChange={e => setRepeatNewPw(e.target.value)}
              />
              {newPw && repeatNewPw && newPw !== repeatNewPw ? (
                <p>비밀번호를 제대로 입력해 주세요.</p>
              ) : (
                ''
              )}
              <button className='change-pw-btn' onClick={editPwFn}>
                비밀번호 변경
              </button>
            </div>
          </>
        )}
        {step === 'withdraw' && (
          <>
            <div className='column input-form withdraw'>
              <span>회원 탈퇴</span>
              <input
                type='password'
                value={currentPw}
                placeholder='비밀번호 입력'
                onChange={e => setCurrentPw(e.target.value)}
              />
              <div className='withdraw-check row'>
                <input
                  type='checkbox'
                  id='withdraw-check'
                  checked={withdrawCheck}
                  onChange={e => setWithdrawCheck(e.target.checked)}
                />
                <label for='withdraw-check'>
                  정말로 회원 탈퇴를 하시겠습니까?
                </label>
              </div>
              <button className='withdraw-btn' onClick={withdrawFn}>
                회원 탈퇴
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default UserEditModal
