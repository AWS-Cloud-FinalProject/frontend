import { useState, useEffect } from 'react'
import { MdCancel } from 'react-icons/md'
import { FaPlus } from 'react-icons/fa6'
import { createDiary, getDiaryDetail } from 'js/api'
import goood from 'Images/emotion/GOOOD.png'
import good from 'Images/emotion/GOOD.png'
import soso from 'Images/emotion/SOSO.png'
import bad from 'Images/emotion/BAD.png'
import baaad from 'Images/emotion/BAAAD.png'

const DiaryModal = ({ setModal, selectedDate }) => {
  const [diaryDetail, setDiaryDetail] = useState({})
  const [mode, setMode] = useState('view')
  const [uploadedPhoto, setUploadedPhoto] = useState('')
  const emotionObj = {
    goood: goood, good: good, soso: soso, bad: bad, baaad: baaad,
  }
  const [createDiaryData, setCreateDiaryData] = useState({
    title: '', contents: '', emotion: 'SOSO', photo: '',
  })

  let prevent = false

  const viewDiaryDetail = async () => {
    if (prevent) return
    prevent = true
    setTimeout(() => {
      prevent = false
    }, 200)
    const result = await (getDiaryDetail(selectedDate))
    if (typeof result === 'object') {
      if (result?.data === null) setMode('prev-create')
      else setDiaryDetail(result?.data)
    }
  }

  const changeDiaryData = (e, type) => {
    setCreateDiaryData(prev => {
      const data = { ...prev }
      if (type === 'photo') {
        data.photo = e.target.files[0]
        const reader = new FileReader()
        reader.readAsDataURL(e.target.files[0])
        reader.onload = () => {
          setUploadedPhoto(reader?.result)
        }
      } else if (type === 'emotion') data.emotion = e
      else data[type] = e.target.value
      return data
    })
  }

  const createDiaryFn = async () => {
    if (createDiaryData?.title === '') return alert('일기 제목을 입력해 주세요.')
    else if (createDiaryData?.content === '') return alert('일기 내용을 입력해 주세요.')
    else if (createDiaryData?.emotion === '') return alert('오늘의 기분을 선택해 주세요.')
    else {
      const formData = new FormData()
      formData.append('title', createDiaryData?.title)
      formData.append('contents', createDiaryData?.contents)
      formData.append('emotion', createDiaryData?.emotion)
      formData.append('diary_date', `${selectedDate.slice(0, 4)}-${selectedDate.slice(4, 6)}-${selectedDate.slice(6, 8)}`)
      if (uploadedPhoto)
        formData.append('photo', createDiaryData?.photo)
      const result = await createDiary(formData);
      if (typeof result === 'object' && result?.data?.message === "Diary entry added successfully") {
        setModal(false)
      }
    }
  }

  useEffect(() => {
    viewDiaryDetail()
  }, [])

  return (<div className="modal-bg">
    <div className="modal diary-modal column">
      <div className="exit-btn" onClick={() => setModal(false)}><MdCancel size={35} /></div>
      {mode === 'view' ? <>
        <div className="row diary-top">
          <h2 className="title">{diaryDetail?.title}</h2>
          <span className="emotion row">
            오늘의 기분:
          <img src={emotionObj[diaryDetail?.emotion?.toLowerCase()]} />
          </span>
        </div>
        <img className="diary-photo" src={diaryDetail?.photo} />
        <p className="contents">{diaryDetail?.contents}</p>
      </> : mode === 'prev-create' ? <div className="lets-add-diary column" onClick={() => setMode('create')}>
        <FaPlus size={80} />
        <p>일기를 추가해 보세요.</p>
      </div> : mode === 'create' ? <div className="column create-diary">
        <input type="text" placeholder="일기 제목" className="create-diary-title" value={createDiaryData.title}
               onChange={e => changeDiaryData(e, 'title')} />
        <div className="column create-diary-photo">
          <div className="row input-photo">
            <label htmlFor="photo" className="photo-file-label">
              이미지 등록
            </label>
            <p>{createDiaryData?.photo?.name}</p>
          </div>
          {uploadedPhoto ? <img src={uploadedPhoto} alt="일기 이미지 미리보기" className="preview-photo" /> : ''}
        </div>
        <input type="file" id="photo"
               onChange={e => changeDiaryData(e, 'photo')} />
        <div className="create-diary-emotion row">
          <img src={goood} onClick={() => changeDiaryData('GOOOD', 'emotion')}
               className={createDiaryData?.emotion === 'GOOOD' ? 'active' : ''} />
          <img src={good} onClick={() => changeDiaryData('GOOD', 'emotion')}
               className={createDiaryData?.emotion === 'GOOD' ? 'active' : ''} />
          <img src={soso} onClick={() => changeDiaryData('SOSO', 'emotion')}
               className={createDiaryData?.emotion === 'SOSO' ? 'active' : ''} />
          <img src={bad} onClick={() => changeDiaryData('BAD', 'emotion')}
               className={createDiaryData?.emotion === 'BAD' ? 'active' : ''} />
          <img src={baaad} onClick={() => changeDiaryData('BAAAD', 'emotion')}
               className={createDiaryData?.emotion === 'BAAAD' ? 'active' : ''} />
        </div>
        <textarea placeholder="일기 내용" className="create-diary-contents" value={createDiaryData.contents}
                  onChange={e => changeDiaryData(e, 'contents')} />
        <button className='create-diary-btn' onClick={createDiaryFn}>일기 저장</button>
      </div> : <>
      </>}
    </div>
  </div>)
}

export default DiaryModal