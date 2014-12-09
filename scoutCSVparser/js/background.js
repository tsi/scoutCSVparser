chrome.extension.onMessage.addListener(
  function(request, sender, sendResponse) {
  	chrome.pageAction.show(sender.tab.id);
    sendResponse();
  }
);

chrome.pageAction.onClicked.addListener(function(tab) {
  chrome.tabs.executeScript(null, { file: "js/jquery.min.js" }, function() {
    chrome.tabs.executeScript(null, { file: "js/jquery-csv.min.js" }, function() {
      chrome.tabs.executeScript(null, { file: "js/csv-parser.js" });
    });
  });
});

