/* On Window Load */
window.onload = function () {
     window.setTimeout(checkAuth, 1);
}

/* Load Gmail API, and when it's done, call renderInbox */
function loadContactsAPI() {
	console.log("contacts/loadContactsAPI");
	//gapi.client.load('contacts', 'v3', renderContacts);
	renderContacts();
}

/* renderContacts()	*/
function renderContacts() {
	console.log("contacts/renderContacts");
	prepareGlobalNavBar();
    prepareToolNavBar('contacts');
}
