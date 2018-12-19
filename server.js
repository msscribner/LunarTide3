var http = require("http");
var express = require("express");
var bodyParser = require("body-parser");
var path = require("path");
var port = process.env.port || 1337;

//*********************************************************************
// SQL Server
//*********************************************************************
var sql = require("mssql");

var config = {
  user: "sa",
  password: "p@ssw0rd",
  server: "CH-45452",
  database: "LunarTide"
};

// //*********************************************************************
// // MYSQL
// //*********************************************************************
// var sql = require('mysql');
// var connection=mysql.createPool({
//    host:'localhost',
//    user:'root',
//    password:'',
//    database:'lunartide'
//    });

var app = express();
app.use(bodyParser());

//*********************************************************************
// Establish the Static Public
// This is where the .JS files should reside
// This also means that "ASQuery" is the public-facing URL.
// Must reference these files with the "ASQuery" prefix in the Index.HTML (1.	Example: <script src="asquery/script.js"></script>)
//*********************************************************************
app.use("/ASQuery", express.static(path.join(__dirname, "public")));

//*********************************************************************
// Index API's  (Identifies the url and the 'path' to the html)
//*********************************************************************
app.get("/Index", function(request, response) {
  response.sendfile("public/views/Index.html");
});

//*********************************************************************
// ASQuery API's  -- apiGetAllSongs
//*********************************************************************
app.get("/ASQuery/api/apiGetAllSongs", function(req, res) {
  console.error("Attempting to connect userid = ", config.user);
  console.error("Attempting to connect password = ", config.password);
  console.error("Attempting to connect server = ", config.server);
  console.error("Attempting to connect database = ", config.database);

  sql.connect(
    config,
    function(err) {
      console.error("Fetching Data from Songs_Tab");

      if (err) {
        console.error("CONNECTION error: ", err);
        res.statusCode = 503;
        res.send({
          result: "error",
          err: err.code
        });
      } else {
        var request = new sql.Request();
        request.query("select * from Song_Tab", function(err, rows) {
          if (err) {
            console.error(err);
            res.statusCode = 500;
            res.send({
              result: "error",
              err: err.code
            });
          } else {
            res.send({
              result: "success",
              err: "",
              json: rows,
              length: rows.length
            });
            sql.close();
          }
        });
      }
    }
  );
});

//*********************************************************************
// ASQuery API's  -- apiAddSong
//*********************************************************************
app.post("/ASQuery/api/apiAddSong", function(req, res) {
  console.error("Attempting to connect userid = ", config.user);
  console.error("Attempting to connect password = ", config.password);
  console.error("Attempting to connect server = ", config.server);
  console.error("Attempting to connect database = ", config.database);

  var song = req.body.SongName;
  var artist = req.body.ArtistName;

  sql.connect(
    config,
    function(err) {
      console.error("Adding a Song to Songs_Tab");

      if (err) {
        console.error("CONNECTION error: ", err);
        res.statusCode = 503;
        res.send({
          result: "error",
          err: err.code
        });
      } else {
        var request = new sql.Request();

        /* Construct the Insert Query...                                           */
        /* NOTE: Returning the Scope_Identity as 'rows.recordset[0].identityvalue' */
        var temp = [];
        temp.push(
          "INSERT INTO Song_Tab (SongName, ArtistName) VALUES ('" +
            song +
            "', '" +
            artist +
            "') SELECT SCOPE_IDENTITY() as identityvalue"
        );
        query = temp.join("");

        console.log("Executing the following query:" + query);

        request.query(query, function(err, rows) {
          if (err) {
            console.error(err);
            res.statusCode = 500;
            res.send({
              result: "error",
              err: err.code
            });
          } 
          else {
            /* Just for debugging to see the IdentityValue */
            var results = rows.recordset[0].identityvalue;

            res.send({
              result: "success",
              err: "",
              json: rows,
              length: rows.length,
            });

            sql.close();
          }
        });
      }
    }
  );
});

