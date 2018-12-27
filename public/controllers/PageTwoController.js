(function() {

   var app = angular.module("LunarTideModule");               /* Set a reference to the module */


   //***************************************************************************
   //* pageTwoFactoryCRUD - FACTORY
   //***************************************************************************
   app.factory('pageTwoFactoryCRUD', function ($http, $q) {
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
      }/*get_AllGigs*/

      
      function post_AddGig(jsonObj) {
         var deferred = $q.defer();

         $http.post(baseurl + 'api/apiAddGig', jsonObj).then(function (result) {
            deferred.resolve(result.data);
         }, function (error) {
            deferred.reject(error);
         });

         return deferred.promise;
      }/*post_AddGig*/

      function put_UpdateGig(jsonObj) {
         var deferred = $q.defer();

         var onComplete = function(result) {
               deferred.resolve(result.data);
         };
         
         var onError = function (error) {
            deferred.reject(error);
         };

         $http.put(baseurl + 'api/apiUpdateGig', jsonObj).then(onComplete, onError);

         return deferred.promise;
      }/*put_UpdateGig*/

      function delete_DeleteGig(jsonObj) {
         var deferred = $q.defer();

         // Append to the 'route' the 'id' of the record to be deleted
         $http.delete(baseurl + 'api/apiDeleteGig/' + jsonObj.Id).then(function (result) {
            deferred.resolve(result.data);
         }, function (error) {
            deferred.reject(error);
         });

         return deferred.promise;
      }/*delete_DeleteGig*/




      return {
         get_AllGigs: get_AllGigs,
         post_AddGig: post_AddGig,
         put_UpdateGig: put_UpdateGig,
         delete_DeleteGig: delete_DeleteGig

      };
   });


   //***************************************************************************
   //* PageTwoController - CONTROLLER
   //***************************************************************************
   var PageTwoController = function($scope, $interval, $location, pageTwoFactoryCRUD) {

         //*********************************************************************
         //* function setClickedRow - Keep Track of the selected row
         //*********************************************************************
         $scope.setClickedRow = function(index) {
            //function that sets the value of selectedRow to current index
            $scope.selectedRow = index;
            console.log(index);
         }; //setClickedRow

         //*********************************************************************
         //* function runAddGig - Pushbutton Add - Add a Gig (just enable the entry fields so gig can be added)
         //*********************************************************************
         $scope.runAddGig = function() {
            $scope.hideInput = true;
         }; //runAddGig

         //*********************************************************************
         //* function runOKAddGig - Add a Gig
         //*********************************************************************
         $scope.runOKAddGig = function() {
            $scope.hideInput = false;

            var jsonObj = { GigName: $scope.gigname };


            //Post the jsonObj and insert into Database
            pageTwoFactoryCRUD
            .post_AddGig(jsonObj)
            .then( function(data) {
                  /* Row was Added Successfully.  Pull out the IdentityValue and insert into the new jsonObj  */
                  var temp1 = $scope.giglist;
                  var identityvalue = data.json.recordset[0].identityvalue;
                  jsonObj.Id = identityvalue;
                  temp1.push(jsonObj);
                  $scope.giglist = temp1;
               },
               function(error) {
                  /* If an error has occurred; then display the error */
                  $scope.error = error;
                  console.log(error);
               }
            );
         }; //runOKAddGig


         //*********************************************************************
         //* function runUpdateGig - Pushbutton Update - Update a Gig
         //*********************************************************************
         $scope.runUpdateGig = function() {
            $scope.hideUpdate = true;

            // Find the Select Gig; Populate the Update fields with the Gig
            var temp1 = $scope.giglist;            
            var jsonObj = temp1[$scope.selectedRow];
            $scope.gigname = jsonObj.GigName;

         }; //runUpdateGig


         //*********************************************************************
         //* function runOKUpdateGig - Update a Gig
         //*********************************************************************
         $scope.runOKUpdateGig = function() {
            $scope.hideUpdate = false;

            // Update the selected Gigt... 
            // Pull out the jsonObject
            // update the fields
            // 'Splice' into the list of gigs
            // Reset the list of gigs
            var temp1 = $scope.giglist;
            var jsonObj = temp1[$scope.selectedRow];
            jsonObj.GigName = $scope.gigname;


            //Post the jsonObj and insert into Database
            pageTwoFactoryCRUD
            .put_UpdateGig(
               jsonObj
            )
            .then(function(data) {
                  /* Do something here */
                  temp1.splice($scope.selectedRow, 1, jsonObj);
                  $scope.giglist = temp1;            
               },
               function(error) {
                  console.log(error);
               }
            );
         }; //runOKUpdateGig


         //*********************************************************************
         //* function runDeleteGig - Pushbutton Delete - Delete a Gig
         //*********************************************************************
         $scope.runDeleteGig = function () {

            $scope.confirmDelete = false;

            //Get the selected record... Create a JsonObject and 'Splice' (delete) Gig from list 
            var temp1 = $scope.giglist;
            var jsonObj = temp1[$scope.selectedRow];
            temp1.splice($scope.selectedRow, 1 );
            $scope.giglist = temp1;

            //Post the jsonObj and insert into Database
            pageTwoFactoryCRUD
               .delete_DeleteGig(jsonObj)
               .then(function (data) {
                     /* Do something here */
                  },
                  function (error) {
                     console.log(error);
                  }
               );

         }; //runDeleteGig



         $scope.toggleConfirmDelete = function(toggle) {
            $scope.confirmDelete = toggle;
         }





      //*********************************************************************
      //* pageLoad() 
      //*********************************************************************
      function pageLoad() {
         console.log("Inside the PageTwoControll::pageLoad()");

         //*********************************************************************
         //* Fetch all the Gigs
         //*********************************************************************
         pageTwoFactoryCRUD
         .get_AllGigs()
         .then(
            function(data) {

               /* The Fetch returned an Array of Gigs...Associate the data with the Combobox */
               $scope.giglist = data.json.recordset;

               /* Just used for Debugging to traverse the list */
               var val;
               for (val of data.json.recordset) {
                  console.log(val);
               }
            },
            function(error) {
               /* If an error has occurred; then display the error */
               $scope.error = error;
               console.log(error);
            }
         );

      } /*pageLoad*/

      //*********************************************************************
      //* Call the pageLoad() function any time the page is loaded
      //*********************************************************************
      pageLoad();
   };

   //************************************************************************
   //* Register the Controller
   //************************************************************************
   app.controller("PageTwoController", PageTwoController);

}());