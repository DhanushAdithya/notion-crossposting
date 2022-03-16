import { Client } from '@notionhq/client';
import {
	ListBlockChildrenResponse,
	QueryDatabaseResponse,
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

	async getObject(): Promise<Array<string>> {
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
				id, // @ts-ignore
				//cover: {
				//external: { url: coverImage },
				//},
				// @ts-ignore
				properties: {
					//Series: {
					//select: { name: series },
					//},
					Sites: { multi_select: sites },
					Tags: { multi_select: tags },
					'Canonical URL': { url: canonicalUrl },
					//Republished: {
					//select: { name: republished },
					//},
					Brief: { rich_text: brief },
					Name: { title },
				},
			} = result;

			return {
				id,
				// @ts-ignore
				title: title.reduce((acc, val) => acc + val.plain_text, ''),
				//coverImage,
				//series,
				sites: sites.map((site: any) => site.name),
				tags: tags.map((tag: any) => tag.name),
				canonicalUrl,
				//republished: republished === 'true' ? true : false,
				// @ts-ignore
				brief: brief.reduce((acc, val) => acc + val.plain_text, ''),
			};
		});

		console.log(properties);

		//const title: { [k: string]: string } = pages.results.reduce(
		//(acc: { [k: string]: string }, val) => {
		//// @ts-ignore
		//acc[val.id] = val.properties.Name.title.reduce(
		//// @ts-ignore
		//(acc, val) => acc + val.plain_text,
		//''
		//);
		//return acc;
		//},
		//{}
		//);

		//const ids = Object.keys(title);
		const ids = properties.map(property => property.id);
		const data = [];
		for (let id of ids) {
			data.push(await this.getMarkdown(id));
		}
		return data;
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
		console.log(md.join('\n'));
		return md.join('\n').trim();
	}
}

const notion = new NotionClient({
	auth: process.env.NOTION_AUTH_TOKEN as string,
	database_id: process.env.NOTION_DATABASE_ID as string,
});

export const MarkDown = async (): Promise<Array<string>> => {
	return notion.getObject();
};
