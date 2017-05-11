function prepareGlobalNavBar()
{
	$("#globalNavBar").empty();
	$("#globalNavBar").append('<ul id="navUL" >\
		<li>\
			<h1><a href="/mail/inbox.html">MyG</a></h1>\
		</li>\
		<li>\
				<a href="/mail/inbox.html" class="mailNav"><img id="inboxNavIco" src="/nav/global/mail.png"  height="32" width="32" title="Inbox"/>&nbsp; Mail</a>\
				</li>\
		<li>\
			<a href="/drive/mydrive.html" class="driveNav"><img id="driveNavIco" src="/nav/global/drive.png" height="32" width="32" title="Drive"/>&nbsp;Drive (Beta)</a>\
		</li>\
		<li>\
			<a href="/tasks/mytasks.html" class="tasksNav"><img id="tasksNavIco" src="/nav/global/tasks.png" height="32" width="32" title="Tasks"/>&nbsp;Tasks</a>\
		</li>\
		<li>\
			<a href="/contacts/mycontacts.html" class="contactsNav"><img id="contactsNavIco" src="/nav/global/contacts.png" height="32" width="32" title="Tasks"/>&nbsp;Contacts</a>\
		</li>\
		</ul>');
	$("#globalNavBar").show();
}


function prepareToolNavBar(toolName)
{
	
	switch (toolName) {
     default :
	 case 'mail':
			$("#toolNavBar").empty();
			$("#toolNavBar").append('<ul id="navUL" >\
				<li></li>\
				<li>\
					<a href="/mail/inbox.html" class="inboxNav"><img id="inboxNavIco" src="/nav/mail/inbox.png" title="Inbox"/>&nbsp; Inbox</a>\
				</li>\
				<li>\
					<a href="/mail/inbox.html?updates" class="updatesNav"><img id="updateNavIco" src="/nav/mail/updates.png" title="Update"/>&nbsp;Updates</a>\
				</li>\
				<li>\
					<a href="/mail/inbox.html?social" class="socialNav"><img id="socialNavIco" src="/nav/mail/social.png" title="Social"/>&nbsp;Social</a>\
				</li>\
				<li>\
					<a href="/mail/inbox.html?promotions" class="promoNav"><img id="promoNavIco" src="/nav/mail/promotions.png" title="Promotions"/>&nbsp;Promotions</a>\
				</li>\
				<li>\
					<a href="/mail/inbox.html?forums" class="forumNav"><img id="forumNavIco" src="/nav/mail/forums.png" title="Forums"/>&nbsp;Forums</a>\
				</li>\
				<li>\
					<a href="/mail/trash.html" class="trashNav"><img id="trashNavIco" src="/nav/mail/delete.png" title="Trash"/>&nbsp;Trash</a>\
				</li>\
				</ul>');
			$("#toolNavBar").show();
          break;
	  case 'drive':
			$("#toolNavBar").empty();
			$("#toolNavBar").append('<ul id="navUL" ><li><span> Drive Navigation to be defined </span></li></ul>');
			break;
	  case 'tasks':
			$("#toolNavBar").empty();
			$("#toolNavBar").append('<ul id="navUL" ><li><span> Tasks Navigation to be defined </span></li></ul>');
			break;
	  case 'contacts':
			$("#toolNavBar").empty();
			$("#toolNavBar").append('<ul id="navUL" ><li><span> Contacts Navigation to be defined </span></li></ul>');
			break;
	}	
}