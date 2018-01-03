"use strict";

window.DevAV = window.DevAV || {};
var CUSTOM_FILTER_KEY = "dx-custom-filter-data";


DevAV.stores = {
    tasks: new DevExpress.data.ODataStore({
        url: DevAV.baseUrl + "odata/Tasks",
        key: "Task_ID",
        keyType: "Int32"
    }),

    customer_orders: new DevExpress.data.ODataStore({
        url: DevAV.baseUrl + "odata/Orders",
        key: "Order_ID",
        keyType: "Int32"
    }),

    customer_employees: new DevExpress.data.ODataStore({
        url: DevAV.baseUrl + "odata/Customer_Employees",
        key: "Customer_Employees_ID",
        keyType: "Int32"
    }),

    employees: new DevExpress.data.ODataStore({
        url: DevAV.baseUrl + "odata/Employees",
        key: "Employee_ID",
        keyType: "Int32"
    }),

    customers: new DevExpress.data.ODataStore({
        url: DevAV.baseUrl + "odata/Customers",
        key: "Customer_ID",
        keyType: "Int32"
    }),
    states: new DevExpress.data.ODataStore({
        url: DevAV.baseUrl + "odata/States",
        key: "State_ID",
        keyType: "Int32"
    }),
    evaluations: new DevExpress.data.ODataStore({
        url: DevAV.baseUrl + "odata/Evaluations",
        key: "Note_ID",
        keyType: "Int32"
    }),
    products: new DevExpress.data.ODataStore({
        url: DevAV.baseUrl + "odata/Products",
        key: "Product_ID",
        keyType: "Int32",
        onLoaded: function(items) {
            // decimal to int
            $.each(items, function(_, item) {
                item.Product_Cost = parseInt(item.Product_Cost);
                item.Product_Retail_Price = parseInt(item.Product_Retail_Price);
                item.Product_Sale_Price = parseInt(item.Product_Sale_Price);
            });
        },
        beforeSend: function(request) {
            if(request.method == "POST") {
                request.payload.Product_Cost = (request.payload.Product_Cost || 0).toFixed(4);
                request.payload.Product_Retail_Price = (request.payload.Product_Retail_Price || 0).toFixed(4);
                request.payload.Product_Sale_Price = (request.payload.Product_Sale_Price || 0).toFixed(4);
            }
        }
    })
};

