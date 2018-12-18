(function() {

   var app = angular.module("LunarTideModule");               /* Set a reference to the module */



  

  //*********************************************************************
  //* Controller 'AppController'  
  //*********************************************************************
   var MainController = function($scope, $interval, $location) {
    
   //*********************************************************************
   //* Object 'data'  Contains the entires for the Gig Dropdown
   //*********************************************************************
   $scope.data = {
      availableOptions: [
           { id: '1', name: 'Seawitch' },
           { id: '2', name: 'Halligans' },
           { id: '3', name: 'Smoke on the Water' }
      ]
   };
 

//    var onUserComplete = function(response) {
//      $scope.user = response.data;
//    };
//
//    var onError = function(reason) {
//      $scope.error = "Could not fetch the user";
//    };
//
//
//    $http.get("https://api.github.com/users/robconery")
//      .then(onUserComplete, onError);
//
//    $scope.message = "Hello, Angular!";
//

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

   };





   //************************************************************************
   //* Register the Controller
   //************************************************************************
   app.controller("MainController", MainController);

}());