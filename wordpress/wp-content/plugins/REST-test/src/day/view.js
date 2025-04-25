import { render } from '@wordpress/element';
import DayBlock from './index';

window.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('day-list-front');
    if (container) {
        render(<DayBlock />, container);
    }
});