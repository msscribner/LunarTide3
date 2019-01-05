(function() {

   var app = angular.module("LunarTideModule");               /* Set a reference to the module */

   //***************************************************************************
   //* mainFactoryCRUD - FACTORY
   //***************************************************************************
   app.factory('mainFactoryCRUD', function ($http, $q) {
      var baseurl = "/ASQuery/";


      return {
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


   //Commented out.  No longer using an Array to populate the ListBox
   // $scope.data = {
   //    arrayAvailableSongs: [
   //         { Id: '1', SongName: 'Song1' },
   //         { Id: '2', SongName: 'Song2' },
   //         { Id: '3', SongName: 'Song3' }
   //    ],
   //    arrayAssignedSongs: [
   //       { Id: '4', SongName: 'Song4' },
   //       { Id: '5', SongName: 'Song5' },
   //    ]
   //   };

   // $scope.Fruits = [
   //    {  Id: 1,   Name: 'Apple' },
   //    {  Id: 2,   Name: 'Mango' },
   //    {  Id: 3,   Name: 'Orange'}
   //   ];   

      
      //*********************************************************************
      //* function runManageSongs - navigate to Manage Songs view
      //*********************************************************************
      $scope.runManageSongs = function () {
         $location.path('/pageone');
         $scope.message = "Select option # " + "Page  1";
      }/*runManageSongs*/               

      //*********************************************************************
      //* function runManageGigs - navigate to Manage Gigs view
      //*********************************************************************
      $scope.runManageGigs = function () {
         $location.path('/pagetwo');
         $scope.message = "Select option # " + "Page  2";
      }/*runManageGigs*/
      
      //*********************************************************************
      //* function runManageSetLists - navigate to Manage SetList view
      //*********************************************************************
      $scope.runManageSetList = function () {
         $location.path('/pagethree');
         $scope.message = "Select option # " + "Page  3";
      }/*runManageSetList*/               
 





      //*********************************************************************
      //* pageLoad() function 
      //*********************************************************************
      function pageLoad () {
         console.log("Inside the MainController::pageLoad()");

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