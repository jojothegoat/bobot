const { Event } = require('klasa');

module.exports = class extends Event {

	constructor(...args) {
		super(...args, { event: 'presenceUpdate' });
	}

	announceStreamer(member, activity) {
		const { announceChannel } = member.guild.configs;
		const matches = activity.url.match(/https:\/\/www.twitch.tv\/(.*)/);
		if (announceChannel !== null) {
			const channel = member.guild.channels.get(announceChannel);
			channel.send(member.guild.language.get('EVENT_STREAMER', member, matches[1], activity.name, activity.url));
		}
	}

	isStreamer(member, streaming = false, activity) {
		const roleId = member.guild.configs.streamerRole;
		const roled = member.roles.has(roleId);
		const blacklisted = member.roles.has(member.guild.configs.blacklistRole);
		if (streaming === true && roled === false && blacklisted === false) {
			this.client.emit('log', `Add Streamer Role (${roleId}) to ${member.user.tag} (${member.id})`);
			this.announceStreamer(member, activity);
			return member.roles.add(roleId);
		}
		if (roled === true && (streaming === false || blacklisted === true)) {
			this.client.emit('log', `Remove Streamer Role (${roleId}) from ${member.user.tag} (${member.id})`);
			return member.roles.remove(roleId);
		}
		return null;
	}

	async run(oldMember, newMember) {
		const roleId = newMember.guild.configs.streamerRole;
		if (roleId === null) return null;

		const { activity } = newMember.user.presence;
		if (activity && activity.type === 'STREAMING' && activity.details === 'Bless Online') {
			return this.isStreamer(newMember, true, activity);
		}
		return this.isStreamer(newMember);
	}

	async init() {
		if (!this.client.gateways.guilds.schema.has('streamerRole')) {
			this.client.gateways.guilds.schema.add('streamerRole', { type: 'assignableRole' });
		}
		if (!this.client.gateways.guilds.schema.has('blacklistRole')) {
			this.client.gateways.guilds.schema.add('blacklistRole', { type: 'role' });
		}
		if (!this.client.gateways.guilds.schema.has('announceChannel')) {
			this.client.gateways.guilds.schema.add('announceChannel', { type: 'textchannel' });
		}
	}

};
