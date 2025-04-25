/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-i18n/
 */
import { __ } from '@wordpress/i18n';

/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
import { useBlockProps } from '@wordpress/block-editor';

import { useState } from '@wordpress/element';


/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * Those files can contain any CSS code that gets applied to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import './editor.scss';

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
 *
 * @return {Element} Element to render.
 */
export default function Edit() {
	const blockProps = useBlockProps();
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState(null);

	const handleSubmit = async (e) => {
		e.preventDefault();

		try {
			const response = await fetch('http://127.0.0.1:5000/api/Employee', {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ username, password }),
			});

			const data = await response.json();

			if (response.ok) {
				// Redirect to dashboard (replace URL as needed)
				window.location.href = '/dashboard/';
			} else {
				setError(data.message || 'Login failed');
			}
		} catch (err) {
			setError('An error occurred while logging in.');
			console.error(err);
		}
	};

	return (
		<div { ...blockProps }>
			<form onSubmit={ handleSubmit }>
				<label htmlFor="username">Username:</label>
				<input
					type="text"
					id="username"
					value={ username }
					onChange={ (e) => setUsername(e.target.value) }
				/>
				<br />
				<label htmlFor="password">Password:</label>
				<input
					type="password"
					id="password"
					value={ password }
					onChange={ (e) => setPassword(e.target.value) }
				/>
				<br />
				<button type="submit">Login</button>
			</form>
			{error && <p style={{ color: 'red' }}>{error}</p>}
		</div>
	);
}
