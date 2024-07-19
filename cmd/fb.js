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
  name: 'fb',
  version: '0.0.1',
  hasPermssion: 0,
  credits: '',
  description: 'Automatically download media from Facebook links',
  commandCategory: 'System',
  usages: 'fbdown <link>',
  cooldowns: 0
};

exports.run = async ({ args }) => {
  try {
    const url = args[0];
    if (!is_url(url)) {
      return 'Invalid URL';
    }

    if (/facebook.com/.test(url)) {
      const apiUrl = `https://z75ww9-2007.csb.app/fbdownload?url=${url}`;
      const response = await axios.get(apiUrl);

      if (response.data && response.data.data) {
        const facebookData = response.data.data;
        const videoUrl = facebookData.medias[0].url; // Using the first media (you can change the index for different quality)
        const videoPath = await stream_url(videoUrl, 'mp4');

        return {
          body: `Facebook Video\n- Title: ${facebookData.title}\n- Source: ${facebookData.source}`,
          attachment: [{
            fileName: path.basename(videoPath),
            type: 'video'
          }]
        };
      } else {
        throw new Error('Failed to fetch Facebook video data');
      }
    } else {
      return 'Unsupported URL. Please provide a valid Facebook video link.';
    }
  } catch (error) {
    console.error(`Error processing command: ${error}`);
    return 'An error occurred while processing your request';
  }
};