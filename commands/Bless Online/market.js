const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');
const rp = require('request-promise-native');
const cheerio = require('cheerio');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			description: (msg) => msg.language.get('COMMAND_MARKET_DESCRIPTION'),
			cooldown: 5,
			usage: '<item:str> [...]'
		});
	}

	getPrice(price) {
		return {
			gold: parseInt(price.children('span.g').text().trim(), 10),
			silver: parseInt(price.children('span.s').text().trim(), 10),
			bronze: parseInt(price.children('span.b').text().trim(), 10)
		};
	}

	serializeItem(item) {
		const itemHolder = item.find('td.col_name > div.wtitem_holder').first();
		const itemPrice = item.find('td.col_price > div.money_holder > p');
		const itemThumb = itemHolder.children('span.item_thumb');
		const itemGraph = item.find('td.col_graph > p > a').first().attr('onclick');
		const graph = itemGraph.match(/graph_open\('(\d+)', '(\d+)', '(\d+)'\)/);

		return {
			lv: parseInt(item.find('td.col_lv > p').first().text().trim(), 10),
			thumb: itemThumb.children('img#open_tooltip').attr('src'),
			count: itemThumb.children('i').text().trim(),
			grade: parseInt(itemThumb.children('data').attr('item_grade'), 10),
			name: itemHolder.children('em').text().trim(),
			category: itemHolder.children('b').text().trim(),
			id: parseInt(graph[1], 10),
			evolution: parseInt(graph[2], 10),
			level: parseInt(graph[3], 10),
			time: item.find('td.col_time > p').first().text().trim(),
			priceEach: this.getPrice(itemPrice.first()),
			priceTotal: this.getPrice(itemPrice.last())
		};
	}

	formatPrice(price) {
		return `${price.gold}${this.langG} ${price.silver}${this.langS} ${price.bronze}${this.langB}`;
	}

	async getItems(region, search, exact) {
		const server = region === 'EU' ? 'ff' : 'vi';
		let url = `https://wic-${server}-lb.blessonline.net/bless/exchange/index.php?ctrl=list&item_name=${search}&sort_type=3&sort_value=2`;
		if (exact) url += '&is_csearch=true';
		const html = await rp.get(url, { resolveWithFullResponse: true });
		const dom = cheerio.load(html.body);
		return dom('div.wt_table > table > tbody > tr');
	}

	buildEmbed(item) {
		const embed = new MessageEmbed();
		embed.setTitle(item.count > 1 ? `${item.name} *(x${item.count})*` : item.name);
		embed.setURL(`https://blesscore.com/en/item/${item.id}/#${item.level}`);
		embed.setColor(this.grades[item.grade]);
		embed.setDescription(`Level ${item.lv}\n**${item.category}**`);
		embed.setThumbnail(item.thumb);
		embed.addField('Price', `${this.formatPrice(item.priceEach)} Each\n${this.formatPrice(item.priceTotal)} Total`);
		embed.setFooter(`Remaining ${item.time}`);
		return embed;
	}

	getServerRegion(msg) {
		const serverRegion = msg.author.configs.region;
		if (serverRegion === null) {
			return msg.guildConfigs.region;
		}
		return serverRegion;
	}

	async run(msg, [...search]) {
		this.langB = msg.language.get('COMMAND_TAX_BRONZE');
		this.langS = msg.language.get('COMMAND_TAX_SILVER');
		this.langG = msg.language.get('COMMAND_TAX_GOLD');
		const region = this.getServerRegion(msg);
		if (region === null) {
			throw msg.language.get('CONFIG_NO_SERVERREGION', msg.guildConfigs.prefix);
		}

		let items = await this.getItems(region, encodeURI(search.join(' ')), true);
		if (items.length === 0) {
			items = await this.getItems(region, encodeURI(search.join(' ')));
		}

		if (items.length > 0) {
			const item = this.serializeItem(items.first());
			msg.sendMessage(this.buildEmbed(item));
		} else {
			msg.sendMessage('This item cannot be found.');
		}
	}

	async init() {
		this.grades = [
			0x7f7f7f,
			0xffffff,
			0x80a94a,
			0x3479be,
			0x686bd7,
			0xb37f47
		];
		const guildSchema = this.client.gateways.guilds.schema;
		if (!guildSchema.has('region')) await guildSchema.add('region', { type: 'ServerRegion' });
		const userSchema = this.client.gateways.users.schema;
		if (!userSchema.has('region')) await userSchema.add('region', { type: 'ServerRegion' });
	}

};
