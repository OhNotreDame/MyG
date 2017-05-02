/* On Window Load */
window.onload = function () {
     window.setTimeout(checkAuth, 1);
}

/* Load Gmail API, and when it's done, call displayInbox */
function loadDriveAPI() {
	gapi.client.load('drive', 'v2', renderFiles);
}

/* renderFiles() */
function renderFiles() {
   	prepareToolbar();
	$('#table-files > tbody').empty();
	retrieveAllFiles("mimeType = 'application/pdf'", null, 30);
}

/* retrieveAllFiles() */
function retrieveAllFiles(q, orderBy, maxResults) {
	var getPageOfFilesLists = function (request, result) {
          request.execute(function (resp) {
               result = result.concat(resp.items);
               var nextPageToken = resp.nextPageToken;
               if (nextPageToken) {
                    request = gapi.client.drive.files.list({
							'userId': USER,
							'pageToken': nextPageToken,
							'q': q,
							'orderBy' : orderBy, 
							'maxResults': maxResults
                         });
                    getPageOfFilesLists(request, result);
               } else {
                    parseFiles(result);
               }
          });
     };

		var	request = gapi.client.drive.files.list({
							'userId': USER,
							'q': q,
							'orderBy' : orderBy, 
							'maxResults': maxResults
                         });
     getPageOfFilesLists(request, []);
}



/* parseFiles() */
function parseFiles(files) {
     $.each(files, function () {          
		  getFile(this.id);
     });
}

/* getTasks() */
function getFile(fileId) {
     var request = gapi.client.drive.files.get({
               'fileId': fileId
          });
     request.execute(function (resp) {
			addFileToTable(resp);          
     });
}

/* addFileToTable() */
function addFileToTable(file) {
	
	if (file.title)
	{
		var lstModified = new Date(file.modifiedDate);
		var lstModifiedFormatted = lstModified.toLocaleString("en-GB");		
		$('#table-files > tbody').append(
			  '<tr class="file_item" id="row-' + file.id + '">\
			  <td><a href="' + file.webContentLink+'">'+ file.originalFilename + '</a></td>\
			  <td>' + file.fileExtension + '</td>\
			  <td>' + lstModifiedFormatted + '</td>\
			  <td>' + file.lastModifyingUserName + '</td>\
			  </tr >');
			  // downloadFile(file, null)
	}	  
    
	/* Reinforce sort */
	$('#table-files > tbody').tablesorter({
		dateFormat: "uk",
		sortList: [[3, 1]]
	});
}