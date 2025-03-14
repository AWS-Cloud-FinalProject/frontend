import { useState } from 'react'
import wiaryLogo from 'Images/wiary-logo.svg'
import { signUp } from '../js/api'
import { setCookie } from '../js/cookie'
import { useNavigate } from 'react-router-dom'

const SignUp = () => {
  const [id, setId] = useState('')
  const [name, setName] = useState('')
  const [pw, setPw] = useState('')
  const [checkPw, setCheckPw] = useState('')

  const navigate = useNavigate()

  const signUpFn = async () => {
    if (id === '') return alert('아이디를 입력해 주세요.')
    else if (name === '') return alert('이름을 입력해 주세요.')
    else if (pw === '') return alert('비밀번호를 입력해 주세요.')
    else if (checkPw === '') return alert('비밀번호 확인을 입력해 주세요.')
    else {
      if (pw !== checkPw) return alert('비밀번호를 정확히 입력해 주세요.')
      else {
        const result = await signUp(id, name, pw)
        if (
          typeof result === 'object' &&
          result?.data?.message === 'User created successfully'
        ) {
          navigate('/')
        }
      }
    }
  }

  return (
    <div className='page column'>
      <div className='box signup-box input-form'>
        <img src={wiaryLogo} alt='logo' />
        <span>회원가입</span>
        <input
          onChange={e => setId(e.target.value)}
          value={id}
          type='text'
          placeholder='ID'
        />
        <input
          onChange={e => setName(e.target.value)}
          value={name}
          type='text'
          placeholder='NAME'
        />
        <input
          onChange={e => setPw(e.target.value)}
          value={pw}
          type='password'
          placeholder='PW'
        />
        <input
          onChange={e => setCheckPw(e.target.value)}
          value={checkPw}
          type='password'
          placeholder='CHECK PW'
        />
        {pw && checkPw && pw !== checkPw ? (
          <p className='incorrect-pw'>비밀번호를 올바르게 입력해 주세요.</p>
        ) : (
          ''
        )}
        <button className='sign-up-btn' onClick={signUpFn}>
          회원가입
        </button>
      </div>
    </div>
  )
}

export default SignUp
