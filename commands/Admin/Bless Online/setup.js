const { Command } = require('klasa');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			enabled: true,
			runIn: ['text'],
			permLevel: 6,
			requiredConfigs: ['factions', 'classes'],
			botPerms: ['MANAGE_ROLES', 'MANAGE_CHANNELS'],
			description: (msg) => msg.language.get('COMMAND_SETUP_DESCRIPTION'),
			subcommands: true,
			usage: '<classes|factions|streamer>'
		});
	}

	async factions(msg) {
		const factions = [
			{ name: 'Hieron', color: 0x0099cc },
			{ name: 'Union', color: 0xcc0000 }
		];
		const roles = [];
		if (msg.guild.configs.factions.length === 0) {
			for (const faction of factions) {
				const role = await msg.guild.roles.create({ data: faction });
				msg.guild.configs.update('factions', role, { action: 'add' });
				roles.push(role);
			}
			msg.sendMessage(`Roles created: ${roles}`);
		} else {
			msg.sendMessage(msg.language.get('COMMAND_FACTIONS_ARRAY_NOTEMPTY'));
		}
	}

	async classes(msg) {
		const classes = [
			msg.language.get('BLESS_CLASS_BERSEKER'),
			msg.language.get('BLESS_CLASS_GUARDIAN'),
			msg.language.get('BLESS_CLASS_MAGE'),
			msg.language.get('BLESS_CLASS_PALADIN'),
			msg.language.get('BLESS_CLASS_RANGER')
		];
		const roles = [];
		if (msg.guild.configs.classes.length === 0) {
			for (const aclass of classes) {
				const role = await msg.guild.roles.create({ data: { name: aclass } });
				msg.guild.configs.update('classes', role, { action: 'add' });
				roles.push(role);
			}
			msg.sendMessage(`Roles created: ${roles}`);
		} else {
			msg.sendMessage(msg.language.get('COMMAND_FACTIONS_ARRAY_NOTEMPTY'));
		}
	}

	async streamer(msg) {
		const pos = msg.guild.me.roles.highest.position - 1;
		const streamerRole = await msg.guild.roles.create({ data: { name: 'Streamer', color: 0x6441A4, hoist: true, position: pos } });
		msg.guild.configs.update('streamerRole', streamerRole, msg.guild);
		const blacklistRole = await msg.guild.roles.create({ data: { name: 'Blacklist' } });
		msg.guild.configs.update('blacklistRole', blacklistRole, msg.guild);
		const announceChannel = await msg.guild.channels.create('streams');
		msg.guild.configs.update('announceChannel', announceChannel, msg.guild);
		msg.sendMessage(`Roles created: ${streamerRole}, ${blacklistRole}\nChannel created: ${announceChannel}`);
	}

};
