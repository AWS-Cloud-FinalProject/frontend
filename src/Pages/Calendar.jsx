import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navigator from 'components/Navigator'
import { getCookie } from 'js/cookie'


const Calendar = () => {
  const today = new Date()
  const [currentYear, setCurrentYear] = useState(today.getFullYear())
  const [currentMonth, setCurrentMonth] = useState(today.getMonth())
  const [calendarData, setCalendarData] = useState([])

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
    const lastDate = new Date(currentYear, currentMonth + 1, 0).getDate() // 월의 마지막 날짜
    const prevLastDate = new Date(currentYear, currentMonth, 0).getDate() // 이전 달의 마지막 날짜

    let calendar = []
    let dayCounter = 1 - firstDay // 이전 달 날짜부터 시작

    for (let i = 0; i < 6; i++) {
      // 최대 6주
      let week = []
      for (let j = 0; j < 7; j++) {
        // 일~토
        if (dayCounter < 1) {
          // 이전 달 날짜
          week.push({
            day: prevLastDate + dayCounter,
            type: 'prev',
            year: currentMonth === 0 ? currentYear - 1 : currentYear,
            month: currentMonth === 0 ? 12 : currentMonth,
          })
        } else if (dayCounter > lastDate) {
          // 다음 달 날짜
          week.push({
            day: dayCounter - lastDate,
            type: 'next',
            year: currentMonth === 11 ? currentYear + 1 : currentYear,
            month: currentMonth === 11 ? 1 : currentMonth + 2,
          })
        } else {
          week.push({
            day: dayCounter,
            type: 'current',
            year: currentYear,
            month: currentMonth + 1,
          })
        }
        dayCounter++
      }
      calendar.push(week)
      if (dayCounter > lastDate) break // 남은 날짜가 없으면 종료
    }
    setCalendarData(calendar)
  }

  useEffect(() => {
    generateCalendar()
  }, [currentMonth, currentYear])

  useEffect(() => {
    if (!getCookie('myToken')) navigate('/sign-in')
  }, [])

  return (
    <div className='page column'>
      <Navigator />
      {/* 월 변경 버튼 */}
      <div className="title-wrap row">
        <button className='monthBtn' onClick={prevMonth}>◀</button>
        <h2 className="title">
          {currentYear}년 {currentMonth + 1}월
        </h2>
        <button className='monthBtn' onClick={nextMonth}>▶</button>
      </div>
      {/* 캘린더 테이블 */}
      <div className='calendar column'>
        <div className='row tr'>
          {['일', '월', '화', '수', '목', '금', '토'].map((day, idx) => (
            <span className='th'>{day}</span>
          ))}
        </div>
        {calendarData.map((week, i) => (
          <div className='row tr'>
            {week.map(({ year, month, day, type }, j) => (
              <span
                className={`column td
                  ${type === 'prev' || type === 'next' ? 'text-gray' : 'text-black'}
                  ${year === today.getFullYear() && month === today.getMonth() + 1 && day === today.getDate() ? 'font-bold' : ''}
                `}
              >
                {day}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

export default Calendar
