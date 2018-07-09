const { Event, Timestamp } = require('klasa');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Event {

	async run(member) {
		const { logChannel } = member.guild.configs;
		if (logChannel === null) return null;
		return member.guild.channels.get(logChannel)
			.sendMessage(this.createEmbed(member));
	}

	async init() {
		if (!this.client.gateways.guilds.schema.has('logChannel')) {
			this.client.gateways.guilds.schema.add('logChannel', { type: 'textchannel' });
		}
		this.timestamp = new Timestamp('d MMMM YYYY');
	}

	createEmbed(member) {
		return new MessageEmbed()
			.setColor(0x009900)
			.setAuthor(`${member.user.tag} (${member.id})`, member.user.displayAvatarURL())
			.setDescription(`**${member.guild.language.get('EVENT_MEMBER_ADD', member)}**\nDiscord Join Date: ${this.timestamp.display(member.user.createdAt)}`)
			.setFooter('💚')
			.setTimestamp();
	}

};
