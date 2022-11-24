export const sendMessage = (message: unknown): void => {
  chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
    const {id} = tabs[0];
    if (id) {
      chrome.tabs.sendMessage(id, message, (response) => {});
    }
  });
};
