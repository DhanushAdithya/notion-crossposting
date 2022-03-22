import type { NextApiRequest, NextApiResponse } from 'next';
import { getDate } from '../../lib/utils';

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<{
		msg: 'success' | 'error';
	}>
) {
	try {
		const { name, email, type, message } = JSON.parse(req.body);
		const response = await (
			await fetch('https://api.notion.com/v1/pages', {
				method: 'POST',
				headers: {
					'Notion-Version': '2022-02-22',
					'Content-Type': 'application/json',
					Authorization: `Bearer ${process.env.NOTION_AUTH_TOKEN}`,
				},
				body: JSON.stringify({
					parent: {
						database_id: process.env.NOTION_CONTACT_DATABASE_ID,
					},
					properties: {
						Name: {
							title: [
								{
									text: {
										content: name,
									},
								},
							],
						},
						Email: {
							rich_text: [
								{
									text: {
										content: email,
									},
								},
							],
						},
						Message: {
							rich_text: [
								{
									text: {
										content: message,
									},
								},
							],
						},
						Date: {
							date: {
								start: getDate(),
							},
						},
						Type: {
							select: {
								name: type,
							},
						},
					},
				}),
			})
		).json();
		res.status(200).json({
			msg: response.created_by.object === 'user' ? 'success' : 'error',
		});
	} catch (e) {
		res.status(400).json({
			msg: 'error',
		});
	}
}
