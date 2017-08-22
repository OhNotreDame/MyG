window.onload = function () {
	prepareGlobalNavBar();
	
	checkAuth_Gmail(true);
	checkAuth_Tasks(true);
	checkAuth_Drive(true);
	checkAuth_Contacts(true);
	checkAuth_YouTube(true);
	
	/*
	$("#scope_drive").text(SCOPES_DRIVE);
	$("#scope_tasks").text(SCOPES_TASKS);
	$("#scope_contacts").text(SCOPES_CONTACTS); */

	// Enable Gmail buttons
	$('#btn_signin_gmail').on('click', function () {
		checkAuth_Gmail(false);
	});
	$('#btn_signout_gmail').on('click', function () {
		global_signOut()
	});
	
	// Enable Tasks buttons		
	$('#btn_signin_tasks').on('click', function () {
		checkAuth_Tasks(false);
	});
	$('#btn_signout_tasks').on('click', function () {
		global_signOut()
	});

	// Enable Drive buttons		
	$('#btn_signin_drive').on('click', function () {
		checkAuth_Drive(false);
	});
	$('#btn_signout_drive').on('click', function () {
		global_signOut()
	});

	// Enable Contacts buttons		
	$('#btn_signin_contacts').on('click', function () {
		checkAuth_Contacts(false);
	});
	$('#btn_signout_contacts').on('click', function () {
		global_signOut()
	});
	
	// Enable YouTube buttons		
	$('#btn_signin_youtube').on('click', function () {
		checkAuth_YouTube(false);
	});
	$('#btn_signout_youtube').on('click', function () {
		global_signOut()
	});
}

function global_signOut()
{
	gapi.auth.setToken(null);
	gapi.auth.signOut();
	location.reload();
}

/**
 Google Tasks - Authentication
**/
function checkAuth_Tasks(immediate)
{
	$("#scope_tasks").text(SCOPES_TASKS);	
	$("#scopeTasks").removeClass("hidden");
	 gapi.auth.authorize({
          'client_id': CLIENT_ID,
          'scope': SCOPES_TASKS,
          'immediate': immediate
     }, handleAuthResult_Tasks);
	
}


function handleAuthResult_Tasks(authResult) 
{
	if (authResult && !authResult.error) {
		displaySuccess("Tasks Authentication", "Success !");
		$('#btn_signin_tasks').addClass("hidden");
		$('#btn_signout_tasks').removeClass("hidden");
		gapi.client.load('tasks', 'v1', getUserInfo_Tasks);

	} 
	else {
		displayDanger("Tasks Authentication", "Error !");
		$('#btn_signout_tasks').addClass("hidden");
		$('#btn_signin_tasks').removeClass("hidden");
		
	}
}

function getUserInfo_Tasks()
{
	$("#status_auth_tasks_label").html("Connected as :");
	/*
	var profileReq = gapi.client.tasks.users.getProfile({ 'userId': USER });
	profileReq.execute(function (resp) {
		$("#status_auth_tasks_label").html("Connected as :");
		$("#status_auth_tasks").html(resp.emailAddress);
     });
	 */
}


/**
 Google Mail - Authentication
**/
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
		$('#btn_signin_gmail').addClass("hidden");
		$('#btn_signout_gmail').removeClass("hidden");
		gapi.client.load('gmail', 'v1', getUserInfo_Gmail);
	} 
	else {
		displayDanger("Gmail Authentication", "Error !");
		$('#btn_signout_gmail').addClass("hidden");
		$('#btn_signin_gmail').removeClass("hidden");

	}
}

function getUserInfo_Gmail()
{
	var profileReq = gapi.client.gmail.users.getProfile({ 'userId': USER });
	profileReq.execute(function (resp) {
		$("#status_auth_gmail_label").html("Connected as :");
		$("#status_auth_gmail").html(resp.emailAddress);
     });
}


/**
 Google Drive - Authentication
**/
function checkAuth_Drive(immediate)
{
	$("#scope_drive").text(SCOPES_DRIVE);	
	$("#scopesDrive").removeClass("hidden");
	 gapi.auth.authorize({
          'client_id': CLIENT_ID,
          'scope': SCOPES_DRIVE,
          'immediate': immediate
     }, handleAuthResult_Drive);
	
}
	
function handleAuthResult_Drive(authResult) 
{
	if (authResult && !authResult.error) {
		displaySuccess("Drive Authentication", "Success !");
		$('#btn_signin_drive').addClass("hidden");
		$('#btn_signout_drive').removeClass("hidden");
		gapi.client.load('drive', 'v3', getUserInfo_Drive);
	} 
	else {
		displayDanger("Drive Authentication", "Error !");
		$('#btn_signout_drive').addClass("hidden");
		$('#btn_signin_drive').removeClass("hidden");

	}
}

function getUserInfo_Drive()
{
	$("#status_auth_drive_label").html("Connected as :");
}



/**
 Google Contacts - Authentication
**/
function checkAuth_Contacts(immediate)
{
	$("#scope_contacts").text(SCOPES_CONTACTS);	
	$("#scopesContacts").removeClass("hidden");
	 gapi.auth.authorize({
          'client_id': CLIENT_ID,
          'scope': SCOPES_CONTACTS,
          'immediate': immediate
     }, handleAuthResult_Contacts);
	
}
	
function handleAuthResult_Contacts(authResult) 
{
	if (authResult && !authResult.error) {
		displaySuccess("Contacts Authentication", "Success !");
		$('#btn_signin_contacts').addClass("hidden");
		$('#btn_signout_contacts').removeClass("hidden");
		gapi.client.load('contacts', 'v3', getUserInfo_Contacts);
	} 
	else {
		displayDanger("Contacts Authentication", "Error !");
		$('#btn_signout_contacts').addClass("hidden");
		$('#btn_signin_contacts').removeClass("hidden");

	}
}

function getUserInfo_Contacts()
{
	$("#status_auth_contacts_label").html("Connected as :");
}


/**
 YouTube - Authentication
**/
function checkAuth_YouTube(immediate)
{
	$("#scope_youtube").text(SCOPES_YOUTUBE);	
	$("#scopesYouTube").removeClass("hidden");
	 gapi.auth.authorize({
          'client_id': CLIENT_ID,
          'scope': SCOPES_YOUTUBE,
          'immediate': immediate
     }, handleAuthResult_YouTube);
	
}
	
function handleAuthResult_YouTube(authResult) 
{
	if (authResult && !authResult.error) {
		displaySuccess("YouTube Authentication", "Success !");
		$('#btn_signin_youtube').addClass("hidden");
		$('#btn_signout_youtube').removeClass("hidden");
		gapi.client.load('youtube', 'v3', getUserInfo_Youtube);
	} 
	else {
		displayDanger("YouTube Authentication", "Error !");
		$('#btn_signout_youtube').addClass("hidden");
		$('#btn_signin_youtube').removeClass("hidden");

	}
}

function getUserInfo_Youtube()
{
	$("#status_auth_youtube_label").html("Connected as :");
}
