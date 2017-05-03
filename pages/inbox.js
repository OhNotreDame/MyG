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

	var curLoc = window.location.href;
	var splitLoc = curLoc.split("?");
	
	if (splitLoc.length == 2 && splitLoc[1])
	{
		switch(splitLoc[1]) {
			case 'updates':
				listThreads('INBOX', 'label:Updates after:'+getLast30DaysDate(), 50, addThreadToInbox);
				//$('#labelUpdates').removeClass('hidden');
				break;			
			case 'social':
				listThreads('INBOX', 'label:Social after:'+getLast30DaysDate(), 50, addThreadToInbox);
				//$('#labelSocial').removeClass('hidden');
				break;
			case 'promotions':
				listThreads('INBOX', 'label:Promotions after:'+getLast30DaysDate(), 50, addThreadToInbox);
				//$('#labelPromo').removeClass('hidden');
				break;
			case 'forums':
				listThreads('INBOX', 'label:Forums after:'+getLast30DaysDate(), 50, addThreadToInbox);
				//$('#labelForums').removeClass('hidden');
				break;
			default:
				listThreads('INBOX', '!label:CHAT !label:Social !label:Updates !label:Promotions after:'+getLast30DaysDate(), 50, addThreadToInbox);
				//$('#labelPersonal').removeClass('hidden');
				//$('#labelImportant').removeClass('hidden');
				break;
		}
	}
	else
	{
		listThreads('INBOX', '!label:CHAT !label:Social !label:Updates !label:Promotions after:'+getLast30DaysDate(), 50, addThreadToInbox);
		//$('#labelPersonal').removeClass('hidden');
		//$('#labelImportant').removeClass('hidden');
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
	//var lastMsgOfThread = getLastMessageOfThread(thread);
	var threadHeaders = firstMsgOfThread.payload.headers;
	var threadLabels = firstMsgOfThread.labelIds;
	var threadParts = firstMsgOfThread.payload.part;

	 /* Append Message to table #table-inbox */
     renderMailRow(firstMsgOfThread);

     /* Extract ReplyTo value and parse it */
     // Option 1: Display Name <EmailAddress@MyDomain.com>
     // Option 2: EmailAddress@MyDomain.com
     var reply_to = (getHeader(threadHeaders, 'Reply-to') !== '' ?
          getHeader(threadHeaders, 'Reply-to') :
          getHeader(threadHeaders, 'From')).replace(/"/g, '&quot;');

     // If necessary, extract Email Address from <EmailAddress@MyDomain.com>, escaping "<" and ">"
     var tmp_reply_to = reply_to.match("<(.*)>");
     if (tmp_reply_to) {
          reply_to = tmp_reply_to[1];
     }

	 /* Extract Subject value and parse it */
     var subject = getHeader(threadHeaders, 'Subject');
     var substring = "Re: ";
     var reply_subject = subject;
	
	/*
     if (subject.indexOf(substring) !== -1) {
          reply_subject = subject.replace(/\"/g, '&quot;');
     } else {
          reply_subject = 'Re: ' + subject.replace(/\"/g, '&quot;');
     }
	 */
	
     /* Add js event handler on Email Subject */
     $('#thread-' + thread.id).on('click', function () {
         var threadDetailURL="thread.html?threadId="+thread.id;
		 console.log(threadDetailURL);
		 document.location.href=threadDetailURL;
     });

     /* Add js event handler on Delete Main Button */
     $('#delete-button-' + firstMsgOfThread.id).on('click', function () {
         sendThreadToTrash(firstMsgOfThread.id, null);
         $('#delete-button-' + firstMsgOfThread.id).hide();
		 $('#row-' +  firstMsgOfThread.id).hide();
     });

     /*  Add js event handler on Delete Main Button */
     $('#asread-button-' + firstMsgOfThread.id).on('click', function () {
           markThreadAsRead(firstMsgOfThread.id, null);
			$('#asread-button-' + firstMsgOfThread.id).hide();
     });

     /* Add js event handler on Reply Main Button */
     $('#reply-button-' + thread.id).on('click', function () {
          fillInReply(reply_to, reply_subject, firstMsgOfThread.id, thread.id);
     });
	 
	 /* Reinforce sort */
     $('#table-inbox').tablesorter({
          dateFormat: "uk",
          sortList: [[3, 1]]
     });
}