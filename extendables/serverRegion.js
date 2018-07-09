const { Extendable } = require('klasa');

module.exports = class extends Extendable {

	constructor(...args) {
		super(...args, {
			appliesTo: ['SettingResolver'],
			name: 'serverregion',
			klasa: true
		});
	}

	async extend(data, guild) {
		const input = data.toUpperCase();
		const serverRegions = ['EU', 'NA'];
		if (serverRegions.includes(input)) return input;
		throw guild.language.get('RESOLVER_INVALID_SERVERREGION');
	}

};
