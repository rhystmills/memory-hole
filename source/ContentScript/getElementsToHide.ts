import {Block} from '../Popup/Popup';
import {Selector} from '../Popup/Sites';

export type ElementWithMatchType = {
  element: HTMLElement;
  matchType: string;
  debugMode: boolean;
};

const filterBlocksForSite = (blockedArray: Block[]): Block[] => {
  const docHostname = document.location.hostname;
  const filteredBlocks = blockedArray.map((block) => {
    return {
      ...block,
      sites: block.sites.filter((site) => {
        return docHostname.includes(site.hostname) && site.blocked;
      }),
    };
  });
  return filteredBlocks;
};

const getElementsThatMatchSelector = (
  selector: Selector,
  debugMode: boolean
): ElementWithMatchType[] => {
  return Array.from(
    document.querySelectorAll(selector.string) as NodeListOf<HTMLElement>
  ).map((element) => {
    return {
      element,
      matchType: selector.matchType,
      debugMode,
    };
  });
};

const filterElementsThatContainBlockPhrase = (
  elements: ElementWithMatchType[],
  blockPhrase: string
): ElementWithMatchType[] => {
  return elements.filter((element) =>
    element.element.innerText?.includes(blockPhrase)
  );
};

export const getElementsToHide = (
  selector: Selector,
  blockPhrase: string,
  debugMode: boolean
): ElementWithMatchType[] => {
  const elements = getElementsThatMatchSelector(selector, debugMode);
  console.log({elements});
  return filterElementsThatContainBlockPhrase(elements, blockPhrase);
};

export const getElementsForBlocks = (
  blocks: Block[]
): ElementWithMatchType[] => {
  const filteredBlocksForSite = filterBlocksForSite(blocks);
  console.log({filteredBlocksForSite});
  const elements = filteredBlocksForSite.flatMap((block) =>
    block.sites.flatMap((site) =>
      site.selectors.flatMap((selector) => {
        return getElementsToHide(selector, block.name, block.debugMode);
      })
    )
  );

  return elements;
};
