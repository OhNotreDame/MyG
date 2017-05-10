/* On Window Load */
window.onload = function () {
	prepareToolbar();
	
	//var rawMimeContentType = "Content-Type: application/javascript;charset=UTF-8";
	var rawMimeContentType = "Content-Type: image/jpg;charset=UTF-8;other=ABC";
	$('#rawMimeContentType').text(rawMimeContentType);
	$('#rawMimeContentType').show();
	
	var mimeCTobj = parseMimeContentType(rawMimeContentType);
	$('#mimeType').text(mimeCTobj.type);
	$('#mimeType').show();
	
	$('#mimeExtension').text(mimeCTobj.extension);
	$('#mimeExtension').show();	
	
	$('#mimeCharset').text(mimeCTobj.charset);
	$('#mimeCharset').show();

}