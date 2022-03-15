import { IMAGE_FORMAT, EMBED_REGEXS } from './constants';

export const getDate = (): string => {
	const date = new Date(Date.now());
	const dateFormat = new Intl.DateTimeFormat('en-ca').format(date);
	return dateFormat;
};

const createImageUrl = async (url: string): Promise<string> => {
	if (IMAGE_FORMAT.test(url)) {
		return url;
	} else {
		const { secure_url, format } = await (
			await fetch(
				`https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload`,
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						api_key: process.env.CLOUDINARY_API_KEY,
						file: url,
						upload_preset: process.env.CLOUDINARY_UPLOAD_PRESET,
					}),
				}
			)
		).json();
		return secure_url.replace(new RegExp(`\.(${format})$`), '.png');
	}
};

const createEmbed = (url: string): string => {
	for (const [embedType, regex] of Object.entries(EMBED_REGEXS)) {
		if (regex.test(url))
			return `{% ${embedType} ${url.replace(regex, '$1')} %}\n`;
	}
	return `[${url}](${url})\n`;
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
	| 'quote'
	| 'divider'
	| 'table'
	| 'table_row'
	| 'embed'
	| 'bookmark'
	| 'video'
	| 'equation'
	| 'callout';

type RichTextType = Array<{
	type: 'text' | 'mention' | 'equation';
	text: {
		content: string;
		link: {
			url: string;
		} | null;
	};
	equation: {
		expression: string;
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

type Sites = 'medium' | 'dev.to' | 'hashnode';

type Detail = {
	type: BlockTypes;
	block: any;
	site: Sites;
	id: string;
};

export class Block {
	private type: BlockTypes;
	private block: any;
	private site: Sites;
	private id: string;

	constructor(detail: Detail) {
		this.type = detail.type;
		this.block = detail.block;
		this.site = detail.site;
		this.id = detail.id;
	}

	async blockContent(): Promise<string> {
		const text: RichTextType = this.block.rich_text;
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
					'\n```\n'
				);
			case 'image':
				return `![${this.createText(
					this.block.caption
				)}](${await createImageUrl(this.block[this.block.type].url)})\n`;
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
						return createEmbed(
							this.block[this.block.type]?.url ?? this.block.url
						);
					case 'hashnode':
						return `%[${
							this.block[this.block.type]?.url ?? this.block.url
						}]\n`;
					default:
						const url =
							this.block[this.block.type]?.url ?? this.block.url;
						return `[${url}](${url})\n`;
				}
			case 'equation':
				switch (this.site) {
					case 'dev.to':
						return (
							'{% katex %}\n' +
							this.block.expression +
							'\n{% endkatex %}\n'
						);
					case 'hashnode':
						return '$$\n' + this.block.expression + '\n$$\n';
					default:
						return `![${this.block.expression.replace(
							'\n',
							' '
						)}](${await createImageUrl(
							'https://math.vercel.app?from=' +
								this.block.expression.replace('\n', ' ')
						)})`;
				}
			case 'callout':
				return `> ${this.block.icon.emoji}\n> ${this.createText(
					text
				).replace('\n', ' ')}`;
			default:
				return '';
		}
	}

	private createTableRows(cells: Array<any>): string {
		const row: Array<string> = [];
		for (let cell of cells) row.push(this.createText(cell));
		return '|' + row.join('|') + '|';
	}

	private createText(textArray: RichTextType): string {
		return textArray
			.map(part => {
				const {
					annotations: { bold, italic, code, strikethrough, underline },
					type,
				} = part;
				switch (type) {
					case 'text':
						const { text } = part;
						let rawText = new Formatting(text.content.trim());
						if (bold) rawText.bold();
						if (italic) rawText.italic();
						if (strikethrough) rawText.strikethrough(this.site);
						if (underline) rawText.underline(this.site);
						if (code) rawText.code();
						if (text.link) rawText.link(text.link.url);
						return rawText.getText;
					case 'equation':
						const rawEquation = new Formatting(part.plain_text.trim());
						rawEquation.code();
						return rawEquation.getText;
					default:
						return '';
				}
			})
			.join(' ')
			.trim();
	}
}

class Formatting {
	text: string;

	constructor(text: string) {
		this.text = text;
	}

	bold(): void {
		this.text = `**${this.text}**`;
	}

	italic(): void {
		this.text = `*${this.text}*`;
	}

	strikethrough(site: Sites): void {
		if (site === 'medium' || site === 'hashnode') {
			this.text = this.text.split('').join('\u0336') + '\u0336';
		} else {
			this.text = `~~${this.text}~~`;
		}
	}

	underline(site: Sites): void {
		if (site === 'medium' || site === 'hashnode') {
			this.text = this.text.split('').join('\u0332') + '\u0332';
		} else {
			this.text = `<u>${this.text}</u>`;
		}
	}

	code(): void {
		this.text = `\`${this.text}\``;
	}

	link(href: string): void {
		this.text = `[${this.text}](${href})`;
	}

	get getText() {
		return this.text;
	}
}
