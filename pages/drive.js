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

	var curLoc = window.location.href;
	var splitLoc = curLoc.split("?");
	
	if (splitLoc.length == 2 && splitLoc[1])
	{
		switch(splitLoc[1]) {
			case 'root':
				retrieveAllFiles("'root' in parents and trashed=false", 'user', 'drive', null);
				break;
			default:
				retrieveAllFiles("'"+splitLoc[1]+"' in parents and trashed=false", 'user', 'drive', null);
				break;
		}
	}
	else
	{
		retrieveAllFiles("'root' in parents and trashed=false", 'user', 'drive', null);
	}	
	
	
	//retrieveAllFiles("mimeType = 'application/pdf'", 'user', 'drive', null); <=> return all pdf fukes
	//retrieveAllFiles""mimeType = 'application/vnd.google-apps.folder'", 'user', 'drive', null); <=> return all folders
	//retrieveAllFiles("mimeType = 'application/vnd.google-apps.folder' and 'root' in parents and trashed=false", 'user', 'drive', null); <=> return all root folders (not in trash)
	//retrieveAllFiles("'root' in parents and trashed=false", 'user', 'drive', null);
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
		  <td>\
		  <a id="file-' + file.id + '">' +
          file.name  +
          '</a></td>\
		  <td>' + file.id + '</td>\
		  <td>' + file.mimeType + '</td>\
		  </tr >');
	
	// render icon (https://icons8.com) based on file type
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
			default: //any other file type
				$('#fileIcon-' + file.id).append("<img src='../img/drive/file.png' height='24' width='24' title='"+fileType+"'/>");
				break;	
	}
	
	/* Add js event handler on Email Subject */
     $('#file-' + file.id).on('click', function () {
        var redirectTo = "";
		var redirectToURL="";
		if(file.mimeType == "application/vnd.google-apps.folder")
		{
			 redirectTo = "folder"
			 redirectToURL="drive.html?"+file.id;
		}
		else{
			 redirectTo = "file"
			 // INCLUDE HERE FILE DOWNLOAD URL //
			 redirectToURL= document.location.href;
		}
		
		console.log("redirectTo:" + redirectTo +" # " + file.name);
		console.log("redirectToURL:" + redirectToURL);
		document.location.href=redirectToURL;
     });

	/* Reinforce sort */
	$('#table-files > tbody').tablesorter({
		dateFormat: "uk",
		sortList: [[3, 1]]
	});
}
