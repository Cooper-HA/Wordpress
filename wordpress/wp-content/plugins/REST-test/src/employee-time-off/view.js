import { render } from '@wordpress/element';
import EmployeeTimeOffBlock from './index';

window.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('employee-time-off-front');
    if (container) {
        render(<EmployeeTimeOffBlock />, container);
    }
});