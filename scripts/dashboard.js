"use strict";

var Dashboard = function () {
    var that = this;

    var chartPalette = ["#bf4e6a", "#579aa3", "#5e6d9d", "#a879a2"];

    DevAV.DBCustomFilterFields = [
        { dataField: "ProductName", caption: "Product Name" },
        { dataField: "ProductCategory", caption: "Product Category" },
        {
            dataField: "StateId",
            dataType: "number",
            caption: "State",
            lookup: {
                dataSource: DevAV.allStates,
                valueExpr: "ID",
                displayExpr: "Name",
            }
        },
        { dataField: "City", caption: "City" }
    ];

    var pivotGridOptions = {
            allowSortingBySummary: true,
            fieldChooser: {
                enabled: false
            },
            fieldPanel: {
                showDataFields: true,
                showRowFields: true,
                showColumnFields: false,
                showFilterFields: false,
                allowFieldDragging: false,
                visible: true
            },
            dataSource: new DevExpress.data.PivotGridDataSource({
                fields: [
                    {
                        caption: "State",
                        dataField: "StateId",
                        sortBySummaryField: "Percentage",
                        sortOrder: "desc",
                        allowSorting: true,
                        selector: function(data) {
                            return DevAV.allStatesByKey[data.StateId].Name;
                        },
                        area: "row"
                    },
                    {
                        dataField: "City",
                        allowSorting: true,
                        area: "row"
                    },
                    {
                        caption: "Category",
                        dataField: "ProductCategory",
                        visible: false,
                        area: "row"
                    },
                    {
                        caption: "Name",
                        dataField: "ProductName",
                        visible: false,
                        area: "row"
                    },
                    {
                        caption: "Sales",
                        dataField: "Total",
                        dataType: "number",
                        summaryType: "sum",
                        format: "currency",
                        area: "data"
                    },
                    {
                        caption: "Percentage",
                        dataField: "Total",
                        summaryType: "sum",
                        summaryDisplayMode: "percentOfGrandTotal",
                        area: "data"
                    }
                ],
                store: new DevExpress.data.CustomStore({
                    load: function() {
                        var deferred = $.Deferred();
                        DevAV.loadData({
                            id: "",
                            controller: "Products",
                            method: "GetProductSalesInfo",
                            type: "POST",
                            callback: function(data) {
                                deferred.resolve(data.value);
                            }
                        });
                        return deferred.promise();
                    }
                })
            }),
            onCellPrepared: function(e) {
                if (e.area === "data" && e.columnIndex === 1) {
                    var $bullet = $("<div/>").addClass("bullet").appendTo(e.cellElement.width(470));
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
                            width: 420,
                            height: 20
                        }
                    }).appendTo($bullet);
                }
            },
            showBorders: true,
            showRowTotals: false,
            height: 405
    };

    var doughnutChartOptions = {
        dataSource: DevAV.doughnutData,
        type: "doughnut",
        palette: chartPalette,
        diameter: 0.8,
        innerRadius: 0.6,
        series: [
            {
                argumentField: "Name",
                valueField: "Value",
                label: {
                    backgroundColor: "none",
                    font: {
                        color: "#757575",
                        size: 15
                    },
                    radialOffset: -20,
                    visible: true,
                    customizeText: function(arg) {
                        return arg.percentText;
                    }
                }
            }
        ],
        legend: {
            margin: {
                top: 80,
                right: 40
            }
        },
        margin: {
            right: 40,
            left: 40,
            top: 20,
            bottom: 20
        },
        size: {
            height: 300
        }
    };

    var funnelChartOptions = {
        dataSource: DevAV.funnelData,
        palette: chartPalette,
        argumentField: "Name",
        valueField: "Value",
        label: {
            visible: true,
            position: "inside",
            backgroundColor: "none",
            font: {
                size: 15
            },
            format: "currency",
            customizeText: function(arg) {
                return arg.valueText;
            }
        },
        margin: {
            right: 45,
            left: 45,
            top: 20,
            bottom: 20
        },
        legend: {
            visible: true,
            margin: {
                top: 80
            }
        },
        size: {
            height: 300
        }
    };

    that.init = function() {
        $("#revenue-analysis").dxPivotGrid(pivotGridOptions);
        DevAV.processFilter();
        $("#revenue-doughnut").dxPieChart(doughnutChartOptions);
        $("#opportunities-funnel").dxFunnel(funnelChartOptions);
    };
};

DevAV.filterField = "ProductCategory";
DevAV.customFilters.init("dashboard");

$(function () {
    var dashboard = new Dashboard();
    dashboard.init();
});