DevAV.customFilters = {
    editingFilterName: "",
    currentFilterInfo: {},
    getFilterInfo: function() {
        if (this.currentFilterInfo)
            return this.currentFilterInfo[this.viewName];
        else
            return [];
    },

    getFilterInfoByName: function(filterName) {
        if (this.currentFilterInfo && this.currentFilterInfo[this.viewName].length !== 0) {
            var currentFilterData = this.currentFilterInfo[this.viewName][this.getIndexByName(filterName)];
            return (currentFilterData && currentFilterData.args) || [];
        }
    },
    menuSelector: "#custom-filters > div ul",
    viewName: "",
    applyCustomFilter: function(filterData) {
        this.editingFilterName = "";
        DevAV.filterGrid(filterData.args, "custom");
    },
    getIndexByName: function(filterName) {
        var result = -1;
        $.each(this.currentFilterInfo[this.viewName], function(index, item) {
            if (item.name == filterName) {
                result = index;
                return false;
            }
        });

        return result;
    },
    isFilterEmpty: function(filterData) {
        return (!filterData || !filterData.args || (filterData.args.length === 0) || (filterData.args.length == 1 && (!filterData.args[0].length || !filterData.args[0][0].length)));
    },
    saveViewFilter: function(filterData, saveToStore) {
        if (!this.currentFilterInfo)
            this.currentFilterInfo = {};

        if (!this.currentFilterInfo[this.viewName])
            this.currentFilterInfo[this.viewName] = [];

        var sameNameIndex = this.getIndexByName(filterData.name);

        filterData.saveToStore = saveToStore;
        if (sameNameIndex == -1) {
            this.currentFilterInfo[this.viewName].push(filterData);
        } else {
            this.currentFilterInfo[this.viewName][sameNameIndex] = filterData;
        }

        this.saveFiltersToStore();

        this.applyCustomFilter(filterData);
    },
    saveFiltersToStore: function() {
        var filtersToSave = $.map(this.currentFilterInfo[this.viewName], function(item) {
            if (item.saveToStore)
                return item;
        });

        var viewFiltersToSave = {};

        viewFiltersToSave[this.viewName] = filtersToSave;
        window.localStorage.setItem(CUSTOM_FILTER_KEY, JSON.stringify($.extend({}, this.currentFilterInfo, viewFiltersToSave)));
    },
    removeFilterByName: function(filterName) {
        if (!filterName) {
            if (!this.currentFilterInfo || this.currentFilterInfo[this.viewName].length === 0)
                this.currentFilterInfo[this.viewName] = [];
            return;
        }

        var that = this,
            filterIndex = this.getIndexByName(filterName);
        if((filterIndex >= 0) && this.currentFilterInfo[this.viewName].length !== 0) {
            that.currentFilterInfo[that.viewName].splice(filterIndex, 1);
        }
    },
    loadViewFilters: function() {
        this.currentFilterInfo = JSON.parse(window.localStorage.getItem(CUSTOM_FILTER_KEY));
    },
    renderMenu: function() {
        var that = this;
        $(that.menuSelector).empty();

        if (!that.currentFilterInfo || !that.currentFilterInfo[that.viewName] || !that.currentFilterInfo[that.viewName].length 
            || (that.currentFilterInfo[that.viewName].length === 1 && that.isFilterEmpty(that.currentFilterInfo[that.viewName][0]))) {
            $("#custom-filters").hide();
            return;
        }

        $("#custom-filters").show();

        $.each(that.currentFilterInfo[that.viewName], function(_, customFilter) {
            if (!that.isFilterEmpty(customFilter)) {
                var newItem = $("<li><a href='#" + customFilter.name + "'>" + customFilter.name + "</a><div class='update-filter'></div></li>");
                newItem.find(".update-filter").on("dxclick", function(e) {
                    DevAV.customFilters.editingFilterName = customFilter.name;
                    $("#edit-custom-filters").data("dxPopup").option("visible", true);
                    DevAV.customFilters.removeFilterByName(customFilter.name);
                });

                newItem.appendTo(that.menuSelector);
            }
        });

        if (that.currentFilterInfo[that.viewName].length >= 10) {
            $(".custom-filers-block").dxScrollView({ height: 421 });
        }
    },
    init: function(viewName) {
        var that = this;
        this.viewName = viewName;
        this.loadViewFilters();
        $(function() {
            that.renderMenu();
        });
    }
};


