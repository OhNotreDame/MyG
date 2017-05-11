var showDeleted = false;
var showHidden = false;

/* On Window Load */
window.onload = function () {
     window.setTimeout(checkAuth, 1);

     document.getElementById("add-button")
     .addEventListener("click", createTaskFromModal, false);

     $('#addtask-taskList').empty();
     $(document).ready(function () {

          $('#addtask-date').datepicker({
               format: 'dd/mm/yyyy',
               weekStart: 1
          });

     });

}

/* Load Gmail API, and when it's done, call displayInbox */
function loadTasksAPI() {
     gapi.client.load('tasks', 'v1', renderTasks);
}

/* renderTasks() */
function renderTasks() {

	prepareGlobalNavBar();
	prepareToolNavBar('tasks');
	$('#table-tasks > tbody').empty();
	listTasksLists(50);

}

/* listTasksLists() */
function listTasksLists(maxResult) {

     var getPageOfTasksLists = function (request, result) {
          request.execute(function (resp) {
               result = result.concat(resp.items);
               var nextPageToken = resp.nextPageToken;
               if (nextPageToken) {
                    request = gapi.client.tasks.tasklists.list({
                              'userId': USER,
                              'maxResults': maxResult,
                              'pageToken': nextPageToken
                         });
                    getPageOfTasksLists(request, result);
               } else {
                    parseTasksLists(resp.items);
               }
          });
     };

     var request = gapi.client.tasks.tasklists.list({
               'userId': USER,
               'maxResults': maxResult
          });
     getPageOfTasksLists(request, []);
}

/* parseTasksLists() */
function parseTasksLists(tasksLists) {
     $.each(tasksLists, function () {
          listTasks(this.title, this.id);
          $('#addtask-taskList').append('<option value="' + this.id + '">' + this.title + '</option>');
     });
}

/* listTasks() */
function listTasks(taskListName, taskListId) {
     var request = gapi.client.tasks.tasks.list({
               'userId': USER,
               'tasklist': taskListId,
               'showDeleted': showDeleted,
               'showHidden': showHidden
          });
     request.execute(function (resp) {
          $.each(resp.items, function () {
               // getTask(this.id, taskListId, taskListName);
               addTaskToTable(this, taskListId, taskListName);
          });
     });
}

/* addTaskToTable() */
function addTaskToTable(task, taskListId, taskListName) {
     var today = new Date();
     var overDue = false;
     var iconDivID = "#icons-" + task.id;
     var iconHTML = "";

     var updatedFormatted = ""
          if (task.updated) {
               updatedFormatted = new Date(task.updated).toLocaleString("en-GB");
          }

          var dueFormatted = ""
          if (task.due) {
               dueFormatted = new Date(task.due).toLocaleString("en-GB");
               overDue = (new Date(task.due) < today);
          } else {
               overDue = false;
          }

          var completedFormatted = ""
          if (task.completed) {
               completedFormatted = new Date(task.completed).toLocaleString("en-GB");
          }

          var statusFormatted = ""
          switch (task.status) {
          case 'completed':
               statusFormatted = "<div id='completed-" + task.id + "' class='completed'> <img id='iconCompleted-" + task.id + "' src='img/completed.png' title='Completed'/>&nbsp; Completed</div>";
               break;

          case 'needsAction':
          default:
               if (overDue) {
                    statusFormatted = "<div id='overdue-" + task.id + "' class='overdue'> <img id='iconOverdue-" + task.id + "' src='img/overdue.png' title='Overdue'/>&nbsp; Overdue</div>";
               } else {
                    statusFormatted = "<div id='ongoing-" + task.id + "' class='ongoing'><img id='iconOngoing-" + task.id + "' src='img/ongoing.png' title='Overdue'/>&nbsp; On-going</div>";
               }
               break;
          }
          if (task.deleted) {
               statusFormatted = "<div id='deleted-" + task.id + "' class='deleted'> <img id='iconDeleted-" + task.id + "' src='img/delete.png' title='Deleted'/>&nbsp; Deleted</div>";
          }
          if (task.hidden) {
               statusFormatted += " (Hidden)";
          }

          var notesFormatted = "";
     if (task.notes) {
          notesFormatted = task.notes
     };

     //

     $('#table-tasks > tbody').append(
          '<tr class="task_item" id="row-' + task.id + '">\
          <td><div id="icons-' + task.id + '"></div></td>\
          <td>' + statusFormatted + '</td>\
          <td>' + task.title + '</td>\
          <td>' + taskListName + '</td>\
          <td>' + notesFormatted + '</td>\
          <td>' + dueFormatted + '</td>\
          <td>' + completedFormatted + '</td>\
          <td>' + updatedFormatted + '</td>\
          </tr> ');

     var iconDivID = "#icons-" + task.id;
     if (task.status != "completed") {
          $(iconDivID).append("<button type='button' class='task-button' id='complete-button-" + task.id + "'><img id='completeIco' src='img/complete.png' title='Complete Task'/></button>&nbsp;");

          // $(iconDivID).append("<button type='button' class='task-button' id='edit-button-" + task.id + "'><img id='editIco' src='../img/edit.png' title='Edit Task'/></button>&nbsp;");
     } else {
          $(iconDivID).append("<button type='button' class='task-button' id='reopen-button-" + task.id + "'><img id='reopenIco' src='img/reopen.png' title='Reopen Task'/></button>&nbsp;");
     }
     if (!task.deleted) {
          $(iconDivID).append("<button type='button' class='task-button' id='delete-button-" + task.id + "'><img id='deleteIco' src='img/delete.png' title='Delete Task'/></button>&nbsp;");
     } else {
          $(iconDivID).append("<button type='button' class='task-button' id='restore-button-" + task.id + "'><img id='restoreIco' src='img/restore.png' title='Restore Task'/></button>&nbsp;");
     }

     /* Reinforce sort */
     $('#table-tasks').tablesorter({
          dateFormat: "uk",
          /* sortList: [[7, 1]] // by Modified date DESC */
          sortList: [[1, 1]] // by Status DESC 
     });

     /* Add js event handler on Complete Task Button */
     $('#complete-button-' + task.id).on('click', function () {
          //$('#complete-button-' + task.id).hide();
          markTaskAsCompleted(taskListId, task.id, null);
          location.reload();
     });

     /* Add js event handler on Complete Task Button */
     $('#reopen-button-' + task.id).on('click', function () {
          reopenTask(taskListId, task.id, null);
          location.reload();
     });

     /* Add js event handler on Complete Task Button */
     $('#restore-button-' + task.id).on('click', function () {
          restoreTask(taskListId, task.id, null);
          location.reload();
     });

     /* Add js event handler on Complete Task Button */
     $('#delete-button-' + task.id).on('click', function () {
          //$('#row-' + task.id).hide();
          deleteTask(taskListId, task.id, null);
          location.reload();
     });

     /* Add js event handler on Complete Task Button */
     $('#edit-button-' + task.id).on('click', function () {
          $('#row-' + task.id).hide();
          //editTask(taskListId, task.id, null);
          location.reload();
     });

}

