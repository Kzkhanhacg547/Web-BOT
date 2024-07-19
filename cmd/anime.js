const axios = require('axios');
const path = require('path');
const fs = require('fs-extra');

module.exports.config = {
    name: 'anime',
    version: '1.0.0',
    hasPermssion: 0,
    credits: 'Kz Khánhh, Tiny',
    description: '!',
    commandCategory: 'Hình ảnh',
    usages: '6mui',
    cooldowns: 5
};

module.exports.run = async ({ args }) => {
    const API = 'https://j8c2z9-2007.csb.app/images/anime';
    const response = await axios.get(API);
    const imageUrl = response.data.data;

    const imagePath = path.join(__dirname, '..', 'cache', path.basename(imageUrl));
    const imageResponse = await axios({
        url: imageUrl,
        method: 'GET',
        responseType: 'stream'
    });
    await new Promise((resolve, reject) => {
        const writer = fs.createWriteStream(imagePath);
        imageResponse.data.pipe(writer);
        writer.on('finish', resolve);
        writer.on('error', reject);
    });

    const imageAttachment = { type: 'image', fileName: path.basename(imageUrl), path: imagePath };

    return {
        body: 'Đây là một anime ngẫu nhiên cho bạn! 😊',
        attachment: [imageAttachment]
    };
};
