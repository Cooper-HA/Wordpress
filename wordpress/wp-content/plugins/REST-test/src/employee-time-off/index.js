import { useEffect, useState } from '@wordpress/element';
import { registerBlockType } from '@wordpress/blocks';
import './style.scss';


import metadata from './block.json';

registerBlockType(metadata, {
    edit: EmployeeTimeOffBlock,
    save: () => null,
});

export default function EmployeeTimeOffBlock() {
    const [requests, setRequests] = useState([]);
    const [form, setForm] = useState({
        startDate: '',
        endDate: '',
        reason: ''
    });

    const userData = JSON.parse(localStorage.getItem('authData') || '{}');
    const employeeId = userData.userId;

    useEffect(() => {
        fetch(`http://localhost:5000/api/timeoff/employee/${employeeId}`)
            .then(res => res.json())
            .then(data => setRequests(data));
    }, [employeeId]);

    const handleInput = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const payload = {
            employeeId,
            startDate: form.startDate,
            endDate: form.endDate,
            reason: form.reason
        };

        fetch('http://localhost:5000/api/timeoff', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        })
        .then(res => res.ok ? res.json() : Promise.reject('Failed to submit'))
        .then(data => {
            setRequests(prev => [...prev, data]);
            setForm({ startDate: '', endDate: '', reason: '' });
        })
        .catch(console.error);
    };

    return (
        <div className="timeoff-block">
            <h3>Your Time Off Requests</h3>
            <ul>
                {requests.map((r, idx) => (
                    <li key={idx}>
                        <strong>{r.startDate} to {r.endDate}</strong> — {r.reason} ({r.requestStatus})
                    </li>
                ))}
            </ul>

            <h4>Request Time Off</h4>
            <form onSubmit={handleSubmit}>
                <label>
                    Start Date:
                    <input 
                        type="date" 
                        name="startDate" 
                        value={form.startDate} 
                        onChange={handleInput} 
                    required />
                </label>
                <label>
                    End Date:
                    <input
                        type="date"
                        name="endDate"
                        value={form.endDate}
                        onChange={handleInput}
                        required
                        min={form.startDate}
                    />
                </label>
                <label>
                    Reason:
                    <input type="text" name="reason" value={form.reason} onChange={handleInput} required />
                </label>
                <button type="submit">Submit</button>
            </form>
        </div>
    );
}
