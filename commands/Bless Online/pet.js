const { Command } = require('klasa');
const moment = require('moment');
require('moment-duration-format');

class PetSimulator {

	constructor(lvl = 1, exp = 0) {
		this.petLevels = [[0, 0],
			[1200, 640], [1216.666667, 720], [1233.333333, 800], [1250, 920], [1266.666667, 1000],
			[1283.333333, 1120], [1300, 1240], [1316.666667, 1360], [1333.333333, 1480], [1350, 1640],
			[1365, 1800], [1380, 1960], [1395, 2120], [1410, 2280], [1425, 2480],
			[1440, 2680], [1455, 2880], [1470, 3080], [1485, 3280], [1500, 3720],
			[1515, 4120], [1530, 4560], [1545, 4960], [1560, 5360], [1575, 5800],
			[1590, 6640], [1605, 7440], [1620, 8280], [1635, 9560], [1650, 10800],
			[1660, 11920], [1670, 13000], [1680, 14120], [1690, 15960], [1700, 17800],
			[1710, 19600], [1720, 22120], [1730, 24640], [1740, 27080], [1750, 29520],
			[1760, 31880], [1770, 35360], [1780, 38760], [1790, 42120], [1800, 45440]];
		if (lvl > 0 && lvl < this.petLevels.length) this.lvl = lvl;
		else throw Error('Invalid LVL');
		if (exp < this.petLevels[lvl][1]) this.exp = exp;
		else throw Error('Invalid EXP');
		this.sta = this.maxSTA;
		this.ticks = 0;
		this.petOut = false;
	}

	get maxLvl() {
		if (this.lvl < 10) return 10;
		else if (this.lvl < 30) return 30;
		else return 45;
	}

	get maxSTA() {
		return this.petLevels[this.lvl][0];
	}

	get maxEXP() {
		return this.petLevels[this.lvl][1];
	}

	get reqEXP() {
		return this.maxEXP - this.exp;
	}

	get reqSTA() {
		return Math.ceil(this.reqEXP / 5);
	}

	callPet() {
		this.petOut = true;
		this.sta -= 10;
	}

	get status() {
		const duration = moment.duration(this.ticks, 'seconds');
		return `[${duration.format()}] LVL: ${this.lvl}\nSTA: ${this.sta}/${this.maxSTA}\nEXP: ${this.exp}/${this.maxEXP}`;
	}

	restPet() {
		const allSTA = this.reqSTA + 10;
		if (allSTA < this.maxSTA) {
			this.ticks += allSTA;
			this.sta = allSTA;
		} else {
			this.ticks += this.maxSTA;
			this.sta = this.maxSTA;
		}
	}

	levelPet() {
		if (this.petOut === false) throw Error('Call Pet before Leveling');
		if (this.reqSTA < this.sta) {
			this.ticks += this.reqSTA;
			this.exp = this.maxEXP;
			this.sta -= this.reqSTA;
		} else {
			this.ticks += this.sta;
			this.exp += this.sta * 5;
			this.sta = 0;
			this.petOut = false;
		}
		return this.levelUp();
	}

	levelUp() {
		if (this.exp >= this.maxEXP && this.lvl < this.petLevels.length - 1) {
			this.lvl += 1;
			this.exp = 0;
			this.sta = this.maxSTA;
			return true;
		}
		return false;
	}

}

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			description: (msg) => msg.language.get('COMMAND_PET_DESCRIPTION'),
			botPerms: ['ADD_REACTIONS'],
			usage: '<level:int{1,45}> [exp:int{0,45440}]',
			usageDelim: ' '
		});
	}

	async run(msg, [lvl, exp = 0]) {
		const pet = new PetSimulator(lvl, exp);
		const { maxLvl } = pet;
		pet.callPet();
		while (pet.levelPet() && pet.lvl < maxLvl);
		const time = moment.duration(pet.ticks, 'seconds').format('d[d] h[h] m[m] s[s]');
		if (pet.sta > 0) {
			const stat = await msg.sendMessage(msg.language.get('COMMAND_PET_LEVELUP', pet.lvl, time));
			this.addTimer(msg, stat, pet.ticks, msg.language.get('COMMAND_PET_LEVELUP_DONE', pet.lvl));
		} else {
			const txt = [msg.language.get('COMMAND_PET_NOENERGY', pet.lvl, time)];
			if (pet.lvl < 45) txt.push(msg.language.get('COMMAND_PET_EXPREQ', pet.lvl + 1, pet.reqEXP, pet.reqSTA));
			const stat = await msg.sendMessage(txt.join('\n'));
			this.addTimer(msg, stat, pet.ticks, msg.language.get('COMMAND_PET_NOENERGY_DONE', pet.lvl));
		}
	}

	async addTimer(oldMsg, newMsg, time, text) {
		await newMsg.react('⏰');
		const data = await newMsg.awaitReactions(reaction => reaction.users.has(oldMsg.author.id), { time: 15000, max: 1 });
		if (data.firstKey() === '⏰') {
			newMsg.edit(`${newMsg.content}\n*Timer started!*`);
			this.client.schedule.create('reminder', Date.now() + (1000 * time), {
				data: {
					user: oldMsg.author.id,
					text: text,
					channel: newMsg.channel.id
				},
				catchUp: true
			});
		}
	}

};
