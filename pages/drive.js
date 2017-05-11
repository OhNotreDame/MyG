/* On Window Load */
window.onload = function () {
     window.setTimeout(checkAuth, 1);
	 
	 document.getElementById("gotoparent")
     .addEventListener("click", goToParentFolder, false);
	 
	 document.getElementById("uploadfile")
     .addEventListener("click", uploadFile, false);	 
	 
	 document.getElementById("createfolder")
     .addEventListener("click", newFolder, false);
}

/* Load Gmail API, and when it's done, call displayInbox */
function loadDriveAPI() {
     gapi.client.load('drive', 'v3', renderFiles);
}

/* renderFiles() */
function renderFiles() {
     console.log("drive/renderFiles");
     prepareGlobalNavBar();
     prepareToolNavBar('drive')
	 $('#table-files > tbody').empty();

     var curLoc = window.location.href;
     var splitLoc = curLoc.split("?");

     if (splitLoc.length == 2 && splitLoc[1]) {
          switch (splitLoc[1]) {
          case 'root':
               retrieveAllFiles("'root' in parents and trashed=false", 'user', 'drive', 'folder, name', addFileToTable);
			   getFolderMetatadata('root');
               break;
          default:
               retrieveAllFiles("'" + splitLoc[1] + "' in parents and trashed=false", 'user', 'drive', 'folder, name', addFileToTable);
			   getFolderMetatadata(splitLoc[1]);
               break;
          }
     } else {
			retrieveAllFiles("'root' in parents and trashed=false", 'user', 'drive', 'folder, name', addFileToTable);
			getFolderMetatadata('root');
     }

	 /**
		retrieveAllFiles ... query examples
		retrieveAllFiles("mimeType = 'application/pdf'", 'user', 'drive', null, addFileToTable); <=> return all pdf fukes and add them to the table
		retrieveAllFiles""mimeType = 'application/vnd.google-apps.folder'", 'user', 'drive', null, addFileToTable), addFileToTable; <=> return all folders  and add them to the table
		retrieveAllFiles("mimeType = 'application/vnd.google-apps.folder' and 'root' in parents and trashed=false", 'user', 'drive', null, addFileToTable); <=> return all root folders (not in trash)  and add them to the table
		retrieveAllFiles("'root' in parents and trashed=false", 'user', 'drive', null, addFileToTable);
	*/
}

