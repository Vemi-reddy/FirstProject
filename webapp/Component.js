sap.ui.define([
    "sap/ui/core/UIComponent",
    "test/model/models"
], (UIComponent, models) => {
    "use strict";

    return UIComponent.extend("test.Component", {
        metadata: {
            manifest: "json",
            interfaces: [
                "sap.ui.core.IAsyncContentCreation"
            ]
        },

        init() {
            // call the base component's init function
            UIComponent.prototype.init.apply(this, arguments);
            var oCurrencyModel = new sap.ui.model.json.JSONModel({
                Currencies: [
                    { CurrencyCode: "USD", CurrencyName: "US Dollar" },
                    { CurrencyCode: "EUR", CurrencyName: "Euro" },
                    { CurrencyCode: "GBP", CurrencyName: "British Pound" },
                    { CurrencyCode: "INR", CurrencyName: "Indian Rupee" },
                    { CurrencyCode: "JPY", CurrencyName: "Japanese Yen" }
                ]
            });
        
            // Set it as a global model
            this.setModel(oCurrencyModel, "currencyModel");

            // set the device model
            this.setModel(models.createDeviceModel(), "device");

            // enable routing
            this.getRouter().initialize();
        }
    });
});