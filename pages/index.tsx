import type { NextPage } from 'next';

import styles from '../styles/homepage.module.scss';

const Home: NextPage = () => {
	return (
		<div className='container'>
			<div className='flex flex-col w-1/2 pl-40 h-screen justify-center'>
				<h1 className='text-7xl font-black mb-1'>
					Next Level Crossposting with
					<span className={styles['notion-underline']}>Notion</span>
				</h1>
				<h3 className='text-2xl font-medium text-slate-500 mb-5'>
					With 3 easy steps schedule & manage your future blogs with ease
				</h3>
				<div className='flex'>
					<button className='mr-5 px-6 py-3 rounded-lg border-black border-2 hover:translate-y-[-3px] transition'>
						Get Started
					</button>
					<button className='px-6 py-3 rounded-lg hover:border-black border-2 hover:translate-y-[-3px] border-white transition'>
						Contribute
					</button>
				</div>
			</div>
			<div className='svg'></div>
		</div>
	);
};

export default Home;
