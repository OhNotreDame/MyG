/* On Window Load */
window.onload = function () {
    window.setTimeout(checkAuth, 1);
}

/* Load Gmail API, and when it's done, call renderThreadContent */
function loadGmailAPI() {
     gapi.client.load('gmail', 'v1', renderThreadContent);
}

/* renderThreadContent() */
function renderThreadContent() {
    
	prepareToolbar();

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
			'<button type="button" style="display:none;" class="btn asread-button" id="asread-button-' + thread.id + '"> \
				<img id="asread-icon-' + thread.id + '" src="../img/markAsRead.png" title="Mark as read"/> &nbsp; Mark as read &nbsp; \
			</button> &nbsp; \
			<button type="button" class="btn delete-button" id="delete-button-' + thread.id + '">\
				<img id="delete-icon-' + thread.id + '" src="../img/delete.png" title="Delete"/>&nbsp; Delete &nbsp;\
			</button>');
		
	if (threadLabels.includes("IMPORTANT")) {
		$('#threadImportant').removeClass('hidden');
		$('#threadImportant').show();
    }
	 
	 if (threadLabels.includes("UNREAD")) {
		$('#threadUnread').removeClass('hidden');
		$('#threadUnread').show();
		$('#asread-button-' + thread.id).show();
	 }

     if (threadLabels.includes("CATEGORY_PERSONAL")) {
        $('#threadPersonal').removeClass('hidden');
		$('#threadPersonal').show();
     }
	 
	  if (threadLabels.includes("CATEGORY_UPDATES")) {
        $('#threadUpdates').removeClass('hidden');
		$('#threadUpdates').show();
     }
	 
	  if (threadLabels.includes("CATEGORY_SOCIAL")) {
        $('#threadSocial').removeClass('hidden');
		$('#threadSocial').show();
     }

     if (threadLabels.includes("CATEGORY_PROMOTIONS")) {
        $('#threadPromo').removeClass('hidden');
		$('#threadPromo').show();
     }
     if (threadLabels.includes("CATEGORY_FORUMS")) {
        $('#threadForums').removeClass('hidden');
		$('#threadForums').show();
     }
    
	
	
	
	var messageCount = thread.messages.length;
	console.log(messageCount);
	for (var i = 0; i < messageCount; i++) 
	{

		var message = thread.messages[i];
		var messageHeaders = message.payload.headers;
		var messageLabelIds = message.labelIds;


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
								&nbsp; <button type="button" class="reply-button" id="reply-button-' + thread.id + '">\
									<img id="reply-icon-' + thread.id + '" src="../img/reply.png" title="Reply"/>\
								</button>\
								<button type="button" class="reply-button" id="replyall-button-' +thread.id + '">\
									<img id="replyall-icon-' + thread.id + '" src="../img/replyall.png" title="Reply"/>\
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
	}
	
	// Expand last thread message
	var lastMsgToShow = "#msg-body-"+(messageCount-1);
	$(lastMsgToShow).addClass("collapse in");


	/*  Add js event handler on Delete Main Button */
	$('#asread-button-' + thread.id).on('click', function () {
		markThreadAsRead(thread.id, null);
		$('#asread-button-' + thread.id).hide();
		$('#threadUnread').addClass('hidden');
		$('#threadUnread').hide();
	});

	/* Add js event handler on Delete Main Button */
	$('#delete-button-' + thread.id).on('click', function () {
		sendThreadToTrash(thread.id, null);
		document.location.href="inbox.html";
	});

	/* Add js event handler on Reply Main Button */
	$('#reply-button-' + thread.id).on('click', function () {
		console.log("reply to this thread");
	});


	/* Add js event handler on Reply Main Button */
	$('#replyall-button-' + thread.id).on('click', function () {
		console.log("reply all to this thread");
	});
	 
}


