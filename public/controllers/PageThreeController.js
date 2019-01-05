(function() {

   var app = angular.module("LunarTideModule");               /* Set a reference to the module */

   //***************************************************************************
   //* pagethreeFactoryCRUD - FACTORY
   //***************************************************************************
   app.factory('pagethreeFactoryCRUD', function ($http, $q) {
      var baseurl = "/ASQuery/";

      function get_AllGigs() {
         var deferred = $q.defer();

         function onComplete (result) {
            deferred.resolve(result.data);
         }

         function onError (error){
            deferred.reject(error);
         }
         
         $http.get(baseurl + 'api/apiGetAllGigs').then(
            onComplete, onError);
      
        return deferred.promise;
      }//get_AllGigs

      function get_AllSongs() {
         var deferred = $q.defer();

         $http.get(baseurl + 'api/apiGetAllSongs').then(function (result) {
            deferred.resolve(result.data);
         }, function (error) {
            deferred.reject(error);
         });

         return deferred.promise;
      }/*get_AllSongs*/


      function get_AllSetLists() {
         var deferred = $q.defer();

         function onComplete (result) {
            deferred.resolve(result.data);
         }

         function onError (error){
            deferred.reject(error);
         }
         
         $http.get(baseurl + 'api/apiGetAllSetLists').then(
            onComplete, onError);
      
        return deferred.promise;
      }//get_AllSetLists

      function get_GetSetListForGig(jsonObj) {
         var deferred = $q.defer();

         var onComplete = function(result) {
               deferred.resolve(result.data);
         };
         
         var onError = function (error) {
            deferred.reject(error);
         };

         //Two ways to pass in data    
//       $http.get(baseurl + 'api/apiGetSetListForGig' + '?gigid=' + jsonObj.GigId).then(onComplete, onError);  //Calls the ROUTE but .params doesn't contain the data
         $http.get(baseurl + 'api/apiGetSetListForGig', {params: jsonObj}).then(onComplete, onError);

         return deferred.promise;
      }/*get_GetSetListForGig*/

      function post_AddSongToSetlist(jsonObj) {
         var deferred = $q.defer();

         $http.post(baseurl + 'api/apiAddSongToSetlist', jsonObj).then(function (result) {
            deferred.resolve(result.data);
         }, function (error) {
            deferred.reject(error);
         });

         return deferred.promise;
      }/*post_AddSongToSetlist*/

      function delete_DeleteSongFromSetlist(jsonObj) {
         var deferred = $q.defer();

         // Append to the 'route' the 'id' of the record to be deleted
         $http.delete(baseurl + 'api/apiDeleteSongFromSetlist/' + jsonObj.Id).then(function (result) {
            deferred.resolve(result.data);
         }, function (error) {
            deferred.reject(error);
         });

         return deferred.promise;
      }/*delete_DeleteSongFromSetlist*/





      return {
         get_AllGigs: get_AllGigs,
         get_AllSongs: get_AllSongs,
         get_AllSetLists: get_AllSetLists,
         get_GetSetListForGig: get_GetSetListForGig,
         post_AddSongToSetlist: post_AddSongToSetlist,
         delete_DeleteSongFromSetlist: delete_DeleteSongFromSetlist
      };
   });



   //*********************************************************************
   //* Controller 'PageThreeController'  
   //*********************************************************************
   var PageThreeController = function($scope, $interval, $location, pagethreeFactoryCRUD) {

 
      //*********************************************************************
      //* function listbox_move - Move a item up/down in the listbox
      //*********************************************************************
      $scope.listbox_move = function (listID, direction) {
         var listbox = document.getElementById(listID);
         var selIndex = listbox.selectedIndex;

         if(-1 == selIndex) {
            alert("Please select an option to move.");
            return;
         }

         var increment = -1;
         if(direction == 'up')
            increment = -1;
         else
            increment = 1;

         if((selIndex + increment) < 0 ||
            (selIndex + increment) > (listbox.options.length-1)) {
            return;
         }

         var selValue = listbox.options[selIndex].value;
         var selText = listbox.options[selIndex].text;
         listbox.options[selIndex].value = listbox.options[selIndex + increment].value
         listbox.options[selIndex].text = listbox.options[selIndex + increment].text

         listbox.options[selIndex + increment].value = selValue;
         listbox.options[selIndex + increment].text = selText;

         listbox.selectedIndex = selIndex + increment;
      }

      //*********************************************************************
      //* function listbox_moveacross - Move a item from Source to Dest listbox
      //*********************************************************************
      $scope.listbox_moveacross = function (sourceID, destID) {
         var src = document.getElementById(sourceID);
         var dest = document.getElementById(destID);

         for(var count=0; count < src.options.length; count++) {

            if(src.options[count].selected == true) {
                  var option = src.options[count];

                  var newOption = document.createElement("option");
                  newOption.value = option.value;
                  newOption.text = option.text;
                  newOption.selected = true;
                  try {
                        dest.add(newOption, null); //Standard
                        src.remove(count, null);
                  }catch(error) {
                        dest.add(newOption); // IE only
                        src.remove(count);
                  }
                  count--;
            }
         }
      }

      //*********************************************************************
      //* function listbox_selectall - Select all items in a listbox
      //*********************************************************************
      $scope.listbox_selectall = function (listID, isSelect) {
         var listbox = document.getElementById(listID);
         for(var count=0; count < listbox.options.length; count++) {
            listbox.options[count].selected = isSelect;
         }
      }


      //*********************************************************************
      //* function runQuery - navigate to selected Query view
      //*********************************************************************
      $scope.runQuery = function () {

         // //******************************************************************
         // //* Select a Quote/Route to execute
         // //******************************************************************
         // switch($scope.data.selectedQuery) {
         //    case '1':
         //       // $location.path('/seawitch');
         //       $location.path('/pageone');               
         //       $scope.message = "Select option # " + $scope.data.selectedQuery;
         //       break;

         //    case '2':
         //       //$location.path('/Halligans');
         //       $location.path('/pagetwo');
         //       $scope.message = "Select option # " + $scope.data.selectedQuery;
         //       break;

         //    case '3':
         //       //$location.path('/Smoke on the Water');
         //       $location.path('/pagethree');
         //       $scope.message = "Select option # " + $scope.data.selectedQuery;
         //       break;

         //    default:
         //       alert("The Selected Query does not exist!");
         // }

         GetSetListForGig($scope.data.selectedQuery);
      };

      //*********************************************************************
      //* runSave
      //*********************************************************************
      $scope.runSave = function () {
         /*
         Songs: ID, SongName, ArtistName
         SetList: Id, GigId, SongId
         */

         //$scope.data.arrayAssignedSongs

         var GigId = $scope.data.selectedQuery;

         var lbAssigned = document.getElementById('listboxassigned');         

         for(var count=0; count < lbAssigned.options.length; count++) {
            var SongId = lbAssigned.options[count].value;
            var SongName = lbAssigned.options[count].text;
   
            var node = findJsonNode($scope.data.arrayAssignedSongs, "SongId", SongId);

            /*If NOT found, then add song to the SetList */
            if (node == null) {
                  //Post the jsonObj and insert into Database
                  var jsonObj = { GigId: GigId, SongId: SongId };
                  pagethreeFactoryCRUD
                     .post_AddSongToSetlist(jsonObj)
                     .then( function(data) {
                        /* Row was Added Successfully.  Pull out the IdentityValue and insert into the new jsonObj  */
                     },
                     function(error) {
                        console.log(error);
                     }
                  );
            } 
         }

         var lbAvailable = document.getElementById('listboxavailable');
         for(var count=0; count < lbAvailable.options.length; count++) {
            var SongId = lbAvailable.options[count].value;
            var SongName = lbAvailable.options[count].text;
   
            var node = findJsonNode($scope.data.arrayAssignedSongs, "SongId", SongId);

            /*If NOT found, then add song to the SetList */
            if (node != null) {
                  //Post the jsonObj and insert into Database
                  var jsonObj = { Id: node.Id };
                  pagethreeFactoryCRUD
                     .delete_DeleteSongFromSetlist(jsonObj)
                     .then( function(data) {
                        /* Row was Added Successfully.  Pull out the IdentityValue and insert into the new jsonObj  */
                     },
                     function(error) {
                        console.log(error);
                     }
                  );
            } 
         }

      };/*runSave*/


      //*********************************************************************
      //* Fetch all the Gigs
      //*********************************************************************
      function FetchGigs() {
         pagethreeFactoryCRUD
            .get_AllGigs()
            .then(
               function (data) {

                  /* The Fetch returned an Array of Gigs...Associate the data with the Combobox */
                  $scope.arrgigs = data.json.recordset;

                  /* Just used of Debugging to traverse the list */
                  var val;
                  for (val of data.json.recordset) {
                     console.log(val);
                  }
               },
               function (error) {
                  /* If an error has occurred; then display the error */
                  $scope.error = error;
                  console.log(error);
               }
            );
      }/*FetchGigs*/

      //*********************************************************************
      //* Fetch all the SetLists
      //*********************************************************************
      function FetchSetLists() {
         pagethreeFactoryCRUD
            .get_AllSetLists()
            .then(
               function (data) {

                  /* Just used of Debugging to traverse the list */
                  var val;
                  for (val of data.json.recordset) {
                     console.log(val);
                  }
               },
               function (error) {
                  /* If an error has occurred; then display the error */
                  $scope.error = error;
                  console.log(error);
               }
            );
      }/*FetchSetLists*/

      //*********************************************************************
      //* Fetch all the Songs
      //*********************************************************************
      function FetchAllSongs() {
         pagethreeFactoryCRUD
         .get_AllSongs()
         .then(function(data) {
               $scope.arrsongs = data.json.recordset;

               var val;
               for (val of data.json.recordset) {
                  console.log(val);
               }
            },
            function(error) {
               console.log(error);            
            }
         );
      }/*FetchAllSongs*/


      //*********************************************************************
      //* Fetch the SetList for Selected Gig
      //*********************************************************************
      function GetSetListForGig(selectedGig){
         $scope.error = "Selected Gig is[" + selectedGig + "]";
         console.log($scope.error);

         var jsonObj = {};
         jsonObj['GigId'] = selectedGig;



         pagethreeFactoryCRUD
            .get_GetSetListForGig(jsonObj)
            .then(
               function (data) {

                $scope.data.arrayAssignedSongs = data.json.recordset;
                PopulateAssignedListBox();

                  /* Just used of Debugging to traverse the list */
                  var val;
                  for (val of data.json.recordset) {
                     console.log(val);
                  }

               },
               function (error) {
                  /* If an error has occurred; then display the error */
                  $scope.error = error;
                  console.log(error);
               }
            );

      }/*GetSetListForGig*/


      //*********************************************************************
      //* findJsonNode - Helper fxn to find a Json Node in an array
      //*********************************************************************
      function findJsonNode(arr, propName, propValue) {
         for (var i=0; i < arr.length; i++)
           if (arr[i][propName] == propValue)
             return arr[i];
         
         return (null);
      }/*findJsonNode*/


      //*********************************************************************
      //* clearListbox - Clears/deletes all entries from a Listbox
      //*********************************************************************
      function clearListbox(listBox) {
         while (listBox.options.length > 0) {                
            listBox.remove(0);
         }        
      }/*clearListbox*/


      //*********************************************************************
      //* PopulateAssignedListBox
      //*********************************************************************
      function PopulateAssignedListBox() {
         /*
         Songs: ID, SongName, ArtistName
         SetList: Id, GigId, SongId
         */

         var lbAssigned = document.getElementById('listboxassigned');
         var lbAvailable = document.getElementById('listboxavailable');         

         clearListbox (lbAssigned);
         clearListbox (lbAvailable);

         /* Traverse the array of Songs... Determine if song is associated with the selected Gig (arrayAssignedSongs) */
         for (var val of $scope.arrsongs) {
            var node = findJsonNode($scope.data.arrayAssignedSongs, "SongId", val.ID);

            var newOption = document.createElement("option");
            newOption.value = val.ID;
            newOption.text = val.SongName;
//          newOption.selected = true;

            /*If NOT found, then add to the Availiable listbox */
            if (node == null) {
               try {
                  lbAvailable.add(newOption, null); //Standard
               }catch(error) {
                  lbAvailable.add(newOption); // IE only
               }
            } else {
            /*If found, then add to the Assigned listbox */               
               try {
                  lbAssigned.add(newOption, null); //Standard
               }catch(error) {
                  lbAssigned.add(newOption); // IE only
               }
            }
         }/*for*/

      }/*PopulateAssignedListBox*/


      //*********************************************************************
      //* FetchAllData
      //*********************************************************************
      function FetchAllData() {


         //Promise is retruned when Fetching AllGigs is Complete
         var onAllGigsComplete = function(data) {
            $scope.arrgigs = data.json.recordset;

            for (var val of data.json.recordset) {
               console.log(val);
            }
         };
      
         //Promise is retruned on error Fetching AllGigs
         var onAllGigsError = function (error) {
               console.log(error);
         };


         //Promise is retruned when Fetching AllSongs is Complete
         //Once the Fetch for AllSongs is complete, issue Fetch for AllGigs
         var onAllSongsComplete = function(data) {
            $scope.arrsongs = data.json.recordset;

            for (var val of data.json.recordset) {
               console.log(val);
            }

            pagethreeFactoryCRUD.get_AllGigs()
               .then(onAllGigsComplete, onAllGigsError);
         };
         
         //Promise is retruned on error Fetching AllSongs
         var onAllSongsError = function (error) {
               console.log(error);
         };


         pagethreeFactoryCRUD
            .get_AllSongs()
            .then(onAllSongsComplete, onAllSongsError);

      }/*FetchAllData*/




      //*********************************************************************
      //* pageLoad() function 
      //*********************************************************************
      function pageLoad () {
         console.log("Inside the PageThreeController::pageLoad()");

//          FetchGigs();
//          FetchSetLists();
//          FetchAllSongs();
            FetchAllData();

      }/*PageLoad*/

      //*********************************************************************
      //* Call the pageLoad() function any time the page is loaded
      //*********************************************************************
      pageLoad();

   };/*PageThreeController*/

   //************************************************************************
   //* Register the Controller
   //************************************************************************
   app.controller("PageThreeController", PageThreeController);

}());