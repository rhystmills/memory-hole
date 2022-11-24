import * as React from 'react';
import {useState, useEffect} from 'react';
// import {browser, Tabs} from 'webextension-polyfill-ts';
import {BlockedManager} from './BlockedManager';
import {Logo} from './Logo';
import {sendMessage} from './messaging';
import {Picker} from './Picker';
import {Selector, sites} from './Sites';

import './styles.scss';

// function openWebPage(url: string): Promise<Tabs.Tab> {
//   return browser.tabs.create({url});
// }

export type SiteSetting = {
  name: string;
  key: string;
  blocked: boolean;
  selectors: Selector[];
  hostname: string;
};
export type Block = {
  name: string;
  sites: SiteSetting[];
};

const Popup: React.FC = () => {
  const [blocked, setBlocked] = useState<Block[]>([] as Block[]);

  useEffect(() => {
    chrome.storage.local.get('blocked', (storedBlocked) => {
      console.log(storedBlocked);
      if (storedBlocked && storedBlocked.blocked) {
        console.log({blocked: storedBlocked.blocked});
        setBlocked(storedBlocked.blocked);
        sendMessage(storedBlocked.blocked);
      }
    });
  }, []);

  useEffect(() => {
    chrome.storage.local.set({blocked});
    sendMessage(blocked);
  }, [blocked]);

  const addToBlocked = (toBlock: string): void => {
    if (!blocked.find((block) => block.name === toBlock)) {
      const blockStructure = {
        name: toBlock,
        sites: sites.map((site) => {
          return {
            name: site.name,
            selectors: site.selectors,
            key: site.key,
            blocked: true,
            hostname: site.hostname,
          };
        }),
      } as Block;
      const newBlocked = [...blocked, blockStructure];
      setBlocked(newBlocked);
    }
  };

  const updateSitesForBlock = (
    blockName: string,
    siteSetting: SiteSetting
  ): void => {
    const block = blocked.find(
      (blockSearched) => blockSearched.name === blockName
    );
    if (block) {
      // Should always be true
      const siteToUpdate = block.sites.find(
        (siteSearched) => siteSearched.key === siteSetting.key
      );
      if (siteToUpdate) {
        siteToUpdate.blocked = siteSetting.blocked;
        chrome.storage.local.set({blocked});
      }
    }
  };

  const removeBlock = (blockName: string): void => {
    const newBlocked = blocked.filter((block) => block.name !== blockName);
    setBlocked(newBlocked);
  };

  return (
    <section id="popup">
      <header>
        <Logo />
      </header>
      <main>
        <BlockedManager
          blocked={blocked}
          updateSitesForBlock={updateSitesForBlock}
          removeBlock={removeBlock}
        />

        <Picker addToBlocked={addToBlocked} />
      </main>
    </section>
  );
};

export default Popup;
