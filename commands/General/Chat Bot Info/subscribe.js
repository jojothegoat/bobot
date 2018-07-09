const { Command } = require('klasa');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			runIn: ['text'],
			guarded: true,
			description: (msg) => msg.language.get('COMMAND_SUBSCRIBE_DESCRIPTION')
		});
	}

	async run(msg) {
		return msg.sendMessage(msg.language.get('COMMAND_SUBSCRIBE', msg));
	}

};
