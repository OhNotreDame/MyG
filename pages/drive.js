// https://www.sitepoint.com/sending-emails-gmail-javascript-api/
//https://www.googleapis.com/auth/drive.metadata

/* On Window Load */
window.onload = function () {
     window.setTimeout(checkAuth, 1);
}

/* Load Gmail API, and when it's done, call displayInbox */
function loadDriveAPI() {
   	console.log("drive/loadDriveAPI");
	gapi.client.load('drive', 'v2', renderFiles);
}

/* displayFiles()	*/
function renderFiles() {
   	prepareToolbar();
	console.log("drive/renderFiles");
}