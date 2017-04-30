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
		//$('#msg-accordion').empty();
		getThreadMessage(threadId, addMessageToThreadDisplay);
	}
}

 

function addMessageToThreadDisplay(thread) {

	var firstMsgOfThread = getFirstMessageOfThread(thread);
	var threadHeaders = firstMsgOfThread.payload.headers;
	var threadLabels = firstMsgOfThread.labelIds;
	
	// <div id="threadSubject" class="pull-left">threadSubject</div>
	// <div id="threadLabels">threadLabels</div>
	// <div id="threadActions" class="pull-right"> threadActions</div>
	$('#threadSubject').text(getHeader(threadHeaders, 'Subject'));
	//$('#threadLabels').text(threadLabels);
	$('#threadInfo').show();
	
	
	
	  $('#threadActions').append(
		'<button type="button" style="display:none;" class="btn asread-button" id="asread-button-' + thread.id + '"> \
          <img id="asread-icon-' + thread.id + '" src="../img/markAsRead.png" title="Mark as read"/>Mark as read\
          </button> &nbsp; \
          <button type="button" class="btn delete-button" id="delete-button-' + thread.id + '">Delete\
          <img id="delete-icon-' + thread.id + '" src="../img/delete.png" title="Delete"/>\
          </button>');
	
	
	
	
	if (threadLabels.includes("IMPORTANT")) {
	   $('#threadImportant').append("<img id='importIco' src='../img/important.png'  title='Important'/>&nbsp;");
     }
	 if (threadLabels.includes("UNREAD")) {
		 $('#threadLabels').append("<img id='newIco' src='../img/new.png' title='Unread'/>&nbsp;");
		 var asReadIcon = '#asread-icon-' + thread.id;
		 $('#asread-button-' + thread.id).show();
	 }

 

     
     if (threadLabels.includes("CATEGORY_PERSONAL")) {
           $('#threadLabels').append("<img id='promoIco' src='../img/personal.png' title='Personal'/>&nbsp; Personal");
     }
     if (threadLabels.includes("CATEGORY_UPDATES")) {
          $('#threadLabels').append("<img id='starIco' src='../img/updates.png' title='Update'/>&nbsp; Update");
     }

     if (threadLabels.includes("CATEGORY_PROMOTIONS")) {
           $('#threadLabels').append("<img id='promoIco' src='../img/promotions.png' title='Promotions'/>&nbsp; Promotions");
     }

     if (threadLabels.includes("CATEGORY_SOCIAL")) {
          $('#threadLabels').append("<img id='promoIco' src='../img/social.png' title='Social'/>&nbsp; Social");
     }
	
	
	
	var messageCount = thread.messages.length;
	console.log(messageCount);
	for (var i = 0; i < messageCount; i++) {

		var message = thread.messages[i];
		var messageHeaders = message.payload.headers;
		var messageLabelIds = message.labelIds;

		
		 // Extract From value, and parse it if necessary
     var fromMail = getHeader(messageHeaders, 'From');
     var tmp_from = fromMail.match("<(.*)>");
     if (tmp_from) {
          fromMail = tmp_from[1];
     }
	 
	 var To = "To";
	 var CC = "CC";
		
	var fromMailTxt = getHeader(messageHeaders, 'From').trim();
	var mailDateString = getHeader(messageHeaders, 'Date');
	var mailDate = new Date(mailDateString);
	var finalMailDate = mailDate.toLocaleString("en-GB");

	
	
	// Add message to thread
	$('#msg-accordion').append(
		'<div class="msg-row panel panel-default" id="msg-row-' + i + '">\
			<div class="msg-header panel-heading" role="tab" id="msg-header-'+ i + '" >\
				<h4 class="panel-title">\
					<a data-toggle="collapse" data-parent="#msg-accordion" href="#msg-body-'+ i +'" aria-expanded="true" aria-controls="#msg-body-'+ i +'" >\
						<div id="msg-from' + i + '" class="msg-from pull-left">  '+ fromMailTxt + ' </div> &nbsp; <span id="msg-fromEmail' + i + '" class="msg-from-small"> '+ fromMail +' </span>\
						<div id="msg-date' + i + '" class="pull-right"> ' + finalMailDate + ' </div>\
						<br/><div id="msg-to' + i + '" class="msg-from-small pull-left"> ' + To + ' </div>\
						<br/><div id="msg-cc' + i + '" class="msg-from-small pull-left"> ' + CC + ' </div>\
					</a>\
				<\h4>\
			</div>\
		<div id="msg-body-' + i + '" class="collapse" role="tabpanel" aria-labelledby="#msg-body-'+ i + '">'+ getBody(message.payload) + '</div>\
		</div>');
	
	}
	
	// Expand last thread message
	var lastMsgToShow = "#msg-body-"+(messageCount-1);
	$(lastMsgToShow).addClass("show");
	
	
	/*  Add js event handler on Delete Main Button */
     $('#asread-button-' + thread.id).on('click', function () {
			markThreadAsRead(thread.id, null);
			$('#asread-button-' + thread.id).hide();
			$('#newIco').hide();
			
     });
	 
	    /* Add js event handler on Delete Main Button */
     $('#delete-button-' + thread.id).on('click', function () {
         sendThreadToTrash(thread.id, null);
		 document.location.href="inbox.html";
     });
}

