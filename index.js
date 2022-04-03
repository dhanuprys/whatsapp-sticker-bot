const wa = require('@open-wa/wa-automate');
const express = require('express');
const rimraf = require('rimraf');
const app = express();

rimraf('./media', () => {
    start();
});

function start() {
    app.use(express.static('media'));

    app.listen(3450, () => {
        wa.create({
            multiDevice: true,
            messagePreprocessor: 'AUTO_DECRYPT_SAVE'
        }).then(handleClient);
    });
}

/**
 * 
 * @param {wa.Client} client 
 */
function handleClient(client) {
    console.log('Client started!');

    client.onMessage(
        /**
         * 
         * @param {wa.Message} message 
         */
        function (message) {
            if (message.type === 'image') {
                client.reply(message.from, 'Mengubah gambar menjadi stiker...', message.id).then(() => {
                    client.sendStickerfromUrlAsReply(message.chatId, 'http://localhost:3450/' + message.body, message.id).then(() => {
                        client.sendText(message.from, 'Terima kasih telah menggunakan StickerBot.');
                    });
                });                
            }
        }
    )
}