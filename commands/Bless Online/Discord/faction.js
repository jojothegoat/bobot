const { Command } = require('klasa');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			enabled: true,
			runIn: ['text'],
			botPerms: ['MANAGE_ROLES'],
			requiredConfigs: ['factions'],
			description: (msg) => msg.language.get('COMMAND_FACTION_DESCRIPTION'),
			usage: '<Faction:string>'
		});

		this.customizeResponse('Faction', this.showRoles);
	}

	showRoles(msg) {
		const roles = [];
		for (const roleid of msg.guild.configs.factions) {
			const role = msg.guild.roles.get(roleid);
			if (role !== undefined) {
				roles.push(role.name);
			}
		}
		return msg.language.get('RESOLVER_INVALID_LITERAL', roles.sort());
	}

	async run(msg, faction) {
		// No Roles available
		if (msg.guild.configs.factions.length === 0) {
			return msg.sendMessage(msg.language.get('INHIBITOR_REQUIRED_CONFIGS', this.requiredConfigs));
		}
		// Find Role
		const role = msg.guild.roles.find(val => val.name.toLowerCase() === faction.toString().toLowerCase());
		if (role === undefined || !msg.guild.configs.factions.includes(role.id)) {
			return msg.sendMessage(this.showRoles(msg));
		}
		// Remove old Roles
		var hasRoles = msg.member.roles.filter((mr) => msg.guild.configs.factions.includes(mr.id));
		await msg.member.roles.remove(hasRoles);
		// Given Role removed
		if (hasRoles.get(role.id)) {
			return msg.sendMessage(msg.language.get('COMMAND_FACTION_LEFT', msg.author, role.name));
		// Given Role added
		} else {
			await msg.member.roles.add(role);
			if (hasRoles.size > 0) {
				return msg.sendMessage(msg.language.get('COMMAND_FACTION_SWITCHED', msg.author, role.name));
			}
			return msg.sendMessage(msg.language.get('COMMAND_FACTION_JOINED', msg.author, role.name));
		}
	}

	async init() {
		if (!this.client.gateways.guilds.schema.has('factions')) {
			await this.client.gateways.guilds.schema.add('factions', { type: 'Role', array: true });
		}
	}

};
