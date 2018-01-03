"use strict";

var Customers = function () {
    var that = this,
        currentCustomerEmployee = {},
        customerStore = DevAV.stores.customers,
        customerDataSource = {
            store: customerStore,
            expand: ["State"]
        },
        customerEmployeesStore = DevAV.stores.customer_employees,
        customerStores = [],
        customerContacts = [],
        galleryType = "stores",
        customerData = {},
        contactInfoForm = {},
        customerInfoForm = {},
        customerIsNew,
        allStates = DevAV.allStates,
        allStatesByKey = DevAV.allStatesByKey;

    var customerDetailsInited = $.Deferred(),
        customerEmployeeInited = $.Deferred();



    DevAV.DBCustomFilterFields = [
        { dataField: "Customer_Name", caption: "Name" },
        { dataField: "Customer_CIty", caption: "City" },
        {
            dataField: "Customer_State",
            dataType: "number",
            caption: "State",
            lookup: {
                dataSource: allStates,                
                valueExpr: "ID",
                displayExpr: "Name",
            }
        },
        { dataField: "Customer_Zipcode", caption: "Zipcode", dataType: "number" },
        { dataField: "Customer_Phone", caption: "Phone" }
    ];

    function showCustomerInfo(id, galleryTypeName) {
        galleryType = galleryTypeName;
        $.when(
            DevAV.loadData({
                id: id,
                controller: "Customers",
                method: "Customer_Employees",
                query: "$select=Customer_Employee_ID,Customer_Store_ID,Customer_Employee_First_Name,Customer_Employee_Last_Name,Customer_Employee_Full_Name,Customer_Employee_Position,Customer_Purchase_Authority,Customer_Employee_Prefix,Customer_Employee_Mobile_Phone,Customer_Employee_Email",
                callback: function (results) {
                    customerContacts = results.value;
                }
            }),
            DevAV.loadData({
                id: id,
                controller: "Customers",
                method: "Customer_Store_Locations",
                query: "$expand=Crest&$select=Customer_Store_ID,Customer_Store_Location,Customer_Store_City,Customer_Store_Address,Customer_Store_State,Customer_Store_Zipcode,Crest_ID,Crest/City_Name",
                callback:  function (results) {
                    customerStores = $.map(results.value, function (item) {
                        return $.extend({
                            fullStoreName: customerData.Customer_Name + " (" + item.Customer_Store_City + ", " + allStatesByKey[item.Customer_Store_State].ShortName + ")"
                        }, item);
                    });
                }
             })).done(function () {
                that.customerGallery.option("dataSource", (galleryType == "contacts") ? customerContacts : customerStores);
                that.customerGallery.repaint();
            });
    }

    var gridOptions = {
        dataSource: {},
        paging: {
            pageSize: 9
        },
        pager: {
            showNavigationButtons: true,
            showInfo: true
        },
        selection: {
            mode: 'single'
        },
        groupPanel: {
            visible: true,
            allowColumnDragging: false
        },
        "export": {
            fileName: "Customers"
        },
        onRowRemoved: function(e) {
            e.component.selectRowsByIndexes(1);
        },
        onSelectionChanged: function (selectedItems) {
            if (!selectedItems.selectedRowKeys[0])
                return;

            $(".info.customers-info").show();
            showCustomerInfo(selectedItems.selectedRowKeys[0], galleryType);
            if (that.customersGrid.getSelectedRowsData().length == 1) {
                customerData = selectedItems.selectedRowsData[0];
                $("#customer-name").text(customerData.Customer_Name);
            }
        },
        showColumnLines: false,
        columns: [{
            caption: "Name",
            dataField: "Customer_Name",
        }, {
            caption: "Address",
            dataField: "Customer_Address",
        }, {
            caption: "State",
            groupIndex: 0,
            dataField: "Customer_State",
            dataType: "string",
            customizeText: function(cellInfo) {
                return allStatesByKey[cellInfo.value].Name;
            },
            allowFiltering: false
        }, {
            caption: "City",
            dataField: "Customer_CIty",
            width: 165,
            allowGrouping: false
        }, {
            caption: "State",
            dataField: "Customer_State",
            alignment: "center",
            width: 100,
            lookup: {
                dataSource: allStates,
                displayExpr: "ShortName",
                valueExpr: "ID"
            }
        }, {
            dataField: "Customer_Phone",
            customizeText: function(cellInfo) {
                return DevAV.formatPhoneNumber(cellInfo.valueText);
            },
            visible: false,
            width: 130
        }, {
            caption: "Zipcode",
            dataField: "Customer_Zipcode",
            width: 100
        }, {
            caption: "Details",
            alignment: "center",
            allowHiding: false,
            width: 100,
            cellTemplate: function (element, options) {
                $("<div />").addClass("grid-details").on("dxclick", function (e) {
                    customerData = options.data;
                    customerIsNew = false;
                    that.editCustomerDetails.option("visible", true);
                }).appendTo(element);
            }
        }],
        width: "100%"
    };

    function setContactValues() {
        $("#grid-edit-label")
            .text((currentCustomerEmployee.Customer_Employee_ID ? "Edit" : "Add") + " Customer Contact " + (currentCustomerEmployee.Customer_Employee_Full_Name ? "(" + currentCustomerEmployee.Customer_Employee_Full_Name + ")" : ""));
        contactInfoForm.getEditor("Customer_Store_ID").option("dataSource", customerStores || []);
        contactInfoForm.updateData(currentCustomerEmployee);
        setCurrentStoreInfo(currentCustomerEmployee.Customer_Store_ID);
    }

    function setCurrentStoreInfo(id, setState) {
        $.each(customerStores, function(_, item) {
            if(item.Customer_Store_ID == id) {
                contactInfoForm.updateData("Customer_Store_Address", item.Customer_Store_Address || "");
                contactInfoForm.updateData("Customer_Store_City", item.Customer_Store_City || "");
                contactInfoForm.updateData("Customer_Store_Zipcode", item.Customer_Store_Zipcode || "");
                contactInfoForm.updateData("Customer_Store_State", item.Customer_Store_State || null);
            }
        });
    }

    var customerContactOptions = {
        visible: false, 
        width: 630,
        height: "auto",
        showTitle: false,
        showCloseButton: false,
        onShowing: function() {
            customerEmployeeInited.done(setContactValues);
        },
        onContentReady: function () {
            contactInfoForm = $(".contact-info").dxForm({
                showColonAfterLabel: false,
                showValidationSummary: true,
                onContentReady: function(e) {
                    DevAV.showValidationMessage(e);
                },
                height: 290,
                items: [
                    {
                        itemType: "group",
                        colCount: 2,
                        items: [{
                            dataField: "Customer_Employee_First_Name",
                            editorType: "dxTextBox",
                            validationRules: [{
                                type: "required",
                                message: "First name is required"
                            }],
                            editorOptions: {
                                height: 30
                            },
                            label: {
                                text: "First Name",
                                alignment: "right"
                            }
                        }, {
                            dataField: "Customer_Employee_Last_Name",
                            editorType: "dxTextBox",
                            editorOptions: {
                                height: 30
                            },
                            validationRules: [{
                                type: "required",
                                message: "Last name is required"
                            }],
                            label: {
                                text: "Last Name",
                                alignment: "right"
                            }
                        }, {
                            dataField: "Customer_Employee_Prefix",
                            editorType: "dxSelectBox",
                            label: {
                                text: "Prefix",
                                alignment: "right"
                            },
                            editorOptions: {
                                dataSource: ["Miss", "Mr.", "Mrs.", "Ms.", "Dr"],
                                height: 30
                            }
                        }, {
                            dataField: "Customer_Employee_Position",
                            editorType: "dxTextBox",
                            validationRules: [{
                                type: "required",
                                message: "Position is required"
                            }],
                            editorOptions: {
                                height: 30
                            },
                            label: {
                                text: "Position",
                                alignment: "right"
                            }
                        }, {
                            itemType: "empty",
                            colSpan: 2
                        }, {
                            dataField: "Customer_Store_ID",
                            editorType: "dxSelectBox",
                            colSpan: 2,
                            label: {
                                text: "Store",
                                alignment: "right"
                            },
                            editorOptions: {
                                dataSource: [],
                                height: 30,
                                valueExpr: "Customer_Store_ID",
                                displayExpr: "fullStoreName",
                                onValueChanged: function(data) {
                                    setCurrentStoreInfo(data.value);
                                }
                            }
                        }, {
                            dataField: "Customer_Store_Address",
                            editorType: "dxTextBox",
                            editorOptions: {
                                height: 30,
                                readOnly: true
                            },
                            colSpan: 2,
                            label: {
                                text: "Address",
                                alignment: "right"
                            }
                        }]
                    }, {
                    itemType: "group",
                    colCount: 4,
                    cssClass: "detail-address",
                    items: [{
                            dataField: "Customer_Store_City",
                            editorType: "dxTextBox",
                            colSpan: 2,
                            label: {
                                visible: false
                            },
                            editorOptions: {
                                height: 30,
                                readOnly: true
                            }
                        }, {
                            dataField: "Customer_Store_State",
                            editorType: "dxSelectBox",
                            label: {
                                visible: false
                            },
                            editorOptions: {
                                dataSource: allStates,
                                valueExpr: "ID",
                                displayExpr: "ShortName",
                                height: 30,
                                readOnly: true
                            }
                        }, {
                            dataField: "Customer_Store_Zipcode",
                            editorType: "dxTextBox",
                            label: {
                                visible: false
                            },
                            editorOptions: {
                                height: 30,
                                readOnly: true
                            }
                        }]
                    }, {
                        itemType: "group",
                        colCount: 2,
                        items: [{
                            itemType: "empty",
                            colSpan: 2
                        }, {
                            editorType: "dxTextBox",
                            editorOptions: {
                                height: 30
                            },
                            label: {
                                text: "Business",
                                alignment: "right"
                            }
                        }, {
                            dataField: "Customer_Employee_Email",
                            editorType: "dxTextBox",
                            validationRules: [{
                                type: "email",
                                message: "Please enter a valid email"
                            }],
                            editorOptions: {
                                height: 30
                            },
                            label: {
                                text: "Email",
                                alignment: "right"
                            }
                        }, {
                            dataField: "Customer_Employee_Mobile_Phone",
                            editorType: "dxTextBox",
                            validationRules: [{
                                type: "pattern",
                                pattern: /^\d{10}$/
                            }],
                            editorOptions: {
                                height: 30,
                                maskInvalidMessage: "Please enter a valid phone",
                                mask: "+1(000)000-0000"
                            },
                            label: {
                                text: "Mobile",
                                alignment: "right"
                            }
                        }, {
                            dataField: "Customer_Purchase_Authority",
                            editorType: "dxCheckBox",
                            label: {
                                text: " ",
                                alignment: "right"
                            },
                            editorOptions: {
                                text: "Purchase authority?"
                            }
                        }]
                    }],
                    screenByWidth: function() {
                        return "lg";
                    }
            }).dxForm("instance");

            $("#contact-cancel").dxButton({
                text: "Cancel",
                width: 90,
                height: 30,
                onClick: function () {
                    that.editCustomerContact.option("visible", false);
                }
            });

            $("#contact-save").dxButton({
                text: "Save",
                width: 90,
                height: 30,
                onClick: function() {
                    if(contactInfoForm.validate().isValid) {
                         
                        if(currentCustomerEmployee) {
                            var customerInfo = {
                                Customer_Employee_First_Name: contactInfoForm.getEditor("Customer_Employee_First_Name").option("value"),
                                Customer_Employee_Last_Name: contactInfoForm.getEditor("Customer_Employee_Last_Name").option("value"),
                                Customer_Employee_Prefix: contactInfoForm.getEditor("Customer_Employee_Prefix").option("value"),
                                Customer_Employee_Position: contactInfoForm.getEditor("Customer_Employee_Position").option("value"),
                                Customer_Store_ID: contactInfoForm.getEditor("Customer_Store_ID").option("value"),
                                Customer_Employee_Mobile_Phone: contactInfoForm.getEditor("Customer_Employee_Mobile_Phone").option("value"),
                                Customer_Employee_Email: contactInfoForm.getEditor("Customer_Employee_Email").option("value"),
                                Customer_Purchase_Authority: contactInfoForm.getEditor("Customer_Purchase_Authority").option("value")
                            };

                            customerInfo.Customer_Employee_Full_Name = customerInfo.Customer_Employee_First_Name + " " + customerInfo.Customer_Employee_Last_Name;

                            if (currentCustomerEmployee.Customer_Employee_ID) {
                                customerEmployeesStore.update(currentCustomerEmployee.Customer_Employee_ID, customerInfo)
                                    .done(function () {
                                        that.customersGrid.refresh();
                                        showCustomerInfo(customerData.Customer_ID, galleryType);
                                    })
                                    .fail(function (error) {
                                        alert(error.message);
                                    });
                            } else {
                                customerEmployeesStore.insert(customerInfo)
                                    .done(function () {
                                        that.customersGrid.refresh();
                                    })
                                    .fail(function (error) {
                                        alert(error.message);
                                    });
                            }
                        }
                         
                        that.editCustomerContact.option("visible", false);
                    }
                }
            });

            customerEmployeeInited.resolve();
        }
    };

    function setCustomerValues() {
        $("#grid-details-label")
                .text(customerData.Customer_ID ? ("Customer details (" + customerData.Customer_Name + ")") : "Add Customer");
        customerInfoForm.option("formData", customerData);
    }

    var customerDetailsOptions = {
        visible: false, 
        width: 650,
        height: "auto",
        showTitle: false,
        showCloseButton: false,
        onShowing: function() {
            customerDetailsInited.done(setCustomerValues);
        },
        onContentReady: function() {

            var commonTextBoxSettings = {
                height: 30,
                disabled: !customerIsNew
            },
            commonSelectBoxSettings = {
                disabled: !customerIsNew,
                dataSource: allStates,
                valueExpr: "ID",
                displayExpr: "Name",
                height: 30
            };
 
            customerInfoForm = $(".customer-info").dxForm({
                colCount: 2,
                showColonAfterLabel: false,
                height: 290,
                items: [{
                    dataField: "Customer_Status",
                    editorType: "dxTextBox",
                    label: {
                        text: "Status",
                        alignment: "right"
                    },
                    editorOptions: commonTextBoxSettings
                }, {
                    dataField: "Customer_Total_Stores",
                    editorType: "dxTextBox",
                    label: {
                        text: "Total Stores",
                        alignment: "right"
                    },
                    editorOptions: commonTextBoxSettings
                }, {
                    dataField: "Customer_Annual_Revenue",
                    editorType: "dxTextBox",
                    label: {
                        text: "Annual Revenue",
                        alignment: "right"
                    },
                    editorOptions: commonTextBoxSettings
                }, {
                    dataField: "Customer_Total_Employees",
                    editorType: "dxTextBox",
                    label: {
                        text: "Total Employees",
                        alignment: "right"
                    },
                    editorOptions: commonTextBoxSettings
                }, {
                    itemType: "empty",
                    colSpan: 2,
                    cssClass: "empty-row"
                }, {
                    dataField: "Customer_State",
                    editorType: "dxSelectBox",
                    label: {
                        text: "State",
                        alignment: "right"
                    },
                    editorOptions: commonSelectBoxSettings
                }, {
                    dataField: "Customer_Zipcode",
                    editorType: "dxNumberBox",
                    label: {
                        text: "Zip Code",
                        alignment: "right"
                    },
                    editorOptions: commonTextBoxSettings
                }, {
                    dataField: "Customer_CIty",
                    editorType: "dxTextBox",
                    label: {
                        text: "City",
                        alignment: "right"
                    },
                    editorOptions: commonTextBoxSettings
                }, {
                    dataField: "Customer_Address",
                    editorType: "dxTextBox",
                    label: {
                        text: "Address",
                        alignment: "right"
                    },
                    editorOptions: commonTextBoxSettings
                }, {
                    dataField: "Customer_Phone",
                    editorType: "dxTextBox",
                    label: {
                        text: "Phone",
                        alignment: "right"
                    },
                    editorOptions: {
                        height: 30,
                        disabled: !customerIsNew,
                        mask: "+1(000)000-0000"
                    }
                }, {
                    dataField: "Customer_Fax",
                    editorType: "dxTextBox",
                    label: {
                        text: "Fax",
                        alignment: "right"
                    },
                    editorOptions: {
                        height: 30,
                        disabled: !customerIsNew,
                        mask: "+1(000)000-0000"
                    }
                }, {
                    itemType: "empty",
                    colSpan: 2,
                    cssClass: "empty-row"
                }, {
                    dataField: "Customer_Billing_State",
                    editorType: "dxSelectBox",
                    label: {
                        text: "Billing State",
                        alignment: "right"
                    },
                    editorOptions: commonSelectBoxSettings
                }, {
                    dataField: "Customer_Billing_Address",
                    editorType: "dxTextBox",
                    label: {
                        text: "Billing Address",
                        alignment: "right"
                    },
                    editorOptions: commonTextBoxSettings
                }, {
                    dataField: "Customer_Billing_City",
                    editorType: "dxTextBox",
                    label: {
                        text: "Billing City",
                        alignment: "right"
                    },
                    editorOptions: commonTextBoxSettings
                }, {
                    dataField: "Customer_Billing_Zipcode",
                    editorType: "dxNumberBox",
                    label: {
                        text: "Billing Zip Code",
                        alignment: "right"
                    },
                    editorOptions: commonTextBoxSettings
                }],
                screenByWidth: function() {
                    return "lg";
                }
            }).dxForm("instance");

            $("#customer-details-cancel").dxButton({
                text: "OK",
                width: 90,
                height: 30,
                onClick: function() {
                    that.editCustomerDetails.option("visible", false);
                }
            });

            customerDetailsInited.resolve();
        }
    };

    function editCustomer(data) {
        currentCustomerEmployee = data;
        that.editCustomerContact.option("visible", true);
    }

    that.init = function () {
        that.customersGrid = DevAV.createGrid(gridOptions, customerDataSource);

        var galleryTypeMenuItems = [{
            text: "Stores",
            items: [{
                text: "Stores",
                selected: true
            }, {
                text: "Contacts"
            }]
        }];

        that.galleryTypeMenu = $("#customer-category").dxMenu({
            items: galleryTypeMenuItems,
            showFirstSubmenuMode: "onHover",
            selectionMode: "single",
            selectByClick: true,
            cssClass: "gallery-menu-items",
            width: 120,
            onItemClick: function (e) {
                if (!e.itemData.items) {
                    showCustomerInfo(customerData.Customer_ID, e.itemData.text.toLowerCase());
                    galleryTypeMenuItems[0].text = e.itemData.text;

                    $.each(galleryTypeMenuItems[0].items, function (i, item) {
                        item.selected = item.text == e.itemData.text;
                    });

                    e.component.option("items", galleryTypeMenuItems);
                }
            }
        }).data("dxMenu");

        that.customerGallery = $("#customers-gallery").dxGallery({
            dataSource: [],
            showNavButtons: true,
            showIndicator: false,
            height: 200,
            width: "100%",
            loop: true,
            initialItemWidth: 150,
            itemTemplate: function (itemData, _, itemElement) {
                var customerEmployeeStoreCity = "",
                    customerEmployeeStoreState = "",
                    img = $("<img />");
                
                $.each(customerStores, function (_, store) {
                    if (store.Customer_Store_ID == itemData.Customer_Store_ID) {
                        customerEmployeeStoreCity = store.Customer_Store_City;
                        if (galleryType == "contacts") {
                            customerEmployeeStoreState = allStatesByKey[store.Customer_Store_State].ShortName;
                            return false;
                        }
                        return false;
                    }
                });

                img.addClass(galleryType)
                    .attr("src", "images/" + (itemData.Customer_Employee_ID ? "loading_customers-gallery.png" : "loading_stores-gallery.png"))
                    .appendTo(itemElement);

                $("<div class='gallery-label'>" + (itemData.Customer_Employee_Full_Name || itemData.Customer_Store_City) + "</div> <div class='gallery-description'>" + (itemData.Customer_Employee_Position || itemData.Customer_Store_Address) + "<div>" + (itemData.Customer_Store_Zipcode ? customerEmployeeStoreCity + " " + itemData.Customer_Store_Zipcode.toString() : ("(" + customerEmployeeStoreCity + ", " + customerEmployeeStoreState) + ")") + "</div>").appendTo(itemElement);
                if (galleryType == "contacts") { 
                    $("<div />").addClass("edit-customer").on("dxclick", function () {
                        editCustomer(itemData);
                    }).appendTo(itemElement);
                }

                if (itemData.Customer_Employee_ID) {
                    DevAV.loadData({
                        id: itemData.Customer_Employee_ID,
                        controller: "Customer_Employees",
                        query: "$select=Customer_Employee_Picture"
                    }).done(function (image) {
                        var imageUrl;
                        if (!image || !image.Customer_Employee_Picture)
                            imageUrl = "images/no-photo_customers-gallery.png";
                        else
                            imageUrl = "data:image/png;base64," + image.Customer_Employee_Picture;
                        img.attr("src", imageUrl);
                    });
                } else {
                    DevAV.loadData({
                        id: itemData.Crest_ID,
                        controller: "Crests",
                        query: "$select=Crest_Image"
                    }).done(function (image) {
                        var imageUrl;
                        if (!image || !image.Crest_Image)
                            imageUrl = "images/no-photo_stores-gallery.png";
                        else
                            imageUrl = "data:image/png;base64," + image.Crest_Image;
                        img.attr("src", imageUrl);
                    });
                }

                itemElement.on("dxclick",function (event) {
                    event.stopPropagation();
                });
            }
        }).dxGallery("instance");

        that.editCustomerContact = $("#edit-contact-popup").dxPopup(customerContactOptions).dxPopup("instance");
        that.editCustomerDetails = $("#edit-customer-popup").dxPopup(customerDetailsOptions).dxPopup("instance");

        $(".button-new").dxButton({
            text: "New",
            width: 70,
            height: 30,
            onClick: function() {
                DevAV.showDBNotice();
            }
        });

        $(".button-delete").dxButton({
            text: "Delete",
            width: 70,
            height: 30,
            onClick: function() {
                 
                that.customersGrid.deleteRow(that.customersGrid.getRowIndexByKey(that.customersGrid.getSelectedRowKeys()[0]));
                 
            }
        });
    };
};

DevAV.customFilters.init("customers");

DevAV.filterField = "State/State_Long";

$(function () {
    var customers = new Customers();
    customers.init();
});

