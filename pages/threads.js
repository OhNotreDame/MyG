// https://www.sitepoint.com/sending-emails-gmail-javascript-api/

/* On Window Load */
window.onload = function () {
     window.setTimeout(checkAuth, 1);

     document.getElementById("send-button")
     .addEventListener("click", sendEmail, false);
     document.getElementById("reply-button")
     .addEventListener("click", sendReply, false);
	 
	

}

/* Load Gmail API, and when it's done, call renderInbox */
function loadGmailAPI() {
     gapi.client.load('gmail', 'v1', renderInbox);
}

/* renderInbox()	*/
function renderInbox() {
     prepareToolbar();
     // Clear Messages table
     $('#table-inbox > tbody').empty();
	 
	var urlParams = new URLSearchParams(window.location.search);
	var curLoc = window.location.href;
	if (curLoc.includes('?'))
	{
		var urlParamsKeys = urlParams.keys();
		for(key of urlParamsKeys) { 
			switch(key) {
				case 'updates':
					listThreads('INBOX', 'label:Updates after:'+getLast30DaysDate(), 50, appendThreadRow);
					break;
				case 'social':
					listThreads('INBOX', 'label:Social after:'+getLast30DaysDate(), 50, appendThreadRow);
					break;
				case 'promotions':
					listThreads('INBOX', 'label:Promotions after:'+getLast30DaysDate(), 50, appendThreadRow);
					break;
				case 'forums':
					listThreads('INBOX', 'label:Forums after:'+getLast30DaysDate(), 50, appendThreadRow);
					break;
				default:
					listThreads('INBOX', '!label:CHAT !label:Social !label:Updates !label:Promotions after:'+getLast30DaysDate(), 50, appendThreadRow);
			}
		}
	}
	else
	{
		listThreads('INBOX', '!label:CHAT !label:Social !label:Updates !label:Promotions after:'+getLast30DaysDate(), 50, appendThreadRow);
	}
}


function getLast30DaysDate() {
     var d = new Date();
     d.setDate(d.getDate() - 30);
     var dateString = d.getFullYear() + "/" + (d.getMonth() + 1) + "/" + d.getDate();
     return dateString;
}

function appendThreadRow(thread) {

	var firstMsgOfThread = getFirstMessageOfThread(thread);
	var threadHeaders = firstMsgOfThread.payload.headers;
	var threadLabels = firstMsgOfThread.labelIds;
	var threadParts = firstMsgOfThread.payload.part;

	// Extract From value, and parse it if necessary
	var from = getHeader(threadHeaders, 'From');
	var tmp_from = from.match("<(.*)>");
	if (tmp_from) {
	   from = tmp_from[1];
	}

	//Retrieve attachemnt
	/*
	if(thread.payload.parts){
		console.log( getAttachments(thread.id,  firstMsgOfThread.payload.parts, function (filename, mimeType, attachment) { return filename; }));
	}
	*/

	var mailDateString = getHeader(threadHeaders, 'Date');
	var mailDate = new Date(mailDateString);
	var finalMailDate = mailDate.toLocaleString("en-GB");

	// Append row to table
	$('.table-inbox tbody').append(
		'<tr class="email_item" id="row-' + firstMsgOfThread.threadId + '">\
		<td><div style="display:inline-block; width: 60px !important;" id="icons-' + firstMsgOfThread.threadId + '""/></td>\
		<td>' + from + '</td>\
		<td>\
		<a href="#message-modal-' + firstMsgOfThread.id +
		'" data-toggle="modal" id="message-link-' + firstMsgOfThread.threadId + '">' +
		getHeader(threadHeaders, 'Subject') +
		'</a>\
		</td>\
		<td style="width: 166px !important;"><div id="dateEmail">' + finalMailDate + '</div></td>\
		<td> <button type="button" style="display:none;" class="btn btn-primary asread-button" id="asread-button-' + firstMsgOfThread.threadId + '"> \
		<img id="asread-icon-' + firstMsgOfThread.threadId + '" src="../img/markAsRead.png" title="Mark as read"/>\
		Mark as read\
		</button>\</td>\
		<td> <button type="button" class="btn btn-primary delete-button" id="delete-button-' + firstMsgOfThread.threadId + '">\
		<img id="delete-icon-' + firstMsgOfThread.threadId + '" src="../img/delete.png" title="Delete"/>\
		Delete\
		</button>\</td>\
		<td> <button type="button" class="btn btn-primary reply-button" id="reply-button-' + firstMsgOfThread.threadId + '">\
		<img id="reply-icon-' + firstMsgOfThread.threadId + '" src="../img/reply.png" title="Reply"/>\
		Reply\
		</button>\</td>\
		</tr>');

	//console.log(threadLabels);
	renderThreadIcons(threadLabels, firstMsgOfThread.id);
	
	/* js event handler on Reply Main Button */
	// $('#reply-button-' + firstMsgOfThread.threadId).on('click', function () {
		// console.log("'#reply-button-" + firstMsgOfThread.threadId);
	  // fillInReply(reply_to, reply_subject, firstMsgOfThread.id);
	// });
	
	 /* js event handler on Delete Main Button */
     $('#delete-button-' + firstMsgOfThread.threadId).on('click', function () {
         console.log("'#reply-button-" + firstMsgOfThread.threadId);
		 sendThreadToTrash(firstMsgOfThread.threadId);
		$('#row-' + firstMsgOfThread.threadId).hide();
     });

     /* js event handler on Delete Main Button */
     $('#asread-button-' + firstMsgOfThread.threadId).on('click', function () {
          markThreadAsRead(firstMsgOfThread.threadId);
		  $('#asread-button-' + firstMsgOfThread.threadId).hide();
     });
	 
	$('#table-inbox').tablesorter({
	  dateFormat: "uk",
	  sortList: [[3, 1]]
	});
		
	//}
}

/* generic js handler to send email, relies on sendMessage() */
function sendEmail() {
     $('#send-button').addClass('disabled');
     sendMessage({
          'To': $('#compose-to').val(),
          'Subject': $('#compose-subject').val()
     },
          $('#compose-message').val(),
          composeTidy);
     return false;
}

/* generic js handler to send an email to trash, relies on deleteMessage() */
function markEmailAsRead(messageId) {
     markMessageAsRead(messageId, null);
     $('#asread-button-' + messageId).hide();
}

/* generic js handler to send an email to trash, relies on deleteMessage() */
function sendEmailToTrash(threadId) {
     sendThreadToTrash(threadId, null);
     $('#row-' + threadId).hide();
}

/* bootstrap function to enhance email composition */
function composeTidy() {
     $('#compose-modal').modal('hide');
     $('#compose-to').val('');
     $('#compose-subject').val('');
     $('#compose-message').val('');
     $('#send-button').removeClass('disabled');
}

/* bootstrap function to enhance email reply */
function replyTidy() {
     $('#reply-modal').modal('hide');
     $('#reply-message').val('');
     $('#reply-button').removeClass('disabled');
}

/* bootstrap function to fill-in reply modal with email info */
function fillInReply(to, subject, message_id) {
     console.log("fillInReply");
     $('#reply-modal').modal('show');
     $('#reply-to').val(to);
     $('#reply-subject').val(subject);
     $('#reply-message-id').val(message_id);
}

/* generic js handler to send a reply to an existing email, relies on sendMessage() */
function sendReply() {
     $('#reply-button').addClass('disabled');
     sendMessage({
          'To': $('#reply-to').val(),
          'Subject': $('#reply-subject').val(),
          'In-Reply-To': $('#reply-message-id').val()
     },
          $('#reply-message').val(),
          replyTidy);
     return false;
}