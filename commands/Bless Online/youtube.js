const { Command } = require('klasa');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, { description: (msg) => msg.language.get('COMMAND_YOUTUBE_DESCRIPTION') });
	}

	async run(msg) {
		const video = await this.client.providers.get('bob').exec.collection('ytvideos')
			.aggregate([{
				$addFields: {
					date: {
						$dateFromString:
				{ dateString: '$snippet.publishedAt' }
					}
				}
			}, { $sort: { date: -1 } }]).limit(1).toArray();
		if (video.length > 0) {
			return msg.sendMessage(`${msg.language.get('COMMAND_BO_LATEST', 'Bless Online Video')}\nhttps://youtu.be/${video[0].snippet.resourceId.videoId}`);
		}
		return msg.sendMessage(msg.language.get('COMMAND_BO_NOTFOUND', 'Bless Online Video'));
	}

};
