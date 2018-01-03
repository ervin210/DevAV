"use strict";

var Employees = function () {
    var that = this,
        currentTask = {},
        currentNote = {},
        noteInfoForm = {},
        taskInfoForm = {},
        currentEmployee = {},
        employeeInfoForm = {},
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
        statuses = ["Not Started", "Need Assistance", "In Progress", "Deferred", "Completed"],
        sections = [
            { text: "Evaluations" },
            { text: "Tasks" }
        ];

    var editNoteInited = $.Deferred(),
        editTaskInited = $.Deferred(),
        editEmployeeInited = $.Deferred();

    DevAV.DBCustomFilterFields = [
        { dataField: "Employee_First_Name", caption: "First Name" },
        { dataField: "Employee_Last_Name", caption: "Last Name" },
        { dataField: "Employee_Birth_Date", caption: "Birth Date", dataType: "date" },
        { dataField: "Employee_Hire_Date", caption: "Hire Date", dataType: "date" },
        { dataField: "Employee_Title", caption: "Title" },
        { dataField: "Employee_Mobile_Phone", caption: "Mobile Phone" },
        { dataField: "Employee_Home_Phone", caption: "Home Phone" }
    ];

    that.employeeGrid = {};
    that.tabs = {};


    var employeeStore = DevAV.stores.employees,
        employeeDataSource = {
            store: employeeStore,
            select: ["Employee_ID,Employee_First_Name,Employee_Last_Name,Employee_Full_Name,Employee_Title,Employee_Birth_Date,Employee_Hire_Date,Employee_Prefix,Employee_Address,Employee_City,Employee_State_ID,Employee_Zipcode,Employee_Email,Employee_Skype,Employee_Home_Phone,Employee_Department_ID,Employee_Mobile_Phone"]
        },
        taskStore = DevAV.stores.tasks,
        evaluationStore = DevAV.stores.evaluations;

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
            fileName: "Employees"
        },
        columns: [
            {
                dataField: "Employee_First_Name",
                caption: "First Name"
            }, {
                dataField: "Employee_Last_Name",
                caption: "Last Name"
            }, {
                dataField: "Employee_Birth_Date",
                caption: "Birth Date",
                dataType: "date"
            }, {
                dataField: "Employee_Title",
                width: "30%",
                caption: "Title"
            }, {
                dataField: "Employee_Hire_Date",
                caption: "Hire Date",
                dataType: "date"
            }, {
                dataField: "Employee_Mobile_Phone",
                caption: "Mobile Phone",
                customizeText: function(cellInfo) {
                    return DevAV.formatPhoneNumber(cellInfo.valueText);
                },
                visible: false
            }, {
                dataField: "Employee_Home_Phone",
                caption: "Home Phone",
                customizeText: function(cellInfo) {
                    return DevAV.formatPhoneNumber(cellInfo.valueText);
                },
                visible: false
            }, {
                dataField: "Details",
                caption: "Details",
                alignment: "center",
                allowFiltering: false,
                allowSorting: false,
                allowHiding: false,
                cellTemplate: function (container, options) {
                    $("<div/>")
                        .addClass("grid-details")
                        .on("dxclick", function (e) { editEmployee(e, options); })
                        .appendTo(container);
                }
            }],
        onRowRemoved: function(e) {
            e.component.selectRowsByIndexes(0);
        },
        onSelectionChanged: function (items) {
            if(items.selectedRowsData[0]) { 
                that.initTabs(items.selectedRowsData[0].Employee_ID);
                that.initInfo(items.selectedRowsData[0].Employee_ID);
            }
        }
    };

    var tabsOptions = {
        dataSource: sections,
        selectedIndex: 0,
        onSelectionChanged: function () {
            if(that.employeeGrid.getSelectedRowsData()[0]) { that.initTabs(that.employeeGrid.getSelectedRowsData()[0].Employee_ID); }
        }
    };


    var tasksOptions = {
        dataSource: [],
        paging: {
            enabled: false
        },
        height: 290,
        width: "100%",
        editing: {
            removeConfirmMessage: ""
        },
        columns: [{
            dataField: "Task_Due_Date",
            caption: "Due Date",
            width: 90
        }, {
            dataField: "Task_Subject",
            caption: "Subject"
        }, {
            dataField: "Task_Actions",
            caption: "",
            width: 150
        }],
        loadPanel: {
            enabled: false
        },
        showColumnLines: false,
        rowTemplate: function (container, options) {
            var rowHtml = "",
                data = options.data;

            rowHtml = $("<tr class='dx-row dx-data-row dx-column-lines'><td>" + Globalize.formatDate(new Date(data.Task_Due_Date), { date: "short" }) + "</td>"
                    + "<td>" + data.Task_Subject + "</td>"
                    + "<td class='task-actions'></td></tr>");

            $("<div />").dxButton({ text: "Edit", onClick: function (e) { editTask(e, options); } }).appendTo($(".task-actions", rowHtml));
            $("<div />").dxButton({ text: "Delete", onClick: function (e) { deleteTask(e, options); } }).appendTo($(".task-actions", rowHtml));

            rowHtml.hover(function (e) {
                $(".row-selected").removeClass("row-selected");
                $(e.delegateTarget).addClass("row-selected");
            }, function () {
                $(".row-selected").removeClass("row-selected");
            });

            container.append(rowHtml);
        }
    };


    var notesOptions = {
        dataSource: [],
        paging: {
            pageSize: 6
        },
        height: 290,
        width: "100%",
        editing: {
            removeConfirmMessage: ""
        },
        columns: [{
            dataField: "Created_On",
            caption: "Date",
            width: 90
        }, {
            dataField: "Subject"
        }, {
            dataField: "Task_Actions",
            caption: "",
            width: 150
        }],
        loadPanel: {
            enabled: false
        },
        showColumnLines: false,
        rowTemplate: function (container, options) {
            var rowHtml = "",
                data = options.data;

            rowHtml = $("<tr class='dx-row dx-data-row dx-column-lines'><td>" + Globalize.formatDate(new Date(data.Created_On), { date: "short" }) + "</td>"
                    + "<td>" + data.Subject + "</td>"
                    + "<td class='task-actions'></td></tr>");

            $("<div />").dxButton({ text: "Edit", onClick: function (e) { editNote(e, options); } }).appendTo($(".task-actions", rowHtml));
            $("<div />").dxButton({ text: "Delete", onClick: function (e) { deleteNote(e, options); } }).appendTo($(".task-actions", rowHtml));

            rowHtml.hover(function (e) {
                $(".row-selected").removeClass("row-selected");
                $(e.delegateTarget).addClass("row-selected");
            }, function () {
                $(".row-selected").removeClass("row-selected");
            });

            container.append(rowHtml);
        }

    };
    
    function deleteNote(e, options) {
        e.event.stopPropagation();
         
        evaluationStore.remove(options.data.Note_ID)
            .done(function() {
                that.initTabs(that.employeeGrid.getSelectedRowsData()[0].Employee_ID);
            })
            .fail(function(error) {
                alert(error.message);
            });
         
    }


    function editNote(e, options) {
        currentNote = options.data;
        that.editNote.option("visible", true);
    }


    function setEditNoteValues() {
        $("#note-edit-label")
            .text("Edit Notes" + (currentNote.Reviewer.Employee_ID ? " (" + currentNote.Reviewer.Employee_Full_Name + ")" : ""));
        noteInfoForm.option("formData", currentNote);
    }

    var editNoteOptions = {
        visible: false,
        width: 620,
        showTitle: false,
        showCloseButton: false,
        height: "auto",
        onShowing: function () {
            editNoteInited.done(setEditNoteValues);
        },
        onContentReady: function () {
            noteInfoForm = $(".note-info").dxForm({
                showColonAfterLabel: false,
                showValidationSummary: true,
                onContentReady: function(e) {
                    DevAV.showValidationMessage(e);
                },
                height: 290,
                labelLocation: "top",
                items: [{
                    dataField: "Subject",
                    editorType: "dxTextBox",
                    validationRules: [{
                        type: "required",
                        message: "Subject is required"
                    }],
                    editorOptions: {
                        height: 30
                    }
                }, {
                    dataField: "Details",
                    editorType: "dxTextArea",
                    editorOptions: {
                        height: 160
                    }
                }],
                screenByWidth: function() {
                    return "lg";
                }
            }).dxForm("instance");

            $("#note-save").dxButton({
                text: "Save",
                width: 90,
                height: 30,
                onClick: function() {
                    if(noteInfoForm.validate().isValid) {
                         
                        if(currentNote) {
                            var noteInfo = {
                                Subject: noteInfoForm.getEditor("Subject").option("value"),
                                Details: noteInfoForm.getEditor("Details").option("value")
                            };

                            evaluationStore.update(currentNote.Note_ID, noteInfo)
                                .done(function() {
                                    that.initTabs(that.employeeGrid.getSelectedRowsData()[0].Employee_ID);
                                })
                                .fail(function(error) {
                                    alert(error.message);
                                });
                        }
                         
                        that.editNote.option("visible", false);
                    }
                }
            });

            $("#note-cancel").dxButton({
                text: "Cancel",
                width: 90,
                height: 30,
                onClick: function () {
                    that.editNote.option("visible", false);
                }
            });

            editNoteInited.resolve();
        }
    };

  

    function editTask(e, options) {
        if (e)
            e.event.stopPropagation();

        currentTask = options.data;

        that.editTask.option("visible", true);
    }   


    function setEditTaskValues() {
        if(currentTask.hasOwnProperty("Task_ID")) {
            for(var field in currentTask) {
                if(taskInfoForm.getEditor(field))
                    taskInfoForm.updateData(field, currentTask[field]);
            }
        } else {
            taskInfoForm.option("formData", currentTask);
        }

        if(!currentTask.Task_Start_Date) { taskInfoForm.updateData("Task_Start_Date", new Date()); }
        if(!currentTask.Task_Due_Date) { taskInfoForm.updateData("Task_Due_Date", new Date()); }
        if(!currentTask.Task_Priority) { taskInfoForm.updateData("Task_Priority", 1); }

        var assignedToName = taskInfoForm.getEditor("Task_Assigned_Employee_ID").option("displayValue");

        $("#task-edit-label")
            .text((currentTask.Task_ID ? "Edit" : "Add") + " Task " + (currentTask.Task_ID ? "(" + assignedToName + ")" : ""));
        $(".task-slider").dxSlider("instance").option("value", currentTask.Task_Completion || 0);
        taskInfoForm.element().find(".dx-validationsummary").empty();
    }



    var editTaskOptions = {
        visible: false,
        width: 750,
        height: "auto",
        showTitle: false,
        showCloseButton: false,
        onShowing: function () {
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
                            displayExpr: "Name",
                            valueExpr: "ID",
                            height: 30
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
                            valueExpr: "ID",
                            height: 30
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
                            pickerType: "calendar",
                            width: "100%",
                            height: 30,
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
                            pickerType: "calendar",
                            width: "100%",
                            height: 30,
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
                            value: 1,
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
                                    .addClass("task-status-" + propertyIndexes["status"][selectedItem || "Pending"])
                                    .appendTo($fieldElement);
                                $("<div />")
                                    .appendTo($fieldElement)
                                    .dxTextBox({
                                        value: selectedItem || "Pending"
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
                                        that.initTabs(that.employeeGrid.getSelectedRowsData()[0].Employee_ID);
                                    })
                                    .fail(function(error) {
                                        alert(error.message);
                                    });
                            } else {
                                taskStore.insert(taskInfo)
                                    .done(function() {
                                        that.initTabs(that.employeeGrid.getSelectedRowsData()[0].Employee_ID);
                                    })
                                    .fail(function(error) {
                                        alert(error.message);
                                    });
                            }
                        }
                         
                        that.editTask.option("visible", false);
                    }
                }
            });

            $("#task-cancel").dxButton({
                text: "Cancel",
                width: 90,
                height: 30,
                onClick: function () {
                    that.editTask.option("visible", false);
                }
            });

            editTaskInited.resolve();
        }
    };

    function editEmployee(e, options) {
        currentEmployee = options.data ? options.data : options;
        that.editEmployee.option("visible", true);
    }


    function setEditEmployeeValues() {
        if(currentEmployee.hasOwnProperty("Employee_ID")) {
            for(var field in currentEmployee) {
                if(employeeInfoForm.getEditor(field))
                    employeeInfoForm.updateData(field, currentEmployee[field]);
            }
        } else {
            employeeInfoForm.option("formData", currentEmployee);
        }

        $("#employee-edit-label")
            .text((currentEmployee.Employee_ID ? "Edit" : "Add") + " Employee" + (currentEmployee.Employee_Full_Name ? " (" + currentEmployee.Employee_Full_Name + ")" : ""));
        employeeInfoForm.element().find(".dx-validationsummary").empty();
    }

    var editEmployeeOptions = {
        visible: false,
        width: 620,
        showTitle: false,
        showCloseButton: false,
        height: "auto",
        onShowing: function () {
            editEmployeeInited.done(setEditEmployeeValues);
        },
        onContentReady: function () {

            employeeInfoForm = $(".employee-info").dxForm({
                showColonAfterLabel: false,
                showValidationSummary: true,
                onContentReady: function(e) {
                    DevAV.showValidationMessage(e);
                },
                height: 290,
                items: [{
                    itemType: "group",
                    colCount: 2,
                    items: [{
                        dataField: "Employee_First_Name",
                        editorType: "dxTextBox",
                        label: {
                            text: "First Name",
                            alignment: "right"
                        },
                        validationRules: [{
                            type: "required",
                            message: "First name is required"
                        }],
                        editorOptions: {
                            height: 30
                        }
                    }, {
                        dataField: "Employee_Last_Name",
                        editorType: "dxTextBox",
                        label: {
                            text: "Last Name",
                            alignment: "right"
                        },
                        validationRules: [{
                            type: "required",
                            message: "Last name is required"
                        }],
                        editorOptions: {
                            height: 30
                        }
                    }, {
                        dataField: "Employee_Prefix",
                        editorType: "dxSelectBox",
                        label: {
                            text: "Prefix",
                            alignment: "right"
                        },
                        editorOptions: {
                            dataSource: ["Mr.", "Mrs.", "Dr.", "Miss", "Ms."],
                            height: 30
                        }
                    }, {
                        dataField: "Employee_Title",
                        editorType: "dxTextBox",
                        validationRules: [{
                            type: "required",
                            message: "Title is required"
                        }],
                        label: {
                            text: "Title",
                            alignment: "right"
                        },
                        editorOptions: {
                            height: 30
                        }
                    }, {
                        itemType: "empty",
                        colSpan: 2,
                        cssClass: "empty-row"
                    }, {
                        dataField: "Employee_Address",
                        editorType: "dxTextBox",
                        editorOptions: {
                            height: 30
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
                        dataField: "Employee_City",
                        editorType: "dxTextBox",
                        colSpan: 2,
                        label: {
                            visible: false
                        },
                        editorOptions: {
                            height: 30
                        }
                    }, {
                        dataField: "Employee_State_ID",
                        editorType: "dxSelectBox",
                        label: {
                            visible: false
                        },
                        editorOptions: {
                            dataSource: DevAV.states,
                            valueExpr: "ID",
                            displayExpr: "Short_Name",
                            height: 30
                        }
                    }, {
                        dataField: "Employee_Zipcode",
                        editorType: "dxTextBox",
                        label: {
                            visible: false
                        },
                        editorOptions: {
                            height: 30
                        }
                    }]
                }, {
                    itemType: "group",
                    colCount: 2,
                    items: [{
                        itemType: "empty",
                        colSpan: 2,
                        cssClass: "empty-row"
                    }, {
                        dataField: "Employee_Home_Phone",
                        editorType: "dxTextBox",
                        label: {
                            text: "Home",
                            alignment: "right"
                        },
                        validationRules: [{
                            type: "pattern",
                            pattern: /^\d{10}$/
                        }],
                        editorOptions: {
                            mask: "+1(000)000-0000",
                            maskInvalidMessage: "Please enter a valid phone",
                            height: 30
                        }
                    }, {
                        dataField: "Employee_Email",
                        editorType: "dxTextBox",
                        label: {
                            text: "Email",
                            alignment: "right"
                        },
                        validationRules: [{
                            type: "email",
                            message: "Please enter a valid email"
                        }],
                        editorOptions: {
                            height: 30
                        }
                    }, {
                        dataField: "Employee_Mobile_Phone",
                        editorType: "dxTextBox",
                        label: {
                            text: "Mobile",
                            alignment: "right"
                        },
                        validationRules: [{
                            type: "pattern",
                            pattern: /^\d{10}$/
                        }],
                        editorOptions: {
                            mask: "+1(000)000-0000",
                            maskInvalidMessage: "Please enter a valid phone",
                            height: 30
                        }
                    }, {
                        dataField: "Employee_Skype",
                        editorType: "dxTextBox",
                        label: {
                            text: "Skype",
                            alignment: "right"
                        },
                        editorOptions: {
                            height: 30
                        }
                    }, {
                        itemType: "empty",
                        colSpan: 2,
                        cssClass: "empty-row"
                    }, {
                        dataField: "Employee_Hire_Date",
                        editorType: "dxDateBox",
                        label: {
                            text: "Hire Date",
                            alignment: "right"
                        },
                        validationRules: [{
                            type: "required",
                            message: "Hire date is required"
                        }],
                        editorOptions: {
                            pickerType: "calendar",
                            width: "100%",
                            height: 30
                        }
                    }, {
                        dataField: "Employee_Department_ID",
                        editorType: "dxSelectBox",
                        label: {
                            text: "Dept.",
                            alignment: "right"
                        },
                        validationRules: [{
                            type: "required",
                            message: "Department is required"
                        }],
                        editorOptions: {
                            dataSource: DevAV.departments,
                            displayExpr: "Name",
                            valueExpr: "ID",
                            height: 30
                        }
                    }]
                }],
                screenByWidth: function() {
                    return "lg";
                }
            }).dxForm("instance");

            $("#employee-save").dxButton({
                text: "Save",
                width: 90,
                height: 30,
                onClick: function() {
                    if(employeeInfoForm.validate().isValid) {
                         
                        if(currentEmployee) {
                            var employeeInfo = {
                                Employee_First_Name: employeeInfoForm.getEditor("Employee_First_Name").option("value"),
                                Employee_Last_Name: employeeInfoForm.getEditor("Employee_Last_Name").option("value"),
                                Employee_Prefix: employeeInfoForm.getEditor("Employee_Prefix").option("value"),
                                Employee_Title: employeeInfoForm.getEditor("Employee_Title").option("value"),
                                Employee_Home_Phone: employeeInfoForm.getEditor("Employee_Home_Phone").option("value"),
                                Employee_Mobile_Phone: employeeInfoForm.getEditor("Employee_Mobile_Phone").option("value"),
                                Employee_Hire_Date: employeeInfoForm.getEditor("Employee_Hire_Date").option("value"),
                                Employee_Address: employeeInfoForm.getEditor("Employee_Address").option("value"),
                                Employee_City: employeeInfoForm.getEditor("Employee_City").option("value"),
                                Employee_State_ID: employeeInfoForm.getEditor("Employee_State_ID").option("value") || null,
                                Employee_Zipcode: employeeInfoForm.getEditor("Employee_Zipcode").option("value"),
                                Employee_Email: employeeInfoForm.getEditor("Employee_Email").option("value"),
                                Employee_Skype: employeeInfoForm.getEditor("Employee_Skype").option("value"),
                                Employee_Department_ID: employeeInfoForm.getEditor("Employee_Department_ID").option("value") || null
                            };

                            if(currentEmployee.Employee_ID) {
                                employeeStore.update(currentEmployee.Employee_ID, employeeInfo)
                                    .done(function() {
                                        that.employeeGrid.refresh();
                                        that.initInfo(currentEmployee.Employee_ID);
                                    })
                                    .fail(function(error) {
                                        alert(error.message);
                                    });
                            } else {
                                employeeStore.insert(employeeInfo)
                                    .done(function() {
                                        that.employeeGrid.refresh();
                                    })
                                    .fail(function(error) {
                                        alert(error.message);
                                    });
                            }
                        }
                         
                        that.editEmployee.option("visible", false);
                    }
                }
            });

            $("#employee-cancel").dxButton({
                text: "Cancel",
                width: 90,
                height: 30,
                onClick: function () {
                    that.editEmployee.option("visible", false);
                }
            });

            editEmployeeInited.resolve();
        }
    };

      
    function deleteTask(e, options) {
        e.event.stopPropagation();
         
        taskStore.remove(options.data.Task_ID)
            .done(function() {
                that.initTabs(that.employeeGrid.getSelectedRowsData()[0].Employee_ID);
            })
            .fail(function(error) {
                alert(error.message);
            });
         
    }

    function addInfo(data) {
        $.each(DevAV.states, function (_, item) {
            if (item.ID == data.Employee_State_ID)
                data.State = item;
        });

        $(".name").text(data.Employee_Full_Name);

        if($(".icon-edit")) { $(".icon-edit").remove(); }

        $(".name").after(
                $("<div/>")
                    .addClass("icon-edit")
                    .on("dxclick", function (e) { editEmployee(e, data); })
                 );      

        $(".title").text(data.Employee_Title);
        
        var imageUrl = data.Employee_Picture ? "data:image/png;base64," + data.Employee_Picture : "images/no-photo_employee-details.png";
        
        $(".photo .image").css("background-image", "url('" + imageUrl + "')");
        $(".photo .address span").html(data.Employee_Address + "<br/>" + data.Employee_City + ", " + (data.State && data.State.Short_Name) + ", " + data.Employee_Zipcode);
        $(".photo .phone span").text(DevAV.formatPhoneNumber(data.Employee_Mobile_Phone));
        $(".photo .mail span").text(data.Employee_Email);
    }

    function initTasks(data) {
        $("<div/>").addClass("tasks").appendTo($(".tabs-content"));
        that.gridTasks = $(".tabs-content .tasks").dxDataGrid($.extend({}, tasksOptions, { "dataSource": data.value })).dxDataGrid("instance");
    }

    function initNotes(data) {
        $("<div/>").addClass("tasks").addClass("notes").appendTo($(".tabs-content"));
        that.gridNotes = $(".tabs-content .notes").dxDataGrid($.extend({}, notesOptions, { "dataSource": data.value })).dxDataGrid("instance");
    }

    that.clearContainer = function () {
        $(".tabs-content").children().remove();
    };


    that.initTabs = function (id) {
        that.clearContainer();
        if (that.tabs.option("selectedIndex") === 0) {
            DevAV.loadData({
                id: id,
                controller: "Employees",
                method: "PersonEvaluations",
                query: "$expand=Reviewer&$select=Note_ID,Subject,Details,Created_On,Reviewer/Employee_ID,Reviewer/Employee_Full_Name",
                callback: function (data) {
                    initNotes(data);
                }
            });
        }
        else {
            DevAV.loadData({
                id: id,
                controller: "Employees",
                method: "ResponsibleTasks",
                query: "$expand=ResponsibleEmployee,Owner&$select=Task_ID,Task_Assigned_Employee_ID,Task_Owner_ID,Task_Subject,Task_Description,Task_Start_Date,Task_Due_Date,Task_Status,Task_Priority,Task_Completion,ResponsibleEmployee/Employee_Full_Name,Owner/Employee_Full_Name",
                callback: function (data) {
                    initTasks(data);
                }
            });
        }
    };

    that.initInfo = function (id) {
        $(".photo .image")
            .css("background-image", "url('images/loading_employee-details.png')");
        DevAV.loadData({
            id: "",
            controller: "Employees",
            query: "$filter=Employee_ID eq " + id,
            callback: function(data) {
                addInfo(data.value[0]);
            }
        });
    };

       
    that.init = function () {
        that.employeeGrid = DevAV.createGrid(gridOptions, employeeDataSource);
        that.tabs = $(".tabs").dxTabs(tabsOptions).dxTabs("instance");
        that.editNote = $("#edit-note-popup").dxPopup(editNoteOptions).data("dxPopup");
        that.editTask = $("#edit-task-popup").dxPopup(editTaskOptions).data("dxPopup");
        that.editEmployee = $("#edit-employee-popup").dxPopup(editEmployeeOptions).data("dxPopup");

        $(".button-new").dxButton({
            text: "New",
            width: 70,
            height: 30,
            onClick: function () {
                editEmployee(null, { data: {}});
            }
        });

        $(".button-delete").dxButton({
            text: "Delete",
            width: 70,
            height: 30,
            onClick: function() {
                 
                that.employeeGrid.deleteRow(that.employeeGrid.getRowIndexByKey(that.employeeGrid.getSelectedRowKeys()[0]));
                 
            }
        });

        $(".button-task").dxButton({
            text: "Task",
            width: 70,
            height: 30,
            onClick: function() {
                editTask(null, {data: {}});
            }
        });
    };

};

DevAV.filterField = "Employee_Status";
DevAV.customFilters.init("employees");

$(function () {
    var employees = new Employees();
    employees.init();
});

