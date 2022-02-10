import type { NextApiRequest, NextApiResponse } from 'next';
import { QueryDatabaseResponse } from '@notionhq/client/build/src/api-endpoints';
import { getDatabase } from '../../lib/notion';

export default async function handler(
	_: NextApiRequest,
	res: NextApiResponse<QueryDatabaseResponse>
) {
	const response = await getDatabase();
	res.status(200).json(response);
}
