// https://www.sitepoint.com/sending-emails-gmail-javascript-api/
//https://www.googleapis.com/auth/drive.metadata

/* On Window Load */
window.onload = function () {
     window.setTimeout(checkAuth, 1);
}

/* Load Gmail API, and when it's done, call displayInbox */
function loadTasksAPI() {
     gapi.client.load('tasks', 'v1', renderTasks);
}

/* renderTasks() */
function renderTasks() {
     prepareToolbar();
     $('#table-tasks > tbody').empty();
     listTasksLists(30);

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
          getTasks(this.title, this.id);
     });
}

/* getTasks() */
function getTasks(taskListName, taskListId) {
     var request = gapi.client.tasks.tasks.list({
               'userId': USER,
               'tasklist': taskListId
          });
     request.execute(function (resp) {
          $.each(resp.items, function () {
               addTaskToTable(this, taskListName);
          });
     });
}

/* addTaskToTable() */
function addTaskToTable(task, taskListName) {
     var updated = new Date(task.updated);
     var updatedFormatted = updated.toLocaleString("en-GB");
     $('#table-tasks > tbody').append(
          '<tr class="task_item" id="row-' + task.id + '">\
          <td>' + task.title + '</td>\
          <td>' + task.status + '</td>\
          <td>' + updatedFormatted + '</td>\
          <td>' + taskListName + '</td>\
          <  / tr > ');
		  
 
    /* Reinforce sort */
	$('#table-tasks').tablesorter({
		dateFormat: "uk",
		sortList: [[3, 1]]
	});
}