const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');

module.exports.config = {
  name: "vdgirl",
  version: "1.0.1",
  hasPermission: 0,
  credits: "Kz Khánhh",
  description: "Xem video",
  commandCategory: "Video",
  usages: "vdgai",
  cooldowns: 2
};

module.exports.run = async ({ args }) => {
  const videoList = require('./../cmd/json/videogaixinh.json');
  const randomVideo = videoList[Math.floor(Math.random() * videoList.length)].trim();
  const fileName = `${Math.random().toString(36).substring(7)}.${randomVideo.split('.').pop()}`;
  const filePath = path.join('./cache', fileName);

  try {
    const response = await axios({
      method: 'GET',
      url: randomVideo,
      responseType: 'stream'
    });

    await new Promise((resolve, reject) => {
      const stream = fs.createWriteStream(filePath);
      response.data.pipe(stream);
      stream.on('finish', resolve);
      stream.on('error', reject);
    });

    const videoAttachment = { type: 'video', fileName };

    return { 
      body: 'Video gái của bạn đây', 
      attachment: [videoAttachment] 
    };
  } catch (error) {
    console.error('Error downloading video:', error);
    return { body: 'Có lỗi xảy ra khi tải video.' };
  }
};
