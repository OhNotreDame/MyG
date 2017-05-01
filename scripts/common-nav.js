function prepareToolbar()
{
	console.log("prepareToolbar");
	$("#headerNavBar").empty();
	$("#headerNavBar").append('<ul id="navUL" >\
		<li>\
			<h1><a href="./inbox.html">MyG</a></h1>\
		</li>\
		<li>\
			<a href="./inbox.html" class="inboxNav"><img id="inboxNavIco" src="../img/inbox.png" title="Inbox"/>&nbsp; Inbox</a>\
		</li>\
		<li>\
			<a href="./inbox.html?updates" class="updatesNav"><img id="updateNavIco" src="../img/updates.png" title="Update"/>&nbsp;Updates</a>\
		</li>\
		<li>\
			<a href="./inbox.html?social" class="socialNav"><img id="socialNavIco" src="../img/social.png" title="Social"/>&nbsp;Social</a>\
		</li>\
		<li>\
			<a href="./inbox.html?promotions" class="promoNav"><img id="promoNavIco" src="../img/promotions.png" title="Promotions"/>&nbsp;Promotions</a>\
		</li>\
		<li>\
			<a href="./inbox.html?forums" class="forumNav"><img id="forumNavIco" src="../img/forums.png" title="Forums"/>&nbsp;Forums</a>\
		</li>\
		<li>\
			<a href="./trash.html" class="trashNav"><img id="trashNavIco" src="../img/delete.png" title="Trash"/>&nbsp;Trash</a>\
		</li>\
		<li>\
			<a href="./drive.html" class="driveNav"><img id="driveNavIco" src="../img/drive.png" title="Drive"/>&nbsp;Drive</a>\
		</li>\
		</ul>');
	$("#headerNavBar").show();
}