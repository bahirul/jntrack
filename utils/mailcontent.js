const mailcontent = function (awb, data) {
    const title = `🚚  Package Update: Journeying to You [${awb}]`;

    const city = data.city !== '' ? `📍 Current Location: ${data.city}\n` : '';
    const desc = data.desc !== '' ? `💬 Description: ${data.desc}\n` : '';
    const status = data.scanstatus !== '' ? `📦 Status: ${data.scanstatus}\n` : '';
    const nextSite = data.nextSite !== '' ? `🚚 Next Stop: ${data.nextSite}\n` : '';
    const signer = data.signer !== '' ? `🧍 Signer: ${data.signer}\n` : '';
    const reason = data.reason !== '' ? `🚀 Reason: ${data.reason}` : '';

    const content = `Hold that smile, your package is on the move! 🚚💨\n\n${city}${status}${desc}${nextSite}${signer}${reason}\n\n📣 This notification was sent by the system. Please do not reply`;

    return {
        title,
        content
    }
}

module.exports = mailcontent;