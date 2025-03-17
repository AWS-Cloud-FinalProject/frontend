import { useEffect, useState } from 'react'
import { MdOutlineModeEdit } from 'react-icons/md'
import { FaRegTrashCan } from 'react-icons/fa6'
import Navigator from 'components/Navigator'
import { createPost, deletePost, getCommunityPosts, updatePost } from 'js/api'

const Community = () => {
  const [mode, setMode] = useState('view')
  const [posts, setPosts] = useState([])
  const [uploadedPhoto, setUploadedPhoto] = useState(null)
  const [post, setPost] = useState({
    contents: '',
    photo: null,
  })
  const [editingPost, setEditingPost] = useState(null) // 수정 중인 게시글 저장
  let prevent = false

  const getPosts = async () => {
    if (prevent) return
    prevent = true
    setTimeout(() => {
      prevent = false
    }, 200)
    const result = await getCommunityPosts()
    if (typeof result === 'object') {
      setPosts(result?.data)
    }
  }

  const changePostData = (e, type) => {
    setPost(prev => {
      const data = { ...prev }
      if (type === 'photo') {
        if (!e.target.files[0]) {
          setUploadedPhoto(null)
          data.photo = null
        } else {
          data.photo = e.target.files[0]
          const reader = new FileReader()
          reader.readAsDataURL(e.target.files[0])
          reader.onload = () => {
            setUploadedPhoto(reader?.result)
          }
        }
      } else data[type] = e.target.value
      return data
    })
  }

  const createPostFn = async () => {
    if (!post?.contents) return alert('내용을 입력해 주세요.')
    else {
      const formData = new FormData()
      formData.append('contents', post.contents)
      if (uploadedPhoto) formData.append('photo', post?.photo)
      const result = await createPost(formData)
      if (typeof result === 'object') {
        setMode('view')
        setUploadedPhoto(null) // 여기서 초기화
        setPost({
          contents: '',
          photo: null,
        })
        getPosts()
      }
    }
  }

  const updatePostFn = async post_id => {
    if (!post?.contents) return alert('내용을 입력해 주세요.')

    const formData = new FormData()
    formData.append('contents', post.contents)

    if (uploadedPhoto) {
      formData.append('photo_provided', true)
      formData.append('photo', post?.photo) // 수정된 사진을 전송
    } else formData.append('photo_provided', false)

    const result = await updatePost(post_id, formData)
    if (
      typeof result === 'object' &&
      result?.data?.message === 'Post updated successfully'
    ) {
      setMode('view')
      setEditingPost(null)
      setUploadedPhoto(null) // 업로드된 사진 초기화
      setPost({
        contents: '',
        photo: null,
      })
      getPosts()
    }
  }

  const deletePostFn = async post_id => {
    const result = await deletePost(post_id)
    if (
      typeof result === 'object' &&
      result?.data?.message === 'Post deleted successfully'
    ) {
      getPosts()
    }
  }

  const renderPosts = () => {
    return posts?.map(({ user_id, created_at, contents, mine, photo, id }) => {
      return (
        <div className='column community-box' key={id}>
          <div className='row'>
            <p className='userId'>@{user_id}</p>
            <p className='createdAt'>{created_at?.replace('T', ' ')}</p>
            {mine ? (
              <>
                <button
                  className='edit-btn'
                  onClick={() => {
                    setEditingPost(id)
                    setPost({ photo: photo, contents: contents })
                    setMode('edit')
                  }}
                >
                  <MdOutlineModeEdit size={20} />
                </button>
                <button className='delete-btn' onClick={() => deletePostFn(id)}>
                  <FaRegTrashCan size={20} />
                </button>
              </>
            ) : (
              <></>
            )}
          </div>
          {editingPost === id && mode === 'edit' ? (
            <div className='column community-edit-box'>
              <textarea
                value={post?.contents}
                onChange={e => changePostData(e, 'contents')}
              />
              {uploadedPhoto || post?.photo ? (
                <img
                  src={uploadedPhoto || post?.photo}
                  alt={`커뮤니티 이미지 ${id}`}
                  className='preview-photo'
                />
              ) : (
                ''
              )}
              <div className='row upload'>
                <label htmlFor='photo' className='upload-img-btn'>
                  사진 업로드
                </label>
                <input
                  type='file'
                  id='photo'
                  accept='image/*'
                  onChange={e => changePostData(e, 'photo')}
                />
                <button onClick={() => updatePostFn(id)}>저장</button>
              </div>
            </div>
          ) : (
            <>
              {photo && (
                <img
                  src={photo}
                  alt={`커뮤니티 이미지 ${id}`}
                  className='post-img'
                />
              )}
              <div className='contents'>{contents}</div>
            </>
          )}
        </div>
      )
    })
  }

  useEffect(() => {
    getPosts()
  }, [])

  return (
    <div className='page column'>
      <Navigator />
      <div className='community column'>
        <div className='row community-top-box'>
          <h2>COMMUNITY</h2>
          <button onClick={() => setMode('create')}>+</button>
        </div>
        {mode === 'create' && (
          <div className='column community-add-box'>
            <textarea
              placeholder='무슨 말이 하고 싶나요?'
              onChange={e => changePostData(e, 'contents')}
            />
            {uploadedPhoto || post?.photo ? (
              <img
                src={uploadedPhoto || post?.photo}
                alt='일기 이미지 미리보기'
                className='preview-photo'
              />
            ) : (
              ''
            )}
            <div className='row upload'>
              <label htmlFor='photo' className='upload-img-btn'>
                사진 업로드
              </label>
              <input
                type='file'
                id='photo'
                accept='image/*'
                onChange={e => changePostData(e, 'photo')}
              />
              <button onClick={createPostFn}>보내기</button>
            </div>
          </div>
        )}
        {renderPosts()}
      </div>
    </div>
  )
}

export default Community
