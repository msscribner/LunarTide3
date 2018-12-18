// Code goes here
(function() {

  //*********************************************************************
  //* Define the Module
  //*********************************************************************
  var app = angular.module("LunarTideModule", ['ui.router']);
  
  //*********************************************************************
  //* Define the Config for the Module
  //*********************************************************************
   app.config(function ($stateProvider, $urlRouterProvider) {



     // For any unmatched url, redirect to /state1
     $urlRouterProvider.otherwise('/index');

     $stateProvider
         // .state('state_main', {
         //    url: "/main",
         //    templateUrl: "ASQuery/views/main.html",
         //    controller: "MainController"
         // })

         .state('state_pageone', {
            url: "/pageone",
            templateUrl: "ASQuery/views/pageone.html",
            controller: "PageOneController"
         })

         .state('state_pageTwo', {
            url: "/pagetwo",
            templateUrl: "ASQuery/views/pagetwo.html",
            controller: "PageTwoController"
         })

         .state('state_pageThree', {
            url: "/pagethree",
            templateUrl: "ASQuery/views/pagethree.html",
            controller: "PageThreeController"
         })

//      alert("In the .Config fxn");

    });

  
}());