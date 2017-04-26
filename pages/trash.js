// https://www.sitepoint.com/sending-emails-gmail-javascript-api/

/* On Window Load */
window.onload = function () {
    window.setTimeout(checkAuth, 1);
	
	document.getElementById("emptyTrash-button")
     .addEventListener("click", emptyTrash, false);
}

/* Load Gmail API, and when it's done, call renderInbox */
function loadGmailAPI() {
     gapi.client.load('gmail', 'v1', renderTrash);
}

/* renderInbox()	*/
function renderTrash() {
     // Clear Messages table
     prepareToolbar();
	 $('.table-trash tbody').empty();
     listMessage('TRASH', '!label:CHAT', 30, appendMessageRow);

}

function emptyTrash() {
	alert("emptyTrash is not implemented yet!");
}

function appendMessageRow(message) {

     var headers = message.payload.headers;

     // Extract From value, and parse it if necessary
     var from = getHeader(headers, 'From');
     var tmp_from = from.match("<(.*)>");
     if (tmp_from) {
          from = tmp_from[1];
     }

     // Check if email has attachments
     var hasAttachString = "No";
     var tmpFileName = "";

     //Retrieve attachemnt


     var mailDateString = getHeader(headers, 'Date');
     var mailDate = new Date(mailDateString);
     var finalMailDate = mailDate.toLocaleString("en-GB");

     //$('.table-inbox tbody').before(
     // Append row to table
     $('#table-trash').append(
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
          <td> <button type="button" class="btn btn-primary restore-button" id="restore-button-' + message.id + '">\
          <img id="delete-icon-' + message.id + '" src="../img/restore.png" title="Restore"/>\
          Restore\
          </button>\</td>\
          </tr>');

     renderEmailIcons(message);

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
          <div id="emailFrom" class="text-left">From: ' + getHeader(headers, 'Reply-to') + '</div>\
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
     $('#restore-button-' + message.id).on('click', function () {
          sendMessageBackToInbox(message.id);
		  $('#row-' + message.id).hide();
     });

     $('#table-trash').tablesorter({
          dateFormat: "uk",
          sortList: [[3, 1]]
     });
}
