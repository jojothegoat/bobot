const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');
const moment = require('moment');
require('moment-duration-format');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['peninsula', 'battlefield', 'battleground'],
			description: (msg) => msg.language.get('COMMAND_PENINSULAR_DESCRIPTION')
		});
	}

	getValue(schedule) {
		const now = moment();
		let note = '';
		const value = schedule.map((seu) => {
			const seuend = moment(seu).add(1, 'h');
			let txt = `\`\`${seu.format('HH:mm')}~${seuend.format('HH:mm')}\`\``;
			if (note.length < 1 && now.isBefore(seuend)) {
				if (now.isBefore(seu)) {
					note = `* Starts in ${moment.duration(seu.diff(now)).format()}`;
				} else {
					note = `* Ends in ${moment.duration(seuend.diff(now)).format()}`;
				}
				txt += ' *****';
			}
			return txt;
		});
		value.push(`${note}`);
		return value.join('\n');
	}

	async run(msg) {
		const embed = new MessageEmbed();
		embed.setTitle(`⚔️ ${msg.language.get('COMMAND_PENINSULAR_DESCRIPTION')}`);
		// embed.setColor(0x9b111e);
		embed.addField('EU', this.getValue([
			moment.tz('14:00', 'HH:mm', 'Europe/Berlin'),
			moment.tz('18:00', 'HH:mm', 'Europe/Berlin'),
			moment.tz('23:00', 'HH:mm', 'Europe/Berlin')
		]), true);
		embed.addField('NA', this.getValue([
			moment.tz('11:00', 'HH:mm', 'America/Vancouver'),
			moment.tz('15:00', 'HH:mm', 'America/Vancouver'),
			moment.tz('20:00', 'HH:mm', 'America/Vancouver')
		]), true);
		return msg.sendMessage(embed);
	}

};
