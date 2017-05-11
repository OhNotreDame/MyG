/*
 * checkAuth()
 * Check if the current user has authorized the application.
 */
function checkAuth() {
     gapi.auth.authorize({
          'client_id': CLIENT_ID,
          'scope': SCOPES_TASKS,
          'immediate': false
     }, handleAuthResult);
}

/*
 * handleAuthResult()
 * Handle authorization result, displaying or not the authorize button.
 */
function handleAuthResult(authResult) {
     if (authResult && !authResult.error) {
          loadTasksAPI();
          $('#authorize-button').remove();
          $('.table-files').removeClass("hidden");
     } else {
          $('#authorize-button').removeClass("hidden");
          $('#authorize-button').on('click', function () {
               checkAuth();
          });
     }
}