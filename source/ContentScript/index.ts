import {Block} from '../Popup/Popup';
import {ElementWithMatchType, getElementsForBlocks} from './getElementsToHide';

console.log('helloworld from content script');

let blocked = [] as Block[];

type BlockedElements = {
  remove: Element[];
  replace: Element[];
};

const getElementsForMatchType = (
  elementsWithMatchTypes: ElementWithMatchType[],
  matchType: string
): HTMLElement[] =>
  elementsWithMatchTypes
    .filter((element) => element.matchType === matchType)
    .map((element) => element.element);

const blockElements = (
  elementsWithMatchTypes: ElementWithMatchType[]
): void => {
  const elementsToReplace = getElementsForMatchType(
    elementsWithMatchTypes,
    'replace'
  );
  const elementsToRemove = getElementsForMatchType(
    elementsWithMatchTypes,
    'remove'
  );
  // FIXME: This process is additive. Removing the block won't unstyle already-styled elements
  elementsToReplace.forEach((element) => {
    element.style.setProperty('outline', '2px solid green');
    // element.style.setProperty('visibility', 'hidden');
  });
  elementsToRemove.forEach((element) => {
    element.style.setProperty('outline', '2px solid red');
    // element.style.setProperty('visibility', 'hidden');
  });
};

chrome.storage.local.get('blocked', (storedBlocked) => {
  //   console.log({blocks: storedBlocked.blocked});
  blocked = storedBlocked.blocked as Block[];

  const elementsWithMatchTypes = getElementsForBlocks(blocked);
  blockElements(elementsWithMatchTypes);
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  blocked = message;

  const elementsWithMatchTypes = getElementsForBlocks(blocked);
  blockElements(elementsWithMatchTypes);
});

export {};

// 1. Actually hide elements
// 2. replace with kittens?
// 3. Also make twitter work
// 4. Text replace too!
// 5. Image replace??
// 6. Dropdown for options. E.g. highlight blocked images, hide them, replace them etc.
