window.onload = function () {
	prepareGlobalNavBar();
	
	checkAuth_Gmail(true);
	/*
	$("#scope_drive").text(SCOPES_DRIVE);
	$("#scope_tasks").text(SCOPES_TASKS);
	$("#scope_contacts").text(SCOPES_CONTACTS); */
	
}


function checkAuth_Gmail(immediate)
{
	$("#scope_gmail").text(SCOPES_MAIL);	
	$("#scopesGmail").removeClass("hidden");
	 gapi.auth.authorize({
          'client_id': CLIENT_ID,
          'scope': SCOPES_MAIL,
          'immediate': immediate
     }, handleAuthResult_Gmail);
	
}
	
function handleAuthResult_Gmail(authResult) 
{
	if (authResult && !authResult.error) {
		displaySuccess("Gmail Authentication", "Success !");
		$('#btn_auth_gmail').addClass("hidden");
		gapi.client.load('gmail', 'v1', getUserInfo_Gmail);
		
	} else {
		displayDanger("Gmail Authentication", "Error !");
		$('#btn_auth_gmail').removeClass("hidden");
		$('#btn_auth_gmail').on('click', function () {
				checkAuth_Gmail(false);
		});
	}
}

function getUserInfo_Gmail()
{
	var profileReq = gapi.client.gmail.users.getProfile({ 'userId': USER });
	profileReq.execute(function (resp) {
		$("#status_auth_gmail").html("<b>Connected as " + resp.emailAddress + "</b>");
     });
}


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
	
