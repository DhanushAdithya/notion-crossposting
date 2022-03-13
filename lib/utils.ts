import {
	CODEPEN_FORMAT,
	CODESANDBOX_FORMAT,
	DEVTO_COMMENT_FORMAT,
	DEVTO_POST_FORMAT,
	DEVTO_USER_FORMAT,
	GIST_FORMAT,
	GITHUB_FORMAT,
	GLITCH_FORMAT,
	IMAGE_FORMAT,
	MEDIUM_FORMAT,
	REDDIT_FORMAT,
	REPLIT_FORMAT,
	STACKBLITZ_FORMAT,
	STACKOVERFLOW_FORMAT,
	TWITTER_FORMAT,
	VIMEO_FORMAT,
	WIKIPEDIA_FORMAT,
	YOUTUBE_FORMAT,
} from './constants';

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
	switch (true) {
		case YOUTUBE_FORMAT.test(url):
			return `{% youtube ${url.replace(YOUTUBE_FORMAT, '$1')} %}\n`;
		case VIMEO_FORMAT.test(url):
			return `{% vimeo ${url.replace(VIMEO_FORMAT, '$1')} %}\n`;
		case CODESANDBOX_FORMAT.test(url):
			return `{% codesandbox ${url.replace(CODESANDBOX_FORMAT, '$1')} %}\n`;
		case DEVTO_USER_FORMAT.test(url):
			return `{% user ${url.replace(DEVTO_USER_FORMAT, '$1')} %}\n`;
		case DEVTO_POST_FORMAT.test(url):
			return `{% link ${url.replace(DEVTO_POST_FORMAT, '$1')} %}\n`;
		case DEVTO_COMMENT_FORMAT.test(url):
			return `{% devcomment ${url.replace(DEVTO_COMMENT_FORMAT, '$1')} %}\n`;
		case GIST_FORMAT.test(url):
			return `{% gist ${url.replace(GIST_FORMAT, '$1')} %}\n`;
		case STACKBLITZ_FORMAT.test(url):
			return `{% stackblitz ${url.replace(STACKBLITZ_FORMAT, '$1')} %}\n`;
		case MEDIUM_FORMAT.test(url):
			return `{% medium ${url.replace(MEDIUM_FORMAT, '$1')} %}\n`;
		case TWITTER_FORMAT.test(url):
			return `{% twitter ${url.replace(TWITTER_FORMAT, '$1')} %}\n`;
		case GLITCH_FORMAT.test(url):
			return `{% glitch ${url.replace(GLITCH_FORMAT, '$1')} %}\n`;
		case REPLIT_FORMAT.test(url):
			return `{% replit ${url.replace(REPLIT_FORMAT, '$1')} %}\n`;
		case REDDIT_FORMAT.test(url):
			return `{% reddit ${url} %}\n`;
		case CODEPEN_FORMAT.test(url):
			return `{% codepen ${url.replace(CODEPEN_FORMAT, '$1')} %}\n`;
		case GITHUB_FORMAT.test(url):
			return `{% github ${url.replace(GITHUB_FORMAT, '$1')} %}\n`;
		case STACKOVERFLOW_FORMAT.test(url):
			return `{% stackoverflow ${url.replace(
				STACKOVERFLOW_FORMAT,
				'$1'
			)} %}\n`;
		case WIKIPEDIA_FORMAT.test(url):
			return `{% wikipedia ${url.replace(WIKIPEDIA_FORMAT, '$1')} %}\n`;
		default:
			return `[${url}](${url})\n`;
	}
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

	async blockContent(): Promise<string> {
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
