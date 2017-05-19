/* On Window Load */
window.onload = function () {
    prepareGlobalNavBar();
    prepareToolNavBar('mail');
	window.setTimeout(checkAuth, 1);

     document.getElementById("emptyTrash-button")
     .addEventListener("click", emptyTrash, false);
}

/* Load Gmail API, and when it's done, call renderInbox */
function loadGmailAPI() {
     gapi.client.load('gmail', 'v1', renderMessages);
}

/* renderMessages()	*/
function renderMessages() {
    // Clear Messages table
    $('.table-msg tbody').empty();
	 
	var curLoc = window.location.href;
	var splitLoc = curLoc.split("?");
	
	if (splitLoc.length == 2 && splitLoc[1])
	{
		switch(splitLoc[1]) {
			case 'sent':
				listMessages('SENT', '!label:CHAT', 50, appendSentMessageRow);
				$("a.mail-sentNav").addClass("CurrentPage");
				break;			
			case 'spam': //not working
				listMessages('SPAM', '!label:CHAT', 50, appendMessageRow);
				$("a.mail-spamNav").addClass("CurrentPage");
				break; 
			case 'trash':
			default:
				listMessages('TRASH', '!label:CHAT', 50, appendTrashMessageRow);
				$("a.mail-trashNav").addClass("CurrentPage");
				break;
		}
	}
	else
	{
		listMessages('TRASH', '!label:CHAT', 50, appendTrashMessageRow);
		$("a.mail-trashNav").addClass("CurrentPage");
	}	
}

function emptyTrash() {
	$('#table-msg tr').each(function(){
		var row = this;
		console.log(row.id);
		if(row.id)
		{
		   deleteMessagePermanently(row.id, getCallResultAndShowMessage);
		}
	});
}


function appendSentMessageRow(message) {
	var headers = message.payload.headers;

     // Extract From value, and parse it if necessary
     var from = getHeader(headers, 'From');
     var tmp_from = from.match("<(.*)>");
     if (tmp_from) {
          from = tmp_from[1];
     }

     var mailDateString = getHeader(headers, 'Date');
     var mailDate = new Date(mailDateString);
     var finalMailDate = mailDate.toLocaleString("en-GB");

     // Append row to table
     $('#table-msg').append(
          '<tr class="email_item" id="' + message.id + '">\
          <td>' + from + '</td>\
          <td>\
          <a id="thread-' + message.threadId + '">' +
          getHeader(headers, 'Subject') +
          '</a>\
          </td>\
          <td style="width: 166px !important;"><div id="dateEmail">' + finalMailDate + '</div></td>\
          <td></td></tr>');

     /* js event handler on Message Subject Link */
     $('#thread-' + message.threadId).on('click', function () {
          var threadDetailURL = "thread.html?threadId=" + message.threadId;
          console.log(threadDetailURL);
          document.location.href = threadDetailURL;
     });

     $('#table-msg').tablesorter({
          dateFormat: "uk",
          sortList: [[3, 1]]
     });
}


function appendTrashMessageRow(message) {

    $("#emptyTrash-button").removeClass("hidden");
	var headers = message.payload.headers;

     // Extract From value, and parse it if necessary
     var from = getHeader(headers, 'From');
     var tmp_from = from.match("<(.*)>");
     if (tmp_from) {
          from = tmp_from[1];
     }
	 
     var mailDateString = getHeader(headers, 'Date');
     var mailDate = new Date(mailDateString);
     var finalMailDate = mailDate.toLocaleString("en-GB");

     $('#table-msg').append(
          '<tr class="email_item" id="' + message.id + '">\
          <td>' + from + '</td>\
          <td>\
          <a id="thread-' + message.threadId + '">' +
          getHeader(headers, 'Subject') +
          '</a>\
          </td>\
          <td style="width: 166px !important;"><div id="dateEmail">' + finalMailDate + '</div></td>\
          <td> <button type="button" class="inbox-buttons restore-button" id="restore-button-' + message.id + '">\
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

     $('#table-msg').tablesorter({
          dateFormat: "uk",
          sortList: [[3, 1]]
     });
}