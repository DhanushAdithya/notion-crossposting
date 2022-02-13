import type {
	ClientType,
	CreateStoryResponse,
	CreateStoryType,
	UserResponse,
} from '../types/HashnodeTypes';
import {
	userQuery,
	createStory,
	createPublicationStory,
} from '../types/HashnodeTypes';

export class HashnodeClient {
	private auth: string;
	private publicationId?: string;
	private apiEndpoint: string = 'https://api.hashnode.com';

	constructor(client: ClientType) {
		this.auth = client.auth;
		this.publicationId = client.publicationId;
	}

	async getUser(username: string): Promise<UserResponse> {
		const res: UserResponse = await (
			await fetch(this.apiEndpoint, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					query: userQuery,
					variables: { username },
				}),
			})
		).json();
		return res;
	}

	async postArticle(
		input: CreateStoryType,
		isPublication: boolean = false,
		hideFromHashnodeFeed: boolean = false
	): Promise<CreateStoryResponse> {
		const res: CreateStoryResponse = await (
			await fetch(this.apiEndpoint, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: this.auth,
				},
				body: JSON.stringify(
					isPublication
						? {
								query: createPublicationStory,
								variables: {
									publicationId: this.publicationId,
									hideFromHashnodeFeed,
									input,
								},
						  }
						: {
								query: createStory,
								variables: { input },
						  }
				),
			})
		).json();
		return res;
	}
}
