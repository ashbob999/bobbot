require('dotenv').config();
const wakeUpDyno = require("wakeDyno.js");

import { Client } from 'discord.js';

const bot = new Client();
const TOKEN = process.env.TESTBOT;

const PORT = 3000; // whatever port you like
const DYNO_URL = ""; // the url of your dyno

const app = express(); // instantiate Express app

app.listen(PORT, () => {
    wakeUpDyno(DYNO_URL); // will start once server starts
})

bot.login(TOKEN);

bot.on('ready', () => {
    console.info(`Logged in as ${bot.user.tag}!`);
});

bot.on('message', msg => {
    if (msg.content === 'ping') {
        msg.reply('pong');
        msg.channel.send('pong');

    }
});
