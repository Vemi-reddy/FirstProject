sap.ui.define([
    "sap/ui/core/mvc/Controller", "sap/ui/core/Fragment", 
    	"sap/m/MessageBox","sap/ui/model/Filter", "sap/ui/model/FilterOperator"
], (Controller, Fragment, MessageBox, Filter,FilterOperator ) => {
    "use strict";

    return Controller.extend("test.controller.AccountView", {
        onInit() {
            var that = this;

            that.oRouter = sap.ui.core.UIComponent.getRouterFor(that);

            that.oRouter.attachRouteMatched(that._handleRouteMatched, that);
            var oModel = new sap.ui.model.odata.v2.ODataModel("/v2/northwind/northwind.svc/");
            this.getView().setModel(oModel);

        },
        _handleRouteMatched: function (oEvent) {
            var that = this;
            var oParameters = oEvent.getParameters();

            if (oParameters.name === "RouteAccountView") {
                this.onRead();

            }

        },
        onRead: function () {
            var oModel = this.getView().getModel("oModel");
            oModel.read("/Customers", {
                success: function (oData, response) {

                    console.log("Data retrieved successfully:", oData);

                },
                error: function (oError) {

                    console.error("Error retrieving data:", oError);

                }
            });
        },



        onCompCode: function () {
            var that = this;

            if (!that._oDialog) {
                that._oDialog = sap.ui.xmlfragment("test.fragment.StandardListItem", that);
                this.getView().addDependent(that._oDialog);
            }

            that._oDialog.open();
        },

        onCustomerSelect: function (oEvent) {
            var oSelectedItem = oEvent.getParameter("listItem");
            var sCustomerID = oSelectedItem.getTitle();

            var oInput = this.getView().byId("value");
            if (oInput) {
                oInput.setValue(sCustomerID);
            }


            this.onCloseCusDialog();
        },

        onCloseCusDialog: function () {
            var that = this;
            if (that._oDialog) {
                that._oDialog.close();
            }
        },

        onRequest: function () {
            var that = this;
            if (!that.olist) {
                // Load the fragment dynamically
                Fragment.load({
                    name: "test.fragment.dialog",
                    id: "product",

                    controller: this
                }).then(function (oSupplier) {

                    that.olist = oSupplier;
                    // that.oSupplierPopup.setTitle("Select Supplier");
                    that.getView().addDependent(that.olist);
                    var oList = sap.ui.core.Fragment.byId("product", "listId");
                    if (oList) {
                        oList.bindAggregation("items", {
                            path: "/Products",
                            template: new sap.m.StandardListItem({
                                title: "{ProductName}",
                                description: "{UnitsInStock}"
                            })
                        });
                    }


                    // Open the dialog with the fragment
                    that.olist.open();
                }.bind(this));
            } else {
                // Open the dialog if it's already loaded
                that.olist.open();
            }
        },
        onSelect: function (oEvent) {

            var oSelectedItem = oEvent.getParameter("listItem");
            var sProductName = oSelectedItem.getTitle();

            // Find the input field and set the selected value
            var oInput = this.getView().byId("value1");
            if (oInput) {
                oInput.setValue(sProductName);
            }

            // Close the dialog
            this.onClose();

        },


        onClose: function () {
            var that = this;
            if (that.olist) {
                that.olist.close();
            }

        },
        onFragment: function (oEvent) {
          var that=this;
            if (!this.oDraggableDialog) {
                this.oDraggableDialog = new sap.m.Dialog({
                    title: "Draggable (only on Desktop) - Available Products",
                    contentWidth: "550px",
                    contentHeight: "300px",
                    // draggable: true,
                    // resizable: true,
                   
                    content: new sap.m.List({
                        id: "idList", 
                        mode: "SingleSelectMaster",
                        items: {
                            path: "/Territories",
                            template: new sap.m.StandardListItem({
                                title: "{TerritoryDescription}",

                            })
                        }
                    }),
                    beginButton: new sap.m.Button({
                        // type: ButtonType.Emphasized,
                        text: "ok",
                        press: function (oEvent) {
                            
                            var oList = sap.ui.getCore().byId("idList"); 
                            var oSelected = oList.getSelectedItem();
                            if (oSelected) {
                                var sSelectedText = oSelected.getTitle();
                                that.getView().byId("value2").setValue(sSelectedText); // Set value in Input field
                            }
                            
                                   that.oDraggableDialog.close();
                        }
                    }),
                    endButton: new sap.m.Button({
                        // type: ButtonType.Emphasized,
                        text: "Close",
                        press: function () {
                            this.oDraggableDialog.close();
                        }.bind(this)
                    })
                });

                //to get access to the controller's model
                this.getView().addDependent(this.oDraggableDialog);
            }

            this.oDraggableDialog.open();
        },
        onValueHelpRequest: function () {
            var that = this;

            // Load the fragment only once
            if (!this.oCurrencyDialog) {
                Fragment.load({
                    id: this.getView().getId(),
                    name: "test.fragment.CurrencyDialog",
                    controller: this
                }).then(function (oDialog) {
                    that.oCurrencyDialog = oDialog;
                    that.getView().addDependent(that.oCurrencyDialog);
                    that.oCurrencyDialog.open();
                });
            } else {
                this.oCurrencyDialog.open();
            }
        },

        onCurrencySelect: function () {
            var oList = this.getView().byId("idCurrencyList");
            var oSelectedItem = oList.getSelectedItem();

            if (oSelectedItem) {
                var sSelectedCurrency = oSelectedItem.getTitle(); // Get Currency Code
                this.getView().byId("idCurrencyInput").setValue(sSelectedCurrency); // Set value
            }

            this.oCurrencyDialog.close();
        },

        onCloseDialog: function () {
            this.oCurrencyDialog.close();
        },
        
        
        onClick: function () {
            var that = this;
            if (!this.oTable) {
                this.oTable= sap.ui.xmlfragment("test.fragment.listitem", this);
                this.getView().addDependent(this.oTable);
            }
                this.oTable.open();
        },
        onDecline:function(oEvent){
            this.oTable.close();
        },
        onSearchField:function(oEvent){
             var oSearchInput= sap.ui.getCore().byId("IdSearch").getValue();
             var oTable1= sap.ui.getCore().byId("idTerritory");
             var oTable2=sap.ui.getCore().byId("idSupplier");
           
             if (oTable1.getVisible()) { // If Territory table is visible
                var oFilter = new sap.ui.model.Filter("TerritoryDescription", sap.ui.model.FilterOperator.Contains, oSearchInput);
                oTable1.getBinding("rows").filter(oFilter);  // Apply filter to Territory table
            } else if (oTable2.getVisible()) { // If Supplier table is visible
                var oFilter = new sap.ui.model.Filter("ContactName", sap.ui.model.FilterOperator.Contains, oSearchInput);
                oTable2.getBinding("rows").filter(oFilter);  // Apply filter to Supplier table
            }
           
        },
        
        onTerritory:function(oEvent){
            // var that = this;
          
          
            // this.onPress("/Territories", "c");
            var oTerritoryTable = sap.ui.getCore().byId("idTerritory");
            var oSupplierTable = sap.ui.getCore().byId("idSupplier");
            // use sap.ui.grtcore instead of this in fragment
            if (oTerritoryTable) {
                oTerritoryTable.setVisible(true);
                oSupplierTable.setVisible(false);
            } else {
                console.log("Territory Table not found.");
            }
          

        },
        onSupplier:function(oEvent){
            var oSupplierTable = sap.ui.getCore().byId("idSupplier");
            var oTerritoryTable = sap.ui.getCore().byId("idTerritory");
            // use sap.ui.grtcore instead of this in fragment
            if (oSupplierTable) {
                oSupplierTable.setVisible(true);
                oTerritoryTable.setVisible(false);
            } else {
                console.log("Table not found.");
            }
        },
        onAdd:function(oEvent){
              var oCompany=this.getView().byId("value").getValue();
              var oDocumentType=this.getView().byId("value1").getValue();
              var oCurrency=this.getView().byId("idCurrencyInput").getValue();
              var oHeaderText=this.getView().byId("value2").getValue();
              if(oCompany==="" || oCurrency==="" || oDocumentType==="" || oHeaderText===""){
                MessageBox.warning("Fill all fields");
              }else{

                
                var oModel = this.getView().getModel();
                var sEntitySet = "/Orders"; // Change this to match your OData service
            
                // Define the empty entry with default values
                var oNewEntry = {
                    CustomerID: "ALFKI", // Required: Use a valid Customer ID
                    EmployeeID: 5, // Required: Use an existing Employee ID
                    OrderDate: new Date().toISOString(), // Correct Date Format
                    ShipName: oCompany // Assuming "Company" is ShipName
                };
                // oModel.submitChanges({
                //     success: function() {
                //         console.log("Empty row added successfully!");
                //     },
                //     error: function(err) {
                //         console.log("Error adding row", err);
                //     }
                // });
                oModel.create(sEntitySet, oNewEntry, {
                    success: function () {
                        sap.m.MessageToast.show("Empty row added successfully!");
            
                        var oTable = this.getView().byId("table1");
                        if (!oTable) {
                            console.error("Table not found. Check your ID.");
                            return;
                        }
            
                        var oBinding = oTable.getBinding("rows");
                        if (oBinding) {
                            oBinding.refresh(true); // Ensure table refreshes
                        }
            
                        oTable.setSelectedIndex(0);
                    }.bind(this),
                    error: function (err) {
                        sap.m.MessageToast.show("Error adding row!");
                        console.error("Error adding row", err);
                    }
                });
              
    //             var oTable = this.getView().byId("table1"); 
    //                if (!oTable) {
    //     console.error("Table not found. Check your ID.");
    //     return;
    // }
    //             oTable.getBinding("oContext").refresh(true);
                
               
    //             oTable.setSelectedIndex(0);
            
              
        }
    },
    onDelete:function(oEvent){
       
        var oTable = this.byId("table1");
        var oModel = oTable.getModel();
        var iSelectedIndex = oTable.getSelectedIndex(); // Get selected row
    
        if (iSelectedIndex === -1) {
            sap.m.MessageToast.show("Please select a row to delete.");
            return;
        }
        if (iSelectedIndex.length > 0) {
            var oModel = this.getView().getModel(); // Get the model
            var  oPath =oTable.getContextByIndex(iSelectedIndex).sPath;
            var aData = oModel.getProperty(oPath); // Assuming table is bound to "/data"
        
            // Remove selected rows from the data array
            iSelectedIndex.sort((a, b) => b - a); // Sort in descending order to prevent index shifting
        
            iSelectedIndex.forEach(index => {
                aData.splice(index, 1); // Remove row
            });
        
            oModel.setProperty("/Orders", aData); // Update model with modified data
            oTable.clearSelection(); // Clear selection after deletion
        }
    //  
        
        
    }

    });
});