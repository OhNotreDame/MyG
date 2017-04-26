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
	 
	var urlParams = new URLSearchParams(window.location.search);
	var curLoc = window.location.href;
	if (curLoc.includes('?'))
	{
		var urlParamsKeys = urlParams.keys();
		for(key of urlParamsKeys) { 
			switch(key) {
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
	}
	else
	{
		listMessages('INBOX', '!label:CHAT !label:Social !label:Updates !label:Promotions', 50, appendMessageRow);
	}
}

function appendMessageRow(message) {

     var headers = message.payload.headers;

     // Extract From value, and parse it if necessary
     var from = getHeader(headers, 'From');
     var tmp_from = from.match("<(.*)>");
     if (tmp_from) {
          from = tmp_from[1];
     }

     var mailDateString = getHeader(headers, 'Date');
     var mailDate = new Date(mailDateString);
     var finalMailDate = mailDate.toLocaleString("en-GB");

     //$('.table-inbox tbody').before(
     // Append row to table
     $('#table-inbox > tbody').append(
          '<tr class="email_item" id="row-' + message.id + '">\
          <td><div style="display:inline-block; width: 70px !important;" id="icons-' + message.id + '""/></td>\
          <td>' + from + '</td>\
          <td>\
          <a href="#message-modal-' + message.id +
          '" data-toggle="modal" id="message-link-' + message.id + '">' +
          getHeader(headers, 'Subject') +
          '</a>\
          </td>\
          <td style="width: 166px !important;"><div id="dateEmail">' + finalMailDate + '</div></td>\
          <td> <button type="button" style="display:none;" class="btn btn-primary asread-button" id="asread-button-' + message.id + '"> \
          <img id="asread-icon-' + message.id + '" src="../img/markAsRead.png" title="Mark as read"/>\
          Mark as read\
          </button>\</td>\
          <td> <button type="button" class="btn btn-primary delete-button" id="delete-button-' + message.id + '">\
          <img id="delete-icon-' + message.id + '" src="../img/delete.png" title="Delete"/>\
          Delete\
          </button>\</td>\
          <td> <button type="button" class="btn btn-primary reply-button" id="reply-button-' + message.id + '">\
          <img id="reply-icon-' + message.id + '" src="../img/reply.png" title="Reply"/>\
          Reply\
          </button>\</td>\
          </tr>');

     renderEmailIcons(message);

     // Reply_To/From format:
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

     var subject = getHeader(headers, 'Subject');
     var substring = "Re: ";
     var reply_subject = "";

     if (subject.indexOf(substring) !== -1) {
          reply_subject = subject.replace(/\"/g, '&quot;');
     } else {
          reply_subject = 'Re: ' + subject.replace(/\"/g, '&quot;');
     }

     //var reply_subject = getHeader(headers, 'Subject').replace(/\"/g, '&quot;');

     $('body').append(
          '<div class="modal fade" id="message-modal-' + message.id + '" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">\
          <div class="modal-dialog modal-lg">\
          <div class="modal-content">\
          <div class="modal-header">\
          <button type="button"\
          class="close"\
          data-dismiss="modal"\
          aria-label="Close">\
          <span aria-hidden="true">&times;</span></button>\
          <h2 class="modal-title" id="emailSubject">' +
          getHeader(headers, 'Subject') +
          '</h2>\
          <div id="emailFrom" class="text-left">From: ' + reply_to + '</div>\
          <div id="emailSent" class="text-left">Sent: ' + finalMailDate + '</div>\</h5>\
          <div id="emailAttach-' + message.id + '" style="display:none;">Attachments: </div>\
          </div>\
          <div class="modal-body">\
          <iframe id="message-iframe-' + message.id + '" srcdoc="<p>Loading...</p>">\
          </iframe>\
          </div>\
          <div class="modal-footer">\
          <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>\
          <div style="display:none" id="emailID">' + message.id + '</span>\
          </div>\
          </div>\
          </div>\
          </div>\
          </div>\
          </div>');

     /* js event handler on Email Subject */
     $('#message-link-' + message.id).on('click', function () {
          var ifrm = $('#message-iframe-' + message.id)[0].contentWindow.document;
          $('body', ifrm).html(getBody(message.payload));
     });

     /* js event handler on Delete Main Button */
     $('#delete-button-' + message.id).on('click', function () {
          sendEmailToTrash(message.id);
          $('#delete-button-' + message.id).hide();
     });

     /* js event handler on Delete Main Button */
     $('#asread-button-' + message.id).on('click', function () {
          markEmailAsRead(message.id);
     });

     /* js event handler on Reply Main Button */
     $('#reply-button-' + message.id).on('click', function () {
          fillInReply(reply_to, reply_subject, message.id);
     });
     $('#table-inbox').tablesorter({
          dateFormat: "uk",
          sortList: [[3, 1]]
     });
}

/* generic js handler to send email, relies on sendMessage() */
function sendEmail() {
     $('#send-button').addClass('disabled');
     sendMessage({
          'To': $('#compose-to').val(),
          'Subject': $('#compose-subject').val()
     },
          $('#compose-message').val(),
          composeTidy);
     return false;
}


/* generic js handler to send an email to trash, relies on deleteMessage() */
function markEmailAsRead(messageId) {
     markMessageAsRead(messageId, null);
     $('#asread-button-' + messageId).hide();
}

/* generic js handler to send an email to trash, relies on deleteMessage() */
function sendEmailToTrash(messageId) {
     sendMessageToTrash(messageId, null);
     $('#row-' + messageId).hide();
}

/* bootstrap function to enhance email composition */
function composeTidy() {
     $('#compose-modal').modal('hide');
     $('#compose-to').val('');
     $('#compose-subject').val('');
     $('#compose-message').val('');
     $('#send-button').removeClass('disabled');
}

/* bootstrap function to enhance email reply */
function replyTidy() {
     $('#reply-modal').modal('hide');
     $('#reply-message').val('');
     $('#reply-button').removeClass('disabled');
}

/* bootstrap function to fill-in reply modal with email info */
function fillInReply(to, subject, message_id) {
     console.log("fillInReply");
     $('#reply-modal').modal('show');
     $('#reply-to').val(to);
     $('#reply-subject').val(subject);
     $('#reply-message-id').val(message_id);
}

/* generic js handler to send a reply to an existing email, relies on sendMessage() */
function sendReply() {
     $('#reply-button').addClass('disabled');
     sendMessage({
          'To': $('#reply-to').val(),
          'Subject': $('#reply-subject').val(),
          'In-Reply-To': $('#reply-message-id').val()
     },
          $('#reply-message').val(),
          replyTidy);
     return false;
}