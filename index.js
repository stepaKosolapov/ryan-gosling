const TelegramBot = require('node-telegram-bot-api');
const config = require('./config');

const bot = new TelegramBot(config.TOKEN, {
    polling: true
});

bot.onText(/\/myid/, (msg, match) => {
    const userId = msg.from.id;
    bot.sendMessage(userId, 'Your user id is: ' + userId);
});

bot.onText(/\/id/, (msg, match) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, 'Chat id is: ' + chatId);
});

const getChance = (percent) => {
    const chance = percent/100;
    return Math.random() <= chance;
};

bot.on('message', (msg) => {
    if(msg.text?.startsWith('/') || msg.text?.startsWith('->')) {
        return;
    }

    const userId = msg.from.id;
    if (msg.chat?.type === "private" && config.ALLOWED_USERS.includes(userId)) {
        const isAnonim = getChance(90);

        if (msg.text) {
            let preparedMessage = msg.text;
            if (!isAnonim) {
                preparedMessage = `-> ${msg.from.username}: ${preparedMessage}`;
            }

            bot.sendMessage(config.CHAT_ID, preparedMessage);
            return;
        }

        if (!isAnonim) {
            bot.sendMessage(config.CHAT_ID, `-> ${msg.from.username}:`);
        }

        if (msg.sticker) {
            bot.sendSticker(config.CHAT_ID, msg.sticker.file_id);
        } else if (msg.photo) {
            bot.sendPhoto(config.CHAT_ID, msg.photo[msg.photo.length - 1]?.file_id);
        }
    }
});

bot.on('polling_error', (e) => {
    console.log(e);
})
