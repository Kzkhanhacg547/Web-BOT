        const axios = require('axios');
        const path = require('path');
        const fs = require('fs-extra');

        module.exports.config = {
            name: 'short',
            version: '1.0.0',
            hasPermssion: 0,
            credits: 'Kz Khánhh, Tiny',
            description: '',
            commandCategory: 'Hình ảnh',
            usages: 'cosplay',
            cooldowns: 5
        };

        module.exports.run = async ({ args }) => {
            const API = 'https://z75ww9-2007.csb.app/khoahoc';
            const response = await axios.get(API);
            const imageUrl = response.data.url;

            const imagePath = path.join(__dirname, '..', 'cache', path.basename(imageUrl));
            const imageResponse = await axios({
                url: imageUrl,
                method: 'GET',
                responseType: 'stream'
            });

            const writer = fs.createWriteStream(imagePath);
            imageResponse.data.pipe(writer);

            // Wait until the download is complete
            await new Promise((resolve, reject) => {
                writer.on('finish', resolve);
                writer.on('error', reject);
            });

            const imageAttachment = { type: 'video', fileName: path.basename(imageUrl) };

            return {
                body: 'Video ngắn',
                attachment: [imageAttachment]
            };
        };
