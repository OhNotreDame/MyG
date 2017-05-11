# MyG

### About
MyG is about working with Google APIs directly from a Google Extension.
This extension is capable of getting data from [Gmail API v1](https://developers.google.com/gmail/api/v1/reference/), [Drive API v3](https://developers.google.com/drive/v3/reference/), [Tasks API v1](https://developers.google.com/google-apps/tasks/v1/reference/) and very soon [Contacts v3](https://developers.google.com/google-apps/contacts/v3/reference).
  
I'm not an expert (trust me I'm an engineer), I mainly work with SharePoint, discovering non MS technologies is very challenging.
I can promise that there will be a ton of mistakes, hiccups and even non-sense. Feel free to show the (right) way.

### Google APIs

#### Enabling Google APIs
1. Open the [Google Developer Console](https://console.developers.google.com)
2. Create a new Project
3. Create a new set of Credentials :
    1. Create a new API Key
    2. Create a new OAuth 2.0 client IDs (I used Chrome App, it seems to be enough)
4. From the dashboard, enable the Google API for Drive and Gmail.

#### Loading API (Example for Google Tasks)
```js
gapi.client.load('tasks', 'v1', renderTasks);
```

### Documentation
I'll do my best to document the "why?".
  
You will find more information in the wiki pages :
- [Folder Structure](https://github.com/OhNotreDame/MyG/wiki/Folder-Structure)
- [Mail features](https://github.com/OhNotreDame/MyG/wiki/Mail)
- [Drive features](https://github.com/OhNotreDame/MyG/wiki/Drive)
- [Tasks features](https://github.com/OhNotreDame/MyG/wiki/Tasks)
- [Contacts features](https://github.com/OhNotreDame/MyG/wiki/Contacts)


### References
1. [jquery](https://jquery.com/)
2. [bootstrap](http://getbootstrap.com/)
3. [tablesorter](http://tablesorter.com/)
4. [Icons DB](http://www.iconsdb.com/)
5. [Icons 8](https://icons8.com/web)


### Inspired by
I look after this article https://www.sitepoint.com/mastering-your-inbox-with-gmail-javascript-api/ 
  
I had to made some changes to make sure it was working with the Google Chrome Extension.



Stay tuned.

Et gros bisous,

Ju!

