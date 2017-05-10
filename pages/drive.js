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

     if (splitLoc.length == 2 && splitLoc[1]) {
          switch (splitLoc[1]) {
          case 'root':
               retrieveAllFiles("'root' in parents and trashed=false", 'user', 'drive', null);
               break;
          default:
               retrieveAllFiles("'" + splitLoc[1] + "' in parents and trashed=false", 'user', 'drive', null);
               break;
          }
     } else {
          retrieveAllFiles("'root' in parents and trashed=false", 'user', 'drive', null);
     }

     //retrieveAllFiles("mimeType = 'application/pdf'", 'user', 'drive', null); <=> return all pdf fukes
     //retrieveAllFiles""mimeType = 'application/vnd.google-apps.folder'", 'user', 'drive', null); <=> return all folders
     //retrieveAllFiles("mimeType = 'application/vnd.google-apps.folder' and 'root' in parents and trashed=false", 'user', 'drive', null); <=> return all root folders (not in trash)
     //retrieveAllFiles("'root' in parents and trashed=false", 'user', 'drive', null);
}

function retrieveAllFiles(q, corpora, spaces, orderBy) {
     var retrievePageOfFiles = function (request, result) {
          request.execute(function (resp) {
               result = result.concat(resp.files);
               var nextPageToken = resp.nextPageToken;
               if (nextPageToken) {
                    request = gapi.client.drive.files.list({
                              'key': apiKEY,
                              'pageToken': nextPageToken,
                              'q': q,
                              'corpora': corpora,
                              'spaces': spaces,
                              'orderBy': orderBy
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
               'orderBy': orderBy
          });
     retrievePageOfFiles(initialRequest, []);
}

/* parseFiles() */
function parseFiles(files) {

     var filesCount = files.length;
     console.log(filesCount);
     for (var i = 0; i < filesCount; i++) {
          var curFile = files[i]
               addFileToTable(curFile);
     }

}

/* getFile() */
function getFile(fileId) {
     var request = gapi.client.drive.files.get({
               'fileId': fileId
          });
     request.execute(function (resp) {
          addFileToTable(resp);
     });
}

/* downloadFile() */
function downloadFile(fileId, fileName, fileType) {
     console.log("downloadFile: " + fileId + " - " + fileName + " - " + fileType);
	 var xhr = new XMLHttpRequest();
	 var fileDownloadUrl = "https://www.googleapis.com/drive/v3/files/" + fileId + "?alt=media"

     var accessToken = gapi.auth.getToken().access_token; // get gapi authentication token
     
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
     console.log("exportFile: " + fileId + " - " + fileName + " - " + mimeType);

	 var xhr = new XMLHttpRequest();
	 var fileDownloadUrl = "https://content.googleapis.com/drive/v3/files/" + fileId + "/export?mimeType="+mimeType
     var accessToken = gapi.auth.getToken().access_token; // get gapi authentication token
     
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


/* addFileToTable() */
function addFileToTable(file) {
     $('#table-files > tbody').append(
          '<tr class="file_item" id="row-' + file.id + '">\
          <td><div id="fileIcon-' + file.id + '"></td>\
          <td>\
          <a id="file-' + file.id + '">' +
          file.name +
          '</a></td>\
          <td>' + file.id + '</td>\
          <td>' + file.mimeType + '</td>\
          </tr >');

     // render icon (https://icons8.com) based on file type
     var fileType = file.mimeType;
     var mimeCTobj = parseMimeContentType(fileType);
     var displayAppIcon = false;

     switch (mimeCTobj.type) {
     case 'application':
          displayAppIcon = true;
          break;

     case 'audio':
     case 'music':
     case 'video':
          $('#fileIcon-' + file.id).append("<img src='../img/drive/mediaFile.png' height='24' width='24' title='" + fileType + "'/>");
          break;

     case 'image':
          $('#fileIcon-' + file.id).append("<img src='../img/drive/imgFile.png' height='24' width='24' title='" + fileType + "'/>");
          break;

     case 'message':
          $('#fileIcon-' + file.id).append("<img src='../img/drive/msgFile.png' height='24' width='24' title='" + fileType + "'/>");
          break;

     case 'text':
     default:
          $('#fileIcon-' + file.id).append("<img src='../img/drive/file.png' height='24' width='24' title='" + fileType + "'/>");
          break;
     }

     if (displayAppIcon) {
          switch (mimeCTobj.extension) {
          case 'vnd.google-apps.folder':
               $('#fileIcon-' + file.id).append("<img src='../img/drive/folder.png' height='24' width='24' title='" + fileType + "'/>");
               break;
          case 'vnd.google-apps.document':
               $('#fileIcon-' + file.id).append("<img src='../img/drive/googleDocs.png' height='24' width='24' title='" + fileType + "'/>");
               break;
          case 'vnd.google-apps.spreadsheet':
               $('#fileIcon-' + file.id).append("<img src='../img/drive/googleSheets.png' height='24' width='24' title='" + fileType + "'/>");
               break;
          case 'vnd.google-apps.presentation':
               $('#fileIcon-' + file.id).append("<img src='../img/drive/googleSlides.png' height='24' width='24' title='" + fileType + "'/>");
               break;
          case 'vnd.google-apps.video':
          case 'vnd.google-apps.audio':
               $('#fileIcon-' + file.id).append("<img src='../img/drive/mediaFile.png' height='24' width='24' title='" + fileType + "'/>");
               break;
          case 'vnd.google-apps.photo':
               $('#fileIcon-' + file.id).append("<img src='../img/drive/imgFile.png' height='24' width='24' title='" + fileType + "'/>");
               break;
          case 'pdf':
               $('#fileIcon-' + file.id).append("<img src='../img/drive/pdfFile.png' height='24' width='24' title='" + fileType + "'/>");
               break;
          case 'vnd.ms-powerpoint':
               $('#fileIcon-' + file.id).append("<img src='../img/drive/pptFile.png' height='24' width='24' title='" + fileType + "'/>");
               break;
          case 'vnd.visio':
               $('#fileIcon-' + file.id).append("<img src='../img/drive/visioFile.png' height='24' width='24' title='" + fileType + "'/>");
               break;
          case 'vnd.word':
          case 'vnd.openxmlformats-officedocument.wordprocessingml.document':
               $('#fileIcon-' + file.id).append("<img src='../img/drive/wordFile.png' height='24' width='24' title='" + fileType + "'/>");
               break;
          case 'vnd.ms-excel':
               $('#fileIcon-' + file.id).append("<img src='../img/drive/excelFile.png' height='24' width='24' title='" + fileType + "'/>");
               break;
          default: //any other file type
               $('#fileIcon-' + file.id).append("<img src='../img/drive/file.png' height='24' width='24' title='" + fileType + "'/>");
               break;
          }

     }

     /* Add js event handler on Email Subject */
     $('#file-' + file.id).on('click', function () {
          var redirectTo = "";
          var redirectToURL = "";
          if (file.mimeType == "application/vnd.google-apps.folder") {
               redirectTo = "folder"
                    redirectToURL = "drive.html?" + file.id;
               console.log("redirectTo:" + redirectTo + " # " + file.name);
               console.log("redirectToURL:" + redirectToURL);
               document.location.href = redirectToURL;
          } else {
               redirectTo = "file"
			   
			   switch (file.mimeType)
			   {

				   case 'application/vnd.google-apps.document':
				        exportFile(file.id, file.name, "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "docx");
				        break;

				   case 'application/vnd.google-apps.presentation':
				        exportFile(file.id, file.name, "application/vnd.openxmlformats-officedocument.presentationml.presentation", "pptx");
				        break;

				   case 'application/vnd.google-apps.spreadsheet':
				        exportFile(file.id, file.name, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "xlsx");
				        break;

				   default:
				        downloadFile(file.id, file.name, file.mimeType);
				        break;
			   }
                    
               
          }

     });

     /* Reinforce sort */
     $('#table-files').tablesorter({
          sortList: [[1, 0]]
     });
}