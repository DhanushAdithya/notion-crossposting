import type { NextPage } from 'next';
import { useState, ChangeEvent, FormEvent } from 'react';

const Contact: NextPage = () => {
	const [form, setForm] = useState<{
		name: string;
		email: string;
		type: 'Query' | 'Feedback';
		message: string;
	}>({
		name: '',
		email: '',
		type: 'Query',
		message: '',
	});

	const handleInput = (
		e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
	): void => {
		setForm({
			...form,
			[e.target.name]: e.target.value,
		});
	};

	const handleSubmit = async (
		e: FormEvent<HTMLFormElement>
	): Promise<void> => {
		e.preventDefault();
		console.log(form);
	};

	return (
		<form onSubmit={handleSubmit}>
			<input
				name='name'
				value={form.name}
				onChange={handleInput}
				placeholder='Name'
			/>
			<input
				name='email'
				value={form.email}
				onChange={handleInput}
				placeholder='Email'
			/>
			<select value={form.type} name='type' onChange={handleInput}>
				<option value='Query'>Query</option>
				<option value='Feedback'>Feedback</option>
			</select>
			<textarea
				name='message'
				value={form.message}
				onChange={handleInput}
				placeholder='Message'
			/>
			<input type='submit' value='Send' />
		</form>
	);
};

export default Contact;
