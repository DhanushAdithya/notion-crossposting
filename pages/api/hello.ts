import type { NextApiRequest, NextApiResponse } from 'next';

import { PagePropertiesType } from 'types/NotionTypes';
import { MarkDown } from '@lib/notion';

export default async function handler(
	_: NextApiRequest,
	res: NextApiResponse<Array<PagePropertiesType>>
) {
	const response = await MarkDown();
	res.status(200).json(response);
}
