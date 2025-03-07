import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navigator from 'components/Navigator'
import DiaryModal from 'components/DiaryModal'
import { getCookie } from 'js/cookie'
import { getDiary } from 'js/api'
import goood from 'Images/emotion/GOOOD.png'
import good from 'Images/emotion/GOOD.png'
import soso from 'Images/emotion/SOSO.png'
import bad from 'Images/emotion/BAD.png'
import baaad from 'Images/emotion/BAAAD.png'


const Calendar = () => {
  const today = new Date()
  const [currentYear, setCurrentYear] = useState(today.getFullYear())
  const [currentMonth, setCurrentMonth] = useState(today.getMonth())
  const [calendar, setCalendar] = useState([])
  const [selectedDate, setSelectedDate] = useState(null)
  const [modal, setModal] = useState(false)
  const [calendarData, setCalendarData] = useState([])
  const emotionObj = {
    goood: goood, good: good, soso: soso, bad: bad, baaad: baaad,
  }

  let prevent = false

  const navigate = useNavigate()

  // 월 이동 함수
  const prevMonth = () => {
    setCurrentMonth(prev => (prev === 0 ? 11 : prev - 1))
    if (currentMonth === 0) setCurrentYear(prev => prev - 1)
  }

  const nextMonth = () => {
    setCurrentMonth(prev => (prev === 11 ? 0 : prev + 1))
    if (currentMonth === 11) setCurrentYear(prev => prev + 1)
  }

  // 캘린더 데이터 생성
  const generateCalendar = () => {
    const firstDay = new Date(currentYear, currentMonth, 1).getDay() // 월 시작 요일
    const lastDate = new Date(currentYear, currentMonth + 1, 0).getDate() // 현재 달 마지막 날짜
    const prevLastDate = new Date(currentYear, currentMonth, 0).getDate() // 이전 달 마지막 날짜

    let calendar = []
    let dayCounter = 1 - firstDay // 이전 달 날짜부터 시작

    for (let i = 0; i < 6; i++) {
      let week = []
      for (let j = 0; j < 7; j++) {
        let dayObj = { day: dayCounter, type: '', year: currentYear, month: currentMonth + 1, emotion: null }

        if (dayCounter < 1) {
          // 이전 달 날짜
          const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear
          const prevMonth = currentMonth === 0 ? 12 : currentMonth
          const dateStr = `${prevYear}-${prevMonth.toString().padStart(2, '0')}-${(prevLastDate + dayCounter).toString().padStart(2, '0')}`

          dayObj = {
            day: prevLastDate + dayCounter,
            type: 'prev',
            year: prevYear,
            month: prevMonth,
            emotion: calendarData.find(entry => entry.date === dateStr)?.emotion || null,
          }
        } else if (dayCounter > lastDate) {
          // 다음 달 날짜
          const nextYear = currentMonth === 11 ? currentYear + 1 : currentYear
          const nextMonth = currentMonth === 11 ? 1 : currentMonth + 2
          const dateStr = `${nextYear}-${nextMonth.toString().padStart(2, '0')}-${(dayCounter - lastDate).toString().padStart(2, '0')}`

          dayObj = {
            day: dayCounter - lastDate,
            type: 'next',
            year: nextYear,
            month: nextMonth,
            emotion: calendarData.find(entry => entry.date === dateStr)?.emotion || null,
          }
        } else {
          // 현재 달 날짜
          const dateStr = `${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}-${dayCounter.toString().padStart(2, '0')}`
          dayObj = {
            day: dayCounter,
            type: 'current',
            year: currentYear,
            month: currentMonth + 1,
            emotion: calendarData.find(entry => entry.date === dateStr)?.emotion || null,
          }
        }

        week.push(dayObj)
        dayCounter++
      }
      calendar.push(week)
      if (dayCounter > lastDate) break // 남은 날짜가 없으면 종료
    }

    setCalendar(calendar)
  }


  const getDiaryFn = async () => {
    if (prevent) return
    prevent = true
    setTimeout(() => {
      prevent = false
    }, 200)
    const month = currentMonth + 1 < 10 ? '0' + (currentMonth + 1) : currentMonth + 1
    const result = await getDiary(`${currentYear}${month}`)
    if (typeof result === 'object') {
      setCalendarData(result?.data)
    }
  }

  useEffect(() => {
    generateCalendar()
  }, [currentMonth, currentYear, calendarData])

  useEffect(() => {
    if (!getCookie('myToken')) return navigate('/sign-in')
    if (!modal) getDiaryFn()
  }, [modal])

  return (<>
    <div className="page column">
      <Navigator />
      {/* 월 변경 버튼 */}
      <div className="title-wrap row">
        <button className="monthBtn" onClick={prevMonth}>◀</button>
        <h2 className="title">
          <span>{currentYear}</span>년 <span>{currentMonth + 1}</span>월
        </h2>
        <button className="monthBtn" onClick={nextMonth}>▶</button>
      </div>
      {/* 캘린더 테이블 */}
      <div className="calendar column">
        <div className="row tr week">
          {['일', '월', '화', '수', '목', '금', '토'].map((day, idx) => (<span className="th">{day}</span>))}
        </div>
        {calendar.map((week, i) => (
          <div className="row tr">
            {week.map(({ year, month, day, type, emotion }) => (
              <div
                className={`column td
                  ${type === 'prev' || type === 'next' ? 'prev-or-next' : 'text-black day'}
                  ${year === today.getFullYear() && month === today.getMonth() + 1 && day === today.getDate() ? 'today' : ''}
                `}
                onClick={() => {
                  setSelectedDate(`${year}${month < 10 ? '0' + month : month}${day < 10 ? '0' + day : day}`)
                  setModal(true)
                }}
              >
                {emotion ? <>
                  <div className="row day-with-emotion">
                    <span>{day}</span>
                    <img className="emotion-img" src={emotionObj[emotion?.toLowerCase()]} />
                  </div>
                </> : <>
                  <span>{day}</span>
                </>}
              </div>))}
          </div>))}
      </div>
    </div>
    {modal && <DiaryModal setModal={setModal} selectedDate={selectedDate} />}
  </>)
}

export default Calendar
