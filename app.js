var express = require('express'),
    path = require('path'),
    fs = require('fs'),
    formidable = require('formidable');
var MongoClient = require('mongodb').MongoClient;
var bodyParser = require('body-parser')

function setRes(res) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);
}
var app = express();

var staticRoot = __dirname + '/';

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.post('/add_dev',function(req,res){
    setRes(res);    
    MongoClient.connect('mongodb://localhost', function (err, client) 
    {
        var db = client.db('mytestingdb');
        // console.log(req.body)
        db.collection('testDevices', function (err, collection){
            collection.insert(req.body);
        })
    })
    res.send({data:"ok"});
})

app.get('/col_devices',function(req,res,next){
    setRes(res);
    MongoClient.connect('mongodb://localhost', function (err, client) 
    {
        if (err) throw err;
        var db = client.db('mytestingdb');
            db.collection(
                'testDevices', function (err, collection)
                {
                    db.collection('testDevices').find({}).toArray(
                        function(err1,result){
                        if (err1) throw err1;
                        res.send(result);
                        }
                    )
                    
                }
            )  
    })
})
        

app.get('/do', function(req,res,next){

    setRes(res);
    res.send({data:"dodo"})
})

app.get('/fileupload', function(req,res,next){
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
            var oldpath = files.filetoupload.path;
      var newpath = 'C:/share/' + files.filetoupload.name;
      fs.rename(oldpath, newpath, function (err) {
        if (err) throw err;
        res.write('File uploaded and moved!');
        res.end();
    });
})
})

app.set('port', (process.env.PORT || 8080));

app.use(express.static(staticRoot));

app.use(function(req, res, next){
    console.log('a')
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);
    // if the request is not html then move along
    var accept = req.accepts('html', 'json', 'xml');
    if(accept !== 'html'){
        console.log('b')
        return next();
    }
    console.log('c')
    // if the request has a '.' assume that it's for a file, move along
    var ext = path.extname(req.path);
    if (ext !== ''){
        console.log('d')
        return next();
    }

    // fs.createReadStream(staticRoot + 'index.html').pipe(res);
    fs.createReadStream('./index.html').pipe(res);

});

// app.all('/*', function(req, res, next) {
//     console.log('a')
//    res.sendFile('index.html', { root: __dirname + '/' });
// });

app.listen(app.get('port'), function() {
    console.log('app running on port', app.get('port'));
});


