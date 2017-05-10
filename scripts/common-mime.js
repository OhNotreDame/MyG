/**
 Return a parsed object of the mime content-type
 CONTENT-TYPE format
	Content-Type: application/javascript;charset=UTF-8
	[- Header -]: [<- type ->]/[<- extension ->] [; <charset>]
 
 Returned Object Structure:
	jsonMimeObj = {
               type: <string>,
               extension: <string>,
               charset: <string>
          };
*/

function parseMimeContentType(rawMimeType){
	var mimeContentType = rawMimeType.substring(rawMimeType.indexOf(":") + 1).trim();
	var regxt = /.+\/.+/g;
	var regxc = /(CHARSET|charset)\s*\=.*/g;
		
	var ctMimeObj = {
		   type: null,
		   extension: null,
		   charset: null
	  };	

	var p = mimeContentType.split(";");
	var t = p.forEach(function(node){
			if(regxt.test(node)){
				var ext = node.split("/");
					ctMimeObj.type = ext[0];
					ctMimeObj.extension = ext[1];
				}
			if(regxc.test(node)){
				c = node.split("=");
				ctMimeObj.charset = c[1];
				}
		})
	return ctMimeObj;
}
