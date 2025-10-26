import React, { useState } from 'react';
import { Calendar, Printer } from 'lucide-react';
import './App.css';

function App() {
  const [startDate, setStartDate] = useState('2026-01-01');
  const [endDate, setEndDate] = useState('2026-12-31');

  // Victorian Public Holidays 2026-2027
  const publicHolidays = {
    '2026-01-01': 'New Year\'s Day',
    '2026-01-26': 'Australia Day',
    '2026-03-09': 'Labour Day',
    '2026-04-03': 'Good Friday',
    '2026-04-04': 'Saturday before Easter Sunday',
    '2026-04-06': 'Easter Monday',
    '2026-04-25': 'Anzac Day',
    '2026-06-08': 'Queen\'s Birthday',
    '2026-11-03': 'Melbourne Cup',
    '2026-12-25': 'Christmas Day',
    '2026-12-26': 'Boxing Day',
    '2026-12-28': 'Boxing Day (observed)',
    '2027-01-01': 'New Year\'s Day',
    '2027-01-26': 'Australia Day',
    '2027-03-08': 'Labour Day',
    '2027-03-26': 'Good Friday',
    '2027-03-27': 'Saturday before Easter Sunday',
    '2027-03-29': 'Easter Monday',
    '2027-04-25': 'Anzac Day',
    '2027-04-26': 'Anzac Day (observed)',
    '2027-06-14': 'Queen\'s Birthday',
    '2027-11-02': 'Melbourne Cup',
    '2027-12-25': 'Christmas Day',
    '2027-12-26': 'Boxing Day',
    '2027-12-27': 'Christmas Day (observed)',
    '2027-12-28': 'Boxing Day (observed)',
  };

  // RDO Days - Edit these dates as needed
  // Format: 'YYYY-MM-DD'
  const rdoDays = new Set([
    // 2026 RDOs - Example: one per month, sometimes two
    '2026-01-16',
    '2026-02-13',
    '2026-02-27',
    '2026-03-20',
    '2026-04-17',
    '2026-05-15',
    '2026-05-29',
    '2026-06-19',
    '2026-07-17',
    '2026-07-31',
    '2026-08-14',
    '2026-09-18',
    '2026-10-16',
    '2026-10-30',
    '2026-11-13',
    '2026-11-27',
    '2026-12-11',
    // 2027 RDOs
    '2027-01-15',
    '2027-01-29',
    '2027-02-12',
    '2027-03-12',
    '2027-03-26',
    '2027-04-16',
    '2027-04-30',
    '2027-05-14',
    '2027-05-28',
    '2027-06-11',
    '2027-06-25',
    '2027-07-09',
    '2027-07-23',
    '2027-08-06',
    '2027-08-20',
    '2027-09-03',
    '2027-09-17',
    '2027-10-01',
    '2027-10-15',
    '2027-10-29',
    '2027-11-12',
    '2027-11-26',
    '2027-12-10',
  ]);

  // Christmas/New Year Closure Period - Edit these date ranges as needed
  const christmasClosures = new Set([
    // 2025-2026 Christmas closure (example: Dec 23 - Jan 5)
    '2025-12-23', '2025-12-24', '2025-12-29', '2025-12-30', '2025-12-31',
    '2026-01-02', '2026-01-05',
    // 2026-2027 Christmas closure
    '2026-12-23', '2026-12-24', '2026-12-29', '2026-12-30', '2026-12-31',
    '2027-01-04', '2027-01-05',
  ]);

  const formatDate = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const isWeekend = (date) => {
    const day = new Date(date).getDay();
    return day === 0 || day === 6;
  };

  const getDayType = (dateStr) => {
    if (publicHolidays[dateStr]) return 'holiday';
    if (christmasClosures.has(dateStr)) return 'closure';
    if (rdoDays.has(dateStr)) return 'rdo';
    if (isWeekend(dateStr)) return 'weekend';
    return 'working';
  };

  const getMonthsInRange = () => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const months = [];
    
    let current = new Date(start.getFullYear(), start.getMonth(), 1);
    const endMonth = new Date(end.getFullYear(), end.getMonth(), 1);
    
    while (current <= endMonth) {
      months.push(new Date(current));
      current.setMonth(current.getMonth() + 1);
    }
    
    return months;
  };

  const getDaysInMonth = (year, month) => {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const days = [];
    
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const calculateStats = () => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    let workingDays = 0;
    let rdoCount = 0;
    let holidayCount = 0;
    let weekendCount = 0;
    let closureCount = 0;
    
    let current = new Date(start);
    while (current <= end) {
      const dateStr = formatDate(current);
      const type = getDayType(dateStr);
      
      if (type === 'working') workingDays++;
      else if (type === 'rdo') rdoCount++;
      else if (type === 'holiday') holidayCount++;
      else if (type === 'closure') closureCount++;
      else if (type === 'weekend') weekendCount++;
      
      current.setDate(current.getDate() + 1);
    }
    
    return { workingDays, rdoCount, holidayCount, weekendCount, closureCount };
  };

  const isInRange = (date) => {
    if (!date) return false;
    const dateStr = formatDate(date);
    return dateStr >= startDate && dateStr <= endDate;
  };

  const handlePrint = () => {
    try {
      window.print();
    } catch (error) {
      alert('Print function not available. Please use your browser\'s print function (Ctrl+P or Cmd+P) to save as PDF.');
    }
  };

  const stats = calculateStats();
  const months = getMonthsInRange();

  return (
    <div className="app-container">
      <div className="content-wrapper">
        <div className="card">
          {/* Header */}
          <div className="header">
            <div className="header-title">
              <Calendar className="icon-large" />
              <h1>Construction Work Calendar</h1>
            </div>
            <button onClick={handlePrint} className="print-button">
              <Printer className="icon-small" />
              Print / Save PDF
            </button>
          </div>

          {/* Date Range Selector */}
          <div className="date-selector">
            <div className="input-group">
              <label>Project Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="input-group">
              <label>Project End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>

          {/* Statistics */}
          <div className="stats-grid">
            <div className="stat-card stat-working">
              <div className="stat-number">{stats.workingDays}</div>
              <div className="stat-label">Working Days</div>
            </div>
            <div className="stat-card stat-rdo">
              <div className="stat-number">{stats.rdoCount}</div>
              <div className="stat-label">RDOs</div>
            </div>
            <div className="stat-card stat-holiday">
              <div className="stat-number">{stats.holidayCount}</div>
              <div className="stat-label">Public Holidays</div>
            </div>
            <div className="stat-card stat-closure">
              <div className="stat-number">{stats.closureCount}</div>
              <div className="stat-label">Xmas Closure</div>
            </div>
            <div className="stat-card stat-weekend">
              <div className="stat-number">{stats.weekendCount}</div>
              <div className="stat-label">Weekends</div>
            </div>
          </div>

          {/* Legend */}
          <div className="legend">
            <div className="legend-item">
              <div className="legend-color legend-working"></div>
              <span>Working Day</span>
            </div>
            <div className="legend-item">
              <div className="legend-color legend-rdo"></div>
              <span>RDO</span>
            </div>
            <div className="legend-item">
              <div className="legend-color legend-holiday"></div>
              <span>Public Holiday</span>
            </div>
            <div className="legend-item">
              <div className="legend-color legend-closure"></div>
              <span>Xmas Closure</span>
            </div>
            <div className="legend-item">
              <div className="legend-color legend-weekend"></div>
              <span>Weekend</span>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="calendar-months">
            {months.map((monthDate, idx) => {
              const year = monthDate.getFullYear();
              const month = monthDate.getMonth();
              const days = getDaysInMonth(year, month);
              
              return (
                <div key={idx} className="month-container">
                  <h2 className="month-title">
                    {monthDate.toLocaleDateString('en-AU', { month: 'long', year: 'numeric' })}
                  </h2>
                  
                  <div className="calendar-grid">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                      <div key={day} className="day-header">
                        {day}
                      </div>
                    ))}
                    
                    {days.map((date, dayIdx) => {
                      if (!date) {
                        return <div key={`empty-${dayIdx}`} className="day-cell empty"></div>;
                      }
                      
                      const dateStr = formatDate(date);
                      const inRange = isInRange(date);
                      const dayType = getDayType(dateStr);
                      const holiday = publicHolidays[dateStr];
                      
                      let cellClass = 'day-cell';
                      if (inRange) {
                        cellClass += ` day-${dayType}`;
                      } else {
                        cellClass += ' day-out-of-range';
                      }
                      
                      return (
                        <div
                          key={dayIdx}
                          className={cellClass}
                          title={holiday || (dayType === 'closure' ? 'Christmas Closure' : '')}
                        >
                          <span className="day-number">{date.getDate()}</span>
                          {holiday && (
                            <span className="day-label">
                              {holiday.split(' ')[0]}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;