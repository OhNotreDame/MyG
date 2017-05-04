//http://bootstrap-notify.remabledesigns.com/
//relies on bootstrap-notify.js

function displayWarning(msg_title, msg_message) {
     $.notify({
          title: msg_title,
          message: msg_message
     }, {
          type: 'warning'
     }, {
          newest_on_top: true
     });
}

function displaySuccess(msg_title, msg_message) {
     $.notify({
          title: msg_title,
          message: msg_message
     }, {
          type: 'success'
     }, {
          newest_on_top: true
     });
}

function displayDanger(msg_title, msg_message) {
     $.notify({
          title: msg_title,
          message: msg_message
     }, {
          type: 'danger'
     }, {
          newest_on_top: true
     });
}

function getCallResultAndShowMessage(response)
{
	 console.log("getCallResultAndShowMessage");
	 if (response && !response.error) {
         displaySuccess('', 'Success');
     } else {
		displayDanger('', 'Error');
	 }
}

