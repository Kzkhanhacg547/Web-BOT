const axios = require('axios');
const fs = require('fs');
const path = require('path');

const is_url = url => /^http(s|):\/\//.test(url);

const stream_url = async (url, type) => {
  try {
    const res = await axios.get(url, { responseType: 'arraybuffer' });
    const filePath = path.join('cache', `${Date.now()}.${type}`);
    fs.writeFileSync(filePath, res.data);
    return filePath;
  } catch (error) {
    console.error(`Error streaming URL: ${error}`);
    throw new Error('Error downloading media');
  }
};

exports.config = {
  name: 'tiktok',
  version: '0.0.2',
  hasPermssion: 3,
  credits: '',
  description: 'Automatically download media from TikTok/Douyin links',
  commandCategory: 'System',
  usages: 'atd <link>',
  cooldowns: 0
};

exports.run = async ({ args }) => {
  try {
    const url = args[0];
    if (!is_url(url)) {
      return 'Invalid URL';
    }

    if (/tiktok|douyin.com/.test(url)) {
      const res = await axios.post(`https://www.tikwm.com/api/`, { url });
      if (res.data.code !== 0) {
        throw new Error('Failed to fetch TikTok data');
      }

      const tiktok = res.data.data;
      const attachments = [];

      if (Array.isArray(tiktok.images) && tiktok.images.length > 0) {
        for (const imageUrl of tiktok.images) {
          const imagePath = await stream_url(imageUrl, 'jpg');
          attachments.push({
            fileName: path.basename(imagePath),
            type: 'image'
          });
        }
      } else {
        const videoPath = await stream_url(tiktok.play, 'mp4');
        attachments.push({
          fileName: path.basename(videoPath),
          type: 'video'
        });
      }

      return {
        body: tiktok.title,
        attachment: attachments
      };
    } else {
      return 'Unsupported URL';
    }
  } catch (error) {
    console.error(`Error processing command: ${error}`);
    return 'An error occurred while processing your request';
  }
};
