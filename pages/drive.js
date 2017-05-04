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
	//retrieveAllFiles("mimeType = 'application/pdf'", null, 30);
	retrieveAllFilesInFolder('root', '', null, 5);
}




function retrieveAllFilesInFolder(folderId, q, orderBy, maxResults) {
  var retrievePageOfChildren = function(request, result) {
    request.execute(function(resp) {
      result = result.concat(resp.items);
      var nextPageToken = resp.nextPageToken;
      if (nextPageToken) {
        request = gapi.client.drive.children.list({
			'folderId' : folderId,
			'key': apiKEY, 
			'q': q,
			'orderBy' : orderBy, 
			'maxResults': maxResults,			
			'pageToken': nextPageToken
        });
        retrievePageOfChildren(request, result);
      } else {
        parseFilesInFolder(folderId, result);
      }
    });
  }
  var initialRequest = gapi.client.drive.children.list({
		'folderId' : folderId,
		'key': apiKEY, 
		'q': q,
		'orderBy' : orderBy, 
		'maxResults': maxResults,
    });
  retrievePageOfChildren(initialRequest, []);
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

/* parseFilesInFolder() */
function parseFilesInFolder(folderId, files) {
     $.each(files, function () {          
		// addFileToTable(this);
		  getFileInFolder(folderId, this.id);
     });
}

/* isFileInFolder() */
function isFileInFolder(folderId, fileId, callback) {
  var request = gapi.client.drive.children.get({
    'folderId': folderId,
    'childId': fileId
  });
  request.execute(function(resp) {
    if (resp.error) {
      if (resp.error.code = 404) {
        callback(false);
      } else {
        console.log('An error occurred: ' + resp.error.message);
        callback(null);
      }
    } else {
      callback(true);
    }
  });
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


/* getTasks() */
function getFileInFolder(folderId, fileId) {
     var request = gapi.client.drive.children.get({
              'key': apiKEY, 
			  'folderId': folderId,
			'childId': fileId
          });
     request.execute(function (resp) {
			addFileToTable(resp);          
     });
}

/* addFileToTable() */
function addFileToTable(file) {
	
	var objType = file.mimeType;
	
	if (objType.indexOf("folder") >= 0)
	{
		if (file.title)
		{
			var lstModified = new Date(file.modifiedDate);
			var lstModifiedFormatted = lstModified.toLocaleString("en-GB");		
			$('#table-files > tbody').append(
				  '<tr class="file_item" id="row-' + file.id + '">\
				  <td><a href="' + file.webViewLink+'">'+ file.title + '</a></td>\
				  <td> Folder </td>\
				  <td>' + lstModifiedFormatted + '</td>\
				  <td>' + file.lastModifyingUserName + '</td>\
				  </tr >');
				  // downloadFile(file, null)
		}	
		
	}
	else
	{
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
		
	}
	  
    
	/* Reinforce sort */
	$('#table-files > tbody').tablesorter({
		dateFormat: "uk",
		sortList: [[3, 1]]
	});
}
