import {Block} from '../Popup/Popup';
import {
  hideElement,
  MatchAndReplacement,
  replaceTextUnderElement,
  replaceWithCat,
} from './elementModifiers';
import {ElementWithMatchType, getElementsForBlocks} from './getElementsToHide';

console.log('helloworld from content script');

let blocked = [] as Block[];

const getElementsForMatchType = (
  elementsWithMatchTypes: ElementWithMatchType[],
  matchType: string
): HTMLElement[] =>
  elementsWithMatchTypes
    .filter((element) => element.matchType === matchType)
    .map((element) => element.element);

const runTextReplacement = (): void => {
  const matchesAndReplacements = blocked.map((block): MatchAndReplacement => {
    return {
      match: block.name,
      replacement: block.textReplacement,
    };
  });

  replaceTextUnderElement(document, matchesAndReplacements);
};

const blockElements = (
  elementsWithMatchTypes: ElementWithMatchType[]
): void => {
  const debugElements = elementsWithMatchTypes.filter((el) => el.debugMode);
  const nonDebugElements = elementsWithMatchTypes.filter((el) => !el.debugMode);

  const elementsToRemoveDebug = getElementsForMatchType(
    debugElements,
    'remove'
  );
  const elementsToReplaceDebug = getElementsForMatchType(
    debugElements,
    'replace'
  );
  const elementsToReplace = getElementsForMatchType(
    nonDebugElements,
    'replace'
  );
  const elementsToRemove = getElementsForMatchType(nonDebugElements, 'remove');

  // FIXME: This process is additive. Removing the block won't unstyle already-styled elements
  elementsToReplaceDebug.forEach((element) => {
    element.style.setProperty('outline', '2px solid green');
  });
  elementsToRemoveDebug.forEach((element) => {
    element.style.setProperty('outline', '2px solid red');
  });
  elementsToReplace.forEach((element) => {
    replaceWithCat(element);
  });
  elementsToRemove.forEach((element) => {
    hideElement(element);
  });
};

chrome.storage.local.get('blocked', (storedBlocked) => {
  //   console.log({blocks: storedBlocked.blocked});
  blocked = storedBlocked.blocked as Block[];

  const elementsWithMatchTypes = getElementsForBlocks(blocked);
  blockElements(elementsWithMatchTypes);
  runTextReplacement();
});

chrome.runtime.onMessage.addListener((message) => {
  blocked = message;

  const elementsWithMatchTypes = getElementsForBlocks(blocked);
  blockElements(elementsWithMatchTypes);
});

setInterval(() => {
  const elementsWithMatchTypes = getElementsForBlocks(blocked);
  blockElements(elementsWithMatchTypes);

  runTextReplacement();
}, 1000);

export {};

// 1. Actually hide elements
// 2. replace with kittens?
// 3. Also make twitter work
// 4. Text replace too!
// 5. Image replace??
// 6. Dropdown for options. E.g. highlight blocked images, hide them, replace them etc.