//*********************************************************************
// ASQuery API's  -- apiUpdateSong
//*********************************************************************
app.put("/ASQuery/api/apiUpdateSong", function(req, res) {
  console.error("Attempting to connect userid = ", config.user);
  console.error("Attempting to connect password = ", config.password);
  console.error("Attempting to connect server = ", config.server);
  console.error("Attempting to connect database = ", config.database);

  var id = req.body.ID;
  var song = req.body.SongName;
  var artist = req.body.ArtistName;

  sql.connect(
    config,
    function(err) {
      console.error("Updating a Song to Song_Tab");

      if (err) {
        console.error("CONNECTION error: ", err);
        res.statusCode = 503;
        res.send({
          result: "error",
          err: err.code
        });
      } else {
        var request = new sql.Request();

        var temp = [];

        temp.push(
          "UPDATE Song_Tab SET SongName = '" +
            song +
            "', ArtistName = '" +
            artist +
            "' WHERE Id = '" +
            id +
            "' "
        );
        query = temp.join("");

        console.log("Executing the following query:" + query);

        request.query(query, function(err, rows) {
          if (err) {
            console.error(err);
            res.statusCode = 500;
            res.send({
              result: "error",
              err: err.code
            });
          } else {
            res.send({
              result: "success",
              err: "",
              json: rows,
              length: rows.length
            });

            sql.close();
          }
        });
      }
    }
  );
});

//*********************************************************************
// ASQuery API's  -- apiDeleteSong
// The route is: /ASQuery/api/apiDeleteSong/:id the Calling Controller 
// will append the 'id' of the record to be deleted.
//*********************************************************************
app.delete("/ASQuery/api/apiDeleteSong/:id", function(req, res) {
  console.error("Attempting to connect userid = ", config.user);
  console.error("Attempting to connect password = ", config.password);
  console.error("Attempting to connect server = ", config.server);
  console.error("Attempting to connect database = ", config.database);

  //Pull out of the Params the 'id' field
  const id = parseInt(req.params.id, 10);


  sql.connect(
    config,
    function(err) {
      console.error("Delete a Song from Song_Tab");

      if (err) {
        console.error("CONNECTION error: ", err);
        res.statusCode = 503;
        res.send({
          result: "error",
          err: err.code
        });
      } else {
        var request = new sql.Request();

        var temp = [];

        temp.push("Delete Song_Tab WHERE Id = '" + id + "' ");
        query = temp.join("");

        console.log("Executing the following query:" + query);

        request.query(query, function(err, rows) {
          if (err) {
            console.error(err);
            res.statusCode = 500;
            res.send({
              result: "error",
              err: err.code
            });
          } else {
            res.send({
              result: "success",
              err: "",
              json: rows,
              length: rows.length
            });

            sql.close();
          }
        });
      }
    }
  );
});

/*https://code.msdn.microsoft.com/SQL-Server-CRUD-Actions-6bc910fd/sourcecode?fileId=164040&pathId=829862964*/
/*https://books.google.com/books?id=JevUDQAAQBAJ&pg=PA306&lpg=PA306&dq=node+%22mssql+%22+insert+%22.query%22&source=bl&ots=tlt0hb46di&sig=7QRI6uAu8R3vkYD97dfzoswlTZw&hl=en&sa=X&ved=2ahUKEwjfvaHX7ZvfAhUxtlkKHS3-DUA4HhDoATAGegQICBAB#v=onepage&q=node%20%22mssql%20%22%20insert%20%22.query%22&f=false*/

/*THis works */
/*
app.post('/ASQuery/api/apiAddSong', function (req, res) {
   console.error("Attempting to connect userid = ", config.user);
   console.error("Attempting to connect password = ", config.password);
   console.error("Attempting to connect server = ", config.server);
   console.error("Attempting to connect database = ", config.database);
   
// var id = req.body.Id;
   id = 5;
   var song = req.body.SongName;
   var artist = req.body.ArtistName;

   var setup = config;
   var temp = [];
   temp.push ("INSERT INTO Song_Tab (Id, SongName, ArtistName) VALUES (" + id +", '"+song+"', '"+artist+"')");
   query = temp.join("");


   sql.connect(config).then(function () {
      new sql.Request().query(query, function(err, recordset) {
         callbackFn (recordset);
      });
   });
});
*/

app.get("/ASQuery/api/appfolders", function(req, res) {
  console.error("Attempting to connect userid = ", config.user);
  console.error("Attempting to connect password = ", config.password);
  console.error("Attempting to connect server = ", config.server);
  console.error("Attempting to connect database = ", config.database);

  /*
   sql.connect(config, function (err) {
      console.error("Fetching Data for AppFolderTab");

      if (err) {
         console.error('CONNECTION error: ', err);
         res.statusCode = 503;
         res.send({
            result: 'error',
            err: err.code
         });
      } else {
         var request = new sql.Request();
         request.query('select * from APP_FOLDER_TAB', function (err, rows) {

            if (err) {
               console.error(err);
               res.statusCode = 500;
               res.send({
                  result: 'error',
                  err: err.code
               });
            } else {
               res.send({
                  result: 'success',
                  err: '',
                  json: rows,
                  length: rows.length
               })
            };

            //         request.release();
         });
      }
   });
*/
});

app.listen(port);
console.error("listen on port:" + port);
