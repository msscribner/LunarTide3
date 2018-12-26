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
      }//get_AllGigs

      
      function post_AddGig(jsonObj) {
         var deferred = $q.defer();

         $http.post(baseurl + 'api/apiAddGig', jsonObj).then(function (result) {
            deferred.resolve(result.data);
         }, function (error) {
            deferred.reject(error);
         });

         return deferred.promise;
      }



      return {
         get_AllGigs: get_AllGigs,
         post_AddGig: post_AddGig
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
         //* function runAddGig - Add a Gig (just enable the entry fields so song can be added)
         //*********************************************************************
         $scope.runAddGig = function() {
            $scope.hideInput = true;
         }; //runAddSong

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
         }; //runOKAddSong



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