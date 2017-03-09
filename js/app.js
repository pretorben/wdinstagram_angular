"use strict";

angular
  .module("wdinstagram", [
    "ui.router", "ngResource"
  ])
  .config(["$stateProvider",
    RouterFunction
  ])
  .factory("EntryFactory", [
    "$resource",
    EntryFactoryFunction
  ])
  .controller("EntryIndexController", [
    "EntryFactory",
    EntryIndexControllerFunction
  ])
  .controller("EntryNewController", [
    "EntryFactory",
    "$state",
    EntryNewControllerFunction
  ])
  .controller("EntryShowController", [
    "EntryFactory",
    "$stateParams",
    EntryShowControllerFunction
  ])
  .controller("EntryEditController", [
    "EntryFactory",
    "$stateParams",
    "$state",
    EntryEditControllerFunction
  ]);

function RouterFunction($stateProvider){
  $stateProvider
  .state("entryIndex", {
    url: "/entries",
    templateUrl: "js/ng-views/index.html",
    controller: "EntryIndexController",
    controllerAs: "vm"
  })
  .state("entryNew", {
    url: "/entries/new",
    templateUrl: "js/ng-views/new.html",
    controller: "EntryNewController",
    controllerAs: "vm"
  })
  .state("entryShow", {
    url: "/entries/:id",
    templateUrl: "js/ng-views/show.html",
    controller: "EntryShowController",
    controllerAs: "vm"
  })
  .state("entryEdit", {
    url: "/entries/:id/edit",
    templateUrl: "js/ng-views/edit.html",
    controller: "EntryEditController",
    controllerAs: "vm"
  });
}

function EntryFactoryFunction($resource){
  return $resource("http://localhost:3000/entries/:id", {}, {
    update: {method: "PUT"}
  });
}

function EntryIndexControllerFunction(EntryFactory){
  this.entries = EntryFactory.query();
}

function EntryNewControllerFunction(EntryFactory, $state){
  this.entry = new EntryFactory();
  this.create = function(){
    this.entry.$save(function(entry){
      $state.go("entryShow", {id: entry.id});
    });
  };
}

function EntryShowControllerFunction(EntryFactory, $stateParams){
  this.entry = EntryFactory.get({id: $stateParams.id});
}

function EntryEditControllerFunction(EntryFactory, $stateParams, $state){
  this.entry = EntryFactory.get({id: $stateParams.id});
  this.update = function(){
    this.entry.$update({id: $stateParams.id}, function(entry){
      $state.go("entryShow", {id: entry.id});
    });
  };
  this.destroy = function(){
    this.entry.$delete({id: $stateParams.id}, function(){
      $state.go("entryIndex");
    });
  };
}
