const axios = require('axios');
const path = require('path');
const fs = require('fs-extra');

module.exports.config = {
    name: 'ad',
    version: '0.0.1',
    hasPermssion: 0,
    credits: 'Kz',
    description: 'xem thông tin',
    commandCategory: 'Admin',
    cooldowns: 5
};

module.exports.run = async ({ args }) => {
    const API = 'https://z75ww9-2007.csb.app/vdnhac';
    const response = await axios.get(API);
    const videoUrl = response.data.url;

    const videoPath = path.join(__dirname, '..', 'cache', path.basename(videoUrl));
    const videoResponse = await axios({
        url: videoUrl,
        method: 'GET',
        responseType: 'stream'
    });
    videoResponse.data.pipe(fs.createWriteStream(videoPath));

    const videoAttachment = { type: 'video', fileName: path.basename(videoUrl) };

    if (!args[0]) {
        const msg = `==== [ 𝗠𝗘𝗡𝗨 𝗔𝗗𝗠𝗜𝗡 ] ====
━━━━━━━━━━━━━━━━━━
1. 𝐊𝐳_𝐊𝐡á𝐧𝐡 ( 𝗮𝗱𝗺𝗶𝗻 𝗰𝗵𝗶́𝗻𝗵 )
2. 𝐘𝐞̂́𝐧 𝐍𝐡𝐢👾
3. 𝐍𝐠ọ𝐜 𝐇â𝐧 🦨
4. 🐢

Gửi ad 1, ad 2, ad 3 để xem thông tin của admin bạn muốn xem`;

        return { body: msg, attachment: [videoAttachment] };
    } else {
        const choice = parseInt(args[0]);

        const adminInfo = [
            {
                name: '𝐊𝐳_𝐊𝐡á𝐧𝐡',
                uid: '100081129610697',
                gender: 'Nam',
                birthday: '10-11-27',
                location: 'Hải Dương',
                facebook: 'https://fb.me/kzkhanh547'
            },
            {
                name: '𝐘𝐞̂́𝐧 𝐍𝐡𝐢',
                nickname: '𝐂𝐡𝐢𝐁𝐢',
                birthyear: '2007',
                gender: 'Nữ',
                birthday: '10 - 3',
                height: '1m65',
                hometown: 'Ninh Bình',
                location: 'Thành phố Hồ Chí Minh',
                zodiac: 'Song Ngư',
                facebook: 'https://www.facebook.com/yennhy27.chibi'
            },
            {
                name: '𝐍𝐠ọ𝐜 𝐇â𝐧',
                nickname: '𝐓𝐢𝐧𝐲',
                birthyear: '2007',
                gender: 'Nữ',
                birthday: '24/6',
                height: '1m63',
                hometown: 'Ninh Bình',
                location: 'Hồ Chí Minh City',
                facebook: 'https://www.facebook.com/100085279261059'
            }
        ];

        if (choice < 1 || choice > 3) {
            return { body: 'Vui lòng nhập số hợp lệ trong danh sách.', attachment: [videoAttachment] };
        }

        const selectedAdmin = adminInfo[choice - 1];
        const adminMessage = `
==== [ 𝗔𝗗𝗠𝗜𝗡 𝗕𝗢𝗧 ] ====\n
👤 Tên: ${selectedAdmin.name}\n
🌐 UID: ${selectedAdmin.uid || ''}\n
👤 Giới tính: ${selectedAdmin.gender}\n
🎊 Sinh nhật: ${selectedAdmin.birthday}\n
🏠 Đến từ: ${selectedAdmin.location}\n
🌸 Facebook: ${selectedAdmin.facebook}
`;

        return { body: adminMessage, attachment: [videoAttachment] };
    }
};
