type ErrorResponse = {
	error: string;
	status: number;
};

export type UserType =
	| {
			type_of: string;
			id: number;
			username: string;
			name: string;
			summary: string;
			twitter_username: string | null;
			github_username: string | null;
			website_url: string | null;
			location: string | null;
			joined_at: string;
			profile_image: string;
	  }
	| {
			name: string;
			username: string;
			twitter_username: string | null;
			github_username: string | null;
			website_url: string | null;
			profile_image: string;
			profile_image_90: string;
	  }
	| ErrorResponse;

type OrganizationType = {
	name: string;
	username: string;
	slug: string;
	profile_image: string;
	profile_image_90: string;
};

export type ArticleType = {
	article: {
		title: string;
		body_markdown: string;
		published?: boolean;
		series?: string;
		main_image?: string;
		canonical_url?: string;
		description?: string;
		tags?: Array<string>;
		organization_id?: number;
	};
};

export type ArticleResponse =
	| {
			type_of: string;
			id: number;
			title: string;
			description: string;
			cover_image: string | null;
			readable_publish_date: string;
			social_image: string;
			tag_list: Array<string>;
			tags: string;
			slug: string;
			path: string;
			url: string;
			canonical_url: string;
			comments_count: number;
			positive_reactions_count: number;
			public_reactions_count: number;
			created_at: string;
			edited_at: string | null;
			crossposted_at: string | null;
			published_at: string;
			last_comment_at: string;
			published_timestamp: string;
			body_html: string;
			body_markdown: string;
			user: UserType;
			reading_time_minutes: number;
			organization?: OrganizationType;
			flare_tag?: {
				name: string;
				bg_color_hex: string;
				text_color_hex: string;
			};
	  }
	| ErrorResponse;
