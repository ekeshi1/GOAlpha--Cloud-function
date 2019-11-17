let mysql=require('mysql');
const webpush = require("web-push");

const publicVapidKey = "BF_boLUPcf7FyCwOKohFf2yI8he_tNVQLU0HjknY87SswjsMi8R1ybXqlOsBh3P6P\n" +
    "AjgEBaRI3XN16H_UhhNnqw";
const privateVapidKey = "TD877cAmEpfpNoj8aGXZGa5HHw3HxYv1FoGbEmc6xnc";

webpush.setVapidDetails(
    "mailto:test@test.com",
    publicVapidKey,
    privateVapidKey
);


/**
 * Responds to any HTTP request.
 *
 * @param {!express:Request} req HTTP request context.
 * @param {!express:Response} res HTTP response context.
 */
exports.sendCampaign =  (req, res) => {
    console.log("triggered");

    const campaignId=req.query.campaignId
    console.log(campaignId);
    var connection = mysql.createConnection({

        user     : process.env.DB_USER,
        password : process.env.DB_PASS,
        database : process.env.DB_NAME,
        socketPath: `/cloudsql/${process.env.CLOUD_SQL_CONNECTION_NAME}`,
    });

    console.log("Performing query");


    connection.query("SELECT \n" +
        "    s.subscription_id,\n" +
        "    s.subscription_string,\n" +
        "    c.notification_title as notificationTitle,\n" +
        "    c.notification_message as notificationMessage,\n" +
        "    c.notification_icon as notificationIcon,\n" +
        "    c.notification_url as notificationUrl\n" +
        "FROM\n" +
        "    push_notif.PN_CAMPAIGNS c\n" +
        "        JOIN\n" +
        "    push_notif.PN_SUBSCRIPTIONS s ON c.id_site = s.project_id\n" +
        "WHERE\n" +
        "    c.id_campaign = ? AND s.is_active = ?",[campaignId,'Y'], async function (error, results, fields) {
        if (error) {
            console.log(error)
            res.status(500).send("Internal Error");
        }
        console.log("Nr of subscriptions: "+results.length);
        let nrSent = 0;
        for(let i=0;i<results.length;i++){
            let row=results[i];
            console.log("Handling row with index" + i)
            const subscription = JSON.parse(row.subscription_string);
            const payload = JSON.stringify({
                "title": row.notificationTitle,
                "message": row.notificationMessage,
                "icon": row.notificationIcon,
                "url": row.notificationUrl,
                "campaignId":campaignId
            })

            try{
                nrSent++;
                await webpush
                    .sendNotification(subscription, payload)
            }
            catch(err){
                console.log(err);
                nrSent--;
            }
            finally{
                console.log("Came down");
                if(i==results.length-1)
                {
                    connection.query("UPDATE `push_notif`.`PN_CAMPAIGNS`\n" +
                        "SET\n" +
                        "`nr_sent` = ?\n" +
                        "WHERE `id_campaign` = ?",[nrSent,campaignId],(err,results)=>{
                        if(err){
                            res.status(500).send("okN't");
                        }
                        res.status(200).send("ok");
                    })




                }

            }
        };


    })
};



