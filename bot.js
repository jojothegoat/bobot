const { Client } = require('klasa');
const config = require('./config.json');

new Client({
	prefix: '+',
	providers: { default: 'mongodb' },
	commandLogging: true,
	schedule: { interval: 1000 }
}).login(config.discord.token);
