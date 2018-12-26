(function() {

   var app = angular.module("LunarTideModule");               /* Set a reference to the module */


   //***************************************************************************
   //* mainFactoryCRUD - FACTORY
   //***************************************************************************
   app.factory('mainFactoryCRUD', function ($http, $q) {
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


      return {
         get_AllGigs: get_AllGigs
      };
   });

  

  //*********************************************************************
  //* Controller 'MainController'  
  //*********************************************************************
   var MainController = function($scope, $interval, $location, mainFactoryCRUD) {
    
   //*********************************************************************
   //* Object 'data'  Contains the entires for the Gig Dropdown
   //*********************************************************************
   /* Originally used to populate the Gig Dropdown */   
   // $scope.data = {
   //    availableOptions: [
   //         { Id: '1', GigName: 'Seawitch' },
   //         { Id: '2', GigName: 'Halligans' },
   //         { Id: '3', GigName: 'Smoke on the Water' }
   //    ]
   // };
 


      //*********************************************************************
      //* function runManageGigs - navigate to Manage Gigs view
      //*********************************************************************
      $scope.runManageGigs = function () {
         $location.path('/pagetwo');
      }/*runManageGigs*/
      
      //*********************************************************************
      //* function runManageSongs - navigate to Manage Songs view
      //*********************************************************************
      $scope.runManageSongs = function () {
         $location.path('/pageone');
      }/*runManageSongs*/               
      
 

      //*********************************************************************
      //* function runQuery - navigate to selected Query view
      //*********************************************************************
      $scope.runQuery = function () {

         //******************************************************************
         //* Select a Quote/Route to execute
         //******************************************************************
         switch($scope.data.selectedQuery) {
            case '1':
               // $location.path('/seawitch');
               $location.path('/pageone');               
               $scope.message = "Select option # " + $scope.data.selectedQuery;
               break;

            case '2':
               //$location.path('/Halligans');
               $location.path('/pagetwo');
               $scope.message = "Select option # " + $scope.data.selectedQuery;
               break;

            case '3':
               //$location.path('/Smoke on the Water');
               $location.path('/pagethree');
               $scope.message = "Select option # " + $scope.data.selectedQuery;
               break;

            default:
               alert("The Selected Query does not exist!");
         }
      };


      //*********************************************************************
      //* pageLoad() function 
      //*********************************************************************
      function pageLoad () {
         console.log("Inside the MainController::pageLoad()");
         
         //*********************************************************************
         //* Fetch all the Gigs
         //*********************************************************************
         mainFactoryCRUD
         .get_AllGigs()
         .then(
            function(data) {

               /* The Fetch returned an Array of Gigs...Associate the data with the Combobox */
               $scope.availableGigs = data.json.recordset;

               /* Just used of Debugging to traverse the list */
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
         
      }/*PageLoad*/

      //*********************************************************************
      //* Call the pageLoad() function any time the page is loaded
      //*********************************************************************
      pageLoad();

   };/*MainController*/





   //************************************************************************
   //* Register the Controller
   //************************************************************************
   app.controller("MainController", MainController);

}());