import type { NextPage } from 'next';
import { ChangeEvent, FormEvent, useState } from 'react';

import Input from '@components/input';

const Login: NextPage = () => {
	const [signup, setSignup] = useState<{
		name: string;
		email: string;
		password: string;
	}>({
		name: '',
		email: '',
		password: '',
	});

	const handleInput = (e: ChangeEvent<HTMLInputElement>): void => {
		setSignup({
			...signup,
			[e.target.name]: e.target.value,
		});
	};

	const handleSubmit = async (
		e: FormEvent<HTMLFormElement>
	): Promise<void> => {
		e.preventDefault();
		const response = await (
			await fetch('/api/signup', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(signup),
			})
		).json();
		console.log(response);
	};

	return (
		<div className='font-raleway w-full bg-black flex justify-center min-h-screen items-center'>
			<div className='lg:w-1/3 md:w-2/3 md:rounded-xl w-full bg-white flex justify-center flex-col items-center'>
				<div className='flex h-full w-full flex-col p-5 pb-0'>
					<h1 className='font-dm text-center lg:text-4xl text-3xl font-bold'>
						Sign Up
					</h1>
				</div>
				<form
					onSubmit={handleSubmit}
					className='flex flex-col w-full p-5 pt-0'
				>
					<Input
						tag='input'
						label='Name'
						htmlFor='name'
						// @ts-ignore
						value={signup.name}
						type='text'
						onChange={handleInput}
						required
					/>
					<Input
						tag='input'
						label='Email'
						htmlFor='email'
						// @ts-ignore
						value={signup.email}
						type='email'
						onChange={handleInput}
						required
					/>
					<Input
						tag='input'
						label='Password'
						htmlFor='password'
						// @ts-ignore
						value={signup.password}
						type='password'
						onChange={handleInput}
						required
					/>
					<button
						className='p-2 hover:scale-[1.02] transition duration-300 rounded-lg mt-4 bg-black text-lg text-white flex items-center justify-center'
						type='submit'
					>
						Sign Up
					</button>
				</form>
			</div>
		</div>
	);
};

export default Login;
