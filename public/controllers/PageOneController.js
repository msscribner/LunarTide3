(function() {

   var app = angular.module("LunarTideModule");               /* Set a reference to the module */

   

  

   //***************************************************************************
   //* pageongeFactoryCRUD - FACTORY
   //***************************************************************************
   app.factory('pageongeFactoryCRUD', function ($http, $q) {
      var baseurl = "/ASQuery/";


      function get_AllSongs() {
         var deferred = $q.defer();

         $http.get(baseurl + 'api/apiGetAllSongs').then(function (result) {
            deferred.resolve(result.data);
         }, function (error) {
            deferred.reject(error);
         });

         return deferred.promise;
      }/*get_AllSongs*/

      function post_AddSong(jsonObj) {
         var deferred = $q.defer();

         $http.post(baseurl + 'api/apiAddSong', jsonObj).then(function (result) {
            deferred.resolve(result.data);
         }, function (error) {
            deferred.reject(error);
         });

         return deferred.promise;
      }/*post_AddSong*/

      function put_UpdateSong(jsonObj) {
         var deferred = $q.defer();

         var onComplete = function(result) {
               deferred.resolve(result.data);
         };
         
         var onError = function (error) {
            deferred.reject(error);
         };

         $http.put(baseurl + 'api/apiUpdateSong', jsonObj).then(onComplete, onError);

         return deferred.promise;
      }/*put_UpdateSong*/

      function delete_DeleteSong(jsonObj) {
         var deferred = $q.defer();

         // Append to the 'route' the 'id' of the record to be deleted
         $http.delete(baseurl + 'api/apiDeleteSong/' + jsonObj.ID).then(function (result) {
            deferred.resolve(result.data);
         }, function (error) {
            deferred.reject(error);
         });

         return deferred.promise;
      }/*delete_DeleteSong*/




      return {
         get_AllSongs: get_AllSongs,
         post_AddSong: post_AddSong,
         put_UpdateSong: put_UpdateSong,
         delete_DeleteSong: delete_DeleteSong
      };
   });


   //************************************************************************
   //* PageOne Controller
   //************************************************************************
   var PageOneController = function($scope, $interval, $location, pageongeFactoryCRUD) {
         //*********************************************************************
         //* function setClickedRow - Keep Track of the selected row
         //*********************************************************************
         $scope.setClickedRow = function(index) {
            //function that sets the value of selectedRow to current index
            $scope.selectedRow = index;
            console.log(index);
         }; //setClickedRow

         //*********************************************************************
         //* function runAddSong - Add a song
         //*********************************************************************
         $scope.runAddSong = function() {
            $scope.hideInput = true;
         }; //runAddSong

         //*********************************************************************
         //* function runUpdateSong - Update a song
         //*********************************************************************
         $scope.runUpdateSong = function() {
            $scope.hideUpdate = true;

            // Find the Select Song; Populate the Update fields with the song
            var temp1 = $scope.pageonesongs;            
            var jsonObj = temp1[$scope.selectedRow];
            $scope.songname = jsonObj.SongName;
            $scope.songartist = jsonObj.ArtistName;

         }; //runUpdateSong

         //*********************************************************************
         //* function runDeleteSong - Delete a song
         //*********************************************************************
         $scope.runDeleteSong = function () {

            $scope.confirmDelete = false;

            //Get the selected record... Create a JsonObject and 'Splice' (delete) song from list 
            var temp1 = $scope.pageonesongs;
            var jsonObj = temp1[$scope.selectedRow];
            temp1.splice($scope.selectedRow, 1 );
            $scope.pageonesongs = temp1;

            //Post the jsonObj and insert into Database
            pageongeFactoryCRUD
               .delete_DeleteSong(jsonObj)
               .then(function (data) {
                     /* Do something here */

                     /* Display the number of songs */
                     $scope.songcount = $scope.pageonesongs.length;
                  },
                  function (error) {
                     console.log(error);
                  }
               );

         }; //runDeleteSong

         //*********************************************************************
         //* function runOKAddSong - Add a song
         //*********************************************************************
         $scope.runOKAddSong = function() {
            $scope.hideInput = false;

            var jsonObj = { SongName: $scope.songname, ArtistName: $scope.songartist };


            //Post the jsonObj and insert into Database
            pageongeFactoryCRUD
            .post_AddSong(jsonObj)
            .then( function(data) {
                  /* Row was Added Successfully.  Pull out the IdentityValue and insert into the new jsonObj  */
                  var temp1 = $scope.pageonesongs;
                  var identityvalue = data.json.recordset[0].identityvalue;
                  jsonObj.ID = identityvalue;
                  temp1.push(jsonObj);
                  $scope.pageonesongs = temp1;

                  /* Display the number of songs */
                  $scope.songcount = $scope.pageonesongs.length;
               },
               function(error) {
                  console.log(error);
               }
            );
         }; //runOKAddSong

         //*********************************************************************
         //* function runOKUpdateSong - Update a song
         //*********************************************************************
         $scope.runOKUpdateSong = function() {
            $scope.hideUpdate = false;

            // Update the selected Song with the Song and Artist... 
            // Pull out the jsonObject
            // update the fields
            // 'Splice' into the list of songs
            // Reset the list of songs
            var temp1 = $scope.pageonesongs;
            var jsonObj = temp1[$scope.selectedRow];
            jsonObj.SongName = $scope.songname;
            jsonObj.ArtistName = $scope.songartist;


            //Post the jsonObj and insert into Database
            pageongeFactoryCRUD
            .put_UpdateSong(
               jsonObj
            )
            .then(function(data) {
                  /* Do something here */
                  temp1.splice($scope.selectedRow, 1, jsonObj);
                  $scope.pageonesongs = temp1;            
               },
               function(error) {
                  console.log(error);
               }
            );
         }; //runOKUpdateSong

         

         $scope.toggleConfirmDelete = function(toggle) {
            $scope.confirmDelete = toggle;
         }



         function pageLoad() {
            console.log("Inside the PageOneControll::pageLoad()");

            $scope.confirmDelete = false;

            //*********************************************************************
            //* If the AppFolderID is valued, then search and display results
            //*********************************************************************
            pageongeFactoryCRUD
            .get_AllSongs()
            .then(
               function(data) {
                  $scope.pageonesongs =
                  data.json.recordset;

                  var val;
                  for (val of data.json.recordset) {
                     console.log(val);
                  }

                  /* Display the number of songs */
                  $scope.songcount = $scope.pageonesongs.length;

               },
               function(error) {
                  console.log(
                  error
                  );
               }
            );
         } /*pageLoad*/

         //*********************************************************************
         //* Call the pageLoad() function any time the page is loaded
         //*********************************************************************
         pageLoad();
      };/*PageOneController*/







   //************************************************************************
   //* Register the Controller
   //************************************************************************
   app.controller("PageOneController", PageOneController);

}());