const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');
const rp = require('request-promise-native');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			cooldown: 5,
			aliases: ['db'],
			description: (msg) => msg.language.get('COMMAND_DATABASE_DESCRIPTION'),
			usage: '<search:str> [...]'
		});
	}

	buildEmbed(item) {
		const embed = new MessageEmbed();
		embed.setTitle(item.name);
		embed.setURL(`https://blesscore.com${item.link}`);
		embed.setColor(this.grades[item.grade]);
		embed.setDescription(item.object_type);
		embed.setThumbnail(`https://blesscore.com/${item.icon_path}/${item.icon}`);
		embed.setFooter('Bless Core', 'https://i.imgur.com/JoIatXy.jpg');
		return embed;
	}

	buildMore(items) {
		const embed = new MessageEmbed();
		const desc = items.map((item) => `[${item.name}](https://blesscore.com${item.link}) *(${item.object_type})*`);
		embed.setTitle('Search');
		embed.setDescription(desc.join('\n'));
		embed.setColor(0x272b30);
		embed.setFooter('Bless Core', 'https://i.imgur.com/JoIatXy.jpg');
		return embed;
	}

	async run(msg, [...search]) {
		const searchStr = search.join(' ');
		const results = await rp.get(`https://blesscore.com/ac.php?l=en&term=${search}`, { json: true });
		if (results.length > 0) {
			if (results.length === 1) return msg.sendMessage(this.buildEmbed(results[0]));
			const exact = results.filter((result) =>
				result.name.replace(/\W+/g, '').toLowerCase() === searchStr.replace(/\W+/g, '').toLowerCase()
			);
			if (exact.length === 1) return msg.sendMessage(this.buildEmbed(exact[0]));
			return msg.sendMessage(this.buildMore(exact.length > 0 ? exact : results));
		}
		return msg.sendMessage('This item cannot be found.');
	}

	async init() {
		this.grades = [
			0x7f7f7f,
			0xffffff,
			0x80a94a,
			0x3479be,
			0x686bd7,
			0xb37f47
		];
	}

};
