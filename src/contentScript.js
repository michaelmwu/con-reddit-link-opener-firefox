var jquery_set_links;
var jquery_set_comments;

function fakeClick(obj) {
	var evObj = document.createEvent('MouseEvents');
	evObj.initEvent('mousedown', true, true);
	obj.dispatchEvent(evObj);
}

chrome.extension.onRequest.addListener( function( request, sender, sendResponse) {
	if (request.action == "openSelectedUrls")
	{	
		jquery_set_links = jQuery("#siteTable .even a.title");
		jquery_set_comments = jQuery("#siteTable .even a.comments");
		
		var data = Array();
		
		var i;
		for (i = 0; i < jquery_set_links.length; i++) {
			data.push(new Array(jquery_set_links[i].text, jquery_set_links[i].href, jquery_set_comments[i].href));
		}

		if (data.length > 0) {		
			sendResponse(data);
		}
	} else if (request.action == "scrapeInfoCompanionBar") {	
		fakeClick(jquery_set_links[request.index]);
	} else if (request.action == "updateSettings") {
		if (request.keyboardshortcut != request.oldkeyboardshortcut) {
			if (request.oldkeyboardshortcut) {
				shortcut.remove(request.oldkeyboardshortcut);
			}
			
			shortcut.add(request.keyboardshortcut, function() {
					chrome.extension.sendRequest({method: "keyboardShortcut"});
				}
			);	
		}
	}
});

chrome.extension.sendRequest({method: "getStatus"}, function(response) {		
	var KeyboardShortcut = response.status;	

	shortcut.add(KeyboardShortcut, function() {
			chrome.extension.sendRequest({method: "keyboardShortcut"}, function(response) {
			  console.log(response.farewell);
			});
		}
	);	
});