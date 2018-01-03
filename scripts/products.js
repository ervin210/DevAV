"use strict";

var Products = function () {
    var that = this;

    var productStore = DevAV.stores.products,
        currentProduct,
        productDataSource = {
            store: productStore,
            select: ["Product_ID,Product_Name,Product_Cost,Product_Sale_Price,Product_Retail_Price,Product_Current_Inventory,Product_Backorder,Product_Manufacturing,Product_Category"]
        },
        sections = [
            { text: "Catalog Images" },
            { text: "Sales and Opportunities" }
        ],
        backOrderInfoForm = {};

     var editBackorderInited = $.Deferred();

    DevAV.DBCustomFilterFields = [
        { dataField: "Product_Name", caption: "Product Name" },
        { dataField: "Product_Category", caption: "Category" },
        { dataField: "Product_Cost", caption: "Cost", dataType: "number" },
        { dataField: "Product_Sale_Price", caption: "Sale Price", dataType: "number" },
        { dataField: "Product_Retail_Price", caption: "Retail Price", dataType: "number" },
        { dataField: "Product_Current_Inventory", caption: "Inventory", dataType: "number" },
        { dataField: "Product_Manufacturing", caption: "Manufacturing", dataType: "number" },
        { dataField: "Product_Backorder", caption: "Backorders", dataType: "number" }
    ];

    that.productGrid = {};
    that.tabs = {};

    var gridOptions = {
        dataSource: {},
        paging: {
            pageSize: 10
        },
        pager: {
            showNavigationButtons: true,
            showInfo: true
        },
        selection: {
            mode: "single"
        },
        "export": {
            fileName: "Products"
        },
        editing: {
            mode: "cell",
            allowUpdating: false
        },
        columns: [{
                dataField: "Product_Name",
                width: "24%"
            }, {
                dataField: "Product_Category",
                caption: "Category",
                visible: false
            }, {
                dataField: "Product_Cost",
                caption: "Cost",
                format: "currency"
            }, {
                dataField: "Product_Sale_Price",
                caption: "Sale Price",
                format: "currency"
            }, {
                dataField: "Product_Retail_Price",
                caption: "Retail Price",
                format: "currency"
            }, {
                dataField: "Product_Current_Inventory",
                caption: "Inventory"
            }, {
                dataField: "Product_Manufacturing",
                caption: "Manufacturing",
                width: "16%"
            }, {
                dataField: "Product_Backorder",
                caption: "Backordered",
                allowEditing: false,
                allowHiding: false,
                alignment: "center",
                cellTemplate: function (container, data) {
                    $("<div/>")
                        .addClass(!data.value ? "unchecked" : "checked")
                        .on("dxclick", function (e) {editBackorder(e, data);})
                        .appendTo(container);
                }
            }],
        onRowRemoved: function(e) {
            e.component.selectRowsByIndexes(0);
        },
        onSelectionChanged: function (items) {
            if (items.selectedRowsData[0]) {
                that.initTabs(items.selectedRowsData[0].Product_ID);
                that.initInfo(items.selectedRowsData[0].Product_ID);
            }
        }
    };


    var chartOptions = {
        dataSource: [],
        commonSeriesSettings: {
            argumentField: "Year",
            type: "bar",
            minBarSize: 1
        },
        size: {
            height: 260
        },
        series: [
            { valueField: "Sale", name: "Sales" },
            { valueField: "Opportunity", name: "Opportunities" }
        ],
        legend: {
            verticalAlignment: "top",
            horizontalAlignment: "right",
            orientation: "horizontal",
            itemTextPosition: "right"
        },
        argumentAxis: {
            type: "discrete"
        },
        equalBarWidth: {
            width: 30,
            spacing: 20
        },
        palette: ["#bf4e6a", "#5e6d9d"]
    };


    var tabsOptions = {
        dataSource: sections,
        selectedIndex: 0,
        onSelectionChanged: function () {
            if(that.productGrid.getSelectedRowsData()[0]) { that.initTabs(that.productGrid.getSelectedRowsData()[0].Product_ID); }
        }
    };
    

    function addInfo(data) {
        var imageUrl = data.Product_Primary_Image ? 'data:image/png;base64,' + data.Product_Primary_Image : 'images/no-photo_product-details.png';

        $(".name").text(data.Product_Name);
        $(".rating").width(data.Product_Consumer_Rating * 100 / 5 + "%");       
        $(".photo .image").css("background-image", "url('" + imageUrl + "')");
        
        DevAV.loadData({
            id: data.Product_ID,
            controller: "Products",
            method: "Engineer",
            callback: function (result) {
                $(".photo .engineer span").text(result.Employee_Full_Name);
            }
        });

        DevAV.loadData({
            id: data.Product_ID,
            controller: "Products",
            method: "SupportManager",
            callback: function (result) {
                $(".photo .support span").text(result.Employee_Full_Name);
            }
        });

        $(".description").text(data.Product_Description);
    }

    var initPopups = function () {
        that.galleryPopup = $(".popupImage").dxPopup({
            width: 620,
            height: 460,
            showTitle: false,
            showCloseButton: false,
            closeOnOutsideClick: true
        }).dxPopup("instance");

        that.backorderPopup = $("#edit-backorder-popup").dxPopup({
            width: 400,
            height: 200,
            showTitle: false,
            showCloseButton: false,
            onShowing: function () {
                editBackorderInited.done(function () {
                    backOrderInfoForm.getEditor("Product_Backorder").option("value", currentProduct.Product_Backorder);
                });
            },
            onContentReady: function () {
                backOrderInfoForm = $(".backorder-info").dxForm({
                    showColonAfterLabel: false,
                    items: [{
                        dataField: "Product_Backorder",
                        label: {
                            text: "Total #Backordered",
                            alignment: "right"
                        },
                        editorType: "dxNumberBox"
                    }]
                }).dxForm("instance");

                $("#text-cancel").dxButton({
                    text: "Cancel",
                    width: 90,
                    height: 30,
                    onClick: function () {
                        that.backorderPopup.option("visible", false);
                    }
                });

                $("#text-save").dxButton({
                    text: "Save",
                    width: 90,
                    height: 30,
                    onClick: function() {
                         
                        if (currentProduct) {
                          var productInfo = {
                              Product_Backorder: backOrderInfoForm.getEditor("Product_Backorder").option("value")
                          };
    
                          productStore.update(currentProduct.Product_ID, productInfo)
                              .done(function () {
                                  that.productGrid.refresh();
                              })
                              .fail(function (error) {
                                  alert(error.message);
                              });
    
                        }
                         

                        that.backorderPopup.option("visible", false);

                    }
                });
                editBackorderInited.resolve();
            }
        }).dxPopup("instance");
    };

    function editBackorder(e, options) {
        currentProduct = options.data;
        that.backorderPopup.option("visible", true);
    }

    that.initGrid = function (options, store) {
        that.productGrid = DevAV.createGrid(options, store);
    };

    function initGallery(id) {
        var galleryContainer = $("<div/>").addClass("gallery").appendTo($(".tabs-content")),
            gallery = galleryContainer
                        .dxGallery({
                            dataSource: [],
                            height: 150,
                            loop: true,
                            showIndicator: false,
                            showNavButtons: true,
                            initialItemWidth: 150,
                            itemTemplate: function(itemData, _, itemElement) {
                                var img = $("<div/>").css("background-image", "url('images/loading_products-gallery.png')");
                                $("<div/>")
                                    .addClass("gallery-image")
                                    .append(img)
                                    .appendTo(itemElement);
                                DevAV.loadData({
                                    id: itemData.Image_ID,
                                    controller: "Product_Images",
                                    query: "$select=Product_Image"
                                }).done(function(image) {
                                    var imageUrl;
                                    if(!image || !image.Product_Image)
                                        imageUrl = "images/no-photo_products-gallery.png";
                                    else
                                        imageUrl = "data:image/png;base64," + image.Product_Image;
                                    img.css("background-image", "url('" + imageUrl + "')");
                                    itemData.Product_Image = imageUrl;
                                });

                                itemElement.on("dxclick", function(event) {
                                    var imageUrl = itemData.Product_Image || "images/no-photo_products-gallery.png";
                                    that.galleryPopup.content().html('<div class="big"><img src="' + imageUrl + '" /></div><br><p>' + itemData.Product.Product_Name + '</p>');
                                    that.galleryPopup.option("visible", true);
                                    event.stopPropagation();
                                });
                            }
                        }).dxGallery("instance");
        return {
            instance: gallery,
            load: function(id) {
                DevAV.loadData({
                    id: id,
                    controller: "Products",
                    method: "Product_Images",
                    query: "$expand=Product&$select=Image_ID,Product/Product_Name",
                    callback: function(data) {
                        gallery.option("dataSource", data.value);
                    }
                });
            }
        };
    }

    function initFileUploader() {
        $("<div/>")
            .addClass("fileuploader")
            .appendTo($(".tabs-content"))
            .dxFileUploader({
                accept: "image/*",
                selectButtonText: "Select",
                uploadUrl: "odata/Product_Images/?productId=" + that.productGrid.getSelectedRowsData()[0].Product_ID,
                labelText: "",
                onUploaded: function(e) {
                    that.gallery.load(that.productGrid.getSelectedRowsData()[0].Product_ID);
                },
                onProgress: function(e) {
                     
                }
            });
    }

    function initChart(data) {
        var chartContainer = $("<div/>").addClass("chart").appendTo($(".tabs-content")),
            chart = chartContainer.dxChart(chartOptions).dxChart("instance");
        chart.showLoadingIndicator();
        chart.option("dataSource", data.value);
    }

    that.clearContainer = function () {
        $(".tabs-content").children().remove();
    };

    that.initTabs = function(id) {
        that.clearContainer();
        if(that.tabs.option("selectedIndex") === 0) {
            that.gallery = initGallery();
            $.when(
                that.gallery.load(id)
                ).done(function() {
                    initFileUploader();
                });
        } else {
            DevAV.loadData({
                id: id,
                controller: "Products",
                method: "SalesAndOpportunities",
                type: "POST",
                callback: function(data) {

                    $.each(data.value, function(_, item) {
                        item.Opportunity = parseInt(item.Opportunity);
                        item.Sale = parseInt(item.Sale);
                    });

                    initChart(data);
                }
            });
        }
    };

    that.initInfo = function (id) {
        $(".photo .image")
            .css("background-image", "url('images/loading_product-details.png')");
        DevAV.loadData({
            id: id,
            controller: "Products",
            callback: function (data) {
                addInfo(data);
            }
        });
    };
    

    that.init = function () {
        initPopups();
        that.initGrid(gridOptions, productDataSource);

        that.tabs = $(".tabs").dxTabs(tabsOptions).dxTabs("instance");

        $(".button-new").dxButton({
            text: "New",
            width: 70,
            height: 30,
            onClick: function(e) {
                e.event.stopPropagation();
                DevAV.showDBNotice();
            }
        });

        $(".button-delete").dxButton({
            text: "Delete",
            width: 70,
            height: 30,
            onClick: function() {
                 
                that.productGrid.deleteRow(that.productGrid.getRowIndexByKey(that.productGrid.getSelectedRowKeys()[0]));
                 
            }
        });
    };
};

DevAV.filterField = "Product_Category";
DevAV.customFilters.init("products");

$(function () {
    var products = new Products();
    products.init();
});

