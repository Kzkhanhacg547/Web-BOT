const axios = require('axios');
const fs = require('fs');
const path = require('path');
const moment = require('moment-timezone');

const instance = axios.create({
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
  },
});

const isURL = u => /^http(|s):\/\//.test(u);

exports.run = async ({ args }) => {
  const str = args.join(' ');

  if (isURL(str)) {
    if (/catbox\.moe/.test(str)) {
      return { body: 'Link CATBOX à\nBot không down được:((' };
    }
    if (/(^https:\/\/)((vm|vt|www|v)\.)?(tiktok|douyin)\.com\//.test(str)) {
      const json = await infoPostTT(str);
      let attachment = [];
      if (json.images) {
        for (const $ of json.images) {
          attachment.push(await streamURL($, 'png'));
        }
      } else {
        attachment = await streamURL(json.play, 'mp4');
      }
      return {
        body: `🖼===[ 𝗧𝗜𝗞𝗧𝗢𝗞 ]===🎼\n✏️ 𝗔𝘂𝘁𝗵𝗼𝗿: ${json.author.nickname}\n📝 𝗧𝗶𝗲̂𝘂 Đ𝗲̂̀ : ${json.title}`,
        attachment
      };
    } else if (/ibb\.co/.test(str)) {
      return { body: `${head('IMGBB')}\n`, attachment: await streamURL(str, str.split('.').pop()) };
    } else if (/imgur\.com/.test(str)) {
      return { body: ` =====imgur=====`, attachment: await streamURL(str, str.split('.').pop()) };
    } else if (/capcut\.com/.test(str)) {
      try {
        const getUrlResponse = await axios.get(`https://ssscap.net/api/download/get-url?url=${str}`);
        const videoId = getUrlResponse.data.url.split("/")[4].split("?")[0];
        const options = {
          method: 'GET',
          url: `https://ssscap.net/api/download/${videoId}`,
          headers: {
            'Connection': 'keep-alive',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36',
            'Cookie': 'sign=08321c1cc11dbdd2d6e3c63f44248dcf; device-time=1699454542608',
            'Referer': 'https://ssscap.net/vi',
            'Host': 'ssscap.net',
            'Accept-Language': 'vi-VN,vi;q=0.9',
            'Accept': 'application/json, text/plain, */*',
            'Sec-Fetch-Dest': 'empty',
            'Sec-Fetch-Site': 'same-origin',
            'Sec-Fetch-Mode': 'cors'
          }
        };
        const response = await axios.request(options);
        const { title, description, usage, originalVideoUrl } = response.data;
        const videoDownloadUrl = `https://ssscap.net${originalVideoUrl}`;
        const stream = (await axios.get(videoDownloadUrl, { responseType: 'stream' })).data;
        return {
          body: `📝 Tiêu đề: ${title}\n🗒 Mô tả: ${description}\n📸 Sử dụng: ${usage}\n🌸 Tự động gửi video link Capcut`,
          attachment: stream
        };
      } catch (error) {
        console.error(error);
        return { body: 'Không thể tải video từ link đã cung cấp' };
      }
    } else if (/soundcloud\.com/.test(str)) {
      const res = (await axios.get(`https://z75ww9-2007.csb.app/soundcloud/download?apikey=kzkhanhz7517222606&link=${str}`));
      const stream = (await axios.get(res.data.result.download, { responseType: "arraybuffer" })).data;
      const path = __dirname + `/cache/1.mp3`;
      fs.writeFileSync(path, Buffer.from(stream, "utf-8"));
      return {
        body: '',
        attachment: fs.createReadStream(path)
      };
    } else if (/zingmp3\.vn/.test(str)) {
      return { body: `${head('ZINGMP3')}\n`, attachment: await streamURL(`https://z75ww9-2007.csb.app/zingmp3/download?apikey=kzkhanhz7517222606&link=${str}`, 'mp3') };
    } else if (/(^https:\/\/)((www)\.)?(pinterest|pin)*\.(com|it)\//.test(str)) {
      const res = await axios.get(`https://api.imgbb.com/1/upload?key=588779c93c7187148b4fa9b7e9815da9&image=${str}`);
      return {
        body: `${head('PINTEREST')}\n- link: ${res.data.data.image.url}`, attachment: await streamURL(res.data.data.image.url, 'jpg')
      };
    } else if (/(^https:\/\/)((www)\.)?(twitter)\.(com)\//.test(str)) {
      const apiUrl = `https://z75ww9-2007.csb.app/twitter/get?url=${str}`;
      const response = await axios.get(apiUrl);
      if (response.data) {
        const twitterData = response.data;
        return {
          body: `${head('TWITTER')}\n- Description: ${twitterData.desc}`,
          attachment: await streamURL(twitterData.HD, 'mp4')
        };
      } else {
        return { body: "Error retrieving Twitter data" };
      }
    } else if (/(^https:\/\/)((www)\.)?(facebook)\.(com)\//.test(str)) {
      const apiUrl = `https://z75ww9-2007.csb.app/fbdownload?url=${str}`;
      const response = await axios.get(apiUrl);
      if (response.data) {
        const facebookData = response.data.data;
        return {
          body: `${head('FACEBOOK')}\n- Title: ${facebookData.title}\n- Source: ${facebookData.source}`,
          attachment: await streamURL(facebookData.medias[0].url, 'mp4')
        };
      } else {
        return { body: "Error retrieving Facebook video data" };
      }
    } else if (/instagram\.com/.test(str)) {
      const res = await axios.get(`https://z75ww9-2007.csb.app/instagram/dlpost?url=${str}`);
      const { videos = [{}], images } = res.data;
      let attachment = [];
      if (videos[0] != undefined) {
        attachment = await streamURL(videos[0], 'mp4');
      } else if (images) {
        for (const $ of typeof images == 'string' ? [images] : images) {
          attachment.push(await streamURL($, 'png'));
        }
      }
      return {
        body: `${head('INSTAGRAM')}\n Tiêu Đề: ${res.data.caption}`,
        attachment
      };
    }

    // Bổ sung phần xử lý cache và gửi file
    const attachment = await streamURL(str, str.split('.').pop());
    return {
      body: `===== Custom Downloader =====\nLink: ${str}`,
      attachment
    };
  }

  return { body: 'Invalid URL provided.' };
};

