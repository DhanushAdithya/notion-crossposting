import type { NextPage } from 'next';
import { useState, ChangeEvent, FormEvent } from 'react';

const Input = (options: {
	label: string;
	htmlFor: string;
	value: string;
	onChange: (e: any) => void;
	type: 'text' | 'select' | 'textarea';
}) => {
	return (
		<>
			<label htmlFor={options.htmlFor} className='mt-4 font-semibold mb-1'>
				{options.label}
			</label>
			{options.type === 'text' ? (
				<input
					className='p-2 transition duration-300 px-3 focus:border-black outline-none border-2 border-slate-400 rounded-md'
					name={options.htmlFor}
					id={options.htmlFor}
					value={options.value}
					onChange={options.onChange}
					placeholder={`Enter ${options.label}`}
					required
				/>
			) : options.type === 'textarea' ? (
				<textarea
					className='p-2 transition duration-300 px-3 focus:border-black outline-none border-2 border-slate-400 rounded-md resize-none'
					name={options.htmlFor}
					id={options.htmlFor}
					value={options.value}
					onChange={options.onChange}
					placeholder={`Enter ${options.label}`}
				/>
			) : (
				<select
					value={options.value}
					name={options.htmlFor}
					id={options.htmlFor}
					onChange={options.onChange}
					className='p-2 transition duration-300 focus:border-black outline-none bg-white rounded-md border-2 border-slate-400'
				>
					<option value='' disabled>
						Select the type
					</option>
					<option value='Query'>Query</option>
					<option value='Feedback'>Feedback</option>
				</select>
			)}
		</>
	);
};

const Contact: NextPage = () => {
	const [form, setForm] = useState<{
		name: string;
		email: string;
		type: '' | 'Query' | 'Feedback';
		message: string;
	}>({
		name: '',
		email: '',
		type: '',
		message: '',
	});
	const [isSending, setSending] = useState<boolean>(false);

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
		setSending(true);
		e.preventDefault();
		const response: {
			msg: 'success' | 'error';
		} = await (
			await fetch('/api/contact', {
				method: 'POST',
				body: JSON.stringify(form),
			})
		).json();
		setSending(false);
		setForm({
			name: '',
			email: '',
			type: '',
			message: '',
		});
		console.log(response.msg);
	};

	return (
		<div className='w-full bg-black flex justify-center min-h-screen items-center'>
			<div className='md:w-2/3 md:rounded-2xl w-full bg-white flex justify-center items-center flex-col p-5'>
				<h1 className='text-3xl font-bold'>Drop us a line</h1>
				<h3 className='text-gray-500 mb-3'>
					We are here for you! How can we help?
				</h3>
				<form
					onSubmit={handleSubmit}
					className='flex flex-col w-full md:w-96'
				>
					<Input
						label='Name'
						htmlFor='name'
						value={form.name}
						onChange={handleInput}
						type='text'
					/>
					<Input
						label='Email'
						htmlFor='email'
						value={form.email}
						onChange={handleInput}
						type='text'
					/>
					<Input
						label='Type'
						htmlFor='type'
						value={form.type}
						onChange={handleInput}
						type='select'
					/>
					<Input
						label='Message'
						htmlFor='message'
						value={form.message}
						onChange={handleInput}
						type='textarea'
					/>
					<button
						className='p-2 hover:scale-105 transition duration-300 rounded-lg my-3 mt-6 bg-black text-lg text-white flex items-center justify-center'
						type='submit'
					>
						{isSending ? (
							<>
								<div className='w-5 h-5 border-4 rounded-full border-t-gray-400 border-gray-700 mx-2 animate-spin'></div>{' '}
								Sending
							</>
						) : (
							'Send Message'
						)}
					</button>
				</form>
			</div>
		</div>
	);
};

export default Contact;
