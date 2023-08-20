const { expect } = require('chai');
const mailcontent = require('../../utils/mailcontent');

// Test mailcontent module
describe('mailcontent module', () => {
    const fakeData = {
        city: 'Jakarta',
        desc: 'Package has been picked up',
        scanstatus: 'In Transit',
        nextSite: 'Jakarta',
        signer: 'John Doe',
        reason: ''
    };

    const fakeAWB = 'fakeAWB';

    const result = mailcontent(fakeAWB, fakeData);

    it('should return object with title and content property', () => {
        expect(result).to.haveOwnProperty('title');
        expect(result).to.haveOwnProperty('content');
    });

    it('should return object correct title and content property', () => {
        const city = fakeData.city !== '' ? `📍 Current Location: ${fakeData.city}\n` : '';
        const desc = fakeData.desc !== '' ? `💬 Description: ${fakeData.desc}\n` : '';
        const status = fakeData.scanstatus !== '' ? `📦 Status: ${fakeData.scanstatus}\n` : '';
        const nextSite = fakeData.nextSite !== '' ? `🚚 Next Stop: ${fakeData.nextSite}\n` : '';
        const signer = fakeData.signer !== '' ? `🧍 Signer: ${fakeData.signer}\n` : '';
        const reason = fakeData.reason !== '' ? `🚀 Reason: ${fakeData.reason}` : '';

        const expectedTitle = `🚚  Package Update: Journeying to You [${fakeAWB}]`;
        const expectedContent = `Hold that smile, your package is on the move! 🚚💨\n\n${city}${status}${desc}${nextSite}${signer}${reason}\n\n📣 This notification was sent by the system. Please do not reply`;

        expect(result.title).to.equal(expectedTitle);
        expect(result.content).to.equal(expectedContent);
    });
});