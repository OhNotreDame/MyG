function prepareToolbar()
{
	console.log("prepareToolbar");
	$("#navBar").empty();
	$("#navBar").append('<ul id="navUL" >\
		<li>\
			<a href="./inbox.html">Inbox</a>\
		</li>\
		<li>\
			<a href="./updates.html">Updates</a>\
		</li>\
		<li>\
			<a href="./social.html">Social</a>\
		</li>\
		<li>\
			<a href="./promotions.html">Promotions</a>\
		</li>\
		<li>\
			<a href="./trash.html">Trash</a>\
		</li>\
		<li>\
			<a href="./drive.html">Drive</a>\
		</li>\
		</ul>');
	$("#toolbar").show();
}