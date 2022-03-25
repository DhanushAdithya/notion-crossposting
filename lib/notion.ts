import { Client } from '@notionhq/client';
import {
	ListBlockChildrenResponse,
	QueryDatabaseResponse,
	SearchResponse,
} from '@notionhq/client/build/src/api-endpoints';

import { Block, getDate } from './utils';

type NotionClientType = {
	auth: string;
	database_id: string;
};

class NotionClient {
	private notion: Client;
	private database_id: string;

	constructor(client: NotionClientType) {
		this.notion = new Client({ auth: client.auth });
		this.database_id = client.database_id;
	}

	async getDatabase(): Promise<{
		id: string;
		title: string;
	}> {
		const response: SearchResponse = await this.notion.search({
			filter: {
				property: 'object',
				value: 'database',
			},
		});

		const database = response.results[0];

		return {
			id: database.id,
			// @ts-ignore
			title: database.title.reduce((acc, val) => acc + val.plain_text, ''),
		};
	}

	async getObject(): Promise<
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
	> {
		const pages: QueryDatabaseResponse = await this.notion.databases.query({
			database_id: this.database_id,
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

		const properties = pages.results.map(result => {
			const {
				id,
				// @ts-ignore
				cover,
				// @ts-ignore
				properties: {
					Series: { select: seriesSelect },
					Republished: { select: republishedSelect },
					Sites: { multi_select: sites },
					Tags: { multi_select: tags },
					'Canonical URL': { url: canonicalUrl },
					Brief: { rich_text: brief },
					Name: { title },
				},
			} = result;
			// @ts-ignore
			const coverImage = cover?.external?.url;
			// @ts-ignore
			const series = seriesSelect?.name;
			// @ts-ignore
			const republished = republishedSelect?.name;

			return {
				id,
				title: title.reduce(
					(acc: string, val: { plain_text: string }) =>
						acc + val.plain_text,
					''
				) as string,
				coverImage: coverImage ?? '',
				series: series ?? '',
				sites: sites.map((site: any) => site.name) as Array<string>,
				tags: tags.map((tag: any) => tag.name) as Array<string>,
				canonicalUrl: canonicalUrl as string,
				republished: republished === 'true' ? true : false,
				brief: brief.reduce(
					(acc: string, val: { plain_text: string }) =>
						acc + val.plain_text,
					''
				) as string,
			};
		});

		const ids = properties.map(property => property.id);
		const data: Array<string> = [];
		for (let id of ids) {
			data.push(await this.getMarkdown(id));
		}
		return properties.map((property, i) => ({
			...property,
			content: data[i],
		}));
	}

	private async getBlockContent(detail: any): Promise<string> {
		const { type, has_children, id } = detail;
		const block = detail[type];

		const parent = new Block({
			type,
			id,
			block,
			site: 'hashnode',
		}).blockContent();

		if (has_children) {
			const child = await this.getMarkdown(id);
			if (type === 'table') {
				const rows = child.split('\n');
				rows.splice(1, 0, await parent);
				return rows.join('\n') + '\n';
			} else {
				return (
					(await parent) +
					'\n' +
					child
						.split('\n')
						.map(str => '  ' + str)
						.join('\n')
				);
			}
		} else {
			return parent;
		}
	}

	private async getMarkdown(block_id: string): Promise<string> {
		const blockObj: ListBlockChildrenResponse =
			await this.notion.blocks.children.list({
				block_id,
			});
		const md = [];
		for (let block of blockObj.results) {
			md.push(await this.getBlockContent(block));
		}
		return md.join('\n').trim();
	}
}

const notion = new NotionClient({
	auth: process.env.NOTION_AUTH_TOKEN as string,
	database_id: process.env.NOTION_DATABASE_ID as string,
});

export const MarkDown = async (): Promise<
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
> => {
	return notion.getObject();
};
