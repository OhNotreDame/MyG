function prepareGlobalNavBar()
{
	$("#globalNavBar").empty();
	$("#globalNavBar").append('<ul id="navUL">\
		<li>\
			<h1><a href="/mail/inbox.html">MyG</a></h1>\
		</li>\
		<li>\
				<a href="/mail/inbox.html" class="mailNav"><img id="mail-inboxNavIco" src="/nav/global/mail.png"  height="32" width="32" title="Inbox"/>&nbsp; Mail</a>\
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
		<li>\
			<a href="/pages/options.html" class="settingsNav"><img id="optionsNavIco" src="/nav/global/settings.png" height="32" width="32" title="Settings"/>&nbsp;Settings</a>\
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
			$("#toolNavBar").append('<ul id="navUL">\
				<li></li>\
				<li>\
					<a href="/mail/inbox.html" class="mail-inboxNav"><img id="mail-inboxNavIco" src="/nav/mail/inbox.png" title="Inbox"/>&nbsp; Inbox</a>\
				</li>\
				<li>\
					<a href="/mail/inbox.html?updates" class="mail-updatesNav"><img id="updateNavIco" src="/nav/mail/updates.png" title="Update"/>&nbsp;Updates</a>\
				</li>\
				<li>\
					<a href="/mail/inbox.html?social" class="mail-socialNav"><img id="socialNavIco" src="/nav/mail/social.png" title="Social"/>&nbsp;Social</a>\
				</li>\
				<li>\
					<a href="/mail/inbox.html?promotions" class="mail-promoNav"><img id="promoNavIco" src="/nav/mail/promotions.png" title="Promotions"/>&nbsp;Promotions</a>\
				</li>\
				<li>\
					<a href="/mail/inbox.html?forums" class="mail-forumNav"><img id="forumNavIco" src="/nav/mail/forums.png" title="Forums"/>&nbsp;Forums</a>\
				</li>\
				<li>\
					<a href="/mail/message.html?sent" class="mail-sentNav"><img id="sentNavIco" src="/nav/mail/sent.png" title="Sent"/>&nbsp;Sent</a>\
				</li>\
				<li>\
					<a href="/mail/message.html?trash" class="mail-trashNav"><img id="trashNavIco" src="/nav/mail/delete.png" title="Trash"/>&nbsp;Trash</a>\
				</li>\
				</ul>');
			$("#toolNavBar").show();
          break;
	  case 'drive':
			$("#toolNavBar").empty();
			$("#toolNavBar").append('<ul id="navUL">\
				<li></li>\
				<li>\
					<a href="/drive/mydrive.html" class="drive-myDriveNav"><img id="" src="/nav/drive/drive.png" title="MyDrive"/>&nbsp; MyDrive</a>\
				</li>\
				<li>\
					<a href="/drive/trash.html" class="drive-trashNav"><img id="" src="/nav/drive/delete.png" title="Trash"/>&nbsp;Trash</a>\
				</li>\
				');
			break;
	  case 'tasks':
			$("#toolNavBar").empty();
			$("#toolNavBar").append('<ul id="navUL">\
				<li></li>\
				<li>\
					<a href="/tasks/mytasks.html" class="tasks-myTasksNav"><img id="" src="/nav/tasks/tasks.png" title="MyTasks"/>&nbsp; MyTasks</a>\
				</li>\
				<li>\
					<a href="/tasks/trash.html" class="tasks-trashNav"><img id="" src="/nav/tasks/delete.png" title="Trash"/>&nbsp;Trash</a>\
				</li>\
				');
			break;
	  case 'contacts':
			$("#toolNavBar").empty();
			$("#toolNavBar").append('<ul id="navUL">\
				<li></li>\
				<li>\
					<a href="/contacts/mycontacts.html" class="contacts-myContactsNav"><img id="" src="/nav/contacts/contacts.png" title="MyContacts"/>&nbsp; MyContacts</a>\
				</li>\
				<li>\
					<a href="/contacts/trash.html" class="contacts-trashNav"><img id="" src="/nav/contacts/delete.png" title="Trash"/>&nbsp;Trash</a>\
				</li>\
				');
			break;
	}	
}