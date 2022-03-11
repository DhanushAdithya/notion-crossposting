import { NOTION_IMAGE_URL } from './constants';

export const getDate = (): string => {
	const date = new Date(Date.now());
	const dateFormat = new Intl.DateTimeFormat('en-ca').format(date);
	return dateFormat;
};

type BlockTypes =
	| 'paragraph'
	| 'heading_1'
	| 'heading_2'
	| 'heading_3'
	| 'bulleted_list_item'
	| 'numbered_list_item'
	| 'code'
	| 'image'
	| 'video'
	| 'quote'
	| 'divider'
	| 'table'
	| 'table_row'
	| 'embed'
	| 'bookmark'
	| 'video';

type ResultType = Array<{
	type: 'text';
	text: {
		content: string;
		link: {
			url: string;
		} | null;
	};
	annotations: {
		bold: boolean;
		italic: boolean;
		strikethrough: boolean;
		underline: boolean;
		code: boolean;
		color: string;
	};
	plain_text: string;
	href: string | null;
}>;

type Detail = {
	type: BlockTypes;
	block: any;
	site: 'medium' | 'dev.to' | 'hashnode';
	id: string;
};

export class Block {
	private type: BlockTypes;
	private block: any;
	private site?: 'medium' | 'dev.to' | 'hashnode';
	private id: string;

	constructor(detail: Detail) {
		this.type = detail.type;
		this.block = detail.block;
		this.site = detail.site;
		this.id = detail.id;
	}

	blockContent(): string {
		const text = this.block.rich_text;
		switch (this.type) {
			case 'heading_1':
				return `# ${this.createText(text)}\n`;
			case 'heading_2':
				return `## ${this.createText(text)}\n`;
			case 'heading_3':
				return `### ${this.createText(text)}\n`;
			case 'paragraph':
				return this.createText(text) + '\n';
			case 'quote':
				return `> ${this.createText(text)}\n`;
			case 'bulleted_list_item':
				return `* ${this.createText(text)}\n`;
			case 'numbered_list_item':
				return `1. ${this.createText(text)}\n`;
			case 'divider':
				return '***\n';
			case 'code':
				return (
					'```' +
					this.block.language +
					'\n' +
					this.createText(text) +
					'\n' +
					'```' +
					'\n'
				);
			case 'image':
				switch (this.block.type) {
					case 'external':
						return `![${this.createText(this.block.caption)}](${
							this.block.external.url
						})\n`;
					default:
						return `![${this.createText(this.block.caption)}](${
							NOTION_IMAGE_URL +
							encodeURIComponent(
								this.block[this.block.type].url.split('?')[0]
							) +
							'?table=block&id=' +
							this.id
						})\n`;
				}
			case 'table':
				return Array(this.block.table_width + 1)
					.fill('|')
					.join('---');
			case 'table_row':
				return this.createTableRows(this.block.cells);
			case 'embed':
			case 'bookmark':
			case 'video':
				switch (this.site) {
					case 'dev.to':
						return `{% embed ${
							this.block[this.block.type]?.url ?? this.block.url
						} %}\n`;
					case 'hashnode':
						return `%[${
							this.block[this.block.type]?.url ?? this.block.url
						}]\n`;
					default:
						return `[](${
							this.block[this.block.type]?.url ?? this.block.url
						})\n`;
				}
			default:
				return '';
		}
	}

	private createTableRows(cells: Array<any>): string {
		const row: Array<string> = [];
		for (let cell of cells) row.push(this.createText(cell));
		return '|' + row.join('|') + '|';
	}

	private createText(textArray: ResultType): string {
		return textArray
			.map(part => {
				const {
					annotations: { bold, italic, code },
					text,
				} = part;
				let rawText = new Formatting(text.content.trim(), text.link?.url);
				if (bold) rawText.bold();
				if (italic) rawText.italic();
				if (code) rawText.code();
				if (text.link) rawText.link();

				return rawText.getText;
			})
			.join(' ');
	}
}

class Formatting {
	text: string;
	href?: string;

	constructor(text: string, href?: string) {
		this.text = text;
		this.href = href;
	}

	bold(): void {
		this.text = `**${this.text}**`;
	}

	italic(): void {
		this.text = `*${this.text}*`;
	}

	code(): void {
		this.text = `\`${this.text}\``;
	}

	link(): void {
		this.text = `[${this.text}](${this.href})`;
	}

	get getText() {
		return this.text;
	}
}
