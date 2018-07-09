const { Command } = require('klasa');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, { description: (msg) => msg.language.get('COMMAND_NEWS_DESCRIPTION') });
	}

	async run(msg) {
		const news = await this.client.providers.get('bob').exec.collection('news')
			.find().sort({ date: -1 }).limit(1).toArray();
		if (news.length > 0) {
			return msg.sendMessage(`${msg.language.get('COMMAND_BO_LATEST', 'Bless Online News')}\nhttps://www.blessonline.net${news[0].url}`);
		}
		return msg.sendMessage(msg.language.get('COMMAND_BO_NOTFOUND', 'Bless Online News'));
	}

};
