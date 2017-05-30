/* On Window Load */
window.onload = function () {
   	$('#reply-message').summernote();
	window.setTimeout(checkAuth, 1);
	

	document.getElementById("reply-close-button")
     .addEventListener("click", clearAndCloseReplyModal, false);
	 
     // document.getElementById("send-button")
     // .addEventListener("click", sendEmail, false);
     document.getElementById("reply-send-button")
     .addEventListener("click", sendReply, false);
}

/* Load Gmail API, and when it's done, call renderThreadContent */
function loadGmailAPI() {
     gapi.client.load('gmail', 'v1', renderThreadContent);
}

/* renderThreadContent() */
function renderThreadContent() {
    
	prepareGlobalNavBar();
	prepareToolNavBar('mail');
	
	var paramsString = new URLSearchParams(window.location.search);
	var searchParams = new URLSearchParams(paramsString);
	var threadId = searchParams.get("threadId");
	if (threadId)
	{
		getThreadMessage(threadId, addMessageToThreadDisplay);
	}
}

 

function addMessageToThreadDisplay(thread) {

	var firstMsgOfThread = getFirstMessageOfThread(thread);
	var threadHeaders = firstMsgOfThread.payload.headers;
	var threadLabels = firstMsgOfThread.labelIds;
	
	$('#threadSubject').text(getHeader(threadHeaders, 'Subject'));
	$('#threadInfo').show();
	$('#threadActions').append(
			'<button type="button" style="display:none;" class="btn archive-button" id="archive-button"> \
				<img id="archive-icon" src="img/archive.png" title="Archive"/> &nbsp; Archive &nbsp; \
			</button> &nbsp; \
			<button type="button" style="display:none;" class="btn backInbox-button" id="backInbox-button"> \
				<img id="backInbox-icon" src="img/inbox.png" title="Move to Inbox"/> &nbsp; Move to Inbox &nbsp; \
			</button> &nbsp; \
			<button type="button" style="display:none;" class="btn star-button" id="star-button"> \
				<img id="star-icon" src="img/star.png" title="Star"/> &nbsp; Star &nbsp; \
			</button> &nbsp; \
			<button type="button" style="display:none;" class="btn unstar-button" id="unstar-button"> \
				<img id="unstar-icon" src="img/unstar.png" title="Star"/> &nbsp; Unstar &nbsp; \
			</button> &nbsp; \
			<button type="button" style="display:none;" class="btn asunread-button" id="asunread-button"> \
				<img id="asunread-icon" src="img/markAsRead.png" title="Mark as unread"/> &nbsp; Mark as unread &nbsp; \
			</button> &nbsp; \
			<button type="button" style="display:none;" class="btn asread-button" id="asread-button"> \
				<img id="asread-icon" src="img/markAsRead.png" title="Mark as read"/> &nbsp; Mark as read &nbsp; \
			</button> &nbsp; \
			<button type="button" class="btn delete-button" id="delete-button">\
				<img id="delete-icon" src="img/delete.png" title="Delete"/>&nbsp; Delete &nbsp;\
			</button>');

	renderThreadIcons(threadLabels);
	
	if (threadLabels.includes("UNREAD")) {
		$('#asread-button').show();
		$('#asunread-button').hide();
	}
	else
	{
		$('#asread-button').hide();
		$('#asunread-button').show();
	}
	
	if (threadLabels.includes("STARRED")) {
		$('#star-button').hide();
		$('#unstar-button').show();
	}
	else
	{
		$('#star-button').show();
		$('#unstar-button').hide();
	}
	
	
	if (threadLabels.includes("INBOX")) {
		$('#backInbox-button').hide();
		$('#archive-button').show();
	}
	else
	{
		$('#backInbox-button').show();
		$('#archive-button').hide();
	}
	
	var messageCount = thread.messages.length;
	console.log(messageCount);
	for (var i = 0; i < messageCount; i++) 
	{

		var message = thread.messages[i];
		var messageHeaders = message.payload.headers;
		var messageLabelIds = message.labelIds;

		console.log("rendering message(" + message.id + ") of thread("+ thread.id+")");

		// Extract From value, and parse it if necessary
		var fromMail = getHeader(messageHeaders, 'From');
		var tmp_from = fromMail.match("<(.*)>");
		if (tmp_from) {
			fromMail = tmp_from[1];
		}
		

		var fromContact = createContact(getHeader(messageHeaders, 'From')) ;
		var toContact = createContact(getHeader(messageHeaders, 'To')) ;
		var ccContact = createContact(getHeader(messageHeaders, 'CC')) ;
	

		var globalToMailTxt = toContact.fullName;
		if (ccContact.fullName)
		{
			globalToMailTxt = toContact.fullName + ", " + ccContact.fullName;
		}
	
		var mailDateString = getHeader(messageHeaders, 'Date');
		var mailDate = new Date(mailDateString);
		var finalMailDate = mailDate.toLocaleString("en-GB");

		// Add message to thread
		$('#msg-accordion').append(
			'<div class="msg-row panel panel-default" id="msg-row-' + i + '">\
				<div class="msg-header panel-heading" role="tab" id="msg-header-'+ i + '" >\
					<h4 class="panel-title">\
						<div id="msg-reply-' + i + '" class="pull-right">\
								&nbsp; <button type="button" class="reply-button" id="' + i + '">\
									<img id="reply-icon" src="img/reply.png" title="Reply"/>\
								</button>\
								<button type="button" class="reply-button" id="' + i + '">\
									<img id="replyall-icon" src="img/replyall.png" title="Reply"/>\
								</button>\
						</div>\
						<a data-toggle="collapse" data-parent="#msg-accordion" href="#msg-body-'+ i +'" aria-expanded="true" aria-controls="#msg-body-'+ i +'" >\
							<div id="msg-from-' + i + '" class="msg-from pull-left">  '+ fromContact.fullName + ' </div>\
							<div id="msg-date-' + i + '" class="msg-date pull-right"> ' + finalMailDate + ' </div>\
							<br/><div id="msg-to-' + i + '" class="msg-from-small pull-left"> ' + globalToMailTxt + ' </div>\
						</a>\
					<\h4>\
				</div>\
				<div id="msg-hidden-info-'+ i +' " class="hidden">\
					<div id="msg-hidden-fromMail-'+ i +' " class="hidden"> ' + fromContact.emailAddress  + ' </div>\
					<div id="msg-hidden-toMail-'+ i +' " class="hidden"> '+ toContact.emailAddress  + ' </div>\
					<div id="msg-hidden-ccMail-'+ i +' " class="hidden"> '+ ccContact.emailAddress  + ' </div>\
				</div>\
			<div id="msg-body-' + i + '" class="collapse msg-body" role="tabpanel" aria-labelledby="#msg-body-'+ i + '">'+ getBody(message.payload) + '</div>\
			</div>');
			
			
		/* Add js event handler on Reply Main Button */
		//$('#reply-button-' + i).on('click', function () {
		$('.reply-button').on('click', function () {
			var messageId = this.id;
			
			var message = thread.messages[messageId];
			var replyMsgHeaders = message.payload.headers;
			
			// Extract From value, and parse it if necessary
			var fromMail = getHeader(replyMsgHeaders, 'From');
			var tmp_from = fromMail.match("<(.*)>");
			if (tmp_from) {
			//	fromMail = tmp_from[1];
			}
			

			var fromContact = createContact(getHeader(replyMsgHeaders, 'From')) ;
			var toContact = createContact(getHeader(replyMsgHeaders, 'To')) ;
			var ccContact = createContact(getHeader(replyMsgHeaders, 'CC')) ;
			
			/* Extract Subject value and parse it */
			 var subject = getHeader(replyMsgHeaders, 'Subject');
			 var substring = "Re: ";
			 var reply_subject = subject;
			 
			//console.log("reply-button: " + orig_reply_to);
			var mailDateString = getHeader(replyMsgHeaders, 'Date');
			var mailDate = new Date(mailDateString);
			var options = {weekday: "short", year: "numeric", month: "numeric", day: "numeric" , hour: "numeric" , minute: "numeric"};
			var finalMailDate = mailDate.toLocaleString("en-GB", options);

			//var quoteHeader = "On " + finalMailDate + ", &lt;"+  reply_to + "&gt; wrote:";
			var quoteHeader = "On " + finalMailDate + ", "+  fromContact.emailAddress + " wrote:";
			var quoteMessage = getBody(message.payload);

			//prepareAndOpenReplyModal(to, cc, cci, subject, quoteHeader, quoteMessage ,message_id, thread_id)
			//prepareAndOpenReplyModal( fromContact.emailAddress, '', '', reply_subject, quoteHeader, quoteMessage , message.id, thread.id);
			prepareAndOpenReplyModal( fromContact.emailAddress, '', '', reply_subject, quoteHeader, quoteMessage , message.id, thread.id);
		});
			
	}
	
	// Expand last thread message
	var lastMsgToShow = "#msg-body-"+(messageCount-1);
	$(lastMsgToShow).addClass("collapse in");


	/*  Add js event handler on 'Mark as Read' Button */
	$('#asread-button').on('click', function () {
		markThreadAsRead(thread.id, null);
		$('#asread-button').hide();
		$('#asunread-button').show();
		$('#threadUnread').addClass('hidden');
		$('#threadUnread').hide();
	});

	/*  Add js event handler on 'Mark as Unead' Button */
	$('#asunread-button').on('click', function () {
		markThreadAsUnread(thread.id, null);
		$('#asread-button').show();
		$('#asunread-button').hide();
		$('#threadUnread').remove('hidden');
		$('#threadUnread').show();
	});
	
	/*  Add js event handler on 'Star' Button */
	$('#star-button').on('click', function () {
		starThread(thread.id, null);
		$('#star-button').hide();
		$('#unstar-button').show();
	});

	/*  Add js event handler on 'Unstar' Button */
	$('#unstar-button').on('click', function () {
		unstarThread(thread.id, null);
		$('#star-button').show();
		$('#unstar-button').hide();
	});
	
	/*  Add js event handler on 'Star' Button */
	$('#archive-button').on('click', function () {
		archiveThread(thread.id, null);
		$('#archive-button').hide();
		$('#backInbox-button').show();
	});

	/*  Add js event handler on 'Unstar' Button */
	$('#backInbox-button').on('click', function () {
		restoreThread(thread.id, null);
		$('#archive-button').show();
		$('#backInbox-button').hide();
	});
	
	
	/* Add js event handler on 'Delete' Button */
	$('#delete-button').on('click', function () {
		sendThreadToTrash(thread.id, null);
	});
	
	 
}
