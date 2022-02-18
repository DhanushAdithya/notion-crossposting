import type { NextApiRequest, NextApiResponse } from 'next';

import { MarkDown } from '../../lib/notion';

export default async function handler(
	_: NextApiRequest,
	res: NextApiResponse<Array<string>>
) {
	const response = await MarkDown();
	res.status(200).json(response);
}
