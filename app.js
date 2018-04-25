var express = require('express');
var app = express();                               // create our app w/ express
var mongoose = require('mongoose');                     // mongoose for mongodb
var morgan = require('morgan');             // log requests to the console (express4)
var bodyParser = require('body-parser');    // pull information from HTML POST (express4)
var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)
var multer = require('multer');
var dir = 'uploads/';
var documentDetails = require('./models/documentDetails');
var fs = require('fs');
var destination = dir;

var upload = multer.diskStorage({ //multers disk storage settings

    destination: function (req, file, cb) {
        cb(null, destination);
    },
    filename: function (req, file, cb) {
        var datetimestamp = Date.now();
        cb(null, file.originalname)
    }
});

var uploadFile = multer({
    storage: upload
}).single('file');

//mongoose.connect('mongodb://poonam:poonam@ds143039.mlab.com:43039/quiz?authSource=quiz'); 
mongoose.connect('mongodb://poonam:poonam@ds157599.mlab.com:57599/uploaddocs'); // connect to mongoDB database on modulus.io

app.use(express.static(__dirname + '/dist/'));                 // set the static files location /public/img will be /img for users
app.use(morgan('dev'));                                         // log every request to the console
app.use(bodyParser.urlencoded({ 'extended': 'true' }));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(methodOverride());
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});
app.listen(8080);
console.log("App listening on port 8080");

app.use(express.static('dist'))
app.post('/api/upload', function (req, res, next) {
    var path = '';
    console.log("folder: ",req.query.folder);
    if(req.query.folder){
        destination = req.query.folder;
    }
    uploadFile(req, res, function (err) {
        if (err) {
            // An error occurred when uploading
            console.log(err);
            return res.status(422).send("an Error occured")
        }
        path = dir + req.file.originalname;        
        if(req.query.folder){
            path = req.query.folder + '/' + req.file.originalname;
            
        }
        documentDetails.update({
            id: req.file.originalname + Date.now()
        }, {
                path: path,
                type: req.file.mimetype,
                name: req.file.originalname,
                lastModified: Date.now(),
                owner: req.query.owner
            }, { upsert: true }, function (err, data) {
                if (err) {
                    console.log("err: ", err);
                    res.json(err);
                } else {
                    console.log("data: ", data);
                    res.json(data);
                }
            })

    });
})

app.get('/api/getAllDocuments', function (req, res, next) {
    documentDetails.find({}, function (err, data) {
        if (err) {
            console.log("err: ", err);
            res.json(err);
        } else {
            console.log("data: ", data);
            res.json(data);
        }
    })
})

app.post('/api/createDirectory', function (req, res, next) {
    var newDirectory = dir + req.query.name;
    let folder = dir;
    if (req.query.folder) {
        folder = req.query.folder + '/';
    }
    newDirectory = folder + req.query.name;
    console.log("new: ", newDirectory);
    console.log(fs.existsSync(newDirectory));
    if (!fs.existsSync(newDirectory)) {
        fs.mkdirSync(newDirectory);
        documentDetails.update({
            id: req.query.name + Date.now()
        }, {
                path: newDirectory,
                type: 'Folder',
                name: req.query.name,
                lastModified: Date.now(),
                owner: req.query.owner
            }, { upsert: true }, function (err, data) {
                if (err) {
                    console.log("err: ", err);
                    res.json(err);
                } else {
                    console.log("data: ", data);
                    res.json(data);
                }
            })
    }
})