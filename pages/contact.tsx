import type { NextPage } from 'next';
import { useState, ChangeEvent, FormEvent } from 'react';

import Input from '@components/input';

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
			<div className='md:w-2/3 md:rounded-xl w-full bg-white flex justify-center flex-col items-center'>
				<div className='flex h-full w-full flex-col p-5 pb-0'>
					<h1 className='font-dm text-center lg:text-4xl text-3xl font-bold'>
						Contact Us
					</h1>
					<h3 className='text-gray-400 mb-3 font-dm lg:text-xl text-center'>
						We are here for you! How can we help?
					</h3>
				</div>
				<form
					onSubmit={handleSubmit}
					className='flex flex-col w-full md:w-2/3 p-5 pt-0'
				>
					<Input
						label='Name'
						htmlFor='name'
						// @ts-ignore
						value={form.name}
						onChange={handleInput}
						tag='input'
					/>
					<Input
						label='Email'
						htmlFor='email'
						// @ts-ignore
						value={form.email}
						onChange={handleInput}
						tag='input'
						required
					/>
					<Input
						label='Type'
						htmlFor='type'
						// @ts-ignore
						value={form.type}
						onChange={handleInput}
						tag='select'
					/>
					<Input
						label='Message'
						htmlFor='message'
						// @ts-ignore
						value={form.message}
						onChange={handleInput}
						tag='textarea'
					/>
					<button
						className='p-2 hover:scale-[1.02] transition duration-300 rounded-lg mt-4 bg-black text-lg text-white flex items-center justify-center'
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
