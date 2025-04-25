import { render } from '@wordpress/element';
import TimeOffRequestBlock from './index';

window.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('employee-list-front');
    if (container) {
        render(<TimeOffRequestBlock />, container);
    }
});