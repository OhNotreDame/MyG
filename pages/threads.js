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

	var curLoc = window.location.href;
	var splitLoc = curLoc.split("?");
	
	if (splitLoc.length == 2 && splitLoc[1])
	{
		switch(splitLoc[1]) {
			case 'updates':
				listThreads('INBOX', 'label:Updates after:'+getLast30DaysDate(), 50, addThreadRowToInbox);
				break;
			case 'social':
				listThreads('INBOX', 'label:Social after:'+getLast30DaysDate(), 50, addThreadRowToInbox);
				break;
			case 'promotions':
				listThreads('INBOX', 'label:Promotions after:'+getLast30DaysDate(), 50, addThreadRowToInbox);
				break;
			case 'forums':
				listThreads('INBOX', 'label:Forums after:'+getLast30DaysDate(), 50, addThreadRowToInbox);
				break;
			default:
				listThreads('INBOX', '!label:CHAT !label:Social !label:Updates !label:Promotions after:'+getLast30DaysDate(), 50, addThreadRowToInbox);
				break;
		}
	}
	else
	{
		listThreads('INBOX', '!label:CHAT !label:Social !label:Updates !label:Promotions after:'+getLast30DaysDate(), 50, addThreadRowToInbox);
	}
}


function getLast30DaysDate() {
     var d = new Date();
     d.setDate(d.getDate() - 30);
     var dateString = d.getFullYear() + "/" + (d.getMonth() + 1) + "/" + d.getDate();
     return dateString;
}

function addThreadRowToInbox(thread) {

	var firstMsgOfThread = getFirstMessageOfThread(thread);
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
     var reply_subject = "";

     if (subject.indexOf(substring) !== -1) {
          reply_subject = subject.replace(/\"/g, '&quot;');
     } else {
          reply_subject = 'Re: ' + subject.replace(/\"/g, '&quot;');
     }
	
	/* Prepare Message Modal*/
	prepareMessageModal(firstMsgOfThread);

     /* Add js event handler on Email Subject */
     $('#message-link-' + firstMsgOfThread.id).on('click', function () {
          var ifrm = $('#message-iframe-' + firstMsgOfThread.id)[0].contentWindow.document;
          $('body', ifrm).html(getBody(firstMsgOfThread.payload));
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
     $('#reply-button-' + firstMsgOfThread.id).on('click', function () {
          fillInReply(reply_to, reply_subject, firstMsgOfThread.id);
     });
	 
	 /* Reinforce sort */
     $('#table-inbox').tablesorter({
          dateFormat: "uk",
          sortList: [[3, 1]]
     });
}