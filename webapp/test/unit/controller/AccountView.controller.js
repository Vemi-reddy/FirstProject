/*global QUnit*/

sap.ui.define([
	"test/controller/AccountView.controller"
], function (Controller) {
	"use strict";

	QUnit.module("AccountView Controller");

	QUnit.test("I should test the AccountView controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
