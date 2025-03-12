import { useState, useEffect } from 'react'
import { MdCancel, MdOutlineModeEdit } from 'react-icons/md'
import { FaPlus, FaRegTrashCan } from 'react-icons/fa6'
import { createDiary, getDiaryDetail, deleteDiary, editDiary } from 'js/api'
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
    goood: goood,
    good: good,
    soso: soso,
    bad: bad,
    baaad: baaad,
  }
  const [diaryData, setDiaryData] = useState({
    title: '',
    contents: '',
    emotion: 'SOSO',
    photo: '',
  })

  let prevent = false

  const viewDiaryDetail = async () => {
    if (prevent) return
    prevent = true
    setTimeout(() => {
      prevent = false
    }, 200)
    const result = await getDiaryDetail(selectedDate)
    if (typeof result === 'object') {
      if (result?.data === null) setMode('prev-create')
      else setDiaryDetail(result?.data)
    }
  }

  const changeDiaryData = (e, type) => {
    setDiaryData(prev => {
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

  const createOrEdit = async () => {
    if (diaryData?.title === '') return alert('일기 제목을 입력해 주세요.')
    else if (diaryData?.content === '')
      return alert('일기 내용을 입력해 주세요.')
    else if (diaryData?.emotion === '')
      return alert('오늘의 기분을 선택해 주세요.')
    else {
      const formData = new FormData()
      formData.append('title', diaryData?.title)
      formData.append('contents', diaryData?.contents)
      formData.append('emotion', diaryData?.emotion)
      formData.append(
        'diary_date',
        `${selectedDate.slice(0, 4)}-${selectedDate.slice(4, 6)}-${selectedDate.slice(6, 8)}`
      )
      if (uploadedPhoto) formData.append('photo', diaryData?.photo)
      if (mode === 'create') {
        const result = await createDiary(formData)
        if (
          typeof result === 'object' &&
          result?.data?.message === 'Diary entry added successfully'
        ) {
          setModal(false)
        }
      } else {
        if (uploadedPhoto) formData.append('photo_provided', true)
        else formData.append('photo_provided', false)
        const result = await editDiary(formData)
        if (
          typeof result == 'object' &&
          result?.data?.message === 'Diary entry updated successfully'
        ) {
          setModal(false)
        }
      }
    }
  }

  const deleteDiaryFn = async () => {
    const bool = window.confirm('정말 삭제할까요?')
    if (!bool) return
    else {
      const result = await deleteDiary(selectedDate)
      if (
        typeof result === 'object' &&
        result?.data?.message === 'Diary entry deleted successfully'
      ) {
        setModal(false)
      }
    }
  }

  useEffect(() => {
    viewDiaryDetail()
  }, [])

  return (
    <div className='modal-bg'>
      <div className='modal diary-modal column'>
        <div className='exit-btn' onClick={() => setModal(false)}>
          <MdCancel size={35} />
        </div>
        {mode === 'view' ? (
          <>
            <div className='btns'>
              <MdOutlineModeEdit
                size={30}
                onClick={() => {
                  setDiaryData(diaryDetail)
                  setMode('edit')
                }}
              />
              <FaRegTrashCan size={30} onClick={deleteDiaryFn} />
            </div>
            <div className='row diary-top'>
              <h2 className='title'>{diaryDetail?.title}</h2>
              <span className='emotion row'>
                오늘의 기분:
                <img
                  alt='오늘의 기분 이모지'
                  src={emotionObj[diaryDetail?.emotion?.toLowerCase()]}
                />
              </span>
            </div>
            {diaryDetail?.photo ? (
              <img
                alt='일기 사진'
                className='diary-photo'
                src={diaryDetail?.photo}
              />
            ) : (
              <></>
            )}
            <p className='contents'>{diaryDetail?.contents}</p>
          </>
        ) : mode === 'prev-create' ? (
          <div
            className='lets-add-diary column'
            onClick={() => setMode('create')}
          >
            <FaPlus size={80} />
            <p>일기를 추가해 보세요.</p>
          </div>
        ) : mode === 'create' || mode === 'edit' ? (
          <div className='column create-diary'>
            <input
              type='text'
              placeholder='일기 제목'
              className='create-diary-title'
              value={diaryData.title}
              onChange={e => changeDiaryData(e, 'title')}
            />
            <div className='column create-diary-photo'>
              <div className='row input-photo'>
                <label htmlFor='photo' className='photo-file-label'>
                  이미지 등록
                </label>
                <p>{diaryData?.photo?.name}</p>
              </div>
              {uploadedPhoto || diaryDetail?.photo ? (
                <img
                  src={
                    mode === 'create'
                      ? uploadedPhoto
                      : uploadedPhoto
                        ? uploadedPhoto
                        : diaryDetail?.photo
                  }
                  alt='일기 이미지 미리보기'
                  className='preview-photo'
                />
              ) : (
                ''
              )}
            </div>
            <input
              type='file'
              id='photo'
              accept='image/*'
              onChange={e => changeDiaryData(e, 'photo')}
            />
            <div className='create-diary-emotion row'>
              <img
                src={goood}
                alt='아주 좋음'
                onClick={() => changeDiaryData('GOOOD', 'emotion')}
                className={diaryData?.emotion === 'GOOOD' ? 'active' : ''}
              />
              <img
                src={good}
                alt='좋음'
                onClick={() => changeDiaryData('GOOD', 'emotion')}
                className={diaryData?.emotion === 'GOOD' ? 'active' : ''}
              />
              <img
                src={soso}
                alt='그냥 그럼'
                onClick={() => changeDiaryData('SOSO', 'emotion')}
                className={diaryData?.emotion === 'SOSO' ? 'active' : ''}
              />
              <img
                src={bad}
                alt='나쁨'
                onClick={() => changeDiaryData('BAD', 'emotion')}
                className={diaryData?.emotion === 'BAD' ? 'active' : ''}
              />
              <img
                src={baaad}
                alt='매우 나쁨'
                onClick={() => changeDiaryData('BAAAD', 'emotion')}
                className={diaryData?.emotion === 'BAAAD' ? 'active' : ''}
              />
            </div>
            <textarea
              placeholder='일기 내용'
              className='create-diary-contents'
              value={diaryData.contents}
              onChange={e => changeDiaryData(e, 'contents')}
            />
            <button className='create-diary-btn' onClick={createOrEdit}>
              일기 {mode === 'create' ? '저장' : '수정'}
            </button>
          </div>
        ) : (
          <></>
        )}
      </div>
    </div>
  )
}

export default DiaryModal
