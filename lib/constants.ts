// API endpoints
const MEDIUM_API_ENDPOINT = 'https://api.medium.com/v1';
const DEVTO_API_ENDPOINT = 'https://dev.to/api';
const HASHNODE_API_ENDPOINT = 'https://api.hashnode.com';

// Developer URLs
const MEDIUM_DEVELOPERS_URL = 'https://medium.com/me/settings';
const DEVTO_DEVELOPERS_URL = 'https://dev.to/settings/account';
const HASHNODE_DEVELOPERS_URL = 'https://hashnode.com/settings/developer';

// Notion Images Endpoint
const NOTION_IMAGE_URL = 'https://www.notion.so/image/';

// Image Support RegEx
const IMAGE_FORMAT = /\.(png|jpe?g|webp|gif)$/g;

// Ungrouped Embed RegExs
const CODEPEN_FORMAT = /^https?:\/\/codepen\.io\/(?:\w+\/)+pen\/\w+\/?$/g;
const STACKOVERFLOW_FORMAT =
	/^https?:\/\/stackoverflow\.com\/(?:a|q(?:uestions)?)\/\d+(?:\/[\w-]+(\/[\d#]+)?)?\/?$/g;
const REDDIT_FORMAT =
	/^(https?:\/\/(?:www\.)?reddit\.com\/r\/(?:(?:[\w]+)\/?)*)(?:.*)?$/g;
const GITHUB_FORMAT =
	/^https?:\/\/(?:www\.)?github\.com\/[\w\-]+\/(?:[\w\-]*\/?)+[\#\w\-]+?\/?$/g;
const WIKIPEDIA_FORMAT =
	/^https?:\/\/[\w\-]+\.wikipedia\.org\/wiki\/([^\'\"\s\>]+)$/g;

// Grouped Embed RegExs
const YOUTUBE_FORMAT =
	/^(?:https?:\/\/)(?:www\.)?youtu(?:.be\/|be\.com\/watch\?(?:\w+(?:=\w*)?\&)?v=)(\w+)(?:\&\w+(?:=\w*)?)?\/?$/g;
const VIMEO_FORMAT =
	/^(?:https?:\/\/(?:\w+[^\s]*\.)?vimeo\.com\/([0-9]+)[^\s]*)\/?$/g;
const CODESANDBOX_FORMAT = /^https?:\/\/codesandbox\.io\/s\/([\w\-]+)\/?$/g;
const DEVTO_USER_FORMAT = /^https?:\/\/dev\.to\/([\w]+)\/?$/g;
const DEVTO_POST_FORMAT = /^https?:\/\/dev\.to\/([\w]+\/[\w\-]+)\/?$/g;
const DEVTO_COMMENT_FORMAT =
	/^https?:\/\/dev\.to\/[\w]+\/comment\/([\w\-]+)\/?$/g;
const GIST_FORMAT =
	/^(https?:\/\/gist\.github\.com\/\w+\/\w+)(?:\#[\w\-]+)?\/?$/g;
const STACKBLITZ_FORMAT = /^https?:\/\/stackblitz\.com\/edit\/([\w\-]+)\/?$/g;
const MEDIUM_FORMAT =
	/^(https?:\/\/medium\.com\/(?:(?:@?\w+)|(?:[\w\-]+))\/[\w\-]+)\??(?:\w+(?:\=[\w\-]+)\&?)*\/?$/g;
const TWITTER_FORMAT =
	/^https?:\/\/twitter\.com\/[\w]{4,15}\/status\/(\d+)\/?$/g;
const GLITCH_FORMAT = /^https?:\/\/glitch\.com\/\~([\w\-]+)\/?$/g;
const REPLIT_FORMAT = /^https?:\/\/replit\.com\/(\@(?:[\w\-]+)\/[\w\-]+)\/?$/g;

export {
	MEDIUM_API_ENDPOINT,
	DEVTO_API_ENDPOINT,
	HASHNODE_API_ENDPOINT,
	MEDIUM_DEVELOPERS_URL,
	DEVTO_DEVELOPERS_URL,
	HASHNODE_DEVELOPERS_URL,
	NOTION_IMAGE_URL,
	IMAGE_FORMAT,
	YOUTUBE_FORMAT,
	VIMEO_FORMAT,
	CODEPEN_FORMAT,
	CODESANDBOX_FORMAT,
	DEVTO_USER_FORMAT,
	DEVTO_POST_FORMAT,
	DEVTO_COMMENT_FORMAT,
	GIST_FORMAT,
	STACKBLITZ_FORMAT,
	MEDIUM_FORMAT,
	TWITTER_FORMAT,
	STACKOVERFLOW_FORMAT,
	REDDIT_FORMAT,
	GITHUB_FORMAT,
	WIKIPEDIA_FORMAT,
	GLITCH_FORMAT,
	REPLIT_FORMAT,
};
