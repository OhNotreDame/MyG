/* On Window Load */
window.onload = function () {
     window.setTimeout(checkAuth, 1);
	 
	 document.getElementById("gotoparent")
     .addEventListener("click", goToParentFolder, false);
	 
	 
	 document.getElementById("uploadFile-upload-button")
     .addEventListener("click", uploadFile, false);	 
	 document.getElementById("uploadFile-close-button")
     .addEventListener("click", clearAndCloseUploadFileModal, false); 
	 
	 document.getElementById("newFolder-create-button")
     .addEventListener("click", newFolder, false); 
	 document.getElementById("newFolder-close-button")
     .addEventListener("click", clearAndCloseNewFolderModal, false); 
	 
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
				retrieveAllFiles("'root' in parents and trashed=false", 'user', 'drive', 'name', addFileToTable);
				getFolderMetatadata('root');
               break;
          default:
               retrieveAllFiles("'" + splitLoc[1] + "' in parents and trashed=false", 'user', 'drive', 'name', addFileToTable);
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
		retrieveAllFiles("mimeType = 'application/vnd.google-apps.folder'", 'user', 'drive', null, addFileToTable), addFileToTable; <=> return all folders  and add them to the table
		retrieveAllFiles("mimeType = 'application/vnd.google-apps.folder' and 'root' in parents and trashed=false", 'user', 'drive', null, addFileToTable); <=> return all root folders (not in trash)  and add them to the table
		retrieveAllFiles("'root' in parents and trashed=false", 'user', 'drive', null, addFileToTable);
	*/
}

