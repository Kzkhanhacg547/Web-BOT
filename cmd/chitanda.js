const axios = require('axios');
const path = require('path');
const fs = require('fs-extra');

module.exports.config = {
    name: 'chitanda',
    version: '1.0.0',
    hasPermssion: 0,
    credits: 'Kz Khánhh, Tiny',
    description: '',
    commandCategory: 'Hình ảnh',
    usages: 'chitanda',
    cooldowns: 5
};

module.exports.run = async ({ args }) => {
    const API = 'https://z75ww9-2007.csb.app/images/chitanda';
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
        body: 'Ảnh chitanda của bạn đây 🫣',
        attachment: [imageAttachment]
    };
};
