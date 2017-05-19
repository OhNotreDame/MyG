var trash = false;
var sent = false;

window.onload = function () {
   	prepareGlobalNavBar();
    prepareToolNavBar('mail');
	$('#compose-message').summernote();
	 
	window.setTimeout(checkAuth, 1);

	document.getElementById("send-button")
     .addEventListener("click", sendEmail, false);
	
	document.getElementById("send-close-button")
     .addEventListener("click", clearAndCloseComposeModal, false);
	
    document.getElementById("emptyTrash-button")
     .addEventListener("click", emptyTrash, false);	
	 
}

/* Load Gmail API, and when it's done, call renderInbox */
function loadGmailAPI() {
     console.log("inbox/loadGmailAPI");
	gapi.client.load('gmail', 'v1', renderInbox);
}

/* renderInbox()	*/
function renderInbox() {	
	// Clear Messages table
     $('#table-inbox > tbody').empty();

	var curLoc = window.location.href;
	var splitLoc = curLoc.split("?");
	
	if (splitLoc.length == 2 && splitLoc[1])
	{
		switch(splitLoc[1]) {
			case 'updates':
				listThreads('INBOX', 'label:Updates after:'+getLast30DaysDate(), 50, addThreadToInbox);				
				$("a.mail-updatesNav").addClass("CurrentPage");
				break;			
			case 'social':
				listThreads('INBOX', 'label:Social after:'+getLast30DaysDate(), 50, addThreadToInbox);
				$("a.mail-socialNav").addClass("CurrentPage");
				break;
			case 'promotions':
				listThreads('INBOX', 'label:Promotions after:'+getLast30DaysDate(), 50, addThreadToInbox);
				$("a.mail-promoNav").addClass("CurrentPage");
				break;
			case 'forums':
				listThreads('INBOX', 'label:Forums after:'+getLast30DaysDate(), 50, addThreadToInbox);
				$("a.mail-forumNav").addClass("CurrentPage");
				break;
			case 'sent':
				listThreads('SENT',  '!label:CHAT after:'+getLast30DaysDate(), 50, addThreadToInbox);
				sent = true;
				$("a.mail-sentNav").addClass("CurrentPage");			
				break;
			case 'trash':
				listThreads('TRASH', 'label:TRASH !label:CHAT', 50, addThreadToInbox);
				trash = true;
				$("a.mail-trashNav").addClass("CurrentPage");
				$("#compose-button").addClass("hidden");
				$("#emptyTrash-button").removeClass("hidden");
				break;
			default:
				listThreads('INBOX', '!label:CHAT !label:Social !label:Updates !label:Promotions after:'+getLast30DaysDate(), 50, addThreadToInbox);
				$("a.mail-inboxNav").addClass("CurrentPage");
				break;
		}
	}
	else
	{
		listThreads('INBOX', '!label:CHAT !label:Social !label:Updates !label:Promotions after:'+getLast30DaysDate(), 50, addThreadToInbox);
		$("a.mail-inboxNav").addClass("CurrentPage");
	}	
}


function getLast30DaysDate() {
     var d = new Date();
     d.setDate(d.getDate() - 30);
     var dateString = d.getFullYear() + "/" + (d.getMonth() + 1) + "/" + d.getDate();
     return dateString;
}

function addThreadToInbox(thread) {
	
	var firstMsgOfThread = getFirstMessageOfThread(thread);
	var lastMsgOfThread = getLastMessageOfThread(thread);
	var firstMsgOfThreadHeaders = firstMsgOfThread.payload.headers;
	var lastMsgOfThreadHeaders = lastMsgOfThread.payload.headers;

	 // Sender of the First Message of the thread to display
	 var from = getHeader(firstMsgOfThreadHeaders, 'From');
     var tmp_from = from.match("<(.*)>");
     if (tmp_from) {
          from = tmp_from[1];
     }
	 
	 // Subject of the first message of the thread to display
	 var subject =  getHeader(firstMsgOfThreadHeaders, 'Subject');
	
	 // Date of Last message of the thread to display
	 var mailDateString = getHeader(lastMsgOfThreadHeaders, 'Date');
     var mailDate = new Date(mailDateString);
     var date = mailDate.toLocaleString("en-GB");
	
	 // Labels of the first message of the thread to display
	 var labels = firstMsgOfThread.labelIds;
	 
	 /* Render Thread Row */
	 renderThreadRow(thread.id, from, subject, date, labels)
	 
	 // Has Attachment
	 if (firstMsgOfThread.payload.parts) {
          getAttachments(firstMsgOfThread.id, firstMsgOfThread.payload.parts, function (filename, mimeType, attachment) {
			   if ((mimeType) && ($("#icons-" + thread.id).has('#attachIco').length <= 0)) {
					$("#icons-" + thread.id).append("<img id='attachIco' src='img/paperclip.png' title='Has attachment'/>&nbsp;");
				}               
          }); 
     }
	
     /* Add js event handler on Thread Subject Link*/
     $('#thread-' + thread.id).on('click', function () {
         console.log('click');
		 var threadDetailURL="thread.html?threadId="+thread.id;
		 console.log(threadDetailURL);
		 document.location.href=threadDetailURL;
     });

     /* Add js event handler on "Delete (thread)" Button */
     $('#delete-button-' + thread.id).on('click', function () {
         sendThreadToTrash(thread.id, getCallResultAndShowMessage);
         $('#delete-button-' + thread.id).hide();
		 $('#' +  thread.id).hide();
     });

     /*  Add js event handler on "Mark (thread) as Read" Button */
     $('#asread-button-' + thread.id).on('click', function () {
			markThreadAsRead(thread.id, getCallResultAndShowMessage);
			$('#asread-button-' + thread.id).hide();
     });
	 
	  /* js event handler on Restore Button */
     $('#restore-button-' + thread.id).on('click', function () {
          sendThreadBackToInbox(thread.id, getCallResultAndShowMessage);
          $('#' + thread.id).hide();
     });

	 /* Reinforce sort */
     $('#table-inbox').tablesorter({
          dateFormat: "uk",
          sortList: [[3, 1]]
     });
}


function emptyTrash() {
	$('#table-inbox tr.email_item').each(function(){
		var row = this;
		console.log(row.id);
		if(row.id)
		{
		   deleteThreadPermanently(row.id, null);
		}
	});
	window.setTimeout(location.reload(), 2000);
}