/* addFileToTable() */
function addFileToTable(file) {
	
	//'fields': "id, name, mimeType, modifiedByMeTime, starred, shared"
	
	 var dateString = file.modifiedTime;
     var date = new Date(dateString);
     var finalDate = date.toLocaleString("en-GB");
	
	
     $('#table-files > tbody').append(
          '<tr class="file_item" id="row-' + file.id + '">\
          <td><div id="fileIcons-' + file.id + '"></div></td>\
          <td><div id="fileTypeIcon-' + file.id + '"> <a id="file-' + file.id + '">' + file.name + '</a></td>\
          <td>' + finalDate + '</td>\
          </tr >');

		  
	 if (file.starred)
	 {
		   $('#fileIcons-' + file.id).append("<img src='../img/drive/star.png' height='24' width='24' title='Starred'/>&nbsp;&nbsp;");
	 }
	 
	 if (file.shared)
	 {
		   $('#fileIcons-' + file.id).append("<img src='../img/drive/shared.png' height='24' width='24' title='Shared'/>&nbsp;&nbsp;");
	 }
	 
	
	 
	 
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
          $('#fileTypeIcon-' + file.id).prepend("<img src='../img/drive/mediaFile.png' height='24' width='24' title='" + fileType + "'/>");
          break;

     case 'image':
          $('#fileTypeIcon-' + file.id).prepend("<img src='../img/drive/imgFile.png' height='24' width='24' title='" + fileType + "'/>");
          break;

     case 'message':
          $('#fileTypeIcon-' + file.id).prepend("<img src='../img/drive/msgFile.png' height='24' width='24' title='" + fileType + "'/>");
          break;

     case 'text':
     default:
          $('#fileTypeIcon-' + file.id).prepend("<img src='../img/drive/file.png' height='24' width='24' title='" + fileType + "'/>");
          break;
     }
	 
	
     if (displayAppIcon) {
          switch (mimeCTobj.extension) {
          case 'vnd.google-apps.folder':
               $('#fileTypeIcon-' + file.id).prepend("<img src='../img/drive/folder.png' height='24' width='24' title='" + fileType + "'/>");
               break;
          case 'vnd.google-apps.document':
               $('#fileTypeIcon-' + file.id).prepend("<img src='../img/drive/googleDocs.png' height='24' width='24' title='" + fileType + "'/>");
               break;
          case 'vnd.google-apps.spreadsheet':
               $('#fileTypeIcon-' + file.id).prepend("<img src='../img/drive/googleSheets.png' height='24' width='24' title='" + fileType + "'/>");
               break;
          case 'vnd.google-apps.presentation':
               $('#fileTypeIcon-' + file.id).prepend("<img src='../img/drive/googleSlides.png' height='24' width='24' title='" + fileType + "'/>");
               break;
          case 'vnd.google-apps.video':
          case 'vnd.google-apps.audio':
               $('#fileTypeIcon-' + file.id).prepend("<img src='../img/drive/mediaFile.png' height='24' width='24' title='" + fileType + "'/>");
               break;
          case 'vnd.google-apps.photo':
               $('#fileTypeIcon-' + file.id).prepend("<img src='../img/drive/imgFile.png' height='24' width='24' title='" + fileType + "'/>");
               break;
          case 'pdf':
               $('#fileTypeIcon-' + file.id).prepend("<img src='../img/drive/pdfFile.png' height='24' width='24' title='" + fileType + "'/>");
               break;
          case 'vnd.ms-powerpoint':
          case 'vnd.openxmlformats-officedocument.presentationml.presentation':
               $('#fileTypeIcon-' + file.id).prepend("<img src='../img/drive/pptFile.png' height='24' width='24' title='" + fileType + "'/>");
               break;
          case 'vnd.visio':
               $('#fileTypeIcon-' + file.id).prepend("<img src='../img/drive/visioFile.png' height='24' width='24' title='" + fileType + "'/>");
               break;
          case 'vnd.word':
          case 'vnd.openxmlformats-officedocument.wordprocessingml.document':
               $('#fileTypeIcon-' + file.id).prepend("<img src='../img/drive/wordFile.png' height='24' width='24' title='" + fileType + "'/>");
               break;
          case 'vnd.ms-excel':
          case 'vnd.openxmlformats-officedocument.spreadsheetml.sheet':
               $('#fileTypeIcon-' + file.id).prepend("<img src='../img/drive/excelFile.png' height='24' width='24' title='" + fileType + "'/>");
               break;
          case 'octet-stream':
          case 'x-zip-compressed':
               $('#fileTypeIcon-' + file.id).prepend("<img src='../img/drive/zipFile.png' height='24' width='24' title='" + fileType + "'/>");
               break;   
			   
          default: //any other file type
               $('#fileTypeIcon-' + file.id).prepend("<img src='../img/drive/file.png' height='24' width='24' title='" + fileType + "'/>");
               break;
          }

     }

     /* Add js event handler on Email Subject */
     $('#file-' + file.id).on('click', function () {
          var redirectToURL = "";
          if (file.mimeType == "application/vnd.google-apps.folder") {
               redirectToURL = "drive.html?" + file.id;          
               document.location.href = redirectToURL;
          } 
		  else {
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


function goToParentFolder()
{
	//alert("goToParentFolder() not implemented yet!")
	var parentId = $("#parent-folder-id").text();
	var redirectToURL = "drive.html?" + parentId;          
    document.location.href = redirectToURL;
}


function uploadFile()
{
	alert("uploadFile() not implemented yet!")
}

/* newFolder() */
// create a new folder in the current location
// find a decent solution to type the name of the folder
function newFolder()
{
	//alert("newFolder() not implemented yet!")
	var folderName ="test-from-MyG";
	var parentId = $("#current-folder-id").text();
	createFolder(folderName, parentId, getCallResultAndShowMessage);
}

