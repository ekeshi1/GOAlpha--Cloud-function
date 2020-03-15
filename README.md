# GOAlpha--Cloud-function



This function is triggered from an http call performed by Cloud Task.(https://us-central1-push-notif-259017.cloudfunctions.net/campaign-sender-http?campaignId={id}.)
It takes the campaignId as an argument and then performs the following steps :

1.Opens a Db Connections and retrieves all subscriptions of the site.
2. Loops all the subscriptions
3.Send to each of them the campaign data such as title, description, redirectUrl and iconUrl.
4.Correclty updates number Sent.

