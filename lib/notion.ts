import { Client } from '@notionhq/client';
import type {
	ListBlockChildrenResponse,
	QueryDatabaseResponse,
	SearchResponse,
} from '@notionhq/client/build/src/api-endpoints';

import type {
	NotionClientType,
	PagePropertiesType,
} from '../types/NotionTypes';
import { Block, getDate } from './utils';

class NotionClient {
	private notion: Client;
	private database_id: string;

	constructor(client: NotionClientType) {
		this.notion = new Client({ auth: client.auth });
		this.database_id = client.database_id;
	}

	async getPublished(): Promise<Array<PagePropertiesType>> {
		const pages = await this.getPage('Published');
		const properties = pages.results.map(result =>
			this.getPageDetails(result)
		);
		return properties;
	}

	async getDraft(): Promise<Array<PagePropertiesType>> {
		const pages = await this.getPage('Draft');
		const properties = pages.results.map(result =>
			this.getPageDetails(result)
		);
		return properties;
	}

	async getScheduled(): Promise<Array<PagePropertiesType>> {
		const pages = await this.getPage('Scheduled');
		const properties = pages.results.map(result =>
			this.getPageDetails(result)
		);
		return properties;
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

	private getPageDetails(result: any): PagePropertiesType {
		const {
			id,
			cover,
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
		const coverImage = cover?.external?.url;
		const series = seriesSelect?.name;
		const republished = republishedSelect?.name;

		return {
			id,
			title: title.reduce(
				(acc: string, val: { plain_text: string }) => acc + val.plain_text,
				''
			),
			coverImage: coverImage ?? '',
			series: series ?? '',
			sites: sites.map((site: any) => site.name) as Array<string>,
			tags: tags.map((tag: any) => tag.name) as Array<string>,
			canonicalUrl: canonicalUrl as string,
			republished: republished === 'true' ? true : false,
			brief: brief.reduce(
				(acc: string, val: { plain_text: string }) => acc + val.plain_text,
				''
			),
		};
	}

	private async getPage(
		state: 'Published' | 'Draft' | 'Scheduled',
		today: boolean = false
	): Promise<QueryDatabaseResponse> {
		const pages = await this.notion.databases.query({
			database_id: this.database_id,
			filter: today
				? {
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
									equals: state,
								},
							},
						],
				  }
				: {
						property: 'State',
						select: {
							equals: state,
						},
				  },
		});

		return pages;
	}

	async getObject(): Promise<Array<PagePropertiesType>> {
		const pages = await this.getPage('Scheduled', true);
		const properties = pages.results.map(result =>
			this.getPageDetails(result)
		);

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

export const MarkDown = async (): Promise<Array<PagePropertiesType>> => {
	return notion.getObject();
};
