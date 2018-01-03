"use strict";

var Tasks = function () {
    var that = this,
        currentTask = {},
        taskInfoForm = {},
        propertyIndexes = {
            "priority": {
                "High": 4,
                "Urgent": 3,
                "Normal": 2,
                "Low": 1
            },
            "status": {
                "Not Started": 1,
                "In Progress": 2,
                "Need Assistance": 3,
                "Deferred": 4,
                "Completed": 5
            }
        },
        priorities = [
            { id: 1, value: "Low" },
            { id: 2, value: "Normal" },
            { id: 3, value: "Urgent" },
            { id: 4, value: "High" }
        ],
        statuses = ["Not Started", "Need Assistance", "In Progress", "Deferred", "Completed"];

    var editTaskInited = $.Deferred();

    that.taskGrid = {};

    DevAV.DBCustomFilterFields = [
            { dataField: "Task_Subject", caption: "Subject" },
            { dataField: "Task_Description", caption: "Description" },
            { dataField: "Task_Start_Date", caption: "Start Date", dataType: "date" },
            { dataField: "Task_Due_Date", caption: "Due Date", dataType: "date" },
            { dataField: "Task_Status", caption: "Status", lookup: { dataSource: statuses } },
            { dataField: "Task_Priority", caption: "Priority", lookup: { dataSource: priorities, valueExpr: "id", displayExpr: "value"  }},
            { dataField: "Task_Completion", caption: "Completion", dataType: "number" }
    ];




    function editTask(e, options) {
        if(e)
            e.event.stopPropagation();
        currentTask = options.data;
        that.popup.option("visible", true);
    }

    function deleteTask(e, options) {
        e.event.stopPropagation();
         
        that.taskGrid.deleteRow(options.rowIndex);
         
    }

    function checkCompleted(e, options) {
        e.event.stopPropagation();
         
        taskStore
            .update(options.data.Task_ID, { Task_Status: (e.value ? "Completed" : "In Progress") })
            .done(function () {
                that.taskGrid.refresh();
            });
         
    }

    var taskStore = DevAV.stores.tasks,
        taskDataSource = {
            store: taskStore
        };

    var gridOptions = {
        dataSource: {},
        paging: {
            pageSize: 10
        },
        pager: {
            showNavigationButtons: true,
            showInfo: true
        },
        editing: {
            removeConfirmMessage: ""
        },
        "export": {
            fileName: "Tasks"
        },
        showColumnLines: false,
        columns: [{
            caption: "",
            dataField: "",
            width: 50
        }, {
            dataField: "Task_Start_Date",
            width: 110,
            dataType: 'date',
            caption: "Start Date"
        }, {
            dataField: "Task_Due_Date",
            width: 110,
            dataType: 'date',
            caption: "Due Date"
        }, {
            caption: "Priority",
            width: 80,
            dataField: "Task_Priority",
            alignment: "left",
            allowFiltering: false
        }, {
            caption: "% Completed",
            width: 155,
            dataField: "Task_Completion",
            alignment: "left",
            allowFiltering: false,
            customizeText: function (cellInfo) {
                return cellInfo.valueText + "%";
            }
        }, {
            caption: "Subject",
            dataField: "Task_Subject",
            allowFiltering: true
        }, {
            caption: "",
            width: 127
        }, {
            visible: false,
            dataType: 'string',
            allowFiltering: true,
            allowSorting: false,
            calculateCellValue: function (rowData) {
                return $("<div />").html(rowData.Task_Description).text();
            }
        }],
        rowTemplate: function (container, options) {
            var rowHtml = "",
                data = options.data;
            rowHtml = $("<tr class='dx-row main-row " + (data.Task_Status == "Completed"? "completed-row" : "") + "'>"
                + "<td rowspan='2' class='task-status'>" + "</td>"
                + "<td>" + Globalize.formatDate(new Date(data.Task_Start_Date), { date: "short" }) + "</td>"
                + "<td>" + Globalize.formatDate(new Date(data.Task_Due_Date), { date: "short" }) + "</td>"
                + "<td class='grid-priority'>" + "<div class='task-priority-" + data.Task_Priority + "'>" + "</td>"
                + "<td class='grid-completed'><div>" + "<div class='completed-chart'></div><div class='chart-background'></div>" + (data.Task_Completion || 0) + "%<div></td>"
                + "<td>" + data.Task_Subject + "</td>"
                + "<td rowspan='2' class='task-actions'>" + "</td>"
                + "</tr>"
                + "<tr class='" + (data.Task_Status == "Completed"? "completed-row" : "") + ""+ "'><td colspan='5' class='task-description'>" + data.Task_Description + "</td></tr>");


            $("<div />").dxCheckBox({ value: data.Task_Status == "Completed", focusStateEnabled: false, onValueChanged: function (e) { checkCompleted(e, options); }, disabled: true }).appendTo($(".task-status", rowHtml));

            $("<div />").dxBullet({
                size: {
                    width: 95,
                    height: 18
                },
                margin: {
                    top: 4,
                    bottom: 0,
                    left: 0
                },
                showTarget: false,
                showZeroLevel: false,
                value: data.Task_Completion,

                color: "#BF4E6A",
                startScaleValue: 0,
                endScaleValue: 100,
                tooltip: {
                    enabled: false
                }
            }).prependTo($(".completed-chart", rowHtml));

            $("<div />").dxButton({ text: "Edit", onClick: function (e) { editTask(e, options); } }).appendTo($(".task-actions", rowHtml));
            $("<div />").dxButton({ text: "Delete", onClick: function (e) { deleteTask(e, options); } }).appendTo($(".task-actions", rowHtml));

            container.append(rowHtml);

            function rowClickHandler(element) {
                var targetRow = $(element);
                if (targetRow.hasClass("task-selected")) {
                    if ($(".task-selected .dx-checkbox").data("dxCheckBox")) { $(".task-selected .dx-checkbox").data("dxCheckBox").option("disabled", true); }
                    $("#grid .task-selected").removeClass("task-selected");

                } else {
                    targetRow.addClass("task-selected");
                    if (targetRow.hasClass("main-row"))
                        targetRow.next().addClass("task-selected");
                    else
                        targetRow.prev().addClass("task-selected");
                    if ($(".task-selected .dx-checkbox").data("dxCheckBox")) { $(".task-selected .dx-checkbox").data("dxCheckBox").option("disabled", false); }
                }
            }

            var rows = container.find("tr");

            $.each([rows.eq(rows.length - 2), rows.eq(rows.length - 1)], function (_, item) {
                item.hover(function () {
                    rowClickHandler(this);
                }, function () {
                    rowClickHandler(this);
                });

            });
        }
    };


    function setEditTaskValues() {
        if(currentTask.hasOwnProperty("Task_ID")) {
            for(var field in currentTask) {
                if(taskInfoForm.getEditor(field))
                    taskInfoForm.updateData(field, currentTask[field]);
            }
        } else {
            taskInfoForm.option("formData", currentTask);
        }

        var assignedToName = taskInfoForm.getEditor("Task_Assigned_Employee_ID").option("displayValue");

        if(!currentTask.Task_Start_Date) { taskInfoForm.updateData("Task_Start_Date", new Date()); }
        if(!currentTask.Task_Due_Date) { taskInfoForm.updateData("Task_Due_Date", new Date()); }
        if (!currentTask.Task_Priority) { taskInfoForm.updateData("Task_Priority", 1); }
        if (!currentTask.Task_Status) { taskInfoForm.updateData("Task_Status", "Not Started"); }

        $("#task-edit-label")
            .text((currentTask.Task_ID ? "Edit" : "Add") + " task " + (currentTask.Task_ID ? "(" + assignedToName + ")" : ""));
        $(".task-slider").dxSlider("instance").option("value", currentTask.Task_Completion || 0);
        taskInfoForm.element().find(".dx-validationsummary").empty();
    }

    var editTaskOptions = {
        visible: false,
        width: 750,
        showTitle: false,
        showCloseButton: false,
        height: "auto",
        onShowing: function() {
            editTaskInited.done(setEditTaskValues);
        },
        onContentReady: function () {

            taskInfoForm = $(".task-info").dxForm({
                showColonAfterLabel: false,
                colCount: 2,
                height: 290,
                showValidationSummary: true,
                onContentReady: function(e) {
                    DevAV.showValidationMessage(e);
                },
                items: [{
                    itemType: "group",
                    label: {
                        visible: false
                    },
                    items: [{
                        dataField: "Task_Owner_ID",
                        label: {
                            text: "Owner"
                        },
                        validationRules: [{
                            type: "required",
                            message: "Owner is required"
                        }],
                        editorType: "dxSelectBox",
                        editorOptions: {
                            dataSource: DevAV.employees,
                            height: 30,
                            displayExpr: "Name",
                            valueExpr: "ID"
                        }
                    }, {
                        dataField: "Task_Assigned_Employee_ID",
                        label: {
                            text: "Assigned To"
                        },
                        editorType: "dxSelectBox",
                        editorOptions: {
                            dataSource: DevAV.employees,
                            displayExpr: "Name",
                            height: 30,
                            valueExpr: "ID"
                        }
                    }, {
                        itemType: "empty"
                    }, {
                        dataField: "Task_Start_Date",
                        label: {
                            text: "Start Date"
                        },
                        editorType: "dxDateBox",
                        validationRules: [{
                            type: "compare",
                            comparisonType: "<=",
                            comparisonTarget: function() {
                                return taskInfoForm.option("formData.Task_Due_Date");
                            },
                            message: "A start date is greater than a due date"
                        }],
                        editorOptions: {
                            calendarOptions: {
                                firstDayOfWeek: 0
                            },
                            width: "100%",
                            height: 30,
                            pickerType: "calendar",
                            onValueChanged: function(e) {
                                var dueDateEditor = taskInfoForm.getEditor("Task_Due_Date").element(),
                                    dueDateValidator = dueDateEditor.dxValidator("instance");
                                dueDateValidator.validate();
                            }
                        }
                    }, {
                        dataField: "Task_Due_Date",
                        label: {
                            text: "Due Date"
                        },
                        editorType: "dxDateBox",
                        validationRules: [{
                            type: "compare",
                            comparisonType: ">=",
                            comparisonTarget: function() {
                                return taskInfoForm.option("formData.Task_Start_Date");
                            },
                            message: "A due date is less than a start date"
                        }],
                        editorOptions: {
                            calendarOptions: {
                                firstDayOfWeek: 0
                            },
                            width: "100%",
                            height: 30,
                            pickerType: "calendar",
                            onValueChanged: function(e) {
                                var startDateEditor = taskInfoForm.getEditor("Task_Start_Date").element(),
                                    startDateValidator = startDateEditor.dxValidator("instance");
                                startDateValidator.validate();
                            }
                        }
                    }, {
                        itemType: "empty"
                    }, {
                        dataField: "Task_Priority",
                        label: {
                            text: "Priority"
                        },
                        cssClass: "task-priority",
                        editorType: "dxSelectBox",
                        editorOptions: {
                            dataSource: priorities,
                            displayExpr: "value",
                            valueExpr: "id",
                            height: 30,
                            fieldTemplate: function(selectedItem, $fieldElement) {

                                if(!selectedItem) selectedItem = priorities[0];

                                $("<div />")
                                    .attr("id", "task-priority-image")
                                    .addClass("task-priority-" + selectedItem.id)
                                    .appendTo($fieldElement);
                                $("<div />")
                                    .appendTo($fieldElement)
                                    .dxTextBox({
                                        value: selectedItem.value
                                    });

                                return $fieldElement;
                            },
                            itemTemplate: function(name, index, $element) {
                                $("<div />")
                                    .attr("id", "task-priority-image")
                                    .addClass("task-priority-" + propertyIndexes["priority"][name.value])
                                    .appendTo($element);

                                $("<span />")
                                    .text(name.value)
                                    .appendTo($element);

                                return $element;
                            }
                        }
                    }, {
                        dataField: "Task_Status",
                        label: {
                            text: "Status"
                        },
                        cssClass: "task-status",
                        editorType: "dxSelectBox",
                        editorOptions: {
                            dataSource: statuses,
                            height: 30,
                            fieldTemplate: function(selectedItem, $fieldElement) {
                                $("<div />")
                                    .attr("id", "task-status-image")
                                    .addClass("task-status-" + propertyIndexes["status"][selectedItem || "Not Started"])
                                    .appendTo($fieldElement);
                                $("<div />")
                                    .appendTo($fieldElement)
                                    .dxTextBox({
                                        value: selectedItem || "Not Started"
                                    });

                                return $fieldElement;
                            },
                            itemTemplate: function(name, index, $element) {
                                $("<div />")
                                    .attr("id", "task-status-image")
                                    .addClass("task-status-" + propertyIndexes["status"][name])
                                    .appendTo($element);

                                $("<span />")
                                    .text(name)
                                    .appendTo($element);

                                return $element;
                            }
                        }
                    }]
                }, {
                    itemType: "group",
                    label: {
                        visible: false
                    },
                    items: [{
                        dataField: "Task_Subject",
                        label: {
                            text: "Subject",
                            alignment: "right"
                        },
                        validationRules: [{
                            type: "required",
                            message: "Subject is required"
                        }],
                        editorType: "dxTextBox",
                        editorOptions: {
                            height: 30
                        }
                    }, {
                        dataField: "Task_Description",
                        label: {
                            text: "Details",
                            alignment: "right"
                        },
                        editorType: "dxTextArea",
                        editorOptions: {
                            height: 110
                        }
                    }, {
                        itemType: "empty"
                    }, {
                        dataField: "Task_Completion",
                        label: {
                            text: "% Completed",
                            alignment: "right"
                        },
                        cssClass: "task-completed",
                        template: function(data, $element) {
                           $("<div />")
                                .appendTo($element)
                                .addClass("task-slider")
                                .dxSlider({
                                    min: 0,
                                    max: 100,
                                    showRange: true,
                                    rtlEnabled: false,
                                    tooltipShowMode: "onhover",
                                    tooltip: {
                                        enabled: true,
                                        format: function(value) {
                                            return value + "%";
                                        },
                                        position: "bottom"
                                    }
                                });

                            $element.append(
                                $("<div />")
                                    .addClass("slider-axis-value-0")
                                    .text(0),
                                $("<div />")
                                    .addClass("slider-axis-value-50")
                                    .text(50),
                                $("<div />")
                                    .addClass("slider-axis-value-100")
                                    .text(100)
                                );

                            return $element;
                        }
                    }]
                }],
                screenByWidth: function() {
                    return "lg";
                }
            }).dxForm("instance");

            $("#task-save").dxButton({
                text: "Save",
                width: 90,
                height: 30,
                onClick: function() {
                    if(taskInfoForm.validate().isValid) {
                         
                        if(currentTask) {
                            var taskInfo = {
                                Task_Owner_ID: taskInfoForm.getEditor("Task_Owner_ID").option("value") || null,
                                Task_Assigned_Employee_ID: taskInfoForm.getEditor("Task_Assigned_Employee_ID").option("value") || null,
                                Task_Subject: taskInfoForm.getEditor("Task_Subject").option("value"),
                                Task_Description: taskInfoForm.getEditor("Task_Description").option("value"),
                                Task_Start_Date: taskInfoForm.getEditor("Task_Start_Date").option("value"),
                                Task_Due_Date: taskInfoForm.getEditor("Task_Due_Date").option("value"),
                                Task_Status: taskInfoForm.getEditor("Task_Status").option("value"),
                                Task_Priority: taskInfoForm.getEditor("Task_Priority").option("value"),
                                Task_Completion: $(".task-slider").dxSlider("instance").option("value")
                            };

                            if(currentTask.Task_ID) {
                                taskStore.update(currentTask.Task_ID, taskInfo)
                                    .done(function() {
                                        that.taskGrid.refresh();
                                    })
                                    .fail(function(error) {
                                        alert(error.message);
                                    });
                            } else {
                                taskStore.insert(taskInfo)
                                    .done(function() {
                                        that.taskGrid.refresh();
                                    })
                                    .fail(function(error) {
                                        alert(error.message);
                                    });
                            }
                        }
                         
                        that.popup.option("visible", false);
                    }
                }
            });

            $("#task-cancel").dxButton({
                text: "Cancel",
                width: 90,
                height:  30,
                onClick: function () {
                    that.popup.option("visible", false);
                }
            });
            editTaskInited.resolve();
        }
    };

    that.init = function () {
        that.taskGrid = DevAV.createGrid(gridOptions, taskDataSource);

        that.popup = $("#edit-task-popup").dxPopup(editTaskOptions).dxPopup("instance");

        $('.button-new').dxButton({
            text: "New",
            height: 30,
            width: 70,
            onClick: function() {
                editTask(null, { data: {}});
            }
        });

        
    };
};

DevAV.filterField = "Task_Status";
DevAV.customFilters.init("tasks");

$(function () {
    var tasks = new Tasks();
    tasks.init();
});

