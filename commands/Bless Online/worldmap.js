const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			cooldown: 5,
			aliases: ['map'],
			description: (msg) => msg.language.get('COMMAND_WORLDMAP_DESCRIPTION')
		});
	}

	async run(msg) {
		const embed = new MessageEmbed();
		embed.setTitle('Bless Online Worldmap');
		embed.setImage('https://i.imgur.com/jC3ngKS.jpg');
		msg.sendMessage(embed);
	}

};
