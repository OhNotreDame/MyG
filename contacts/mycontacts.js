/* On Window Load */
window.onload = function () {
     prepareGlobalNavBar();
     prepareToolNavBar('contacts');
     window.setTimeout(checkAuth, 1);
}

/* Load Gmail API, and when it's done, call renderInbox */
function loadContactsAPI() {
     console.log("contacts/loadContactsAPI");
     //gapi.client.load('contacts', 'v3', renderContacts);
     retrieveContacts(1);
}

 
		  
function retrieveContacts(index) {
	
	var maxResults = 75;
	var startIndex = index
	if (index > 1)
	{
		startIndex = index * maxResults;	
	}
	
     var accessToken = gapi.auth.getToken().access_token;
     var contactsURL = "https://content.googleapis.com/m8/feeds/contacts/default/full?access_token=" + accessToken + "&alt=json&max-results="+ maxResults +"&start-index="+startIndex;
	 console.log(contactsURL);
     $.ajax({
          url: contactsURL,
          dataType: "jsonp",
          success: function (data) {
			  var results = JSON.stringify(data);
			  var obj = JSON.parse(results);
			   for (var i = 0; i < obj.feed.entry.length; i++) {
				   var curContact = obj.feed.entry[i];
				   var contactID = curContact.id.$t;
				   var contactName = curContact.title.$t;
				   var contactEmail = ""
				   var contactPhone = ""
				   
				   if ( curContact.gd$email != undefined)
				   {
						contactEmail = curContact.gd$email[0].address;
				   }
				   
				   if ( curContact.gd$phoneNumber != undefined)
				   {
						contactPhone = curContact.gd$phoneNumber[0].$t;
				   }
				    var contact = createContact(contactID, contactName, contactEmail, contactPhone);
					if(contactName) { addContactToTable(contact); }	

					if(startIndex)
					{
						//retrieveContacts(index+1);
					}
			   }
          },
          error: function (data) {
               console.log("Error while getting Contacts.");
          }
     });
}

function createContact(id, name, email, phone)
{
	var contact = {
               id: id.trim(),
               name: name.trim(),
               email: email.trim(),
               phone: phone.trim()
          };
	return contact;
}

function addContactToTable(contact) 
{
	  $('#table-contacts > tbody').append(
          '<tr class="contact_item" id="' + contact.id + '">\
          <td><div id="name"><a href="'+ contact.id + '">' + contact.name +'</a></div></td>\
          <td><div id="email">'+ contact.email +'</div></td>\
          <td><div id="phone">'+ contact.phone +'</div></td>\
          </tr >');
		  
		  
		  
	 /* Reinforce sort */
	 $('#table-contacts').tablesorter({
		  sortList: [[0, 0]]
	 });
}