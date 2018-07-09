const { Command } = require('klasa');
const rp = require('request-promise-native');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			cooldown: 5,
			aliases: ['server', 'status'],
			description: (msg) => msg.language.get('COMMAND_SERVERSTATUS_DESCRIPTION')
		});
	}

	async run(msg) {
		const status = await rp.get('http://www.blessonline.net/api/server_state', { json: true });
		let desc = '';
		status.forEach((state) => {
			desc += state.serverOpen ? `\n${msg.language.get('COMMAND_SERVERSTATUS_ONLINE')} ${state.serverName}` :
				`\n${msg.language.get('COMMAND_SERVERSTATUS_OFFLINE')} ${state.serverName}`;
		});
		const embed = new MessageEmbed();
		embed.setTitle(msg.language.get('COMMAND_SERVERSTATUS_DESCRIPTION'));
		embed.setColor(0xffffff);
		embed.setDescription(desc);
		msg.sendMessage(embed);
	}

};
