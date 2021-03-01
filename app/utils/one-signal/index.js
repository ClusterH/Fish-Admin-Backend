const oneSignal = require("onesignal-node");
const config = require("../../config/one-signal.config");
const oneSignalClient = new oneSignal.Client(config.oneSignalAppID, config.oneSignalRestAPIKey);

exports.sendNotification = (refereeId) => {
	const notification = {
		'headings': {en: 'new apply'},
		'contents': {en: 'Referee applied to your match'},
		'include_external_user_ids': [refereeId],
		'data': {tag: 'tag data'}
	};

	oneSignalClient.createNotification(notification)
		.then(res => {
			console.log('push notification sent: ' + JSON.stringify(res));
		})
		.catch(err => {
			console.log('push notification error: ' + JSON.stringify(err));
		});
};