/*
 * checkAuth()
 * Check if the current user has authorized the application.
 */
function checkAuth() {
	console.log("contacts/checkAuth");
     gapi.auth.authorize({
          'client_id': CLIENT_ID,
          'scope': SCOPES_CONTACTS,
          'immediate': false
     }, handleAuthResult);
}

/*
 * handleAuthResult()
 * Handle authorization result, displaying or not the authorize button.
 */
function handleAuthResult(authResult) {
	console.log("contacts/handleAuthResult");
     if (authResult && !authResult.error) {
          
		  console.log("contacts/handleAuthResult/OK");
		  loadContactsAPI();
          $('#authorize-button').remove();
          $('.table-inbox').removeClass("hidden");
          $('#compose-button').removeClass("hidden");
     } else {
		 console.log("contacts/handleAuthResult/KO");
          $('#authorize-button').removeClass("hidden");
          $('#authorize-button').on('click', function () {
               checkAuth();
          });
     }
}