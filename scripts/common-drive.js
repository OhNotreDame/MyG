// Array of API discovery doc URLs for APIs used by the quickstart
const DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"];
const SCOPES = [
     "https://www.googleapis.com/auth/drive.file",
     "https://www.googleapis.com/auth/drive.metadata"
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
     console.log("drive/handleAuthResult");
     if (authResult && !authResult.error) {
          loadDriveAPI();
          $('#authorize-button').remove();
          $('.table-files').removeClass("hidden");
     } else {
          $('#authorize-button').removeClass("hidden");
          $('#authorize-button').on('click', function () {
               checkAuth();
          });
     }
}
