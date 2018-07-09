const { Command } = require('klasa');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			enabled: true,
			runIn: ['text'],
			botPerms: ['MANAGE_ROLES'],
			requiredConfigs: ['classes'],
			description: (msg) => msg.language.get('COMMAND_CLASS_DESCRIPTION'),
			usage: '<stats|Class:string>'
		});
		this.customizeResponse('Class', this.showRoles);
	}

	showRoles(msg) {
		const roles = [];
		for (const roleid of msg.guild.configs.classes) {
			const role = msg.guild.roles.get(roleid);
			if (role !== undefined) {
				roles.push(role.name);
			}
		}
		return msg.language.get('RESOLVER_INVALID_LITERAL', roles.sort());
	}

	async showStats(msg) {
		const classes = [
			msg.language.get('BLESS_CLASS_BERSEKER'),
			msg.language.get('BLESS_CLASS_GUARDIAN'),
			msg.language.get('BLESS_CLASS_MAGE'),
			msg.language.get('BLESS_CLASS_PALADIN'),
			msg.language.get('BLESS_CLASS_RANGER')
		];
		const classmoji = [
			msg.language.get('BLESS_CLASS_BERSEKER_EMOJI'),
			msg.language.get('BLESS_CLASS_GUARDIAN_EMOJI'),
			msg.language.get('BLESS_CLASS_MAGE_EMOJI'),
			msg.language.get('BLESS_CLASS_PALADIN_EMOJI'),
			msg.language.get('BLESS_CLASS_RANGER_EMOJI')
		];
		let response = `__Class Statistics for ${msg.guild.name}__\n`;
		const classarr = [];
		msg.guild.configs.classes.forEach(async (classid) => {
			const role = msg.guild.roles.get(classid);
			if (role !== undefined) {
				const { name } = role;
				const nidx = classes.indexOf(name);
				const desc = nidx === -1 ? name : classmoji[nidx];
				classarr.push(` **${role.members.size}**x ${desc}`);
			}
		});
		response += classarr.join('|');
		return response;
	}

	async run(msg, [selectedClass]) {
		// No Roles available
		if (msg.guild.configs.classes.length === 0) {
			return msg.sendMessage(msg.language.get('INHIBITOR_REQUIRED_CONFIGS', this.requiredConfigs));
		}

		if (selectedClass === 'stats') {
			return msg.sendMessage(await this.showStats(msg));
		}

		// Find Role
		const role = msg.guild.roles.find(val => val.name.toLowerCase() === selectedClass.toString().toLowerCase());
		if (role === undefined || !msg.guild.configs.classes.includes(role.id)) {
			return msg.sendMessage(this.showRoles(msg));
		}
		// Toggle Role
		if (msg.member.roles.get(role.id)) {
			await msg.member.roles.remove(role);
			return msg.sendMessage(msg.language.get('COMMAND_CLASS_REMOVED', role.name));
		} else {
			await msg.member.roles.add(role);
			return msg.sendMessage(msg.language.get('COMMAND_CLASS_ADDED', role.name));
		}
	}

	async init() {
		if (!this.client.gateways.guilds.schema.has('classes')) {
			await this.client.gateways.guilds.schema.add('classes', { type: 'Role', array: true });
		}
	}

};
