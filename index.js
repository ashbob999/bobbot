require('dotenv').config();

const util = require("./util");
console.log(util.times.name);
// db

const pg = require("./libs/pg");

const client = new pg.Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

client.connect();
query = "SELECT table_schema,table_name FROM information_schema.tables;";
query = "SELECT * FROM times;";
client.query(query, (err, res) => {
  if (err) throw err;
  console.log("s");
  for (let row of res.rows) {
    console.log(JSON.stringify(row));
  }
  console.log("e");
  client.end();
});

// db

const Discord = require("discord.js")

const bot = new Discord.Client();

const TOKEN = process.env.DEV == "true" ? process.env.TEST_BOT : process.env.BOB_BOT;

const config = {
	prefix: "--",
}

let timesChannels = {
	"shit-talk": undefined,
	"bot-channel": undefined,
};

bot.login(TOKEN);

bot.on('ready', () => {
    console.info(`Logged in as ${bot.user.tag}!`);
    
    for (let [key, value] of bot.guilds) {
    	for (let [channelId, channel] of value.channels) {
    		console.log(channel.name);
			if (channel.name in timesChannels) {
    			timesChannels[channel.name] = channelId;
    		}
   	 }
    }
    console.log(timesChannels);
});

bot.on('message', msg => {
	
	if (msg.author.bot) { // don't reply to other bots
		return;
	}
	
	let content = msg.content;
	
	if (!content.startsWith(config.prefix)) {
		return;
	}
	
	content = content.slice(config.prefix.length).trim();
	console.log(content);
	
	let args = content.split(/ +/);
	console.log(args);
	console.log(msg.channel.id);
	
	let author = msg.author;
	
	//console.log(msg.content.split(Discord.MessageMentions.USERS_PATTERN));
	
	/*
	if (msg.mentions.users.has(bot.user.id)) {
		console.log("mention");
	}
	*/
	
    if (msg.content === 'ping') {
        msg.reply('pong2'); // reply with @
        msg.channel.send('pong2'); // reply without @
    }
});
