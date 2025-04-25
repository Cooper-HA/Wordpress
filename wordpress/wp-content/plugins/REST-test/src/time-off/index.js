import { useEffect, useState } from '@wordpress/element';
import { registerBlockType } from '@wordpress/blocks';

import './style.scss';


import metadata from './block.json';

registerBlockType(metadata, {
    edit: TimeOffRequestBlock,
    save: () => null,
});

const API_URL = 'http://localhost:5000/api/timeoff'; // Replace with your actual route

export default function TimeOffRequestBlock() {
    const [requests, setRequests] = useState([]);

    useEffect(() => {
        fetch(API_URL)
            .then((res) => res.json())
            .then((data) => {
                setRequests(data);             
                console.log(data);})
            .catch((err) => console.error('API fetch failed', err));
    }, []);

    const handleAction = async (req, status) => {
        try {
            const response = await fetch(`${API_URL}/${req.timeRequestId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ requestStatus: status }),
            });
    
            if (!response.ok) throw new Error('Failed to update request');
    
            const updatedRequest = await response.json();
            console.log('Updated request:', updatedRequest);
    
            setRequests((prev) =>
                prev.map((r) =>
                    r.timeRequestId === updatedRequest.timeRequestId ? updatedRequest : r
                )
            );
        } catch (err) {
            console.error(`Failed to ${status} request`, err);
        }
    };
    

    return (
        <div className="time-off-block">
            <h3>Time Off Requests</h3>
            <ul>
                {requests.filter((req) => req.requestStatus === 'PENDING').map((req) => (
                    
                    <li key={req.timeRequestId}>
                        <strong>{req.employeeName}:</strong>{req.startDate} - {req.endDate}
                        <div>
                            Reason: {req.reason}
                        </div>
                        <div>
                            Status: {req.requestStatus}
                        </div>
                        {req.requestStatus === 'PENDING' && (
                            <>
                                <button onClick={() => handleAction(req, 1)}>Approve</button>
                                <button onClick={() => handleAction(req, 2)}>Deny</button>
                            </>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}
