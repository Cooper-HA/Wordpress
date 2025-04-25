import { render } from '@wordpress/element';
import TimeOffRequestBlock from './index';

window.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('time-off-front');
    if (container) {
        render(<TimeOffRequestBlock />, container);
    }
});