function createTaskFromModal() {
     $('#add-button').addClass('disabled');
     var taskListId = $('#addtask-taskList option:selected').val();
     var taskName = $('#addtask-title').val();
     var taskDescription = $('#addtask-desc').val();
     var taskDue = $('#addtask-date').val();
     console.log(taskDue);
     var dueDateTxt = null;
     if (taskDue) {
         /* var curTime = new Date().toLocaleTimeString("en-GB");
		 var date = new Date(taskDue).toLocaleDateString("en-GB"); */
		 var dueDate = new Date(taskDue);
		 console.log(dueDate);
		 dueDateTxt = dueDate.toISOString()
     }

    insertTask(taskListId, taskName, taskDescription, dueDateTxt, clearAddTaskModal);
}

function insertTask(taskListId, taskName, taskDescription, taskDue, callback) {
     var resource = {
          'title': taskName,
          'notes': taskDescription,
          'due': taskDue
     };
     var request = gapi.client.tasks.tasks.insert({
               'userId': USER,
               'tasklist': taskListId,
               'title': taskName,
               'due': taskDue,
               'resource': resource
          });
	request.execute(callback);
}

function markTaskAsCompleted(taskListId, taskId, callback) {
     var curDate = new Date();
     var curDateTxt = curDate.toISOString();
     var request = gapi.client.tasks.tasks.patch({
               'userId': USER,
               'tasklist': taskListId,
               'task': taskId,
               'status': 'completed',
               'completed': curDateTxt
          });
     request.execute(callback);
}

function reopenTask(taskListId, taskId, callback) {
     var request = gapi.client.tasks.tasks.patch({
               'userId': USER,
               'tasklist': taskListId,
               'task': taskId,
               'status': 'needsAction',
               'completed': null
          });
     request.execute(callback);
}

function restoreTask(taskListId, taskId, callback) {
     var request = gapi.client.tasks.tasks.patch({
               'userId': USER,
               'tasklist': taskListId,
               'task': taskId,
               'deleted': false
          });
     request.execute(callback);
}

function rescheduleTask(taskListId, taskId, newDueDate, callback) {
     var curDate = new Date(newDueDate);
     var curDateTxt = curDate.toISOString();
     var request = gapi.client.tasks.tasks.patch({
               'userId': USER,
               'tasklist': taskListId,
               'task': taskId,
               'due': curDateTxt
          });
     request.execute(callback);
}

function deleteTask(taskListId, taskId, callback) {
     var request = gapi.client.tasks.tasks.delete ({
               'userId': USER,
               'tasklist': taskListId,
               'task': taskId
          });
     request.execute(callback);
}

function clearAddTaskModal() {

     $('#addtask-title').val('')
     $('#addtask-desc').val('')
     $('#addtask-date').val('')
     $('#add-button').removeClass('disabled');
     $('#addtask-modal').modal('hide');
     location.reload();
}