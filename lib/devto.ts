import { ArticleResponse, ArticleType, UserType } from '../types/DevtoTypes';

export class DevtoClient {
	private auth: string;
	private apiEndpoint: string = 'https://dev.to/api';

	constructor(client: { auth: string }) {
		this.auth = client.auth;
	}

	async getUser(): Promise<UserType> {
		const res: UserType = await (
			await fetch(`${this.apiEndpoint}/users/me`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					api_key: this.auth,
				},
			})
		).json();
		return res;
	}

	async postArticle(data: ArticleType): Promise<ArticleResponse> {
		const res: ArticleResponse = await (
			await fetch(`${this.apiEndpoint}/articles`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					api_key: this.auth,
				},
				body: JSON.stringify(data),
			})
		).json();
		return res;
	}
}
