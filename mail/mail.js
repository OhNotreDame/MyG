/*
 * checkAuth()
 * Check if the current user has authorized the application.
 */
function checkAuth() {
	console.log("inbox/checkAuth");
     gapi.auth.authorize({
          'client_id': CLIENT_ID,
          'scope': SCOPES_MAIL,
          'immediate': true
     }, handleAuthResult);
}

/*
 * handleAuthResult()
 * Handle authorization result, displaying or not the authorize button.
 */
function handleAuthResult(authResult) {
	console.log("inbox/handleAuthResult");
     if (authResult && !authResult.error) {
          
		  console.log("inbox/handleAuthResult/OK");
		  loadGmailAPI();
          $('#authorize-button').remove();
          $('.table-inbox').removeClass("hidden");
          $('#compose-button').removeClass("hidden");
     } else {
		 console.log("inbox/handleAuthResult/KO");
          $('#authorize-button').removeClass("hidden");
          $('#authorize-button').on('click', function () {
               checkAuth();
          });
     }
}

/*
Handling Threads
 */

function listThreads(labelIds, query, maxResult) {
     var getPageOfThreads = function (request, result) {
          request.execute(function (resp) {
               result = result.concat(resp.threads);
               var nextPageToken = resp.nextPageToken;
               if (nextPageToken) {
                    request = gapi.client.gmail.users.threads.list({
                              'userId': USER,
                              'labelIds': labelIds,
                              'q': query,
                              'maxResults': maxResult,
                              'pageToken': nextPageToken
                         });
					getPageOfThreads(request, result);
               } else {
                    parseThreads(result);
               }
          });
     };

     var request = gapi.client.gmail.users.threads.list({
               'userId': USER,
               'labelIds': labelIds,
               'q': query,
               'maxResults': maxResult
          });
     getPageOfThreads(request, []);
}

function parseThreads(threads) {
     $.each(threads, function () {
          getThread(this.id);
     });
}

function getThread(threadId) {
     var request = gapi.client.gmail.users.threads.get({
               'userId': USER,
               'id': threadId
          });
     request.execute(function (resp) {
          addThreadToInbox(resp);
     });
}

function getThreadMessage(threadId) {
     var request = gapi.client.gmail.users.threads.get({
               'userId': USER,
               'id': threadId
          });
     request.execute(function (resp) {
          addMessageToThreadDisplay(resp);
     });
}

/* js function, using google api, to mark a thread as read, based on its messageID */
function markThreadAsRead(threadId, callback) {
     var request = gapi.client.gmail.users.threads.modify({
               'userId': USER,
               'id': threadId,
               'resource': {
                    'addLabelIds': [],
                    'removeLabelIds': ['UNREAD']
               }
          });
     return request.execute(callback);
}

/* js function, using google api, to delete a thread (send the email to trash), based on its threadId */
function sendThreadToTrash(threadId, callback) {
     var request = gapi.client.gmail.users.threads.trash({
               'userId': USER,
               'id': threadId
          });
     return request.execute(callback);
}

/* js function, using google api, to restore a thread (send the email back to the inbox), based on its threadId */
function sendThreadBackToInbox(threadId, callback) {
     var request = gapi.client.gmail.users.threads.untrash({
               'userId': USER,
               'id': threadId
          });
     return request.execute(callback);
}

/* js function, using google api, to delete permanently a thread, based on its messageID */
function deleteThreadPermanently(threadId, callback) {
     var request = gapi.client.gmail.users.threads.delete({
               'userId': USER,
               'id': threadId
          });
     return request.execute(callback);
}

/*
Handling Messages
 */

function listMessages(labelIds, query, maxResult, callback) {
     // Prepare Request to Google API
     var request = gapi.client.gmail.users.messages.list({
               'userId': USER,
               'labelIds': labelIds,
               'q': query,
               'maxResults': maxResult
          });
     request.execute(function (response) {
          $.each(response.messages, function () {
               var messageRequest = gapi.client.gmail.users.messages.get({
                         'userId': USER,
                         'id': this.id
                    });
               messageRequest.execute(callback);
          });
     });
}

