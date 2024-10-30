chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ 
    blockedWebsites: ["facebook.com", "twitter.com", "instagram.com"],
    isFocusModeEnabled: false,
    schedules: []
  });
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    chrome.storage.sync.get(['blockedWebsites', 'isFocusModeEnabled'], (result) => {
      if (result.isFocusModeEnabled) {
        const blockedWebsites = result.blockedWebsites || [];
        const isBlocked = blockedWebsites.some(site => tab.url.includes(site));
        if (isBlocked) {
          chrome.tabs.update(tabId, { url: chrome.runtime.getURL("blocked.html") });
        }
      }
    });
  }
});

chrome.webRequest.onBeforeRequest.addListener(
  function(details) {
    return { cancel: true };
  },
  { urls: [
    "*://*.doubleclick.net/*",
    "*://*.googlesyndication.com/*",
    "*://*.googleadservices.com/*",
    "*://*.moatads.com/*",
    "*://*.adnxs.com/*"
  ]},
  ["blocking"]
);

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name.startsWith('schedule_')) {
    chrome.notifications.create({
      type: 'basic',
      iconUrl: 'icon128.png',
      title: 'Mewitsu Schedule Reminder',
      message: alarm.name.split('_')[1],
      priority: 2
    });
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "setSchedule") {
    request.schedule.forEach((item) => {
      chrome.alarms.create(`schedule_${item.task}`, {
        when: new Date(item.time).getTime()
      });
    });
    sendResponse({status: "Schedule set successfully"});
  }
  return true;
});