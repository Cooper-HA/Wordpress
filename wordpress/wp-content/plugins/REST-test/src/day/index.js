import { useEffect, useState } from '@wordpress/element';
import { registerBlockType } from '@wordpress/blocks';
import './style.scss';
import metadata from './block.json';

registerBlockType(metadata, {
    edit: DayBlock,
    save: () => null,
});

export default function DayBlock() {
    const [employees, setEmployees] = useState([]);
    const [employeeNames, setEmployeeNames] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isCreating, setIsCreating] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const params = new URLSearchParams(window.location.search);
    const selectedDate = params.get('date');

    useEffect(() => {
        if (!selectedDate) {
            setError("No date selected.");
            setLoading(false);
            return;
        }

        // Fetch the day's schedule
        fetch(`http://localhost:5000/api/day`)
            .then((res) => {
                if (!res.ok) throw new Error("API error");
                return res.json();
            })
            .then(async (data) => {
                const day = data.find(d => d.date === selectedDate);
                const employeeList = day?.employeeDays || [];
                setEmployees(employeeList);

                // Fetch names for each employeeId
                const names = {};
                await Promise.all(
                    employeeList.map(async (emp) => {
                        const res = await fetch(`http://localhost:5000/api/employee/${emp.employeeId}`);
                        if (res.ok) {
                            const data = await res.json();
                            names[emp.employeeId] = `${data.firstName} ${data.lastName}`;
                        } else {
                            names[emp.employeeId] = "Unknown";
                        }
                    })
                );
                setEmployeeNames(names);
                setLoading(false);
            })
            .catch((err) => {
                setError("Failed to load employee schedule.");
                setLoading(false);
                console.error(err);
            });
    }, [selectedDate]);

    if (loading) return <p>Loading employee schedule...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="manager-employee-day">
            <h3>Schedule for {selectedDate}</h3>
            <button className="btn back-btn" onClick={() => window.location.href = `${window.location.origin}/managers/`}>← Back to Managers</button>
            <button className="btn create" onClick={() => setIsCreating(true)}>+ New Shift</button>
            {isCreating && (
                <CreatePopup 
                    date={selectedDate}
                    onClose={() => setIsCreating(false)} 
                    onCreate={handleCreate} 
                />
            )}

            {employees.length === 0 ? (
                <p>No employees scheduled.</p>
            ) : (
                <table className="employee-schedule-table">
                    <thead>
                        <tr>
                            <th>Employee</th>
                            <th>Position</th>
                            <th>Shift Start</th>
                            <th>Shift End</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {employees.map((emp) => (
                            <tr key={emp.employeeDayID}>
                                {editingId === emp.employeeDayID ? (
                                    <>
                                        <td>{employeeNames[emp.employeeId] || 'Loading...'}</td>
                                        <td>
                                            <input
                                                type="text"
                                                value={emp.position}
                                                onChange={(e) =>
                                                    setEmployees((prev) =>
                                                        prev.map((row) =>
                                                            row.employeeDayID === emp.employeeDayID
                                                                ? { ...row, position: e.target.value }
                                                                : row
                                                        )
                                                    )
                                                }
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="time"
                                                value={emp.startTime.slice(11, 16)}
                                                onChange={(e) =>
                                                    setEmployees((prev) =>
                                                        prev.map((row) =>
                                                            row.employeeDayID === emp.employeeDayID
                                                                ? { ...row, startTime: emp.startTime.slice(0, 11) + e.target.value }
                                                                : row
                                                        )
                                                    )
                                                }
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="time"
                                                value={emp.endTime.slice(11, 16)}
                                                onChange={(e) =>
                                                    setEmployees((prev) =>
                                                        prev.map((row) =>
                                                            row.employeeDayID === emp.employeeDayID
                                                                ? { ...row, endTime: emp.endTime.slice(0, 11) + e.target.value }
                                                                : row
                                                        )
                                                    )
                                                }
                                            />
                                        </td>
                                        <td>
                                            <button className="btn save" onClick={() => handleEditSave(emp)}>Save</button>
                                            <button className="btn cancel" onClick={() => setEditingId(null)}>Cancel</button>
                                        </td>
                                    </>
                                ) : (
                                    <>
                                        <td>{employeeNames[emp.employeeId] || 'Loading...'}</td>
                                        <td>{emp.position}</td>
                                        <td>{formatTime(emp.startTime)}</td>
                                        <td>{formatTime(emp.endTime)}</td>
                                        <td>
                                            <button className="btn edit" onClick={() => setEditingId(emp.employeeDayID)}>Edit</button>
                                            <button className="btn delete" onClick={() => handleDelete(emp.employeeDayID)}>Delete</button>
                                        </td>
                                    </>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>

            )}
        </div>
    );
}

function formatTime(dateTimeStr) {
    const date = new Date(dateTimeStr);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}
async function handleEditSave(updatedEmp) {
    await fetch(`http://localhost:5000/api/employeeDay/${updatedEmp.employeeDayID}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedEmp),
    });
    refresh();
}

async function handleDelete(employeeDayID) {
    await fetch(`http://localhost:5000/api/employeeDay/${employeeDayID}`, {
        method: 'DELETE',
    });
    refresh();
}

async function handleCreate(newEmp) {
    console.log(newEmp);
    await fetch(`http://localhost:5000/api/employeeDay`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        
        body: JSON.stringify(newEmp),
    });
    refresh();
}

function refresh() {
    window.location.reload();
}

function EditRow({ emp, onSave, onCancel }) {
    const [start, setStart] = useState(emp.startTime);
    const [end, setEnd] = useState(emp.endTime);
    const [position, setPosition] = useState(emp.position);

    return (
        <div>
            <input type="time" value={start.slice(11, 16)} onChange={e => setStart(emp.startTime.slice(0,11) + e.target.value)} />
            <input type="time" value={end.slice(11, 16)} onChange={e => setEnd(emp.endTime.slice(0,11) + e.target.value)} />
            <input type="text" value={position} onChange={e => setPosition(e.target.value)} />
            <button onClick={() => onSave({ ...emp, startTime: start, endTime: end, position })}>Save</button>
            <button onClick={onCancel}>Cancel</button>
        </div>
    );
}

function CreatePopup({ date, onClose, onCreate }) {
    const [employeeId, setEmployeeId] = useState("");
    const [employeeOptions, setEmployeeOptions] = useState([]);
    const [start, setStart] = useState("09:00");
    const [end, setEnd] = useState("17:00");
    const [position, setPosition] = useState("");
    const [dayId, setDayId] = useState(null);

    useEffect(() => {
        // Fetch employees
        fetch('http://localhost:5000/api/employee')
            .then(res => res.json())
            .then(data => setEmployeeOptions(data))
            .catch(err => console.error('Failed to load employees:', err));

        // Fetch Day ID
        async function fetchDayId() {
            try {
                const res = await fetch('http://localhost:5000/api/day');
                if (!res.ok) throw new Error('Failed to fetch days');
                const days = await res.json();
                const match = days.find(d => d.date === date);
                if (match) setDayId(match.dayId);
                else console.error('No day found for this date:', date);
            } catch (err) {
                console.error('Error fetching day ID:', err);
            }
        }

        fetchDayId();
    }, [date]);

    function handleSubmit() {
        const startTime = `${date}T${start}`;
        const endTime = `${date}T${end}`;
        if (!employeeId || !dayId || !position) return;

        onCreate({
            employeeId: parseInt(employeeId),
            startTime,
            endTime,
            position,
            dayId,
        });
    }

    return (
        <div className="popup">
            <h4>Create New Shift</h4>
            <div className="popup-form">
                <label>
                    Employee:
                    <select
                        value={employeeId}
                        onChange={(e) => setEmployeeId(e.target.value)}
                    >
                        <option value="">-- Select Employee --</option>
                        {employeeOptions.map(emp => (
                            <option key={emp.employeeId} value={emp.employeeId}>
                                {emp.firstName} {emp.lastName}
                            </option>
                        ))}
                    </select>
                </label>
    
                <label>
                    Start Time:
                    <input type="time" value={start} onChange={e => setStart(e.target.value)} />
                </label>
    
                <label>
                    End Time:
                    <input type="time" value={end} onChange={e => setEnd(e.target.value)} />
                </label>
    
                <label>
                    Position:
                    <input type="text" placeholder="Position" value={position} onChange={e => setPosition(e.target.value)} />
                </label>
    
                <div className="popup-buttons">
                    <button className="btn primary" onClick={handleSubmit} disabled={!dayId || !employeeId || !position}>Create</button>
                    <button className="btn secondary" onClick={onClose}>Cancel</button>
                </div>
            </div>
        </div>
    );
    
}
