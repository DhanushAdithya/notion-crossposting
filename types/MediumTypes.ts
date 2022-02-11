export type ClientType = {
	auth: string;
	uid?: string;
	publicationId?: string;
};

export type PostType = {
	title: string;
	contentFormat: 'html' | 'markdown';
	content: string;
	tags?: Array<string>;
	canonicalUrl?: string;
	publishStatus?: 'public' | 'draft' | 'unlisted';
	license?:
		| 'all-rights-reserved'
		| 'cc-40-by'
		| 'cc-40-by-sa'
		| 'cc-40-by-nd'
		| 'cc-40-by-nc'
		| 'cc-40-by-nc-nd'
		| 'cc-40-by-nc-sa'
		| 'cc-40-zero'
		| 'public-domain';
	notifyFollowers?: boolean;
};

type ErrorResponse = {
	errors: Array<{
		message: string;
		code: number;
	}>;
};

export type UserResponse =
	| {
			data: {
				id: string;
				username: string;
				name: string;
				url: string;
				imageUrl: string;
			};
	  }
	| ErrorResponse;

export type PostResponse =
	| {
			data: {
				id: string;
				title: string;
				authorId: string;
				tags: Array<string>;
				url: string;
				canonicalUrl: string;
				publishStatus: string;
				license: string;
				licenseUrl: string;
			};
	  }
	| ErrorResponse;

export type PublicationResponse =
	| {
			data: Array<{
				id: string;
				name: string;
				description: string;
				url: string;
				imageUrl: string;
			}>;
	  }
	| ErrorResponse;

export type ContributionResponse =
	| {
			data: Array<{
				publicationId: string;
				userId: string;
				role: string;
			}>;
	  }
	| ErrorResponse;
