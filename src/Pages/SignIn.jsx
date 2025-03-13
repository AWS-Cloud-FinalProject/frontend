import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { signIn } from 'js/api'
import wiaryLogo from 'Images/wiary-logo.svg'
import { setCookie, getCookie } from 'js/cookie'

const SignIn = () => {
  const navigate = useNavigate()
  const [id, setId] = useState('')
  const [pw, setPw] = useState('')

  const signInFn = async () => {
    if (id === '') return alert('아이디를 입력해 주세요.')
    else if (pw === '') return alert('비밀번호를 입력해 주세요.')
    else {
      const result = await signIn(id, pw)
      if (typeof result === 'object') {
        const { access_token, refresh_token } = result.data
        setCookie('myToken', access_token, { path: '/' })
        setCookie('rfToken', refresh_token, { path: '/' })
        navigate('/home/diary')
      }
    }
  }

  const enterFn = e => {
    if (e.key === 'Enter') signInFn()
    else return
  }

  useEffect(() => {
    if (getCookie('myToken') && getCookie('rfToken')) navigate('/home/diary')
  }, [])

  return (
    <div className='page column'>
      <div className='box login-box input-form'>
        <img src={wiaryLogo} alt='logo' />
        <span>로그인</span>
        <div className='row'>
          <div className='column'>
            <input
              onChange={e => setId(e.target.value)}
              onKeyDown={e => enterFn(e)}
              value={id}
              type='text'
              placeholder='ID'
            />
            <input
              onChange={e => setPw(e.target.value)}
              onKeyDown={e => enterFn(e)}
              value={pw}
              type='password'
              placeholder='PASSWORD'
            />
          </div>
          <button className='login-btn' onClick={signInFn}>
            Login
          </button>
        </div>
        <button className='go-sign-up' onClick={() => navigate('/sign-up')}>
          회원가입
        </button>
      </div>
    </div>
  )
}

export default SignIn
