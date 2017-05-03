const SCOPES = [
     "https://www.googleapis.com/auth/gmail.modify",
     "https://www.googleapis.com/auth/gmail.compose"
];
const USER = 'me';

/*
 * checkAuth()
 * Check if the current user has authorized the application.
 */
function checkAuth() {
     gapi.auth.authorize({
          'client_id': CLIENT_ID,
          'scope': SCOPES,
          'immediate': true
     }, handleAuthResult);
}

/*
 * handleAuthResult()
 * Handle authorization result, displaying or not the authorize button.
 */
function handleAuthResult(authResult) {
     if (authResult && !authResult.error) {
          loadGmailAPI();
          $('#authorize-button').remove();
          $('.table-inbox').removeClass("hidden");
          $('#compose-button').removeClass("hidden");
     } else {
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
                    parseThreads(resp.threads);
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

/* js function, using google api, to add a message to a thread (send the email back to the inbox), based on its threadId */
function insertMessageToThread(threadId, email, callback) {
     // Using the js-base64 library for encoding:
     // https://www.npmjs.com/package/js-base64
     var base64EncodedEmail = Base64.encodeURI(email);
     var request = gapi.client.gmail.users.messages.insert({
               'userId': USER,
               'threadId': threadId,
               'resource': {
                    'raw': base64EncodedEmail
               }
          });
     request.execute(callback);
}

function replyToThread(threadId, headers_obj, message, callback) {
     console.log("replyToThread");
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
     var email = '';
     for (var header in headers_obj)
          email += header += ": " + headers_obj[header] + "\r\n";
     email += "\r\n" + message;
     var request = gapi.client.gmail.users.messages.send({
               'userId': USER,
               'resource': {
                    'threadId': thread_id,
					'raw': window.btoa(email).replace(/\+/g, '-').replace(/\//g, '_')
					
               }
          });
     return request.execute(callback);
}


/* js function, using google api, to send a message (an email indeed), based on its parameters */
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

/* js function, using google api, to delete a message (send the email to trash), based on its messageID */
function sendMessageToTrash(messageId, callback) {
     var request = gapi.client.gmail.users.messages.trash({
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

function renderThreadIcons(ThreadLabelIds, messageID) {
     // if (ThreadLabelIds.includes("UNREAD")) {
          // var iconDivID = "#icons-" + messageID;
          // $(iconDivID).append("<img id='newIco' src='../img/new.png' title='Unread'/>&nbsp;");

          // var buttonID = "#asread-button-" + messageID;
          // $(buttonID).toggle();
     // }

     // if (ThreadLabelIds.includes("STARRED")) {
          // var iconDivID = "#icons-" + messageID;
          // $(iconDivID).append("<img id='starIco' src='../img/star.png' title='Starred'/>&nbsp;");
     // }

     // if (ThreadLabelIds.includes("IMPORTANT")) {
          // var iconDivID = "#icons-" + messageID;
          // $(iconDivID).append("<img id='importIco' src='../img/important.png'  title='Important'/>&nbsp;");
     // }
     // if (ThreadLabelIds.includes("CATEGORY_PERSONAL")) {
          // var iconDivID = "#icons-" + messageID;
          // $(iconDivID).append("<img id='promoIco' src='../img/personal.png' title='Personal'/>&nbsp;");
     // }
     // if (ThreadLabelIds.includes("CATEGORY_UPDATES")) {
          // var iconDivID = "#icons-" + messageID;
          // $(iconDivID).append("<img id='starIco' src='../img/updates.png' title='Update'/>&nbsp;");
     // }

     // if (ThreadLabelIds.includes("CATEGORY_PROMOTIONS")) {
          // var iconDivID = "#icons-" + messageID;
          // $(iconDivID).append("<img id='promoIco' src='../img/promotions.png' title='Promotions'/>&nbsp;");
     // }

     // if (ThreadLabelIds.includes("CATEGORY_SOCIAL")) {
          // var iconDivID = "#icons-" + messageID;
          // $(iconDivID).append("<img id='promoIco' src='../img/social.png' title='Social'/>&nbsp;");
     // }

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
     return thread.messages[thread.messages.length-1];
}

function createContact(contactString)
{
	var contactStringSplit = contactString.split("<");
	if(contactStringSplit.length == 2)
	{
		var contact = {fullName: contactStringSplit[0].trim(), emailAddress: contactStringSplit[1].replace(">", '').trim()};
	}
	else
	{
		var contact = {fullName: contactStringSplit[0].trim(), emailAddress: contactStringSplit[0].trim()};
	}
	
	return contact;
}