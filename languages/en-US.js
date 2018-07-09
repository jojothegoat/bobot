const { Language, util } = require('klasa');

module.exports = class extends Language {

	constructor(...args) {
		super(...args);
		this.language = {
			COMMAND_INVITE: (client) => [
				`To add ${client.user.username} to your discord guild:`,
				`https://discordapp.com/oauth2/authorize?client_id=${client.application.id}&scope=bot`
			],
			COMMAND_SUBSCRIBE: (msg) => [
				`To subscribe news to your discord guild:`,
				`https://discordapp.com/oauth2/authorize?response_type=code&scope=webhook.incoming&client_id=${msg.client.application.id}&guild_id=${msg.guild.id}&channel_id=${msg.channel.id}`
			],
			COMMAND_SUBSCRIBE_DESCRIPTION: 'Displays the news subscription link.',
			COMMAND_NEWS_DESCRIPTION: 'Link to the latest Bless Online News Website.',
			COMMAND_STEAMNEWS_DESCRIPTION: 'Link to the latest Community Announcement on Steam.',
			COMMAND_TWITTER_DESCRIPTION: 'Link to the latest Post on Twitter.',
			COMMAND_YOUTUBE_DESCRIPTION: 'Link to the latest Video on YouTube.',
			COMMAND_WEBHOOK_DESCRIPTION: 'Display Webhook Settings for current or a given channel.',
			COMMAND_WEBHOOK_SETTINGS: (channel) => `**Webhook Settings for ${channel}**:`,
			COMMAND_WEBHOOK_NOTFOUND: (channel) => `No Webhooks installed on ${channel}`,
			COMMAND_BO_LATEST: (type) => `**Latest ${type}**`,
			COMMAND_BO_NOTFOUND: (type) => `No ${type} found`,
			EVENT_STREAMER: (member, user, name, url) => [`${member} (${user}) is streaming Bless Online on Twitch right now!`,
				`**${name}**\n${url}`],
			COMMAND_SETUP_DESCRIPTION: 'Setup this Discord server with default configuration for Roles/Streamers.',
			COMMAND_FACTIONS_DESCRIPTION: 'Define self-assignable roles to choose a faction.',
			COMMAND_FACTIONS_ARRAY_NOTEMPTY: 'Self-assignable roles are already defined.',
			UNMANAGEABLE_ROLE: 'I cannot manage this role.',
			COMMAND_FACTION_DESCRIPTION: 'Self un/assign your faction role.',
			COMMAND_FACTION_JOINED: (user, role) => `${user} joined the faction **${role}**.`,
			COMMAND_FACTION_LEFT: (user, role) => `${user} left the faction **${role}**.`,
			COMMAND_FACTION_SWITCHED: (user, role) => `${user} switched to faction **${role}**.`,
			COMMAND_CLASS_DESCRIPTION: 'Self un/assign your class role.',
			COMMAND_CLASS_REMOVED: (role) => `You no longer have **${role}** class role.`,
			COMMAND_CLASS_ADDED: (role) => `You now have **${role}** class role.`,
			BLESS_CLASS_BERSEKER: 'Berserker',
			BLESS_CLASS_GUARDIAN: 'Guardian',
			BLESS_CLASS_MAGE: 'Mage',
			BLESS_CLASS_PALADIN: 'Paladin',
			BLESS_CLASS_RANGER: 'Ranger',
			BLESS_CLASS_BERSEKER_EMOJI: 'B.',
			BLESS_CLASS_GUARDIAN_EMOJI: 'G.',
			BLESS_CLASS_MAGE_EMOJI: 'M.',
			BLESS_CLASS_PALADIN_EMOJI: 'P.',
			BLESS_CLASS_RANGER_EMOJI: 'R.',
			COMMAND_GAMEPEDIA_DESCRIPTION: 'Finds a Gamepedia Page by title.',
			COMMAND_GAMEPEDIA_NORESULTS: 'There were no results matching the query.',
			COMMAND_GAMEPEDIA_RESULTS: (string) => `Search results for "${string}"`,
			EVENT_MEMBER_ADD: (member) => `${member} has joined`,
			EVENT_MEMBER_REMOVE: (member) => `${member} has left`,
			COMMAND_INFO: (users, servers, channels, owner, message) => [
				'= INFO =',
				'',
				`• Owner      :: ${owner}`,
				`• Users      :: ${users}`,
				`• Servers    :: ${servers}`,
				`• Channels   :: ${channels}`,
				`• Framework  :: Klasa`,
				`• Library    :: Discord.js`,
				`• Language   :: Node.js`,
				this.client.options.shardCount ?
					`• Shard      :: ${((message.guild ? message.guild.shardID : message.channel.shardID) || this.client.options.shardId) + 1} / ${this.client.options.shardCount}` :
					''
			],
			COMMAND_EMISSARIES_TITLE: 'Emissaries Live on Twitch',
			COMMAND_EMISSARIES_DESCRIPTION: 'Show Live Streams from Emissaries on Twitch.',
			COMMAND_EMISSARIES_EMOJI: '',
			COMMAND_TAX_DESCRIPTION: 'Market Registration Fee Calculator',
			COMMAND_TAX_REGFEE: 'Fee (Regular)',
			COMMAND_TAX_PRMFEE: 'Fee (Premium)',
			COMMAND_TAX_BRONZE: 'B',
			COMMAND_TAX_SILVER: 'S',
			COMMAND_TAX_GOLD: 'G',
			COMMAND_LUMENA_DESCRIPTION: 'Lumena Currency Converter',
			COMMAND_LUMENA_TITLE: 'Lumena Exchange Rate',
			COMMAND_LUMENA_BASE: 'Base Price',
			COMMAND_LUMENA_L: 'L',
			COMMAND_WORLDMAP_DESCRIPTION: 'Shows you the Worldmap of Bless Online.',
			COMMAND_WORLDMAP_LINK: 'https://i.imgur.com/jC3ngKS.jpg',
			COMMAND_SOUNDTRACK_DESCRIPTION: 'Link to the Bless OST on YouTube.',
			COMMAND_SOUNDTRACK_LINK: 'https://www.youtube.com/playlist?list=PLEu-wcvCHh0OVPpDPg2us83DVSkYpOjO1',
			COMMAND_SERVERSTATUS_DESCRIPTION: 'Server Status',
			COMMAND_SERVERSTATUS_OFFLINE: '[OFF]',
			COMMAND_SERVERSTATUS_ONLINE: '[ON]',
			COMMAND_RESET_DESCRIPTION: 'Reset Timers',
			COMMAND_PENINSULAR_DESCRIPTION: 'Peninsular War Schedule',
			COMMAND_MARKET_DESCRIPTION: 'Search an item on Market and show the lowest Price',
			RESOLVER_INVALID_SERVERREGION: 'Region must be EU or NA.',
			CONFIG_NO_SERVERREGION: (prefix) => `Please set your server region via \`\`${prefix}region\`\``,
			COMMAND_REGION_DESCRIPTION: (prefix) => `Change the server region for commands like ${prefix}market`,
			COMMAND_DATABASE_DESCRIPTION: 'Bless Database Search',
			COMMAND_PET_DESCRIPTION: 'Pet Leveling Timer',
			COMMAND_PET_LEVELUP: (lvl, time) => `Your Pet will reach **Level ${lvl}** in **${time}** !`,
			COMMAND_PET_LEVELUP_DONE: '**Pet Timer**: Level up!',
			COMMAND_PET_NOENERGY: (lvl, time) => `Your Pet will run out of energy in **${time}** ! *(Level ${lvl})*`,
			COMMAND_PET_NOENERGY_DONE: '**Pet Timer**: Out of energy!',
			COMMAND_PET_EXPREQ: (lvl, exp, sta) => `${exp} EXP *(${sta} Energy)* required for Level ${lvl}.`
		};
	}

	async init() {
		await super.init();
	}

};
