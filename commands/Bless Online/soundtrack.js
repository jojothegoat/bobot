const { Command } = require('klasa');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			cooldown: 5,
			aliases: ['music', 'ost'],
			description: (msg) => msg.language.get('COMMAND_SOUNDTRACK_DESCRIPTION')
		});
	}

	async run(msg) {
		msg.sendMessage(msg.language.get('COMMAND_SOUNDTRACK_LINK'));
	}

};
