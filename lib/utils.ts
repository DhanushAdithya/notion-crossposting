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
				return `# ${this.createText(text)}`;
			case 'heading_2':
				return `## ${this.createText(text)}`;
			case 'heading_3':
				return `### ${this.createText(text)}`;
			case 'paragraph':
				return this.createText(text);
			case 'quote':
				return `> ${this.createText(text)}`;
			case 'bulleted_list_item':
				return `* ${this.createText(text)}`;
			case 'numbered_list_item':
				return `1. ${this.createText(text)}`;
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
			default:
				return '';
		}
	}

	private createText(textArray: ResultType): string {
		return (
			textArray
				.map(part => {
					const {
						annotations: { bold, italic, code },
						text,
					} = part;
					let rawText = new Formatting(
						text.content.trim(),
						text.link?.url
					);
					if (bold) rawText.bold();
					if (italic) rawText.italic();
					if (code) rawText.code();
					if (text.link) rawText.link();

					return rawText.getText;
				})
				.join(' ') + '\n'
		);
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
