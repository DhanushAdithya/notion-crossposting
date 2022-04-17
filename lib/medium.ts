import type {
	ClientType,
	PostType,
	UserResponse,
	PostResponse,
	PublicationResponse,
	ContributionResponse,
} from 'types/MediumTypes';
import { MEDIUM_API_ENDPOINT } from './constants';

export class MediumClient {
	private auth: string;
	private uid?: string;
	private publicationId?: string;
	private apiEndpoint = MEDIUM_API_ENDPOINT;

	constructor(client: ClientType) {
		this.auth = client.auth;
		this.uid = client.uid;
		this.publicationId = client.publicationId;
	}

	async getUser(): Promise<UserResponse> {
		const res: UserResponse = await (
			await fetch(`${this.apiEndpoint}/me`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${this.auth}`,
				},
			})
		).json();
		return res;
	}

	async postArticle(
		data: PostType,
		isPublication: boolean
	): Promise<PostResponse> {
		const route = isPublication
			? `publications/${this.publicationId}`
			: `users/${this.uid}`;
		const res: PostResponse = await (
			await fetch(`${this.apiEndpoint}/${route}/posts`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${this.auth}`,
				},
				body: JSON.stringify(data),
			})
		).json();
		return res;
	}

	async getPublications(): Promise<PublicationResponse> {
		const res: PublicationResponse = await (
			await fetch(`${this.apiEndpoint}/users/${this.uid}/publications`)
		).json();
		return res;
	}

	async getContributions(): Promise<ContributionResponse> {
		const res: ContributionResponse = await (
			await fetch(`${this.apiEndpoint}/users/${this.uid}/contributors`)
		).json();
		return res;
	}
}
