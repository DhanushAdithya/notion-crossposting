import type {
	ClientType,
	CreateStoryResponse,
	CreateStoryType,
} from '../types/HashnodeTypes';
import { createStory, createPublicationStory } from '../types/HashnodeTypes';

export class HashnodeClient {
	private auth: string;
	private publicationId?: string;
	private apiEndpoint: string = 'https://api.hashnode.com';

	constructor(client: ClientType) {
		this.auth = client.auth;
		this.publicationId = client.publicationId;
	}

	async postArticle(
		input: CreateStoryType,
		isPublication: boolean,
		hideFromHashnodeFeed: boolean = false
	): Promise<CreateStoryResponse> {
		const res = await (
			await fetch(`${this.apiEndpoint}`, {
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
