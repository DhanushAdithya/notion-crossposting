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
	| 'table_row';

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

export class Block {
	private type: BlockTypes;
	private block: any;

	constructor(type: BlockTypes, block: any) {
		this.type = type;
		this.block = block;
	}

	blockContent(): string {
		const text = this.block.text;
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
				return `![](${this.block.external.url})\n`;
			case 'table':
				return Array(this.block.table_width + 1)
					.fill('|')
					.join('---');
			case 'table_row':
				return this.createTableRows(this.block.cells);
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
