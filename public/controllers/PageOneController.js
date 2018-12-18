(function() {

   var app = angular.module("LunarTideModule");               /* Set a reference to the module */

   

  

   //***************************************************************************
   //* pageongeFactoryCRUD - FACTORY
   //***************************************************************************
   app.factory('pageongeFactoryCRUD', function ($http, $q) {
      var baseurl = "/ASQuery/";


      function getAllSongs() {
         var deferred = $q.defer();

         $http.get(baseurl + 'api/apiGetAllSongs').then(function (result) {
            deferred.resolve(result.data);
         }, function (error) {
            deferred.reject(error);
         });

         return deferred.promise;
      }

      function post_AddSong(jsonObj) {
         var deferred = $q.defer();

         $http.post(baseurl + 'api/apiAddSong', jsonObj).then(function (result) {
            deferred.resolve(result.data);
         }, function (error) {
            deferred.reject(error);
         });

         return deferred.promise;
      }

      function put_UpdateSong(jsonObj) {
         var deferred = $q.defer();

         $http.put(baseurl + 'api/apiUpdateSong', jsonObj).then(function (result) {
            deferred.resolve(result.data);
         }, function (error) {
            deferred.reject(error);
         });

         return deferred.promise;
      }


      return {
         getAllSongs: getAllSongs,
         post_AddSong: post_AddSong,
         put_UpdateSong: put_UpdateSong
      };
   });


   //************************************************************************
   //* PageOne Controller
   //************************************************************************
   var PageOneController = function($scope, $interval, $location, pageongeFactoryCRUD) {

      //*********************************************************************
      //* function setClickedRow - Keep Track of the selected row
      //*********************************************************************
      $scope.setClickedRow = function(index){  //function that sets the value of selectedRow to current index
         $scope.selectedRow = index;
         console.log(index);
      }//setClickedRow

      //*********************************************************************
      //* function runAddSong - Add a song
      //*********************************************************************
      $scope.runAddSong = function () {
         $scope.hideInput = true;
      }//runAddSong

      //*********************************************************************
      //* function runUpdateSong - Add a song
      //*********************************************************************
      $scope.runUpdateSong = function () {
         $scope.hideUpdate = true;

         // Loop through the list of songs and populte the Update fields with the song
         var val;
         var temp1 = $scope.pageonesongs;         
         for (val of temp1) {
            if (val.ID === $scope.selectedRow) {
               $scope.songname = val.SongName;
               $scope.songartist = val.ArtistName;
            }
             console.log(val);
         }            

      }//runUpdateSong
      
      //*********************************************************************
      //* function runDeleteSong - Add a song
      //*********************************************************************
      $scope.runDeleteSong = function () {
         alert("runDeleteSong");
      }//runDeleteSong

      //*********************************************************************
      //* function runOK - Add a song
      //*********************************************************************
      $scope.runOKAddSong = function () {
         $scope.hideInput = false;

         var jsonObj = { SongName: $scope.songname, ArtistName: $scope.songartist};         

         var temp1 = $scope.pageonesongs;
         temp1.push(jsonObj);
         $scope.pageonesongs = temp1;

         //Post the jsonObj and insert into Database
         pageongeFactoryCRUD.post_AddSong(jsonObj).then(function (data) {
            /* Do something here */
            }, function (error) {
               console.log(error);
         });

      }//runOKAddSong


      
      //*********************************************************************
      //* function runOKUpdateSong - Add a song
      //*********************************************************************
      $scope.runOKUpdateSong = function () {
         $scope.hideUpdate = false;

         //Get the Song an Artist... Create a JsonObject and 'Splice' into the list of songs   
         var jsonObj = { ID: $scope.selectedRow, SongName: $scope.songname, ArtistName: $scope.songartist};         
         var temp1 = $scope.pageonesongs;

         var val;
         let  iIndex = 0;
         for (val of temp1) {
            if (val.ID === $scope.selectedRow) {
               temp1.splice(iIndex, 1, jsonObj);
            }

         iIndex++;
         }            
         $scope.pageonesongs = temp1;


         

         //Post the jsonObj and insert into Database
         pageongeFactoryCRUD.put_UpdateSong(jsonObj).then(function (data) {
            /* Do something here */
            }, function (error) {
               console.log(error);
         });

      }//runOKUpdateSong



      //*********************************************************************
      //* function runOKDeleteSong - Delete a song
      //*********************************************************************
      $scope.runOKDeleteSong= function () {
         $scope.hideUpdate = false;

         //Get the Song an Artist... Create a JsonObject and 'Push' onto the list of songs   
         // var jsonObj = { SongName: $scope.songname, ArtistName: $scope.songartist};         
         // var temp1 = $scope.pageonesongs;
         // temp1.push(jsonObj);
         // $scope.pageonesongs = temp1;

         // //Post the jsonObj and insert into Database
         // pageongeFactoryCRUD.post_AddSong(jsonObj).then(function (data) {
         //    /* Do something here */
         //    }, function (error) {
         //       console.log(error);
         // });

      }//runOKDeleteSong



      function pageLoad() {
         console.log ("Inside the PageOneControll::pageLoad()");

         //*********************************************************************
         //* If the AppFolderID is valued, then search and display results
         //*********************************************************************
         // pageongeFactoryCRUD.getAllSongs({ appFolderID: appFolderID } ).then(function (data) {
         //    $scope.appfoldertabitems = data.data.json;
         //    }, function (error) {
         //       console.log(error);
         // });
         pageongeFactoryCRUD.getAllSongs( ).then(function (data) {
            $scope.pageonesongs = data.json.recordset;

            var val;
            for (val of data.json.recordset) {
                console.log(val);
            }            

            }, function (error) {
               console.log(error);
         });


      }/*pageLoad*/

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