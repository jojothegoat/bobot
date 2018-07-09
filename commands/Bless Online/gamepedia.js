const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');
const rp = require('request-promise-native');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			cooldown: 5,
			aliases: ['wiki'],
			description: (msg) => msg.language.get('COMMAND_GAMEPEDIA_DESCRIPTION'),
			usage: '<query:str>'
		});
	}

	async run(msg, [query]) {
		const results = await rp.get(`https://blessonline.gamepedia.com/api.php`,
			{ qs: { action: 'opensearch', search: query, limit: 5 }, json: true });
		if (results[1].length === 0) {
			return msg.sendMessage(msg.language.get('COMMAND_GAMEPEDIA_NORESULTS'));
		}

		const embed = new MessageEmbed().setColor(0xf68f38);

		if (results[1][0].toLowerCase() === results[0].toLowerCase() || results[1].length === 1) {
			embed.setAuthor(`${results[1][0]} - Official Bless Online Wiki`,
				'https://i.imgur.com/qwRQpUd.png', results[3][0]);
		} else {
			embed.setAuthor(msg.language.get('COMMAND_GAMEPEDIA_RESULTS', results[0]), '',
				`https://blessonline.gamepedia.com/index.php?search=${results[0]}`);
			let desc = '';
			results[1].forEach((result, i) => {
				desc += `\n[${result}](${results[3][i]})`;
			});
			embed.setDescription(desc);
			embed.setFooter('Official Bless Online Wiki',
				'https://i.imgur.com/qwRQpUd.png');
		}
		return msg.sendMessage({ embed });
	}

};
