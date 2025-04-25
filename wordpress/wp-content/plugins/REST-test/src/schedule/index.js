// src/schedule/index.js
import { registerBlockType } from '@wordpress/blocks';
import { useEffect, useState } from '@wordpress/element';
import './style.scss';
import metadata from './block.json';

registerBlockType(metadata, {
    edit: CalendarBlock,
    save: () => null,
});

export function CalendarBlock() {
    const [schedule, setSchedule] = useState({});
    const [currentDate, setCurrentDate] = useState(new Date());
    const [days, setDays] = useState([]);
    const [timeOffs, setTimeOffs] = useState([]);

    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const monthStr = `${year}-${month}`;

    useEffect(() => {
        fetch(`http://localhost:5000/api/schedule?month=${monthStr}`)
            .then((res) => res.json())
            .then((data) => {
                const map = {};
                data.forEach((entry) => {
                    map[entry.date] = entry.employees;
                });
                setSchedule(map);
            })
            .catch((err) => console.error('API error:', err));
            fetch(`http://localhost:5000/api/day`)
            .then((res) => res.json())
            .then((data) => {
                setDays(data);
            })
            .catch((err) => console.error('API error:', err));
        fetch('http://localhost:5000/api/timeoff')
            .then(res => res.json())
            .then(data => {
                const approved = data.filter(req => req.requestStatus === 'APPROVED');
                setTimeOffs(approved);
            })
            .catch(err => console.error('Time Off API error:', err));
        
    }, [monthStr]);

    const getTimeOffsForDay = (dateStr) => {
        return timeOffs.filter(req => {
            return dateStr >= req.startDate && dateStr <= req.endDate;
        });
    };
    
    const handleDrop = (e, date) => {
        e.preventDefault();
        const data = e.dataTransfer.getData('text/plain');
        const employee = JSON.parse(data);
        const newShift = { 
            employeeDay : {
                employeeId: employee.employeeId,
                startTime: `${date}T09:00`,
                endTime: `${date}T17:00`,
                position: String(employee.defaultPos)
            },
            date: date
        };
        console.log("shift:")
        console.log(newShift);
        fetch('http://localhost:5000/api/employeeDay', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newShift),
        })
            .then((res) => res.json())
            .then(() => {
                setSchedule((prev) => {
                    const updated = { ...prev };
                    if (!updated[date]) updated[date] = [];
                    console.log("data:")
                    console.log(data);
                    updated[date].push({ name: employee.firstName, position: employee.defaultPos});
                    console.log (updated[date])
                    return updated;
                });
            });
    };
    const goToPreviousMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };
    
    const goToNextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };
    
    const daysInMonth = new Date(year, currentDate.getMonth() + 1, 0).getDate();
    const startDay = new Date(year, currentDate.getMonth(), 1).getDay();

    const calendarDays = [];

    // Fill empty slots before the 1st day
    for (let i = 0; i < startDay; i++) {
        calendarDays.push(<div className="calendar-cell empty" key={`empty-${i}`} />);
    }

    // Fill each day cell
    for (let day = 1; day <= daysInMonth; day++) {
        const dayKey = `${monthStr}-${String(day).padStart(2, '0')}`;
        const employees = schedule[dayKey] || [];
        const timeOffForDay = getTimeOffsForDay(dayKey);


        calendarDays.push(
            <a href={ `${window.location.origin}/WPSite/wordpress/managers_employee_day/?date=${dayKey}`} className="calendar-cell-link" key={dayKey}>
                <div className="calendar-cell"
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => handleDrop(e, dayKey)}>
                    <strong>{day}</strong>
                    {timeOffForDay.length > 0 && (
                        <div className="time-off-banner">
                            {timeOffForDay.map((req, i) => (
                                <div key={i} className="time-off-entry">
                                    {req.employeeName}
                                </div>
                            ))}
                        </div>
                    )}
                    <div className="cell-content">
                        {employees.length > 0 ? (
                            employees.map((emp, idx) => (
                                <div className={emp.position} key={idx}>
                                    {emp.name}
                                </div>
                            ))
                        ) : (
                            <em>No one scheduled</em>
                        )}
                    </div>
                </div>
            </a>
        );
    }

    return (
        <div>
            <div className="calendar-nav">
                <button onClick={goToPreviousMonth}>&lt; Previous</button>
                <h2>{currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</h2>
                <button onClick={goToNextMonth}>Next &gt;</button>
            </div>
    
            <div className="calendar-grid">
                {calendarDays}
            </div>
        </div>
    );
}