$(function() {
    $("#disable-db-notice").dxPopup({
        visible: false,
        width: 600,
        showTitle: false,
        showCloseButton: false,
        height: 210,
        onContentReady: function() {
            $("#disable-db-notice-ok").dxButton({
                text: "OK",
                height: 30,
                width: 70,
                onClick: function() {
                    $("#disable-db-notice").data("dxPopup").option("visible", false);
                }
            });
        }
    });


    var filterPopupRendered = $.Deferred(),
        gridElement = $("#grid"),
        pivotGridElement = $(".dashboard #revenue-analysis");
    
    function getHashValue() {
        return window.location.hash.slice(1).replace(/%20/g, " ");
    }

    $("#edit-custom-filters").dxPopup({
        visible: false,
        showTitle: false,
        showCloseButton: false,
        width: 500,
        height: 480,
        onContentReady: function() {
            $("#edit-filter-content .filter-options").dxScrollView({ direction: "both" });
            
            $("#edit-filter-content .filter-save").dxCheckBox({
                value: true
            });

            $("#edit-filter-content .filter-name").dxTextBox({
                width: 440,
                height: 30,
                placeholder: "Enter a name for your custom filter..."
            });

            $("#filters-ok").dxButton({
                text: "OK",
                height: 30,
                width: 70,
                onClick: function() {
                    var filterArgs = {
                        name: $("#edit-filter-content .filter-name").data("dxTextBox").option("value") || "Custom",
                        args: $("#edit-filter-content .filter-permissions").dxFilterBuilder("instance").option("value")
                    };
                    if (!DevAV.customFilters.isFilterEmpty(filterArgs)) {
                        DevAV.customFilters.saveViewFilter(filterArgs, $("#edit-filter-content .filter-save").data("dxCheckBox").option("value"));
                        DevAV.customFilters.renderMenu();
                        window.location.hash = "#" + filterArgs.name;
                    } else {
                        if (!filterArgs || !filterArgs.name || (DevAV.customFilters.getIndexByName(filterArgs.name) == -1)) {
                            DevAV.customFilters.removeFilterByName(filterArgs.name);
                            DevAV.customFilters.renderMenu();
                            window.location.hash = "";
                        }
                    }

                    $("#edit-custom-filters").data("dxPopup").option("visible", false);
                }
            });

            $("#filters-cancel").dxButton({
                text: "Cancel",
                height: 30,
                width: 100
            });

            filterPopupRendered.resolve();
        },
        onShowing: function() {
            $.when(filterPopupRendered).done(function() {
                function buildFiltersHtml(filterData) {
                    if (!filterData || filterData.length === 0)
                        filterData = [[DevAV.DBCustomFilterFields[0].dataField, "=", ""]];

                    $("#edit-filter-content .filter-permissions").dxFilterBuilder({
                        value: filterData,
                        fields: DevAV.DBCustomFilterFields
                    });
                }
                var filterData;

                if(DevAV.customFilters.editingFilterName)
                    filterData = DevAV.customFilters.getFilterInfoByName(DevAV.customFilters.editingFilterName);

                $("#edit-filter-content .filter-name").data("dxTextBox").option("value", DevAV.customFilters.editingFilterName || "");
                $("#edit-filter-content .filter-save").data("dxCheckBox").option("value", true);

                buildFiltersHtml(filterData);

                var filterTitle = "Create Custom Filter";
                var filterOkOptions = {
                    text: "OK"
                };

                var filterCancelOptions = {
                    text: "Cancel",
                    onClick: function() {
                        $("#edit-custom-filters").data("dxPopup").option("visible", false);
                    }

                };

                if(DevAV.customFilters.editingFilterName) {
                    filterOkOptions.text = "Save";
                    filterCancelOptions = {
                        text: "Delete",
                        onClick: function() {
                            var clearHash = getHashValue() == DevAV.customFilters.editingFilterName;
                            DevAV.customFilters.saveFiltersToStore();
                            DevAV.customFilters.renderMenu();
                            DevAV.customFilters.editingFilterName = "";
                            $("#edit-custom-filters").data("dxPopup").option("visible", false);
                            if (clearHash) {
                                window.location.hash = "";
                            }
                        }
                    };
                    filterTitle = "Edit Custom Filter";
                }

                $("#filters-ok").data("dxButton").option(filterOkOptions);
                $("#filters-cancel").data("dxButton").option(filterCancelOptions);

                $("#edit-filter-content .edit-label").text(filterTitle);
            });
        }

    });

    $("#analysis-popup").dxPopup({
        visible: false,
        width: 800,
        height: "auto",
        showTitle: false,
        showCloseButton: false,
        onShown: function() {
            $("#revenue-analysis")
                .removeClass("invisible")
                .dxPivotGrid("instance")
                .updateDimensions();
        },
        onContentReady: function() {
            $("#revenue-analysis")
                .addClass("invisible")
                .dxPivotGrid({
                    allowSortingBySummary: true,
                    fieldChooser: {
                        enabled: false
                    },
                    dataSource: new DevExpress.data.PivotGridDataSource({
                        fields: [
                            {
                                caption: "State",
                                width: 120,
                                sortBySummaryField: "Percentage",
                                sortOrder: "desc",
                                selector: function(data) {
                                    return DevAV.allStatesByKey[data.Customer_Store_Locations.Customer_Store_State].Name;
                                },
                                area: "row"
                            },
                            {
                                caption: "City",
                                width: 120,
                                selector: function(data) {
                                    return data.Customer_Store_Locations.Customer_Store_City;
                                },
                                area: "row"
                            },
                            {
                                caption: "Sales",
                                dataField: "Order_Total_Amount",
                                dataType: "number",
                                summaryType: "sum",
                                format: "currency",
                                area: "data"
                            },
                            {
                                caption: "Percentage",
                                dataField: "Order_Total_Amount",
                                summaryType: "sum",
                                summaryDisplayMode: "percentOfGrandTotal",
                                area: "data"
                            }
                        ],
                        store: DevAV.stores.customer_orders,
                        expand: ["Customer_Store_Locations"],
                        select: ["Order_Total_Amount,Customer_Store_Locations/Customer_Store_City,Customer_Store_Locations/Customer_Store_State"]
                    }),
                    onCellPrepared: function(e) {
                        if (e.area === "data" && e.columnIndex === 1) {
                            var $bullet = $("<div/>").addClass("bullet").appendTo(e.cellElement.width(350));
                            $("<div/>").dxBullet({
                                showTarget: false,
                                showZeroLevel: false,
                                value: parseFloat(e.cell.text),
                                color: "#BF4E6A",
                                startScaleValue: 0,
                                endScaleValue: 100,
                                tooltip: {
                                    enabled: false
                                },
                                size: {
                                    width: 300,
                                    height: 20
                                }
                            }).appendTo($bullet);
                        }
                    },
                    showBorders: true,
                    showRowTotals: false,
                    height: 330
                });

            $("#analysis-close").dxButton({
                text: "Close",
                width: 90,
                height: 30,
                onClick: function() {
                    $("#analysis-popup").data("dxPopup").option("visible", false);
                }
            });
        }
    });


    $('.button-custom-filter').dxButton({
        width: 32,
        height: 30,
        icon: "custom-filter",
        hint: "Custom Filter",
        onClick: function() {
            $("#edit-custom-filters").data("dxPopup").option("visible", true);
        }
    });

    var throttleTimer = 0,
        searchByGrid = $(".search").dxTextBox({
            width: 220,
            height: 30,
            onValueChanged: function(searchText) {
                clearTimeout(throttleTimer);
                throttleTimer = setTimeout(function() {
                    DevAV.filterGrid(searchText.value, "search");
                }, 500);
            },
            valueChangeEvent: "keyup"
        }).dxTextBox("instance");

    $(".button-chooser").dxButton({
        width: 32,
        height: 30,
        icon: "column-chooser",
        hint: "Choose grid columns",
        onClick: function() {
            $("#grid").data("dxDataGrid").showColumnChooser();
        }
    });

    $(".button-export").dxButton({
        width: 32,
        height: 30,
        icon: "export",
        hint: "Export",
        onClick: function() {
            if(gridElement.length)
                gridElement.dxDataGrid("instance").exportToExcel();
            else
                pivotGridElement.dxPivotGrid("instance").exportToExcel();
        }
    });

    $(".button-analysis").dxButton({
        text: "Revenue Analysis",
        height: 30,
        onClick: function() {
            $("#analysis-popup").data("dxPopup").option("visible", true);
        }
    });

    DevAV.selectActiveFilter = function(value, container) {
        $(".active-left-menu-item").removeClass("active-left-menu-item");
        if (!container)
            container = $(".left-menu:not(#custom-filters) > ul a:contains(" + (value || "All") + ")");
        container.addClass("active-left-menu-item");

        if ($(".custom-filers-block.dx-scrollview").length)
            $(".custom-filers-block").dxScrollView("instance").scrollToElement($(".custom-filers-block a.active-left-menu-item"));
    };

    var mainMenuId = $(".main-menu").attr("id"),
        mainMenuItems = [{
            iconSrc: "images/logo-" + mainMenuId.toLowerCase() + ".png",
            items: [{
                text: "Dashboard"
            }, {
                text: "Products"
            }, {
                text: "Customers"
            }, {
                text: "Employees"
            }, {
                text: "Tasks"
            }]
        }];

    $.each(mainMenuItems[0].items, function(i, item) {
        item.selected = item.text == mainMenuId;
    });

    $(".main-menu").dxMenu({
        items: mainMenuItems,
        showFirstSubmenuMode: "onHover",
        selectionMode: "single",
        selectByClick: true,
        cssClass: "main-menu-items",
        height: 30,
        onItemClick: function(e) {
            if (!e.itemData.items)
                location.href = DevAV.baseUrl + e.itemData.text;
        }
    }).data("dxMenu");

    DevAV.filterGrid = function(value, type) {
        var isGrid = gridElement.length > 0,
            filterInstance = isGrid ? gridElement.dxDataGrid("instance") : pivotGridElement.dxPivotGrid("instance"),
            searchString = searchByGrid.option("value"),
            hashValue = window.location.hash ? getHashValue() : "",
            isHashType = (hashValue !== "") && !value;

        if(isGrid)
            filterInstance.needSelectElement = true;

        switch(type) {
            case "custom":
                if(isGrid)
                    filterInstance.filter(value);
                else {
                    filterInstance.getDataSource().filter(value);
                    filterInstance.getDataSource().reload();
                }
                break;
            case "search":
                filterInstance.searchByText(value);
                break;
            default:
                if(isHashType || (value && value !== "All")) {
                    if(isGrid)
                        filterInstance.filter([DevAV.filterField, "=", (isHashType ? hashValue : value)]);
                    else {
                        filterInstance.getDataSource().filter([DevAV.filterField, "=", (isHashType ? hashValue : value)]);
                        filterInstance.getDataSource().reload();
                    }
                } 
                else {
                    if(isGrid) {
                        filterInstance.clearFilter();
                        if(searchString)
                            filterInstance.searchByText(searchString);
                    } else {
                        filterInstance.getDataSource().filter(null);
                        filterInstance.getDataSource().reload();
                    }
                }
                DevAV.selectActiveFilter(isHashType ? hashValue : value);
        }
    };

    DevAV.createGrid = function(options, dataSource) {
        options.dataSource = new DevExpress.data.DataSource({
            store: dataSource.store,
            expand: dataSource.expand,
            select: dataSource.select,
            postProcess: function(data) {
                if (dataSource.store !== DevAV.stores.tasks) {
                    var grid = $("#grid").data("dxDataGrid");
                    if(data.length && grid.needSelectElement) {
                        grid.selectRows(data[0].items ? data[0].items[0][grid.option("dataSource").key()] : data[0][grid.option("dataSource").key()]);
                    }

                    grid.needSelectElement = false;
                }
                return data;
            }
        });

        var initedGrid = $("#grid").dxDataGrid(options).data("dxDataGrid");

        initedGrid.needSelectElement = true;
        DevAV.processFilter();

        return initedGrid;
    };

    DevAV.loadData = function(options) {
        return $.ajax({
            url: DevAV.baseUrl + "odata/" + options.controller + (options.id ? "(" + options.id + ")/" : "/")
                + (options.method || "") + (options.query ? "?" + options.query : ""),
            dataType: "json",
            type: options.type || "GET",
            success: options.callback
        });
    };

    DevAV.processFilter = function() {
        if (!window.location.hash) {
            DevAV.filterGrid();
            DevAV.selectActiveFilter("All");
            return;
        }

        var value = getHashValue(),
            found = false;
        $(".left-menu:not(#custom-filters) a").each(function() {
            var itemValue = $(this).text();
            if (itemValue === value) {
                DevAV.filterGrid(value);
                DevAV.selectActiveFilter(value);
                found = true;
                return false;
            }
        });

        if(found) return;

        $(DevAV.customFilters.currentFilterInfo[DevAV.customFilters.viewName]).each(function() {
            var itemValue = this.name;
            if (itemValue === value) {
                DevAV.customFilters.applyCustomFilter(this);
                DevAV.selectActiveFilter(value, $("#custom-filters a[href='#" + value + "']"));
                found = true;
                return false;
            }
        });
    };

    window.onhashchange = DevAV.processFilter;
});

DevAV.showDBNotice = function() {
    $("#disable-db-notice").data("dxPopup").option("visible", true);
};

DevAV.showValidationMessage = function(e) {
    var validationSummary = e.element.find(".dx-validationsummary"),
        validationSummaryInstance = validationSummary.dxValidationSummary("instance");

    validationSummaryInstance.option("itemTemplate", function() {
        var customValidationMessage = validationSummary.find(".custom-validation-message");
        if(!customValidationMessage.length)
           return $("<div>").addClass("custom-validation-message").text("Not all fields are correctly filled in");
    });
};

DevAV.showIe8Notice = function() {
    var Ie8Notice = "Your browser is out of date. Some features in this demo may not work properly.";

    $("body").append(
       '<div class="ie-8-notice">'
       + '<img src="images/warning.png" class="warning"/><span>'
       + Ie8Notice +
       '</span><img src="images/close.png" class="close"/></div>'
   );

    $(".close").click(function() {
        $(".ie-8-notice").hide();
    });
};

DevAV.formatPhoneNumber = function(phoneNumber) {
    return phoneNumber.replace(/(\d{3})(\d{3})(\d{4})/, "+1($1)$2-$3");
};


