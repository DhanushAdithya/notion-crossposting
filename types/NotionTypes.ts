export type NotionClientType = {
	auth: string;
	database_id: string;
};

export type PagePropertiesType =
	| {
			id: string;
			title: string;
			coverImage: any;
			republished: boolean;
			brief: string;
			tags: Array<string>;
			series: any;
			sites: Array<string>;
			canonicalUrl: string;
	  }
	| {
			id: string;
			title: string;
			coverImage: any;
			republished: boolean;
			brief: string;
			tags: Array<string>;
			series: any;
			sites: Array<string>;
			canonicalUrl: string;
			content: string;
	  };
