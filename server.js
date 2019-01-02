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
// ASQuery API's  -- apiGetAllGigs
//*********************************************************************
app.get ("/ASQuery/api/apiGetAllGigs", function (req, res) {
  console.log("Attempting to connect userid = ", config.user);
  console.log("Attempting to connect password = ", config.password);
  console.log("Attempting to connect server = ", config.server);
  console.log("Attempting to connect database = ", config.database);

  sql.connect(
    config,
    function(err) {
      console.log("Fetching Data from GIG_TAB");

      if (err) {
        console.error("CONNECTION error: ", err);
        res.statusCode = 503;
        res.send({
          result: "error",
          err: err.code
        });
      } else {
        var request = new sql.Request();
        request.query("select * from GIG_TAB", function(err, rows) {
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
// ASQuery API's  -- apiAddGig
//*********************************************************************
app.post("/ASQuery/api/apiAddGig", function(req, res) {
  console.error("Attempting to connect userid = ", config.user);
  console.error("Attempting to connect password = ", config.password);
  console.error("Attempting to connect server = ", config.server);
  console.error("Attempting to connect database = ", config.database);

  var gigName = req.body.GigName;

  sql.connect(
    config,
    function(err) {
      console.error("Adding a Gig to GIG_TAB");

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
          "INSERT INTO GIG_TAB (GigName) VALUES ('" +
            gigName +
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
// ASQuery API's  -- apiUpdateGig
//*********************************************************************
app.put("/ASQuery/api/apiUpdateGig", function(req, res) {
  console.error("Attempting to connect userid = ", config.user);
  console.error("Attempting to connect password = ", config.password);
  console.error("Attempting to connect server = ", config.server);
  console.error("Attempting to connect database = ", config.database);

  var id = req.body.Id;
  var gigname = req.body.GigName;

  sql.connect(
    config,
    function(err) {
      console.error("Updating a Gig to Gig_Tab");

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
          "UPDATE GIG_TAB SET GigName = '" +
            gigname +
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
// ASQuery API's  -- apiDeleteGig
// The route is: /ASQuery/api/apiDeleteGig/:id the Calling Controller 
// will append the 'id' of the record to be deleted.
//*********************************************************************
app.delete("/ASQuery/api/apiDeleteGig/:id", function(req, res) {
  console.error("Attempting to connect userid = ", config.user);
  console.error("Attempting to connect password = ", config.password);
  console.error("Attempting to connect server = ", config.server);
  console.error("Attempting to connect database = ", config.database);

  //Pull out of the Params the 'id' field
  const id = parseInt(req.params.id, 10);


  sql.connect(
    config,
    function(err) {
      console.error("Delete a Gig from Gig_Tab");

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

        temp.push("Delete Gig_Tab WHERE Id = '" + id + "' ");
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
      console.error("Fetching Data from SONG_TAB");

      if (err) {
        console.error("CONNECTION error: ", err);
        res.statusCode = 503;
        res.send({
          result: "error",
          err: err.code
        });
      } else {
        var request = new sql.Request();
        request.query("select * from SONG_TAB", function(err, rows) {
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
      console.error("Adding a Song to SONG_TAB");

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
          "INSERT INTO SONG_TAB (SongName, ArtistName) VALUES ('" +
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
      console.error("Updating a Song to SONG_TAB");

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
          "UPDATE SONG_TAB SET SongName = '" +
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
      console.error("Delete a Song from SONG_TAB");

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

        temp.push("Delete SONG_TAB WHERE Id = '" + id + "' ");
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
// ASQuery API's  -- apiGetAllSetLists
//*********************************************************************
app.get ("/ASQuery/api/apiGetAllSetLists", function (req, res) {
  console.log("Attempting to connect userid = ", config.user);
  console.log("Attempting to connect password = ", config.password);
  console.log("Attempting to connect server = ", config.server);
  console.log("Attempting to connect database = ", config.database);

  sql.connect(
    config,
    function(err) {
      console.log("Fetching Data from SETLIST_TAB");

      if (err) {
        console.error("CONNECTION error: ", err);
        res.statusCode = 503;
        res.send({
          result: "error",
          err: err.code
        });
      } else {
        var request = new sql.Request();
        request.query("select * from SETLIST_TAB", function(err, rows) {
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
// ASQuery API's  -- apiGetSetListForGig
//*********************************************************************
app.get ("/ASQuery/api/apiGetSetListForGig", function (req, res) {
  console.log("Attempting to connect userid = ", config.user);
  console.log("Attempting to connect password = ", config.password);
  console.log("Attempting to connect server = ", config.server);
  console.log("Attempting to connect database = ", config.database);


  sql.connect(
    config,
    function(err) {
      console.log("Fetching Data from SETLIST_TAB");

      if (err) {
        console.error("CONNECTION error: ", err);
        res.statusCode = 503;
        res.send({
          result: "error",
          err: err.code
        });
      } else {
        var request = new sql.Request();

        const GigId = parseInt(req.query.GigId, 10);

        var temp = [];
        temp.push(
          "SELECT * FROM SETLIST_TAB WHERE GigId = '" +
          GigId +
            "'");
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
// ASQuery API's  -- apiAddSongToSetlist
//*********************************************************************
app.post("/ASQuery/api/apiAddSongToSetlist", function(req, res) {
  console.error("Attempting to connect userid = ", config.user);
  console.error("Attempting to connect password = ", config.password);
  console.error("Attempting to connect server = ", config.server);
  console.error("Attempting to connect database = ", config.database);

  var gigid = req.body.GigId;
  var songid = req.body.SongId;

  sql.connect(
    config,
    function(err) {
      console.error("Adding a Song to SETLIST_TAB");

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
          "INSERT INTO SETLIST_TAB (GigId, SongId) VALUES ('" +
            gigid +
            "', '" +
            songid +
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
// ASQuery API's  -- apiDeleteSongFromSetlist
// The route is: /ASQuery/api/apiDeleteSongFromSetlist/:id the Calling Controller 
// will append the 'id' of the record to be deleted.
//*********************************************************************
app.delete("/ASQuery/api/apiDeleteSongFromSetlist/:id", function(req, res) {
  console.error("Attempting to connect userid = ", config.user);
  console.error("Attempting to connect password = ", config.password);
  console.error("Attempting to connect server = ", config.server);
  console.error("Attempting to connect database = ", config.database);

  //Pull out of the Params the 'id' field
  const id = parseInt(req.params.id, 10);


  sql.connect(
    config,
    function(err) {
      console.error("Delete a Song from SETLIST_TAB");

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

        temp.push("Delete SETLIST_TAB WHERE Id = '" + id + "' ");
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
