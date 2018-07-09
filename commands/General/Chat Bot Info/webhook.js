const { Command } = require('klasa');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			runIn: ['text'],
			usage: '[channel:channel]',
			permLevel: 6,
			description: (msg) => msg.language.get('COMMAND_WEBHOOK_DESCRIPTION')
		});
	}

	async run(msg, [channel = msg.channel]) {
		const webhook = await this.client.providers.get('bob').exec.collection('webhook').find({
			channel_id: channel.id,
			guild_id: msg.guild.id
		}).toArray();
		if(webhook.length > 0 && webhook[0].subs !== undefined) {
			let txt = msg.language.get('COMMAND_WEBHOOK_SETTINGS', channel);
			txt += '```';
			this.subs.forEach((sub) => {
				const tag = this.tags[webhook[0].subs[sub.key]];
				txt += `\n${sub.title}: ${tag}`;
			});
			txt += '```';
			return msg.sendMessage(txt);
		}
		return msg.sendMessage(msg.language.get('COMMAND_WEBHOOK_NOTFOUND', msg.channel));
	}

	async init() {
		this.subs = [{
			key: 'news',
			title: 'News',
		},{
			key: 'youtube',
			title: 'YouTube',
		},{
			key: 'twitter',
			title: 'Twitter',
		},{
			key: 'steamnews',
			title: 'Steam News',
		},{
			key: 'tracker',
			title: 'Tracker',
		}];
		this.tags = ['❌ Disabled','✅ Enabled','✅ Enabled (@here)','✅ Enabled (@everyone)']
	}
};
