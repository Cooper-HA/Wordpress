import { registerBlockType } from '@wordpress/blocks';
import { useEffect, useState } from '@wordpress/element';
import './style.scss';
import metadata from './block.json';


registerBlockType(metadata, {
    edit: EmployeeScheduleBlock,
    save: () => null,
});

export function EmployeeScheduleBlock() {
    const [shifts, setShifts] = useState({});
    const [currentDate, setCurrentDate] = useState(new Date());

    const userData = JSON.parse(localStorage.getItem('authData') || '{}');
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const monthStr = `${year}-${month}`;
    console.log("User Data:", userData);
    useEffect(() => {
        fetch(`http://localhost:5000/api/employee/user?employeeId=${userData.userId}&month=${monthStr}`) 
            .then(res => res.json())
            .then(data => {
                const map = {};
                console.log(`http://localhost:5000/api/employee/user?employeeId=${userData.userId}&month=${monthStr}`);
                data.forEach(entry => {
                    const dateKey = entry.dayDate;
                    if (!map[dateKey]) map[dateKey] = [];
                    map[dateKey].push(entry);
                });
                setShifts(map);
            });
    }, [monthStr]);

    const goToPreviousMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const goToNextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const daysInMonth = new Date(year, currentDate.getMonth() + 1, 0).getDate();
    const startDay = new Date(year, currentDate.getMonth(), 1).getDay();

    const calendarDays = [];

    for (let i = 0; i < startDay; i++) {
        calendarDays.push(<div className="calendar-cell empty" key={`empty-${i}`} />);
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const dayKey = `${monthStr}-${String(day).padStart(2, '0')}`;
        const myShifts = shifts[dayKey] || [];

        calendarDays.push(
            <div className="calendar-cell" key={dayKey}>
                <strong>{day}</strong>
                <div className="cell-content">
                    {myShifts.length > 0 ? (
                        myShifts.map((shift, idx) => (
                            <div className={shift.position} key={idx}>
                                {shift.position} — {shift.startTime.slice(11, 16)} to {shift.endTime.slice(11, 16)}
                            </div>
                        ))
                    ) : (
                        <em>Off</em>
                    )}
                </div>
            </div>
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
