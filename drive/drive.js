/*
 * checkAuth()
 * Check if the current user has authorized the application.
 */
function checkAuth() {
     console.log("checkAuth");
	 
	 gapi.auth.authorize({
          'client_id': CLIENT_ID,
          'scope': SCOPES_DRIVE,
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

/* retrieveAllFiles() */
function retrieveAllFiles(q, corpora, spaces, orderBy, callback) {
     var retrievePageOfFiles = function (request, result) {
          request.execute(function (resp) {
               result = result.concat(resp.files);
               var nextPageToken = resp.nextPageToken;
               if (nextPageToken) {
                    request = gapi.client.drive.files.list({
                              'key': API_KEY,
                              'pageToken': nextPageToken,
                              'q': q,
                              'corpora': corpora,
                              'spaces': spaces,
                              'orderBy': orderBy,
							  'fields': 'files(id, name, mimeType, modifiedTime, starred, shared)'
                         });
                    retrievePageOfFiles(request, result);
               } else {
						var files = result;
						for (var i = 0; i < files.length; i++) {
							var curFile = files[i]
							callback(curFile);
						}
               }
          });
     }
     var initialRequest = gapi.client.drive.files.list({
               'key': API_KEY,
               'q': q,
               'corpora': corpora,
               'spaces': spaces,
               'orderBy': orderBy,
			   'fields': 'files(id, name, mimeType, modifiedTime, starred, shared)'
          });
     retrievePageOfFiles(initialRequest, []);
}

/* getFile() */
function getFile(fileId, callback) {
     var request = gapi.client.drive.files.get({
               'fileId': fileId
          });
     request.execute(function (resp) {
          callback(resp);
     });
}

function getFolderMetatadata(fileId) {
     var request = gapi.client.drive.files.get({
               'fileId': fileId,
			   'fields': "name, id, parents"
          });
     request.execute(function (file) {
        	$("#current-folder-name").text(file.name);
        	$("#current-folder-id").text(file.id);
		    $("#parent-folder-id").text(file.parents);
     });
}

/* createFolder() */
function createFolder(folderName, parentId, callback) {
	
	var folderMetadata = {
          'name': folderName,
		  'parents': [parentId],
          'mimeType': "application/vnd.google-apps.folder"
        };
		
     var request = gapi.client.drive.files.create({
               'resource': folderMetadata
          });
     request.execute(function (resp) {
          callback(resp);
     });
}


/* downloadFile() */
function downloadFile(fileId, fileName, fileType) {
     //console.log("downloadFile: " + fileId + " - " + fileName + " - " + fileType);
	 
	 // prepare fileDownloadUrl (using googleapis domain)
	 var fileDownloadUrl = "https://www.googleapis.com/drive/v3/files/" + fileId + "?alt=media"
     
	 // get gapi authentication token
	 var accessToken = gapi.auth.getToken().access_token; 
	
	// build XMLHttpRequest
     var xhr = new XMLHttpRequest();
	 xhr.open('GET', fileDownloadUrl);
     xhr.setRequestHeader('Authorization', 'Bearer ' + accessToken); // to ensure authentication during file download
     xhr.responseType = "arraybuffer"; // to ensure that any file are properly created
     
	 xhr.onload = function () {
          if (xhr.status === 200) {

               var blob = new Blob([xhr.response], {
                         type: fileType
                    });
               var docURL = URL.createObjectURL(blob);
               chrome.downloads.download({
                    url: docURL,
                    filename: fileName,
                    conflictAction: 'overwrite',
                    saveAs: false
               });
			   displaySuccess("" , "Download of " + fileName + " completed.");
          }
     };

     xhr.onerror = function () {
          displayError("" , "Download of " + fileName + " to " + fileExtension + " failed.");
     };

     xhr.send();
}


/* exportFile() */
function exportFile(fileId, fileName, mimeType, fileExtension) {
     //console.log("exportFile: " + fileId + " - " + fileName + " - " + mimeType);
	
	 // prepare fileDownloadUrl (using googleapis domain)
	 var fileDownloadUrl = "https://content.googleapis.com/drive/v3/files/" + fileId + "/export?mimeType="+mimeType
     
	 // get gapi authentication token
	 var accessToken = gapi.auth.getToken().access_token; 
	
	// build XMLHttpRequest
	 var xhr = new XMLHttpRequest();
     xhr.open('GET', fileDownloadUrl);
     xhr.setRequestHeader('Authorization', 'Bearer ' + accessToken); // to ensure authentication during file download
     xhr.responseType = "arraybuffer"; // to ensure that any file are properly created
	 
     xhr.onload = function () {
          if (xhr.status === 200) {

               var blob = new Blob([xhr.response], {
                         type: mimeType
                    });
               var docURL = URL.createObjectURL(blob);
               chrome.downloads.download({
                    url: docURL,
                    filename: fileName +"."+fileExtension,
                    conflictAction: 'overwrite',
                    saveAs: false
               });
			   displaySuccess("" , "Export of " + fileName + " to " + fileExtension + " completed.");
          }
     };
     
	 xhr.onerror = function () {
		 displayError("" , "Export of " + fileName + " to " + fileExtension + " failed.");
     };

     xhr.send();
}

