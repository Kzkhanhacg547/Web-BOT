const axios = require('axios');
const path = require('path');
const fs = require('fs-extra');

module.exports.config = {
    name: 'nhạc',
    version: '1.0.0',
    hasPermssion: 0,
    credits: 'Kz Khánhh, Tiny',
    description: '',
    commandCategory: 'audio',
    usages: 'nhạc',
    cooldowns: 5
};

module.exports.run = async ({ args }) => {
    const API = 'https://z75ww9-2007.csb.app/nhac';
    const response = await axios.get(API);
    const audioUrl = response.data.data;

    const audioPath = path.join(__dirname, '..', 'cache', 'audio.mp3');
    const audioResponse = await axios({
        url: audioUrl,
        method: 'GET',
        responseType: 'stream'
    });

    const writer = fs.createWriteStream(audioPath);
    audioResponse.data.pipe(writer);

    // Wait until the download is complete
    await new Promise((resolve, reject) => {
        writer.on('finish', resolve);
        writer.on('error', reject);
    });

    const audioAttachment = { type: 'audio', fileName: 'audio.mp3', path: './cache/audio.mp3' };

    return {
        body: 'Audio đã được tải về',
        attachment: [audioAttachment]
    };
};
