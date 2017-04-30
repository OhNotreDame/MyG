function prepareToolbar()
{
	console.log("prepareToolbar");
	$("#navBar").empty();
	$("#navBar").append('<ul id="navUL" >\
		<li>\
			<a href="./inbox.html">Inbox</a>\
		</li>\
		<li>\
			<a href="./inbox.html?updates">Updates</a>\
		</li>\
		<li>\
			<a href="./inbox.html?social">Social</a>\
		</li>\
		<li>\
			<a href="./inbox.html?promotions">Promotions</a>\
		</li>\
		<li>\
			<a href="./inbox.html?forums">Forums</a>\
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