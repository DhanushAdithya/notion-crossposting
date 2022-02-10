export const getDate = (): string => {
	const date: Date = new Date(Date.now());
	const dateFormat: string = new Intl.DateTimeFormat('en-ca').format(date);
	return dateFormat;
};

class Formatting {
	text: string;
	href: string | undefined;

	constructor(text: string, href: string | undefined) {
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

export default { Formatting };
