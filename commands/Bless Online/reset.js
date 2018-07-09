const { Command } = require('klasa');
const moment = require('moment');
require('moment-duration-format');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, { description: (msg) => msg.language.get('COMMAND_RESET_DESCRIPTION') });
	}

	async run(msg) {
		const now = moment();
		const ResetEU = moment().tz('Etc/GMT').startOf('day').add(1, 'd');
		const ResetNA = moment().tz('Etc/GMT+7').startOf('day').add(1, 'd');
		const reply = [
			`__⏰ ${msg.language.get('COMMAND_RESET_DESCRIPTION')}__`,
			`**EU** in \`\`${moment.duration(ResetEU.diff(now)).format()}\`\``,
			`**NA** in \`\`${moment.duration(ResetNA.diff(now)).format()}\`\``
		];
		return msg.sendMessage(reply.join('\n'));
	}

};
