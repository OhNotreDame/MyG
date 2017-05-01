function showComposeModal() {
     console.log("showComposeModal");
     $('#compose-modal').modal('show');
     $('#compose-to').val('');
     $('#compose-subject').val('');
     $('#compose-message').val('');
}
/* bootstrap function to enhance email composition */
function composeTidy() {
     $('#compose-modal').modal('hide');
     $('#compose-to').val('');
     $('#compose-subject').val('');
     $('#compose-message').val('');
     $('#send-button').removeClass('disabled');
     location.reload();
}

/* bootstrap function to enhance email reply */
function replyTidy() {
     $('#reply-modal').modal('hide');
     $('#reply-message').val('');
     $('#reply-button').removeClass('disabled');
     location.reload();
}

/* bootstrap function to fill-in reply modal with email info */
function fillInReply(to, subject, message_id) {
     $('#reply-modal').modal('show');
     $('#reply-to').val(to);
     $('#reply-subject').val(subject);
     $('#reply-message-id').val(message_id);
}

/* function to render a row with email info */
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
          '<tr class="email_item" id="row-' + message.id + '">\
          <td><div style="display:inline-block; width: 70px !important;" id="icons-' + message.id + '""/></td>\
          <td>' + from + '</td>\
          <td>\
          <a id="thread-' + message.threadId + '">' +
          getHeader(messageHeaders, 'Subject') +
          '</a>\
          </td>\
          <td style="width: 166px !important;"><div id="dateEmail">' + finalMailDate + '</div></td>\
          <td> <button type="button" style="display:none;" class="btn asread-button" id="asread-button-' + message.id + '"> \
          <img id="asread-icon-' + message.id + '" src="../img/markAsRead.png" title="Mark as read"/>\
          </button>\</td>\
          <td> <button type="button" class="btn delete-button" id="delete-button-' + message.id + '">\
          <img id="delete-icon-' + message.id + '" src="../img/delete.png" title="Delete"/>\
          </button>\</td>\
          <td> <button type="button" class="btn reply-button" id="reply-button-' + message.id + '">\
          <img id="reply-icon-' + message.id + '" src="../img/reply.png" title="Reply"/>\
          </button>\</td>\
          </tr>');

     if (messageLabelIds.includes("UNREAD")) {
          var iconDivID = "#icons-" + message.id;
          $(iconDivID).append("<img id='newIco' src='../img/new.png' title='Unread'/>&nbsp;");

          var buttonID = "#asread-button-" + message.id;
          $(buttonID).toggle();
     }

     if (messageLabelIds.includes("STARRED")) {
          var iconDivID = "#icons-" + message.id;
          $(iconDivID).append("<img id='starIco' src='../img/star.png' title='Starred'/>&nbsp;");
     }

     if (messageLabelIds.includes("IMPORTANT")) {
          var iconDivID = "#icons-" + message.id;
          $(iconDivID).append("<img id='importIco' src='../img/important.png'  title='Important'/>&nbsp;");
     }
     if (messageLabelIds.includes("CATEGORY_PERSONAL")) {
          var iconDivID = "#icons-" + message.id;
          $(iconDivID).append("<img id='promoIco' src='../img/personal.png' title='Personal'/>&nbsp;");
     }
     // if (messageLabelIds.includes("CATEGORY_UPDATES")) {
          // var iconDivID = "#icons-" + message.id;
          // $(iconDivID).append("<img id='starIco' src='../img/updates.png' title='Update'/>&nbsp;");
     // }

     // if (messageLabelIds.includes("CATEGORY_PROMOTIONS")) {
          // var iconDivID = "#icons-" + message.id;
          // $(iconDivID).append("<img id='promoIco' src='../img/promotions.png' title='Promotions'/>&nbsp;");
     // }

     // if (messageLabelIds.includes("CATEGORY_SOCIAL")) {
          // var iconDivID = "#icons-" + message.id;
          // $(iconDivID).append("<img id='promoIco' src='../img/social.png' title='Social'/>&nbsp;");
     // }

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


/* bootstrap js handler to send email, relies on sendMessage() */
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

/* bootstrap js handler to send a reply to an existing email, relies on sendMessage() */
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

