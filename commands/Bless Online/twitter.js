const { Command } = require('klasa');
const Twit = require('twit');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, { description: (msg) => msg.language.get('COMMAND_TWITTER_DESCRIPTION') });
	}

	async run(msg) {
		const tweets = await this.twit.get('statuses/user_timeline', {
			user_id: this.config.twitter.follow[0],
			count: 10,
			include_rts: 0,
			exclude_replies: 1
		});
		if (tweets.data.length > 0) {
			const tweet = tweets.data[0];
			const twitlink = `https://twitter.com/${tweet.user.screen_name}/status/${tweet.id_str}`;
			return msg.sendMessage(`${msg.language.get('COMMAND_BO_LATEST', 'Tweet')}\n${twitlink}`);
		}
		return msg.sendMessage(msg.language.get('COMMAND_BO_NOTFOUND', 'Tweet'));
	}

	async init() {
		this.config = require(`${this.client.clientBaseDir}/config.json`);
		this.twit = new Twit(this.config.twitter.api);
	}

};
