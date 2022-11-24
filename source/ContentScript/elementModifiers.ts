import {quotes} from './inspirationalQuote';

export const hideElement = (element: HTMLElement): void => {
  element.style.setProperty('display', 'none');
};

export const replaceWithCat = (element: HTMLElement): void => {
  Array.from(element.children).forEach(
    (child) => ((child as HTMLElement).style.display = 'none')
  );
  const height = element.offsetHeight;
  const width = element.offsetWidth;
  const img = document.createElement('img');
  img.src = `http://placekitten.com/${width}/${height}`;
  img.style.setProperty('z-index', '2147483645');
  const span = document.createElement('span');
  span.innerHTML = quotes[Math.floor(Math.random() * quotes.length)];
  span.setAttribute(
    'style',
    'font-family: "American Typewriter"; font-size: 20px; font-weight: 600; color: white; z-index: 2147483646; position: absolute; padding: 10px; text-shadow: 0px 0px 2px black;'
  );
  element.appendChild(img);
  element.appendChild(span);
};

type Options = {
  inspect?: (n: Node) => boolean;
  collect?: (n: Node) => boolean;
  callback?: (n: Node) => boolean;
};
// Borrowed from sphinxxxx https://gist.github.com/Sphinxxxx/ed372d176c5c2c1fd9ea1d8d6801989b
const walkNodeTree = (root: Node, options?: Options): Node[] => {
  const internalOptions = options || ({} as Options);

  const inspect = internalOptions.inspect || ((): boolean => true);
  const collect = internalOptions.collect || ((): boolean => true);
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_ALL, {
    acceptNode(node) {
      if (!inspect(node)) {
        return NodeFilter.FILTER_REJECT;
      }
      if (!collect(node)) {
        return NodeFilter.FILTER_SKIP;
      }
      return NodeFilter.FILTER_ACCEPT;
    },
  });

  const nodes = [];
  let n;
  // eslint-disable-next-line no-cond-assign
  while ((n = walker.nextNode())) {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    internalOptions.callback && internalOptions.callback(n);
    nodes.push(n);
  }

  return nodes;
};

// Borrowed from sphinxxxx https://gist.github.com/Sphinxxxx/ed372d176c5c2c1fd9ea1d8d6801989b
const textNodesUnder = (el: Node): Text[] => {
  return walkNodeTree(el, {
    inspect: (n) => !['STYLE', 'SCRIPT'].includes(n.nodeName),
    collect: (n) => n.nodeType === Node.TEXT_NODE,
    // callback: n => console.log(n.nodeName, n),
  }) as Text[];
};

export type MatchAndReplacement = {
  match: string;
  replacement: string;
};

export const replaceTextUnderElement = (
  el: Node,
  matchesAndReplacements: MatchAndReplacement[]
): void => {
  const textNodes = textNodesUnder(el);
  console.log({textNodes});
  textNodes.forEach((textNode) => {
    const oldText = textNode.nodeValue;
    let newText = oldText;
    matchesAndReplacements.forEach((matchAndReplacement) => {
      if (newText && matchAndReplacement.replacement) {
        newText = newText.replaceAll(
          matchAndReplacement.match,
          matchAndReplacement.replacement
        );
      }
      textNode.nodeValue = newText;
    });
  });
};
