import { Client } from '@notionhq/client';
import { QueryDatabaseResponse } from '@notionhq/client/build/src/api-endpoints';

import { getDate } from './utils';

const notion = new Client({
	auth: process.env.NOTION_AUTH_TOKEN,
});

export const getDatabase = async (): Promise<QueryDatabaseResponse> => {
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
	return db;
};
