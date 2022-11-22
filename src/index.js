let express = require('express')

require('dotenv').config()


const urlscan = require('gabnews-urlscan');

const AWS = require('aws-sdk');



AWS.config.update({
    region: 'us-east-1'
});

var s3 = new AWS.S3();


const PORT = process.env.PORT || 3000
const url = 'https://popularenlinea.com'
let app = express()

const ssmClient = new AWS.SSM({
    apiVersion: '2014-11-06',
    region: 'us-east-1'
});

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

async function getParameter(parameterName) {
    try {
        const { Parameter } = await ssmClient
            .getParameter({
                Name: `${parameterName}`,
                WithDecryption: false,
            })
            .promise()

        return Parameter ? Parameter.Value : null
    } catch (e) {
        console.error(e)
        return null
    }
}

app.get('/', async(req, res) => {

    var apikey = await getParameter('bridge-api-key')
    var options = {
        apiKey: apikey,
        public: true
    };
    var scanner = urlscan(options);

    scanner
        .scanUrl(url)
        .then((result) => {
            let object = JSON.stringify(result, null, 4)
            var buf = Buffer.from(object);
            //Creo el objeto que va a contener el resultado del escaner 
            var data = {
                Bucket: 'bridge-challenge-axel-fulop',
                Key: 'resultado.json',
                Body: buf,
                ContentEncoding: 'base64',
                ContentType: 'application/json',
                ACL: 'public-read'
            };
            //Subo el archivo resultado.json con el output del escaneo
            s3.upload(data, function(err, data) {
                if (err) {
                    console.log(err);
                    console.log('Error uploading data: ', data);
                    res.send('Error: ' + err)
                } else {
                    console.log('succesfully uploaded!!!');
                    var datetime = new Date();
                    res.send('Submission successful at ' + datetime)
                }
            })
        })
        .catch((error) => {
            console.log('URL scan error', error);
            res.send('Error: ' + error)
        });
})


app.use((req, res) => {
    res.status(404).send('404 not found')
})

app.listen(PORT, () => {
    console.log(`Listening on PORT ${PORT}`);
})