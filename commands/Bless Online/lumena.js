const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			usage: '[lumena:float{1}] [currency:str{3,3}]',
			usageDelim: ' ',
			description: (msg) => msg.language.get('COMMAND_LUMENA_DESCRIPTION')
		});
	}

	async getPrices(cur) {
		const query = { classid: '2834208818' };
		query[`prices.${cur}`] = { $exists: true };
		return await this.client.providers.get('bob').exec.collection('steamitems')
			.find(query).limit(1).toArray();
	}

	async getLastRun() {
		const jobs = await this.client.providers.get('bob').exec.collection('agendaJobs')
			.find({ name: 'read prices' }, { lastFinishedAt: 1 }).limit(1).toArray();
		return jobs[0].lastFinishedAt;
	}

	async run(msg, [lumena = this.base, currency = 'USD']) {
		const lum = msg.language.get('COMMAND_LUMENA_L');
		const cur = currency.toUpperCase();

		const prices = await this.getPrices(cur);
		if (prices.length === 0) throw 'Currency is not available';

		const embed = new MessageEmbed();
		embed.setTitle(`💱 ${msg.language.get('COMMAND_LUMENA_TITLE')}`);
		embed.setColor(0x9b111e);

		const price = prices[0].prices[cur] / 100;
		const baseTotal = price.toLocaleString(msg.language.name, { style: 'currency', currency: cur });
		const basePer = (1).toLocaleString(msg.language.name, { style: 'currency', currency: cur });
		embed.addField(msg.language.get('COMMAND_LUMENA_BASE'),
			[`${lum}${this.base.toLocaleString(msg.language.name)} = ${baseTotal}`,
				`*(${basePer} = ~${Math.floor(this.base / price)} ${lum})*`].join(' '));

		const calcPrice = (price / this.base * Math.floor(lumena)).toLocaleString(msg.language.name, { style: 'currency', currency: cur });
		embed.addField(`Lumena ➡️ ${cur}`, `${lum}${Math.floor(lumena).toLocaleString(msg.language.name)} = ~${calcPrice}`, true);

		const fInput = lumena.toLocaleString(msg.language.name, { style: 'currency', currency: cur });
		const calcLum = Math.floor(this.base / price * lumena).toLocaleString(msg.language.name);
		embed.addField(`${cur} ➡️ Lumena`, `${fInput} = ~${calcLum}${lum}`, true);

		embed.setFooter('Last Price Update');
		embed.setTimestamp(await this.getLastRun());
		return msg.sendMessage(embed);
	}

	async init() {
		this.base = 1200;
	}

};
