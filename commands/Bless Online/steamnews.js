const { Command } = require('klasa');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, { description: (msg) => msg.language.get('COMMAND_STEAMNEWS_DESCRIPTION') });
	}

	async run(msg) {
		const news = await this.client.providers.get('bob').exec.collection('steamnews')
			.find().sort({ date: -1 }).limit(1).toArray();
		if (news.length > 0) {
			return msg.sendMessage(`${msg.language.get('COMMAND_BO_LATEST', 'Community Announcement')}\nhttp://store.steampowered.com/news/externalpost/${news[0].feedname}/${news[0].gid}`);
		}
		return msg.sendMessage(msg.language.get('COMMAND_BO_NOTFOUND', 'Community Announcement'));
	}

};
