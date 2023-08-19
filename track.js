
const fs = require('fs');
const path = require('path');
const config = require('./config/config');
const crypto = require('crypto')
const FormData = require('form-data');
const axios = require('axios');
const Table = require('cli-table3');
const nodemailer = require('nodemailer');

(async function () {
    // Check if config.js exists
    if (!fs.existsSync(path.join(__dirname, './config/config.js'))) {
        console.error('config.js not found!');
        process.exit(1);
    }

    // config properties
    const awbs = config.awbs;
    const mailer = config.mailer;
    const notificationTo = config.notification;

    // mailer transporter
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: mailer.auth
    });

    // Check if config.js is empty
    if (awbs.length === 0) {
        console.error('config.js is empty!');
        process.exit(1);
    }

    // run the loop
    for (let i = 0; i < awbs.length; i++) {
        // Check if config.js is valid
        if (!awbs[i].hasOwnProperty('awb') || !awbs[i].hasOwnProperty('phone')) {
            console.error('config.js is invalid!');
            process.exit(1);
        }

        // const last 4 string of phone number
        const last4Phone = awbs[i].phone.slice(-4);

        const pId = awbs[i].pId;
        const pst = crypto.createHash('md5').update(pId + 'j&t2020app!@#').digest("hex");

        /**
         * see: https://www.jet.co.id/track
         */
        const formData = new FormData();
        formData.append('method', 'query/findTrack');
        formData.append('data[billcode]', awbs[i].awb);
        formData.append('data[lang]', 'en');
        formData.append('data[source]', 3);
        formData.append('data[phone]', last4Phone);
        formData.append('pId', pId);
        formData.append('pst', pst);

        const axiosConfig = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'https://www.jet.co.id/index/router/index.html',
            headers: {
                ...formData.getHeaders()
            },
            data: formData
        };

        const response = await axios.request(axiosConfig);

        const result = response.data;

        if (response.status == 200) {
            console.log(`\nTracking for ${awbs[i].awb} (${result.data.serviceType}):`);

            const table = new Table({
                head: ['Scantime', 'Scantype', 'Scanscode', 'Scanstatus', 'Desc', 'NextSite', 'City', 'Signer', 'Reason'],
            })

            // push data to table
            const details = Object.values(result.data.details).reverse();

            // current data
            const current = details[0];

            for (let j = 0; j < details.length; j++) {
                // remove useless data
                delete details[j]['deliveryName'];
                delete details[j]['deliveryTel'];
                delete details[j]['siteName'];
                delete details[j]['latitude'];
                delete details[j]['longitude'];
                delete details[j]['siteType'];

                // push data to table
                table.push(Object.values(details[j]));
            }

            // print table
            console.log(table.toString());

            // create db.json file if not exists
            if (!fs.existsSync(path.join(__dirname, './data/db.json'))) {
                fs.writeFileSync(path.join(__dirname, './data/db.json'), '{}');
            };

            // read db.json file
            const db = JSON.parse(fs.readFileSync(path.join(__dirname, './data/db.json'), 'utf8'));

            // check if awb is already exists in db.json
            if (db.hasOwnProperty(awbs[i].awb)) {
                // check if value is different from details.length
                if (db[awbs[i].awb] !== details.length) {
                    // update db.json
                    db[awbs[i].awb] = details.length;

                    // write db.json
                    fs.writeFileSync(path.join(__dirname, './data/db.json'), JSON.stringify(db, null, 4));

                    // send mail notification
                    const mailtemplate = mailcontent(awbs[i].awb, current);
                    const title = mailtemplate.title;
                    const content = mailtemplate.content;

                    console.log('\nSending notification to %s ...', notificationTo);

                    const mailInfo = await transporter.sendMail({
                        to: notificationTo,
                        subject: title,
                        html: content.replace(/\n/g, '<br>')
                    });

                    console.log('Notification sent: %s', mailInfo.messageId);

                    // notify
                    console.log(`Tracking for ${awbs[i].awb} (${result.data.serviceType}) has been updated!`);
                }
            } else {
                // update db.json
                db[awbs[i].awb] = details.length;

                // write db.json
                fs.writeFileSync(path.join(__dirname, './data/db.json'), JSON.stringify(db, null, 4));

                // send mail notification
                const mailtemplate = mailcontent(awbs[i].awb, current);
                const title = mailtemplate.title;
                const content = mailtemplate.content;

                console.log('\nSending notification to %s ...', notificationTo);

                const mailInfo = await transporter.sendMail({
                    to: notificationTo,
                    subject: title,
                    html: content.replace(/\n/g, '<br>')
                });

                console.log('Notification sent: %s', mailInfo.messageId);

                // notify
                console.log(`Tracking for ${awbs[i].awb} (${result.data.serviceType}) has been added!`);
            }

        } else {
            console.error(`Error: failed to get tracking data ${awbs[i].awb} from jet.co.id`);
        }
    }
})();


function mailcontent(awb, data) {
    const title = `🚚  Package Update: Journeying to You [${awb}]`;

    const city = data.city !== '' ? `📍 Current Location: ${data.city}\n` : '';
    const desc = data.desc !== '' ? `💬 Description: ${data.desc}\n` : '';
    const nextSite = data.nextSite !== '' ? `🚚 Next Stop: ${data.nextSite}\n` : '';
    const signer = data.signer !== '' ? `🧍 Signer: ${data.signer}\n` : '';
    const reason = data.reason !== '' ? `🚀 Reason: ${data.reason}` : '';

    const content = `Hold that smile, your package is on the move! 🚚💨\n\n${city}${desc}${nextSite}${signer}${reason}\n\n📣 This notification was sent by the system. Please do not reply`;

    return {
        title,
        content
    }
}