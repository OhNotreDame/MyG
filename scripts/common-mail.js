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
     console.log("checkAuth");
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
     console.log("handleAuthResult");
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

function listMessage(labelIds, query, maxResult, callback) {
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
function sendMessage(headers_obj, message, callback) {
     var email = '';
     for (var header in headers_obj)
          email += header += ": " + headers_obj[header] + "\r\n";
     email += "\r\n" + message;
     var sendRequest = gapi.client.gmail.users.messages.send({
               'userId': USER,
               'resource': {
                    'raw': window.btoa(email).replace(/\+/g, '-').replace(/\//g, '_')
               }
          });
     return sendRequest.execute(callback);
}

/* js function, using google api, to mark a message as read, based on its messageID */
function markMessageAsRead(messageId, callback) {
     var sendRequest = gapi.client.gmail.users.messages.modify({
               'userId': USER,
               'id': messageId,
               'resource': {
                    'addLabelIds': [],
                    'removeLabelIds': ['UNREAD']
               }
          });
     return sendRequest.execute(callback);
}

/* js function, using google api, to delete a message (send the email to trash), based on its messageID */
function sendMessageToTrash(messageId, callback) {
     var sendRequest = gapi.client.gmail.users.messages.trash({
               'userId': USER,
               'id': messageId
          });
     return sendRequest.execute(callback);
}


/* js function, using google api, to restore a message (send the email back to the inbox), based on its messageID */
function sendMessageBackToInbox(messageId, callback) {
     var sendRequest = gapi.client.gmail.users.messages.untrash({
               'userId': USER,
               'id': messageId
          });
     return sendRequest.execute(callback);
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


function renderEmailIcons(message)
{
	if (message.labelIds.includes("UNREAD")) {
          var iconDivID = "#icons-" + message.id;
          $(iconDivID).append("<img id='newIco' src='../img/new.png' title='Unread'/>&nbsp;");

          var buttonID = "#asread-button-" + message.id;
          $(buttonID).toggle();
     }

     if (message.labelIds.includes("STARRED")) {
          var iconDivID = "#icons-" + message.id;
          $(iconDivID).append("<img id='starIco' src='../img/star.png' title='Starred'/>&nbsp;");
     }

     if (message.labelIds.includes("IMPORTANT")) {
          var iconDivID = "#icons-" + message.id;
          $(iconDivID).append("<img id='importIco' src='../img/important.png'  title='Important'/>&nbsp;");
     }
     if (message.labelIds.includes("CATEGORY_PERSONAL")) {
          var iconDivID = "#icons-" + message.id;
          $(iconDivID).append("<img id='promoIco' src='../img/personal.png' title='Personal'/>&nbsp;");
     }
     if (message.labelIds.includes("CATEGORY_UPDATES")) {
          var iconDivID = "#icons-" + message.id;
          $(iconDivID).append("<img id='starIco' src='../img/updates.png' title='Update'/>&nbsp;");
     }

     if (message.labelIds.includes("CATEGORY_PROMOTIONS")) {
          var iconDivID = "#icons-" + message.id;
          $(iconDivID).append("<img id='promoIco' src='../img/promotions.png' title='Promotions'/>&nbsp;");
     }

     if (message.labelIds.includes("CATEGORY_SOCIAL")) {
          var iconDivID = "#icons-" + message.id;
          $(iconDivID).append("<img id='promoIco' src='../img/social.png' title='Social'/>&nbsp;");
     }

     if (message.payload.parts) {
          getAttachments(message.id, message.payload.parts, function (filename, mimeType, attachment) {
               if (filename) {
                    /* display Icon in the main page */
                    var iconDivID = "#icons-" + message.id;
                    if ($(iconDivID).has('#attachIco').length > 0) {}
                    else {
                         $(iconDivID).append("<img id='attachIco' src='../img/paperclip.png' title='Has attachment'/>&nbsp;");
                    }
                    /* put attachement ref to the modal*/
                    var emailAttachID = "#emailAttach-" + message.id
                         $(emailAttachID).append("<img id='attachIco' src='../img/paperclip.png' title='Has attachment'/>" + filename + "&nbsp;");
                    $(emailAttachID).toggle();
               }
          });
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