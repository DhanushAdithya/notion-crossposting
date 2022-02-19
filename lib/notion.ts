import { Client } from '@notionhq/client';
import {
	ListBlockChildrenResponse,
	QueryDatabaseResponse,
} from '@notionhq/client/build/src/api-endpoints';

import { Block, getDate } from './utils';

const notion = new Client({
	auth: process.env.NOTION_AUTH_TOKEN,
});

export const MarkDown = async (): Promise<Array<string>> => {
	const db: QueryDatabaseResponse = await notion.databases.query({
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
		data.push(await getBlockObject(ids[i]));
	}
	return data;
};

const blockContent = async (detail: any): Promise<string> => {
	const { type, has_children } = detail;
	const block = detail[type];

	if (has_children) {
		const parent = new Block(type, block).blockContent();
		const child = await getBlockObject(detail.id);
		return (
			parent +
			'\n' +
			child
				.split('\n')
				.map(str => '  ' + str)
				.join('\n')
		);
	} else {
		const content = new Block(type, block).blockContent();
		return content;
	}
};

const getBlockObject = async (block_id: string): Promise<string> => {
	const blockObj: ListBlockChildrenResponse =
		await notion.blocks.children.list({
			block_id,
		});
	const md = [];
	for (let block of blockObj.results) {
		const content = await blockContent(block);
		md.push(content);
	}
	return md.join('\n');
};
