window.onload = function () {
   	prepareGlobalNavBar();
    prepareToolNavBar('youtube');
	
}

/* Load YouTube API, and when it's done, call renderNewVideos */
function loadYoutubeAPI() {
    console.log("new/loadYoutubeAPI");
	//gapi.client.load('gmail', 'v1', renderInbox);
}

/* renderNewVideos()	*/
function renderNewVideos() {	
	// Clear Videos table
	$('#table-videos > tbody').empty();
}