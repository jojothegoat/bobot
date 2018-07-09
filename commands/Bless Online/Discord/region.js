const { Command } = require('klasa');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['setregion'],
			cooldown: 5,
			description: (msg) => msg.language.get('COMMAND_REGION_DESCRIPTION', msg.guildConfigs.prefix),
			usage: '<EU|NA>'
		});
	}

	async run(msg, [region]) {
		const input = region.toUpperCase();
		if (msg.author.configs.region === input) throw msg.language.get('COMMAND_CONF_NOCHANGE', 'Serverregion');
		await msg.author.configs.update('region', input);
		return msg.sendMessage(`Your Serverregion has been set to ${input}`);
	}

};
