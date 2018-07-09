const { Command } = require('klasa');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['details', 'what'],
			guarded: true,
			description: (msg) => msg.language.get('COMMAND_INFO_DESCRIPTION')
		});
	}

	async run(msg) {
		let [users, guilds, channels] = [0, 0, 0];

		if (this.client.shard) {
			const results = await this.client.shard.broadcastEval(`[this.users.size, this.guilds.size, this.channels.size]`);
			for (const result of results) {
				users += result[0];
				guilds += result[1];
				channels += result[2];
			}
		}

		return msg.sendCode('asciidoc', msg.language.get('COMMAND_INFO',
			(users || this.client.users.size).toLocaleString(),
			(guilds || this.client.guilds.size).toLocaleString(),
			(channels || this.client.channels.size).toLocaleString(),
			this.client.owner.tag,
			msg,
		));
	}

};
