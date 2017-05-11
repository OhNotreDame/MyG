// https://www.sitepoint.com/sending-emails-gmail-javascript-api/

/* On Window Load */
window.onload = function () {
     window.setTimeout(checkAuth, 1);

     document.getElementById("emptyTrash-button")
     .addEventListener("click", emptyTrash, false);
}

/* Load Gmail API, and when it's done, call renderInbox */
function loadGmailAPI() {
     gapi.client.load('gmail', 'v1', renderTrash);
}

/* renderInbox()	*/
function renderTrash() {
     // Clear Messages table
     prepareGlobalNavBar();
     prepareToolNavBar('mail');
     $('.table-trash tbody').empty();
     listMessages('TRASH', '!label:CHAT', 30, appendMessageRow);
}

function emptyTrash() {
	$('#table-trash tr').each(function(){
		var row = this;
		console.log(row.id);
		if(row.id)
		{
		   deleteMessagePermanently(row.id, getCallResultAndShowMessage);
		}
	});
}

function appendMessageRow(message) {

     var headers = message.payload.headers;

     // Extract From value, and parse it if necessary
     var from = getHeader(headers, 'From');
     var tmp_from = from.match("<(.*)>");
     if (tmp_from) {
          from = tmp_from[1];
     }

     // Check if email has attachments
     var hasAttachString = "No";
     var tmpFileName = "";

     //Retrieve attachemnt
     var mailDateString = getHeader(headers, 'Date');
     var mailDate = new Date(mailDateString);
     var finalMailDate = mailDate.toLocaleString("en-GB");

     //$('.table-inbox tbody').before(
     // Append row to table
     $('#table-trash').append(
          '<tr class="email_item" id="' + message.id + '">\
          <td>' + from + '</td>\
          <td>\
          <a id="thread-' + message.threadId + '">' +
          getHeader(headers, 'Subject') +
          '</a>\
          </td>\
          <td style="width: 166px !important;"><div id="dateEmail">' + finalMailDate + '</div></td>\
          <td> <button type="button" class="btn btn-primary restore-button" id="restore-button-' + message.id + '">\
          <img id="delete-icon-' + message.id + '" src="img/restore.png" title="Restore"/></button>\</td>\
          </tr>');

     /* js event handler on Message Subject Link */
     $('#thread-' + message.threadId).on('click', function () {
          var threadDetailURL = "thread.html?threadId=" + message.threadId;
          console.log(threadDetailURL);
          document.location.href = threadDetailURL;
     });

     /* js event handler on Restore Button */
     $('#restore-button-' + message.id).on('click', function () {
          sendMessageBackToInbox(message.id);
          $('#row-' + message.id).hide();
     });

     $('#table-trash').tablesorter({
          dateFormat: "uk",
          sortList: [[3, 1]]
     });
}