/* addFileToTable() */
function addFileToTable(file) {
	
	//'fields': "id, name, mimeType, modifiedByMeTime, starred, shared"
	
	var isFolder = 0;
	
	if (file.mimeType == 'application/vnd.google-apps.folder'){isFolder = 1}

	 var dateString = file.modifiedTime;
     var date = new Date(dateString);
     var finalDate = date.toLocaleString("en-GB");
	
	
     $('#table-files > tbody').append(
          '<tr class="file_item" id="' + file.id + '">\
          <td><span id="isFolder-' + file.id + '" class="hidden" >'+isFolder+'</span></td>\
          <td><div id="fileIcons-' + file.id + '"></div></td>\
          <td><div id="fileTypeIcon-' + file.id + '"> <a id="file-' + file.id + '">' + file.name + '</a></td>\
          <td>' + finalDate + '</td>\
          </tr >');

		  
	 if (file.starred)
	 {
		   $('#fileIcons-' + file.id).append("<img src='img/star.png' height='24' width='24' title='Starred'/>&nbsp;&nbsp;");
	 }
	 
	 if (file.shared)
	 {
		   $('#fileIcons-' + file.id).append("<img src='img/shared.png' height='24' width='24' title='Shared'/>&nbsp;&nbsp;");
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
          $('#fileTypeIcon-' + file.id).prepend("<img src='img/mediaFile.png' height='24' width='24' title='" + fileType + "'/>");
          break;

     case 'image':
          $('#fileTypeIcon-' + file.id).prepend("<img src='img/imgFile.png' height='24' width='24' title='" + fileType + "'/>");
          break;

     case 'message':
          $('#fileTypeIcon-' + file.id).prepend("<img src='img/msgFile.png' height='24' width='24' title='" + fileType + "'/>");
          break;

     case 'text':
     default:
          $('#fileTypeIcon-' + file.id).prepend("<img src='img/file.png' height='24' width='24' title='" + fileType + "'/>");
          break;
     }
	 
	
     if (displayAppIcon) {
          switch (mimeCTobj.extension) {
          case 'vnd.google-apps.folder':
               $('#fileTypeIcon-' + file.id).prepend("<img src='img/folder.png' height='24' width='24' title='" + fileType + "'/>");
               break;
          case 'vnd.google-apps.document':
               $('#fileTypeIcon-' + file.id).prepend("<img src='img/googleDocs.png' height='24' width='24' title='" + fileType + "'/>");
               break;
          case 'vnd.google-apps.spreadsheet':
               $('#fileTypeIcon-' + file.id).prepend("<img src='img/googleSheets.png' height='24' width='24' title='" + fileType + "'/>");
               break;
          case 'vnd.google-apps.presentation':
               $('#fileTypeIcon-' + file.id).prepend("<img src='img/googleSlides.png' height='24' width='24' title='" + fileType + "'/>");
               break;
          case 'vnd.google-apps.video':
          case 'vnd.google-apps.audio':
               $('#fileTypeIcon-' + file.id).prepend("<img src='img/mediaFile.png' height='24' width='24' title='" + fileType + "'/>");
               break;
          case 'vnd.google-apps.photo':
               $('#fileTypeIcon-' + file.id).prepend("<img src='img/imgFile.png' height='24' width='24' title='" + fileType + "'/>");
               break;
          case 'pdf':
               $('#fileTypeIcon-' + file.id).prepend("<img src='img/pdfFile.png' height='24' width='24' title='" + fileType + "'/>");
               break;
          case 'vnd.ms-powerpoint':
          case 'vnd.openxmlformats-officedocument.presentationml.presentation':
               $('#fileTypeIcon-' + file.id).prepend("<img src='img/pptFile.png' height='24' width='24' title='" + fileType + "'/>");
               break;
          case 'vnd.visio':
               $('#fileTypeIcon-' + file.id).prepend("<img src='img/visioFile.png' height='24' width='24' title='" + fileType + "'/>");
               break;
          case 'vnd.word':
          case 'vnd.openxmlformats-officedocument.wordprocessingml.document':
               $('#fileTypeIcon-' + file.id).prepend("<img src='img/wordFile.png' height='24' width='24' title='" + fileType + "'/>");
               break;
          case 'vnd.ms-excel':
          case 'vnd.openxmlformats-officedocument.spreadsheetml.sheet':
               $('#fileTypeIcon-' + file.id).prepend("<img src='img/excelFile.png' height='24' width='24' title='" + fileType + "'/>");
               break;
          case 'octet-stream':
          case 'x-zip-compressed':
               $('#fileTypeIcon-' + file.id).prepend("<img src='img/zipFile.png' height='24' width='24' title='" + fileType + "'/>");
               break;   
			   
          default: //any other file type
               $('#fileTypeIcon-' + file.id).prepend("<img src='img/file.png' height='24' width='24' title='" + fileType + "'/>");
               break;
          }

     }

     /* Add js event handler on Email Subject */
     $('#file-' + file.id).on('click', function () {
          var redirectToURL = "";
          if (file.mimeType == "application/vnd.google-apps.folder") {
               redirectToURL = "mydrive.html?" + file.id;          
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
          sortList: [[0, 1],[1, 0]]
     });
}


function goToParentFolder()
{
	//alert("goToParentFolder() not implemented yet!")
	var parentId = $("#parent-folder-id").text();
	var redirectToURL = "mydrive.html?" + parentId;          
    document.location.href = redirectToURL;
}

/* uploadFile() */
function uploadFile()
{
	$('#uploadFile-upload-button').addClass('disabled');
	var parentId = $("#current-folder-id").text();

	var file = document.getElementById('uploadFile-file').files[0];
    if (file) {
        // create FileReader
        var reader = new FileReader();
		reader.readAsDataURL(file);
        reader.onloadend  = function(e) {			
			//when reader is fully loaded, call createFile()
			createFile(e.target.result, file.name, file.type, parentId, getCallResultAndShowMessage) 
			clearAndCloseUploadFileModal();			
        };
    }
}

/* newFolder() */
function newFolder()
{
	$('#newFolder-create-button').addClass('disabled');
	var folderName = "FolderCreatedByMyG";
	folderName = $("#newFolder-folderName").val();
	var parentId = $("#current-folder-id").text();
	
	createFolder(folderName, parentId, getCallResultAndShowMessage);
	clearAndCloseNewFolderModal();
}

function clearAndCloseNewFolderModal()
{
	$('#newFolder-modal').modal('hide');
	$('#newFolder-create-button').removeClass('disabled');
    $('#newFolder-folderName').val('');
}

function clearAndCloseUploadFileModal()
{
	$('#uploadFile-modal').modal('hide');
	$('#uploadFile-upload-button').removeClass('disabled');
    $('#uploadFile-uploadFile-file').val('');
}