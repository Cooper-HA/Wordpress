import { useEffect, useState } from '@wordpress/element';
import { registerBlockType } from '@wordpress/blocks';
import './style.scss';
import metadata from './block.json';

registerBlockType(metadata, {
    edit: EmployeeListBlock,
    save: () => null,
});

export default function EmployeeListBlock() {
    const [employees, setEmployees] = useState([]);

    useEffect(() => {
        fetch('http://localhost:5000/api/employee')
            .then(res => res.json())
            .then(data => setEmployees(data));
    }, []);

    function handleDragStart(e, employee) {
        const json = JSON.stringify(employee);
        e.dataTransfer.setData('text/plain', json);
        console.log(e);
    }

    return (
        <div className="employee-list">
            <h3>Employees</h3>
            {employees.map(emp => (
                <div
                    key={emp.employeeId}
                    className={`draggable-employee${emp.defaultPos ? ` employee-${emp.defaultPos.toLowerCase()}` : ''}`}
                    draggable
                    onDragStart={(e) => handleDragStart(e, emp)}
                >
                    {emp.firstName} {emp.lastName}
                </div>
            ))}
        </div>
    );
}