const { Extendable, util } = require('klasa');

module.exports = class extends Extendable {

	constructor(...args) {
		super(...args, {
			appliesTo: ['SettingResolver'],
			name: 'assignablerole',
			klasa: true
		});
	}

	async extend(data, guild, name) {
		const missing = guild.me.missingPermissions('MANAGE_ROLES');
		if (missing.length > 0) throw guild.language.get('INHIBITOR_MISSING_BOT_PERMS', util.toTitleCase(missing.join(', ').split('_').join(' ')));
		const result = await this.client.gateways.resolver.role(data, guild, name) || guild.roles.find('name', data);
		const role = guild.roles.get(result);
		if (guild.me.roles.highest.position < role.position) throw guild.language.get('UNMANAGEABLE_ROLE');
		if (result) return result;
		throw guild.language.get('RESOLVER_INVALID_ROLE', name);
	}

};