exports.config = {
  name: 'atd',
  version: '1',
  hasPermssion: 0,
  credits: 'Kz Khánhh',
  description: '',
  commandCategory: 'Tiện ích',
  usages: [],
  cooldowns: 1
};

async function streamURL(url, type) {
  try {
    const response = await axios.get(url, {
      responseType: 'arraybuffer'
    });

    const filePath = path.join(__dirname, 'cache', `${Date.now()}.${type}`);
    fs.writeFileSync(filePath, response.data);

    const fileReadStream = fs.createReadStream(filePath);
    fileReadStream.on('end', () => {
      fs.unlink(filePath, (err) => {
      if (err) throw err;
      });
      });
      return fileReadStream;
      } catch (error) {
      console.error(`Error downloading file from URL: ${url}`, error);
      return null;
      }
      }

      async function infoPostTT(url) {
      const res = (await axios.get(`https://api.tikapi.io/post/info?url=${url}`, {
      headers: {
      'User-Agent': 'okhttp/4.2.2',
      'Referer': 'https://www.tiktok.com/',
      'Cookie': 'sessionid=3f9fd9f8e8bc07bfa1987fa76c7f3e9a; sessionid_ss=3f9fd9f8e8bc07bfa1987fa76c7f3e9a',
      'Authorization': 'Bearer c88a456e-6e29-48de-8021-007fbb491fd8'
      }
      })).data;
      const { video, author, title, origin_cover, desc, download_url } = res.data;
      const json = {
      play: video.play_addr.url_list[0],
      author: { nickname: author.nickname, uid: author.uid },
      title,
      images: [origin_cover.url_list[0], desc],
      download: download_url
      };
      return json;
      }