import type { NextApiRequest, NextApiResponse } from 'next';

import { MarkDown } from '../../lib/notion';

export default async function handler(
	_: NextApiRequest,
	res: NextApiResponse<
		Array<{
			id: string;
			title: string;
			coverImage: any;
			republished: boolean;
			brief: string;
			tags: Array<string>;
			series: any;
			canonicalUrl: string;
			content: string;
		}>
	>
) {
	const response = await MarkDown();
	res.status(200).json(response);
}
