/* On Window Load */
window.onload = function () {
     window.setTimeout(checkAuth, 1);
}

/* Load Gmail API, and when it's done, call displayInbox */
function loadDriveAPI() {
	gapi.client.load('drive', 'v3', renderFiles);
}

/* renderFiles() */
function renderFiles() {
   	console.log("drive/renderFiles");
	prepareToolbar();
	$('#table-files > tbody').empty();
	//retrieveAllFiles("mimeType = 'application/pdf'", null, 30);
	//retrieveAllFiles('root', null, 5);
	//retrieveAllFiles("mimeType = 'application/pdf'", 'user', 'drive', 5);
	retrieveAllFiles(null, 'user', 'drive', null);
}


/* retrieveAllFiles() */
function retrieveAllFiles(q, corpora, spaces, orderBy) {
	console.log("drive/retrieveAllFiles");
	var getPageOfFilesLists = function (request, result) {
          request.execute(function (resp) {
               result = result.concat(resp.items);
               var nextPageToken = resp.nextPageToken;
               if (nextPageToken) {
                    request = gapi.client.drive.files.list({			
							'key': apiKEY,
							'pageToken': nextPageToken,
							'q': q,
							'corpora': corpora,
							'spaces': spaces,
							'orderBy' : orderBy
                         });
                    getPageOfFilesLists(request, result);
               } else {
                    parseFiles(result);
               }
          });
     };

		var	request = gapi.client.drive.files.list({
							'key': apiKEY,
							'q': q,
							'corpora': corpora,
							'spaces': spaces,
							'orderBy' : orderBy
                         });
     getPageOfFilesLists(request, []);
}

/* parseFiles() */
function parseFiles(files) {
    console.log("drive/parseFiles");
	$.each(files, function () {      
		console.log("drive/parseFiles("+ this.id+")");    
		getFile(this.id);
     });
}

/* getTasks() */
function getFile(fileId) {
    console.log("drive/getFile("+ fileId+")");
	var request = gapi.client.drive.files.get({
               'fileId': fileId
          });
     request.execute(function (resp) {
			addFileToTable(resp);          
     });
}

/* addFileToTable() */
function addFileToTable(file) {

	 console.log("drive/addFileToTable("+ file.title +")");
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
