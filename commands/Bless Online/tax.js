const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			description: (msg) => msg.language.get('COMMAND_TAX_DESCRIPTION'),
			usage: '<money:int{1,1000000000}>'
		});
	}

	formatMoney(money) {
		const bronze = money % 100;
		const silver = Math.floor((money % 10000) / 100);
		const gold = Math.floor(money / 10000);

		if (gold > 0) return `${gold}${this.langG} ${silver}${this.langS} ${bronze}${this.langB}`;
		if (silver > 0) return `${silver}${this.langS} ${bronze}${this.langB}`;
		return `${bronze} ${this.langB}`;
	}

	async run(msg, money) {
		this.langB = msg.language.get('COMMAND_TAX_BRONZE');
		this.langS = msg.language.get('COMMAND_TAX_SILVER');
		this.langG = msg.language.get('COMMAND_TAX_GOLD');
		const embed = new MessageEmbed()
			.setTitle(msg.language.get('COMMAND_TAX_DESCRIPTION'))
			.setColor(0xDDAA00);
		embed.setDescription(`__Selling Price__: ${this.formatMoney(money)}`);
		const RegFee = Math.floor(money * 0.15);
		embed.addField(msg.language.get('COMMAND_TAX_REGFEE'), this.formatMoney(RegFee), true);
		const PrmFee = Math.floor(money * 0.05);
		embed.addField(msg.language.get('COMMAND_TAX_PRMFEE'), this.formatMoney(PrmFee), true);
		msg.sendMessage(embed);
	}

};
