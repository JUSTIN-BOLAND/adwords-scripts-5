function main() {
	var accountName = "Test Account"; //Change this to your account name
	var yourEmail = "ali@atom42.co.uk"; //Change this to your email address. You can add multiple emails by separating them with comma
	var emailBody="Hi Atom,<br> Here are the campaigns with no impressions";
	var noImpCamp=0;
	var campaignsIterator = AdWordsApp.campaigns().get();
	while (campaignsIterator.hasNext()) {
		var campaign = campaignsIterator.next();
		var stats = campaign.getStatsFor('YESTERDAY'); //You can change this value for different date ranges. Check Google Script Guide to learn more. I can't teach you all :D
		if ((stats.getImpressions() == 0)&&(campaign.isEnabled())) {
			emailBody = emailBody + campaign.getName() + "<br>";
			noImpCamp++;
		}
	}
	if (noImpCamp > 0) {
		MailApp.sendEmail(yourEmail,"Alert: " + accountName + " – " + noImpCamp + " Campaigns with no impressions","",{htmlBody: emailBody})
	}
}