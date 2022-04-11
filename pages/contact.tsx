import type { NextPage } from 'next';
import { useState, ChangeEvent, FormEvent } from 'react';

type InputProps = {
	label: string;
	htmlFor: string;
	value: string;
	onChange: (e: any) => void;
	type: 'text' | 'select' | 'textarea';
};

const Input = (options: InputProps) => {
	const { label, htmlFor, type, value, onChange, ...props } = options;
	return (
		<>
			<label htmlFor={htmlFor} className='mt-4 font-semibold mb-0.5'>
				{label}
			</label>
			{type === 'text' ? (
				<input
					className='p-2 transition duration-300 px-3 text-sm focus:border-black outline-none border-2 border-slate-400 rounded-md'
					name={htmlFor}
					id={htmlFor}
					value={value}
					onChange={onChange}
					placeholder={`Enter ${label}`}
					{...props}
				/>
			) : type === 'textarea' ? (
				<textarea
					className='p-2 transition duration-300 px-3 text-sm focus:border-black outline-none border-2 border-slate-400 rounded-md resize-none'
					name={htmlFor}
					id={htmlFor}
					value={value}
					onChange={onChange}
					rows={5}
					placeholder={`Enter ${label}`}
					{...props}
				/>
			) : (
				<select
					value={value}
					name={htmlFor}
					id={htmlFor}
					onChange={onChange}
					className='p-2 border-r-8 border-transparent font-raleway transition duration-300 text-sm focus:ring-black ring-2 ring-slate-400 outline-none bg-white rounded-md'
					{...props}
				>
					<option value='' disabled>
						Select the {htmlFor}
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
		<div className='font-raleway w-full bg-black flex justify-center min-h-screen items-center'>
			<div className='md:w-2/3 md:rounded-xl w-full bg-white flex justify-center flex-col lg:flex-row items-start'>
				<div className='lg:w-1/2 w-full flex h-full flex-col p-5 pb-0'>
					<h1 className='font-dm text-center lg:text-8xl text-3xl font-bold lg:text-left'>
						Contact Us
					</h1>
					<h3 className='text-gray-500 mb-3 font-dm lg:text-3xl text-center lg:text-left'>
						We are here for you! How can we help?
					</h3>
				</div>
				<form
					onSubmit={handleSubmit}
					className='flex flex-col w-full lg:w-1/2 p-5 pt-0'
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
						// @ts-ignore
						required
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
						className='p-2 hover:scale-105 transition duration-300 rounded-lg mt-4 bg-black text-lg text-white flex items-center justify-center'
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
