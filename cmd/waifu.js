const axios = require('axios');
const path = require('path');
const fs = require('fs-extra');

module.exports.config = {
    name: 'waifu',
    version: '1.0.0',
    hasPermssion: 0,
    credits: 'Kz Khánhh, Tiny',
    description: '!',
    commandCategory: 'Hình ảnh',
    usages: '6mui',
    cooldowns: 5
};

module.exports.run = async ({ args }) => {
    const API = 'https://api.waifu.pics/sfw/waifu';
    const response = await axios.get(API);
    const imageUrl = response.data.url;

    const imagePath = path.join(__dirname, '..', 'cache', path.basename(imageUrl));
    const imageResponse = await axios({
        url: imageUrl,
        method: 'GET',
        responseType: 'stream'
    });
    imageResponse.data.pipe(fs.createWriteStream(imagePath));

    const imageAttachment = { type: 'image', fileName: path.basename(imageUrl) };

    return {
        body: 'Đây là một waifu ngẫu nhiên cho bạn! 😊',
        attachment: [imageAttachment]
    };
};

