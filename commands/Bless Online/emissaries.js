const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');
const rp = require('request-promise-native');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			cooldown: 5,
			aliases: ['emissary'],
			description: (msg) => msg.language.get('COMMAND_EMISSARIES_DESCRIPTION')
		});
	}

	async getUsers(userIds) {
		const ids = userIds.join('&id=');
		const url = `https://api.twitch.tv/helix/users?id=${ids}`;
		const users = await rp.get(url, {
			headers: { 'Client-ID': this.config.twitch.client_id },
			json: true
		});
		const ret = {};
		for (const user of users.data) {
			ret[user.id] = user;
		}
		return ret;
	}

	async run(msg) {
		const logins = this.emissaries.join('&user_login=');
		const url = `https://api.twitch.tv/helix/streams?game_id=${this.config.twitch.game_id}&user_login=${logins}`;
		const streams = await rp.get(url, {
			headers: { 'Client-ID': this.config.twitch.client_id },
			json: true
		});
		const embed = new MessageEmbed().setTitle(msg.language.get('COMMAND_EMISSARIES_TITLE')).setColor(0x6441A4);
		if (streams.data.length > 0) {
			const userIds = streams.data.map(data => data.user_id);
			const users = await this.getUsers(userIds);
			streams.data.forEach((stream) => {
				const su = users[stream.user_id];
				embed.addField(`${msg.language.get('COMMAND_EMISSARIES_EMOJI')} ${su.display_name}`,
					`${stream.title.substr(0, 25)}\n**${stream.viewer_count} Viewer 👁️\n[Start Watching](https://twitch.tv/${su.login})**\n*Total Views: ${su.view_count}*`, true);
			});
		} else {
			embed.setDescription('No Emissary streams currently :(');
		}
		msg.sendMessage(embed);
	}

	async init() {
		this.config = require(`${this.client.clientBaseDir}/config.json`);
		this.emissaries = require(`${this.client.clientBaseDir}/emissaries.json`);
	}

};
