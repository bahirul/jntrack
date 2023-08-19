
/**
 * email: Your email address for notification
 */
const notification = "your-notification@mail.com";

/**
 * awb: Tracking AWB number
 * phone: Recipient or sender phone number
 * pId: your browser fingerprint (see README.md)
 * 
 * format: {"awb": "1234567890", "phone": "0810000000", "pId": "ffffffffffffffffffffffffffffffff"}
 */
const awbs = [
    {
        "awb": "1234567890",
        "phone": "0810000000",
        "pId": "ffffffffffffffffffffffffffffffff"
    },
]

/**
 * Mailer for sending notification (GMAIL) // User password app, not regular password !!!
 */
const mailer = {
    "auth": {
        "user": "your-email@gmail.com",
        "pass": "your-password-app"
    }
}

module.exports = {
    notification,
    awbs,
    mailer
};