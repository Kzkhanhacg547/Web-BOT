const axios = require('axios');
const path = require('path');
const fs = require('fs-extra');

module.exports.config = {
    name: '6mui',
    version: '1.0.0',
    hasPermssion: 0,
    credits: 'Kz Khánhh, Tiny',
    description: 'Trai 6 múi cho mấy chị đẹp nek!',
    commandCategory: 'Hình ảnh',
    usages: '6mui',
    cooldowns: 5
};

module.exports.run = async ({ args }) => {
    const API = 'https://z75ww9-2007.csb.app/6mui';
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
        body: '=== 𝗧𝗥𝗔𝗜 𝟲 𝗠𝗨́𝗜 𝗖𝗛𝗢 𝗠𝗔̂́𝗬 𝗖𝗛𝗜̣ Đ𝗘̣𝗣 𝗡𝗘̀𝗞 ===',
        attachment: [imageAttachment]
    };
};
