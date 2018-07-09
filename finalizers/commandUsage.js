const { Finalizer } = require('klasa');

module.exports = class extends Finalizer {

	run(message) {
		if (message.channel.type === 'text') {
			message.guild.configs.update('lastCommand', new Date());
		}
	}

	async init() {
		if (!this.client.gateways.guilds.schema.has('lastCommand')) {
			this.client.gateways.guilds.schema.add('lastCommand', { type: 'any' });
		}
	}

};
