export const userQuery = `
query user($username: String!) {
    user(username: $username) {
        _id
        name
        username
        tagline
        dateJoined
        numFollowing
        numFollowers
        photo
        coverImage
        numPosts
        blogHandle
        publicationDomain
    }
}`;

const storyResponseQuery = `
code
success
message
post {
    _id
    cuid
    title
    slug
    type
    dateAdded
    brief
    coverImage
    isRepublished
}`;

export const createStory = `
mutation createStory($input: CreateStoryInput!) {
    createStory(input: $input) {
        ${storyResponseQuery}
    }
}`;

export const createPublicationStory = `
mutation createStory($input: CreateStoryInput!, $publicationId: String!) {
    createPublicationStory(input: $input, publicationId: $publicationId) {
        ${storyResponseQuery}
    }
}`;

export type ClientType = {
	auth: string;
	publicationId?: string;
};

export type CreateStoryType = {
	title: string;
	slug?: string;
	contentMarkdown: string;
	coverImageURL?: string;
	isRepublished?: {
		originalArticleURL: string;
	};
	tags?:
		| Array<{
				_id: string;
				slug?: string;
				name: string;
		  }>
		| [];
	isAnonymous?: boolean;
	sourcedFromGithub?: boolean;
};

type ErrorResponse =
	| {
			errors: Array<{
				message: string;
				locations: Array<{
					line: number;
					column: number;
				}>;
				path: Array<string>;
				extensions: {
					code: string;
				};
			}>;
			data: {
				user: null;
			} | null;
	  }
	| {
			error: {
				errors: Array<{
					message: string;
					locations: Array<{
						line: number;
						column: number;
					}>;
					extensions: {
						code: string;
					};
				}>;
			};
	  };

type PostResponse = {
	code: number;
	success: boolean;
	message: string;
	post: {
		_id: string;
		cuid: string;
		title: string;
		slug: string;
		type: string;
		dateAdded: string;
		brief: string;
		coverImage: string;
		isRepublished: boolean;
	} | null;
};

export type CreateStoryResponse =
	| {
			data: {
				createPublicationStory: PostResponse;
			};
	  }
	| {
			data: {
				createStory: PostResponse;
			};
	  }
	| ErrorResponse;

export type UserResponse =
	| {
			data: {
				user: {
					_id: string;
					name: string;
					username: string;
					tagline: string;
					dateJoined: string;
					numFollowing: number;
					numFollowers: number;
					photo: string;
					coverImage: string | null;
					numPosts: number;
					blogHandle: string | null;
					publicationDomain: string | null;
				};
			};
	  }
	| ErrorResponse;
