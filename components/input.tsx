type InputProps = {
	label: string;
	htmlFor: string;
	tag: 'input' | 'select' | 'textarea';
};

const Input = (options: InputProps) => {
	const { label, htmlFor, tag, ...props } = options;
	return (
		<>
			<label htmlFor={htmlFor} className='mt-4 font-semibold mb-0.5'>
				{label}
			</label>
			{tag === 'input' ? (
				<input
					className='p-2 transition duration-300 px-3 text-sm focus:border-black outline-none border-2 border-slate-400 rounded-md'
					name={htmlFor}
					id={htmlFor}
					placeholder={`Enter ${label}`}
					{...props}
				/>
			) : tag === 'textarea' ? (
				<textarea
					className='rounded-md p-2 transition duration-300 px-3 text-sm focus:border-black outline-none border-2 border-slate-400 rounded-md resize-none'
					name={htmlFor}
					id={htmlFor}
					rows={5}
					placeholder={`Enter ${label}`}
					{...props}
				/>
			) : (
				<select
					name={htmlFor}
					id={htmlFor}
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

export default Input;
