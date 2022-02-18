import { Client } from '@notionhq/client';
import { ListBlockChildrenResponse } from '@notionhq/client/build/src/api-endpoints';

import { Block, getDate } from './utils';

const notion = new Client({
	auth: process.env.NOTION_AUTH_TOKEN,
});

export const MarkDown = async (): Promise<Array<string>> => {
	const db = await notion.databases.query({
		database_id: process.env.NOTION_DATABASE_ID as string,
		filter: {
			and: [
				{
					property: 'Date',
					date: {
						equals: getDate(),
					},
				},
				{
					property: 'State',
					select: {
						equals: 'Scheduled',
					},
				},
			],
		},
	});

	const title: { [k: string]: string } = db.results.reduce(
		(acc: { [k: string]: string }, val) => {
			// @ts-ignore
			acc[val.id] = val.properties.Name.title[0].plain_text;
			return acc;
		},
		{}
	);

	const ids = Object.keys(title);
	const data = [];
	for (let i = 0; i < ids.length; i++) {
		const pageData: ListBlockChildrenResponse =
			await notion.blocks.children.list({
				block_id: ids[i],
			});
		data.push(pageData.results);
	}

	const markdowns: Array<string> = [];

	for (let i = 0; i < data.length; i++) {
		const pageMD: Array<string> = [];
		for (let j = 0; j < data[i].length; j++) {
			// @ts-ignore
			const { type } = data[i][j];
			// @ts-ignore
			const block = data[i][j][type];
			const res = new Block(type, block).blockContent();
			pageMD.push(res);
		}
		markdowns.push(pageMD.join('\n'));
	}

	return markdowns;
};
