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
	//retrieveAllFiles""mimeType = 'application/vnd.google-apps.folder'"", 'user', 'drive', 5);
	//retrieveAllFiles("mimeType = 'application/vnd.google-apps.folder' and trashed =false and folder_id='root'", 'user', 'drive', null);
	//retrieveAllFiles("mimeType = 'application/vnd.google-apps.folder' and 'root' in parents and trashed=false", 'user', 'drive', null);
	retrieveAllFiles("'root' in parents and trashed=true", 'user', 'drive', null);
}

function retrieveAllFiles(q, corpora, spaces, orderBy) {
  var retrievePageOfFiles = function(request, result) {
    request.execute(function(resp) {
      result = result.concat(resp.files);
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
        retrievePageOfFiles(request, result);
      } else {
        parseFiles(result);
      }
    });
  }
  var initialRequest = gapi.client.drive.files.list({
				'key': apiKEY,
				'q': q,
				'corpora': corpora,
				'spaces': spaces,
				'orderBy' : orderBy
			 });
  retrievePageOfFiles(initialRequest, []);
}


/* retrieveAllFiles()
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
 */
/* parseFiles() */
function parseFiles(files) {
	
	var filesCount = files.length;
	console.log(filesCount);
	for (var i = 0; i < filesCount; i++) 
	{
		var curFile= files[i]
		addFileToTable(curFile);
	}
   
	
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
	$('#table-files > tbody').append(
		  '<tr class="file_item" id="row-' + file.id + '">\
		  <td><div id="fileIcon-' + file.id +'"></td>\
		  <td>' + file.name + '</td>\
		  <td>' + file.id + '</td>\
		  <td>' + file.mimeType + '</td>\
		  </tr >');
	
	/*
	Icons : https://icons8.com
	*/

	var fileType = file.mimeType;
	switch (fileType)
	{
			case 'application/vnd.google-apps.folder':
				$('#fileIcon-' + file.id).append("<img src='../img/drive/folder.png' height='24' width='24' title='"+fileType+"'/>");
				break;
			case 'application/vnd.google-apps.document':
				$('#fileIcon-' + file.id).append("<img src='../img/drive/googleDocs.png' height='24' width='24' title='"+fileType+"'/>");
				break;
			case 'application/vnd.google-apps.spreadsheet':
				$('#fileIcon-' + file.id).append("<img src='../img/drive/googleSheets.png' height='24' width='24' title='"+fileType+"'/>");
				break;
			case 'application/vnd.google-apps.presentation':
				$('#fileIcon-' + file.id).append("<img src='../img/drive/googleSlides.png' height='24' width='24' title='"+fileType+"'/>");
				break;
			case 'application/vnd.google-apps.video':
			case 'application/vnd.google-apps.audio':
				$('#fileIcon-' + file.id).append("<img src='../img/drive/mediaFile.png' height='24' width='24' title='"+fileType+"'/>");
				break;	
			case 'image/jpeg':
			case 'image/png':
			case 'application/vnd.google-apps.photo':	
				$('#fileIcon-' + file.id).append("<img src='../img/drive/imgFile.png' height='24' width='24' title='"+fileType+"'/>");
				break;
			case 'application/pdf':	
				$('#fileIcon-' + file.id).append("<img src='../img/drive/pdfFile.png' height='24' width='24' title='"+fileType+"'/>");
				break;
			case 'application/vnd.ms-powerpoint':	
				$('#fileIcon-' + file.id).append("<img src='../img/drive/pptFile.png' height='24' width='24' title='"+fileType+"'/>");
				break;	
			case 'application/vnd.visio':	
				$('#fileIcon-' + file.id).append("<img src='../img/drive/visioFile.png' height='24' width='24' title='"+fileType+"'/>");
				break;
			case 'application/vnd.word':	
			case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':	
				$('#fileIcon-' + file.id).append("<img src='../img/drive/wordFile.png' height='24' width='24' title='"+fileType+"'/>");
				break;
			case 'application/vnd.ms-excel':	
				$('#fileIcon-' + file.id).append("<img src='../img/drive/excelFile.png' height='24' width='24' title='"+fileType+"'/>");
				break;	
				
	}
	
	

	/* Reinforce sort */
	$('#table-files > tbody').tablesorter({
		dateFormat: "uk",
		sortList: [[3, 1]]
	});
}
