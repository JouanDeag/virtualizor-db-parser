// Import mysql library
var mysql = require('mysql');
const fs = require('fs');

// Create a connection to the database
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'virtualizor'
});

// Connect to the database
connection.connect(function(err) {
    if (err) {
        console.error('error connecting: ' + err.stack);
        return;
    }
    console.log('connected as id ' + connection.threadId);
});

let getvpsquery = "SELECT  `vpsid`, `vps_name`,  `serid`,  `virt`,  `uid`, `hostname` FROM `virtualizor`.`vps` WHERE `virt`='kvm' AND `serid`='14';"

let result1

let vpsInfo = connection.query(getvpsquery, function(err, result) {
    if (err) throw err;
    result1 = result;
}).on('error', function(err) {
    console.log(err);
});


setTimeout(() => {
    parseResult1(result1);
}, 1000);

function parseResult1(result) {
    let array = [];
    let userres = "";

    result.forEach(function(element) {
        array.push ({
            "vpsid": element.vpsid,
            "vps_name": element.vps_name,
            "serid": element.serid,
            "uid": element.uid,
            "hostname": element.hostname
        });
    });

    array.forEach(element => {

        let userquery = `SELECT email FROM virtualizor.users WHERE uid = "${element.uid}";`;

        let userInfo = connection.query(userquery, function(err, result) {
            if (err) throw err;
            userres += (`${result[0]['email']} - ${element.hostname}\n`);
        }).on('error', function(err) {
            console.log(err);
        });


    });

    setTimeout(() => {
        fs.writeFileSync('output.txt', userres);
        process.exit();
    }, 1000);

}