/* js function, using google api, to send a message (an email indeed), based on its parameters */
function sendMessage(thread_id, headers_obj, message, callback) {

	console.log("sendMessage/thread_id: " + thread_id);
	var email = '';
	for (var header in headers_obj)
	  email += header += ": " + headers_obj[header] + "\r\n";
	email += "\r\n" + message;
	console.log(email);
	var emailEncoded =    utoa(email);
	var request = gapi.client.gmail.users.messages.send({
               'userId': USER,
               'resource': {
                    'threadId': thread_id,
                    'raw': emailEncoded.replace(/\+/g, '-').replace(/\//g, '_')
               }
          });
		  //'raw': window.btoa(email).replace(/\+/g, '-').replace(/\//g, '_')
     return request.execute(callback);
}


/* js function, using google api, to send a message (an email indeed), based on its parameters */
function sendMessage2(thread_id, message_obj, callback) {

	var request = gapi.client.gmail.users.messages.send({
               'userId': USER,
               'resource': {
                    'threadId': thread_id,
                    'raw': message_obj
               }
          });
		  //'raw': window.btoa(email).replace(/\+/g, '-').replace(/\//g, '_')
     return request.execute(callback);
}


// ucs-2 string to base64 encoded ascii
function utoa(str) {
    return window.btoa(unescape(encodeURIComponent(str)));
}
// base64 encoded ascii to ucs-2 string
function atou(str) {
    return decodeURIComponent(escape(window.atob(str)));
}


/* js function, using google api, to send a message (an email indeed), based on its parameters
function sendReplyToThread(thread_id, headers_obj, message, callback) {
var email = '';
for (var header in headers_obj)
email += header += ": " + headers_obj[header] + "\r\n";
email += "\r\n" + message;
var request = gapi.client.gmail.users.messages.send({
'userId': USER,
'resource': {
'raw': window.btoa(email).replace(/\+/g, '-').replace(/\//g, '_'),
'threadId': thread_id
}
});
return request.execute(callback);
}
 */

/* js function, using google api, to mark a message as read, based on its messageID */
function markMessageAsRead(messageId, callback) {
     var request = gapi.client.gmail.users.messages.modify({
               'userId': USER,
               'id': messageId,
               'resource': {
                    'addLabelIds': [],
                    'removeLabelIds': ['UNREAD']
               }
          });
     return request.execute(callback);
}

/* js function, using google api, to send message to trash, based on its messageID */
function sendMessageToTrash(messageId, callback) {
     var request = gapi.client.gmail.users.messages.trash({
               'userId': USER,
               'id': messageId
          });
     return request.execute(callback);
}

/* js function, using google api, to send delete permanently a message, based on its messageID */
function deleteMessagePermanently(messageId, callback) {
     var request = gapi.client.gmail.users.messages.delete({
               'userId': USER,
               'id': messageId
          });
     return request.execute(callback);
}

/* js function, using google api, to restore a message (send the email back to the inbox), based on its messageID */
function sendMessageBackToInbox(messageId, callback) {
     var request = gapi.client.gmail.users.messages.untrash({
               'userId': USER,
               'id': messageId
          });
     return request.execute(callback);
}

/* js function, using google api, to retrieve emails attachments */
function getAttachments(messageId, payloadParts, callback) {
     for (var i = 0; i < payloadParts.length; i++) {
          var part = payloadParts[i];
          if (part.filename && part.filename.length > 0) {
               var attachId = part.body.attachmentId;
               var request = gapi.client.gmail.users.messages.attachments.get({
                         'userId': USER,
                         'id': attachId,
                         'messageId': messageId
                    });
               request.execute(function (attachment) {
                    callback(part.filename, part.mimeType, attachment);
               });
          }
     }
}

function renderThreadIcons(threadLabels) {
	if (threadLabels.includes("IMPORTANT")) {
		$('#threadImportant').removeClass('hidden');
		$('#threadImportant').show();
    }
	 
	 if (threadLabels.includes("UNREAD")) {
		$('#threadUnread').removeClass('hidden');
		$('#threadUnread').show();
		$('#asread-button').show();
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

}

function getHeader(headers, index) {
     var header = '';
     $.each(headers, function () {
          if (this.name.toLowerCase() === index.toLowerCase()) {
               header = this.value;
          }
     });
     return header;
}

function getBody(message) {
     var encodedBody = '';
     if (typeof message.parts === 'undefined') {
          encodedBody = message.body.data;
     } else {
          encodedBody = getHTMLPart(message.parts);
     }
     encodedBody = encodedBody.replace(/-/g, '+').replace(/_/g, '/').replace(/\s/g, '');
     return decodeURIComponent(escape(window.atob(encodedBody)));
}

function getHTMLPart(arr) {
     for (var x = 0; x <= arr.length; x++) {
          if (typeof arr[x].parts === 'undefined') {
               if (arr[x].mimeType === 'text/html') {
                    return arr[x].body.data;
               }
          } else {
               return getHTMLPart(arr[x].parts);
          }
     }
     return '';
}

function getFirstMessageOfThread(thread) {
     return thread.messages[0];
}

function getLastMessageOfThread(thread) {
     return thread.messages[thread.messages.length - 1];
}

function createContact(contactString) {
     var contactStringSplit = contactString.split("<");
     if (contactStringSplit.length == 2) {
          var contact = {
               fullName: contactStringSplit[0].trim(),
               emailAddress: contactStringSplit[1].replace(">", '').trim()
          };
     } else {
          var contact = {
               fullName: contactStringSplit[0].trim(),
               emailAddress: contactStringSplit[0].trim()
          };
     }

     return contact;
}

function showComposeModal() {
     console.log("showComposeModal");
     $('#compose-modal').modal('show');
     $('#compose-to').val('');
     $('#compose-subject').val('');
     $('#compose-message').val('');
}

/* Clear and Close Compose Modal after thread/message is sent */
function clearAndCloseComposeModal() {
     $('#compose-modal').modal('hide');
	 $('#send-button').removeClass('disabled');
     $('#compose-to').val('');
     $('#compose-cc').val('');
     $('#compose-cci').val('');
     $('#compose-subject').val('');
     $('#compose-message').val('');
     /*
     $('#reply-message-id').val('');
     $('#reply-thread-id').val(''); 
	 */
     //location.reload();
}




/* Clear and Close Reply Modal after thread/message is sent */
function clearAndCloseReplyModal() {
     $('#reply-modal').modal('hide');
	 $('#reply-button').removeClass('disabled');
	 
     $('#reply-to').val('');
     $('#reply-cc').val('');
     $('#reply-cci').val('');
     $('#reply-subject').val('');
     $('#reply-message').val('');
     $('#original-message-header').empty();
     $('#original-message').empty();
     $('#reply-message-id').val('');
     $('#reply-thread-id').val('');
     //location.reload();
}

/* Fill in Reply Modal with thread/message information */
function prepareAndOpenReplyModal(to, cc, cci, subject, quoteHeader, quoteMessage, message_id, thread_id) {
     $('#reply-modal').modal('show');
	 $('#reply-button').removeClass('disabled');
	 
     $('#reply-to').val(to);
     $('#reply-cc').val(cc);
     $('#reply-cci').val(cci);
     $('#reply-subject').val(subject);
     $('#reply-message').val('');
     $('#original-message-header').html(quoteHeader);
     $('#original-message').html(quoteMessage);
     $('#reply-message-id').val(message_id);
     $('#reply-thread-id').val(thread_id);
}

function addActionsButtonsToMailRow(threadId)
{
	//add 2 actions buttons: Mark as Read and Delete
	 $('#actions-btn-'+threadId).append(
		'<button type="button" style="display:none;" class="inbox-buttons asread-button" id="asread-button-' + threadId + '"> \
			<img id="asread-icon-' + threadId+ '" src="img/markAsRead.png" title="Mark as read"/>\
          </button>\
		  &nbsp;\
          <button type="button" class="inbox-buttons delete-button" id="delete-button-' + threadId + '">\
          <img id="delete-icon-' + threadId + '" src="img/delete.png" title="Delete"/>\
          </button>\
		  &nbsp;\
		  <button type="button" class="inbox-buttons restore-button hidden" id="restore-button-' + threadId + '">\
          <img id="restore-icon-' + threadId + '" src="img/restore.png" title="Restore"/></button>\</td>\
          </tr>');
		  
	if (trash)
	{
		 $('#asread-button-'+threadId).addClass("hidden");
		 $('#delete-button-'+threadId).addClass("hidden");
		 $('#restore-button-'+threadId).removeClass("hidden");
	}
	
	if (sent)
	{
		 $('#asread-button-'+threadId).addClass("hidden");
		 $('#delete-button-'+threadId).addClass("hidden");
		 $('#restore-button-'+threadId).addClass("hidden");
	}
}

function addLabelsToMailRow(threadId, labels)
{
	 if (labels.includes("UNREAD")) {
          var iconDivID = "#icons-" + threadId;
          $(iconDivID).append("<img id='newIco' src='img/new.png' title='Unread'/>&nbsp;");

          var buttonID = "#asread-button-" + threadId;
          $(buttonID).toggle();
     }

     if (labels.includes("STARRED")) {
          var iconDivID = "#icons-" + threadId;
          $(iconDivID).append("<img id='starIco' src='img/star.png' title='Starred'/>&nbsp;");
     }

     if (labels.includes("IMPORTANT")) {
          var iconDivID = "#icons-" + threadId;
          $(iconDivID).append("<img id='importIco' src='img/important.png'  title='Important'/>&nbsp;");
     }
     if (labels.includes("CATEGORY_PERSONAL")) {
          var iconDivID = "#icons-" + threadId;
          $(iconDivID).append("<img id='promoIco' src='img/personal.png' title='Personal'/>&nbsp;");
     }
}

function addAttachmentIcon(threadId, hasAttachment)
{
	if (hasAttachment)
	{
		
	}	
}

function renderThreadRow(threadId, from, subject, date, labels)
{

	   $('#table-inbox > tbody').append(
          '<tr class="email_item" id="' + threadId + '">\
          <td><div style="display:inline-block; width: 70px !important;" id="icons-' + threadId + '""/></td>\
          <td>' + from + '</td>\
          <td> <a id="thread-' + threadId + '">' + subject + '</a> </td>\
          <td style="width: 166px !important;"><div id="dateEmail">' + date + '</div></td>\
		  <td id="actions-btn-' + threadId + '"></td>\
		  </tr>'); 
	
	addActionsButtonsToMailRow(threadId);
	addLabelsToMailRow(threadId, labels);
}


/* function to render a row with email info */
/* still used by message.html */
function renderMailRow(message) {
     var messageHeaders = message.payload.headers;
     var messageLabelIds = message.labelIds;

     // Extract From value, and parse it if necessary
     var from = getHeader(messageHeaders, 'From');
     var tmp_from = from.match("<(.*)>");
     if (tmp_from) {
          from = tmp_from[1];
     }
     var mailDateString = getHeader(messageHeaders, 'Date');
     var mailDate = new Date(mailDateString);
     var finalMailDate = mailDate.toLocaleString("en-GB");

     $('#table-inbox > tbody').append(
          '<tr class="email_item" id="row-' + message.threadId + '">\
          <td><div style="display:inline-block; width: 70px !important;" id="icons-' + message.id + '""/></td>\
          <td>' + from + '</td>\
          <td>\
          <a id="thread-' + message.threadId + '">' + getHeader(messageHeaders, 'Subject') +
          '</a>\
          </td>\
          <td style="width: 166px !important;"><div id="dateEmail">' + finalMailDate + '</div></td>\
		  <td id="actions-btn-' + message.id + '"></td></tr>'); 
		  
		addActionsButtonsToMailRow(message.id);
		addLabelsToMailRow(message.id, messageLabelIds);

     if (message.payload.parts) {
          getAttachments(message.id, message.payload.parts, function (filename, mimeType, attachment) {
               if (filename) {
                    /* display Icon in the main page */
                    var iconDivID = "#icons-" + message.id;
                    if ($(iconDivID).has('#attachIco').length > 0) {}
                    else {
                         $(iconDivID).append("<img id='attachIco' src='img/paperclip.png' title='Has attachment'/>&nbsp;");
                    }
                    /* put attachement ref to the modal*/
                    var emailAttachID = "#emailAttach-" + message.id
                         $(emailAttachID).append("<img id='attachIco' src='img/paperclip.png' title='Has attachment'/>" + filename + "&nbsp;");
                    $(emailAttachID).toggle();
               }
          }); 
     }
}


/* bootstrap js handler to send email, relies on sendMessage() */
function sendEmail() {
     $('#send-button').addClass('disabled');
	 
     var to = $('#compose-to').val();
     var cc = $('#compose-cc').val();
     var bcc = $('#compose-bcc').val();

     // Mail itself
     var subject = $('#compose-subject').val();
	 var message = $('#compose-message').summernote('code');
	 
     sendMessage('', {
          'To': to,
		  'Cc':cc,
		  'Bcc':bcc,	  
          'Subject': subject,
          'Content-Type': 'text/html; charset=utf-8',
          'Content-Transfer-Encoding': 'quoted-printable'
		},
		message,
		getCallResultAndShowMessage);
     //quoted-printable
	 clearAndCloseComposeModal();
     return false;
	 
}

/* bootstrap js handler to send a reply to an existing email, relies on sendMessage() */
function sendReply() {

     $('#reply-button').addClass('disabled');

     // MessageId, ThreadId
     var threadId = $('#reply-thread-id').val();
     var messageId = $('#reply-message-id').val();

     //prepareAndOpenReplyModal(to, cc, cci, subject, quoteHeader, quoteMessage ,message_id, thread_id)
     var to = $('#reply-to').val();
     var cc = $('#reply-cc').val();
     var bcc = $('#reply-bcc').val();

     // Mail itself
     var subject = $('#reply-subject').val();
	 var reply = $('#reply-message').summernote('code');

     // Quote
     var quoteHeader = $('#original-message-header').text();
     var quoteMessage = $('#original-message').text();

     // Reply quotying
    // var replyMessage = reply + "\r\n" + "<blockquote class='gmail_quote'>"+ quoteHeader + "\r\n" + quoteMessage + "</blockquote>"   ;
    //var replyMessage = reply + "\r\n" + quoteHeader + "\r\n" + quoteMessage ;
	var replyMessage = reply + "<br/>" +  "\r\n" + quoteHeader + "<blockquote class='gmail_quote'>"+  quoteMessage + "</blockquote>";
     
     console.log(replyMessage);
     sendMessage(
          threadId, {
          'To': to,
		  'Cc':cc,
		  'Bcc':bcc,		  
          'Subject': subject,
          'In-Reply-To': messageId,
		  'Content-Type': 'text/html; charset=UTF-8',
         // 'Content-Transfer-Encoding': 'quoted-printable'
     },
          replyMessage,
          getCallResultAndShowMessage);
	 clearAndCloseReplyModal();
     return false;
}





function prepareMessageToSend()
{
	//createMessageObject(fromName, fromEmail, toName, toEmail, emailSubject, emailBody) 
	
	
}

