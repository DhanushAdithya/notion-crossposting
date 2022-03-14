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

// Grouped Embed RegExs
const EMBED_REGEXS = {
	stackoverflow:
		/^(https?:\/\/stackoverflow\.com\/(?:a|q(?:uestions)?)\/\d+(?:\/[\w\-]+(?:\/[\d\#]+)?)?)\/?(?:.*)?$/g,
	reddit: /^(https?:\/\/(?:www\.)?reddit\.com\/r\/(?:(?:[\w]+)\/?)*)(?:.*)?$/g,
	github:
		/^(https?:\/\/(?:www\.)?github\.com\/[\w\-]+\/(?:[\w\-]*\/?)+[\#\w\-]+?)\/?(?:.*)?$/g,
	wikipedia: /^(https?:\/\/[\w\-]+\.wikipedia\.org\/wiki\/[^\s]+)(?:.*)?$/g,
	codepen: /^(https?:\/\/codepen\.io\/(?:\w+\/)+pen\/\w+)(?:.*)?$/g,
	youtube:
		/^(?:https?:\/\/)?(?:www\.)?youtu(?:.be\/|be\.com\/watch\?(?:\w+(?:\=\w*)?\&)?v\=)?([\w\-]+)(?:.*)?$/g,
	vimeo: /^(?:https?:\/\/(?:\w+[^\s]*\.)?vimeo\.com\/([0-9]+)[^\s]*)\/?(?:.*)?$/g,
	codesandbox: /^https?:\/\/codesandbox\.io\/s\/([\w\-]+)\/?(?:.*)?$/g,
	user: /^https?:\/\/dev\.to\/([\w]+)\/?$/g,
	link: /^https?:\/\/dev\.to\/([\w]+\/[\w\-]+)\/?$/g,
	devcomment: /^https?:\/\/dev\.to\/[\w]+\/comment\/([\w\-]+)\/?(?:.*)?$/g,
	gist: /^(https?:\/\/gist\.github\.com\/\w+\/\w+)(?:\#[\w\-]+)?\/?(?:.*)?$/g,
	stackblitz: /^https?:\/\/stackblitz\.com\/edit\/([\w\-]+)\/?(?:.*)?$/g,
	medium:
		/^(https?:\/\/medium\.com\/(?:(?:@?\w+)|(?:[\w\-]+))\/[\w\-]+)\??(?:\w+(?:\=[\w\-]+)\&?)*\/?(?:.*)?$/g,
	twitter: /^https?:\/\/twitter\.com\/[\w]{4,15}\/status\/(\d+)\/?(?:.*)?$/g,
	glitch: /^https?:\/\/glitch\.com\/\~([\w\-]+)\/?(?:.*)?$/g,
	replit: /^https?:\/\/replit\.com\/(\@(?:[\w\-]+)\/[\w\-]+)(?:.*)?$/g,
};

export {
	MEDIUM_API_ENDPOINT,
	DEVTO_API_ENDPOINT,
	HASHNODE_API_ENDPOINT,
	MEDIUM_DEVELOPERS_URL,
	DEVTO_DEVELOPERS_URL,
	HASHNODE_DEVELOPERS_URL,
	NOTION_IMAGE_URL,
	IMAGE_FORMAT,
	EMBED_REGEXS,
};
