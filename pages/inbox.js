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
				listMessages('INBOX', 'label:Updates', 50, appendMessageRow);
				break;
			case 'social':
				listMessages('INBOX', 'label:Social', 50, appendMessageRow);
				break;
			case 'promotions':
				listMessages('INBOX', 'label:Promotions', 50, appendMessageRow);
				break;
			case 'forums':
				listMessages('INBOX', 'label:Forums', 50, appendMessageRow);
				break;
			default:
				listMessages('INBOX', '!label:CHAT !label:Social !label:Updates !label:Promotions', 50, appendMessageRow);
				break;
		}
	}
	else
	{
		listMessages('INBOX', '!label:CHAT !label:Social !label:Updates !label:Promotions', 50, appendMessageRow);
	}
}

function appendMessageRow(message) {

     var headers = message.payload.headers;
	
     /* Append Message to table #table-inbox */
     renderMailRow(message);

     /* Extract ReplyTo value and parse it */
     // Option 1: Display Name <EmailAddress@MyDomain.com>
     // Option 2: EmailAddress@MyDomain.com
     var reply_to = (getHeader(headers, 'Reply-to') !== '' ?
          getHeader(headers, 'Reply-to') :
          getHeader(headers, 'From')).replace(/"/g, '&quot;');

     // If necessary, extract Email Address from <EmailAddress@MyDomain.com>, escaping "<" and ">"
     var tmp_reply_to = reply_to.match("<(.*)>");
     if (tmp_reply_to) {
          reply_to = tmp_reply_to[1];
     }

	 /* Extract Subject value and parse it */
     var subject = getHeader(headers, 'Subject');
     var substring = "Re: ";
     var reply_subject = "";

     if (subject.indexOf(substring) !== -1) {
          reply_subject = subject.replace(/\"/g, '&quot;');
     } else {
          reply_subject = 'Re: ' + subject.replace(/\"/g, '&quot;');
     }
	
	/* Prepare Message Modal*/
	prepareMessageModal(message);

     /* Add js event handler on Email Subject */
     $('#message-link-' + message.id).on('click', function () {
          var ifrm = $('#message-iframe-' + message.id)[0].contentWindow.document;
          $('body', ifrm).html(getBody(message.payload));
     });

     /* Add js event handler on Delete Main Button */
     $('#delete-button-' + message.id).on('click', function () {
         sendMessageToTrash(message.id, null);
         $('#delete-button-' + message.id).hide();
		 $('#row-' +  message.id).hide();
     });

     /*  Add js event handler on Delete Main Button */
     $('#asread-button-' + message.id).on('click', function () {
           markMessageAsRead(message.id, null);
			$('#asread-button-' + message.id).hide();
     });

     /* Add js event handler on Reply Main Button */
     $('#reply-button-' + message.id).on('click', function () {
          fillInReply(reply_to, reply_subject, message.id);
     });
	 
	 /* Reinforce sort */
     $('#table-inbox').tablesorter({
          dateFormat: "uk",
          sortList: [[3, 1]]
     });
}