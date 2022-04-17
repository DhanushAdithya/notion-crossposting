import { SiMedium, SiHashnode } from 'react-icons/si';
import { FaDev } from 'react-icons/fa';

import type { PagePropertiesType } from '../types/NotionTypes';

const TagChip = (props: { tag: string; empty?: boolean }): JSX.Element => (
	<span className='mr-1 mb-1 inline-block border-2 px-2 py-0.5 border-black font-semibold rounded-full font-raleway text-xs'>
		{props.empty ? '' : '#'}
		{props.tag}
	</span>
);

const SitesIndicator = (props: { site: string }): JSX.Element | null => {
	switch (props.site) {
		case 'Medium':
			return (
				<div className='flex mr-1 items-center justify-center bg-black rounded-full w-11 h-11'>
					<SiMedium className='text-xl text-white' />
				</div>
			);
		case 'Dev.to':
			return (
				<div className='flex mr-1 items-center justify-center bg-black rounded-full w-11 h-11'>
					<FaDev className='text-xl text-white' />
				</div>
			);
		case 'Hashnode':
			return (
				<div className='flex mr-1 items-center justify-center bg-black rounded-full w-11 h-11'>
					<SiHashnode className='text-xl text-white' />
				</div>
			);
		default:
			return null;
	}
};

export const BlogCard = (props: PagePropertiesType): JSX.Element => {
	const { coverImage, title, brief, tags, sites } = props;
	return (
		<div className='w-96 rounded-2xl bg-white shadow-xl m-2 h-full transition hover:translate-y-[-5px]'>
			<div className='h-44'>
				<img
					className='rounded-t-xl w-full h-full'
					src={coverImage || 'https://wallpapercave.com/wp/wp2445846.jpg'}
				/>
			</div>
			<div className='flex flex-col h-full justify-between p-4'>
				<h2 className='text-2xl font-bold font-raleway'>
					{title || 'Untitled'}
				</h2>
				<p className='font-medium font-raleway text-gray-500'>
					{brief || 'No brief found.'}
				</p>
				<div className='mt-1'>
					{!!tags.length ? (
						tags.map(tag => <TagChip key={tag} tag={tag} />)
					) : (
						<TagChip tag='No tags' empty />
					)}
				</div>
				<div className='mt-3 flex justify-between items-end'>
					<div className='flex'>
						{sites.includes('All')
							? ['Medium', 'Dev.to', 'Hashnode'].map(site => (
									<SitesIndicator key={site} site={site} />
							  ))
							: sites.map(site => (
									<SitesIndicator key={site} site={site} />
							  ))}
					</div>
					<button className='py-2 px-4 bg-black rounded-md font-medium font-raleway text-white'>
						Publish
					</button>
				</div>
			</div>
		</div>
	);
};
