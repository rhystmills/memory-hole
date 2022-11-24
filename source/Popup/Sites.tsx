import React, {ReactElement, useState} from 'react';
import type {SiteSetting} from './Popup';

const guardian = {
  name: 'The Guardian',
  key: 'guardian',
  selectors: [{string: '.fc-item__container', matchType: 'replace'}],
  hostname: 'theguardian.com',
};

const localhost = {
  name: 'localhost',
  key: 'localhost',
  selectors: [
    {string: '.example', matchType: 'replace'},
    {string: '.test', matchType: 'remove'},
  ],
  hostname: 'localhost',
};

const twitter = {
  name: 'Twitter',
  key: 'twitter',
  selectors: [{string: "article[data-testid='tweet']", matchType: 'remove'}],
  hostname: 'twitter.com',
};

export type Selector = {
  string: string;
  matchType: 'replace' | 'remove';
};

export type Site = {
  name: string;
  key: string;
  selectors: Selector[];
  hostname: string;
};

export const Site = ({
  site,
  updateSitesForBlock,
  blockName,
}: {
  site: SiteSetting;
  updateSitesForBlock: (blockName: string, siteSetting: SiteSetting) => void;
  blockName: string;
}): ReactElement => {
  const [on, setOn] = useState(site.blocked);

  const clickHandler = (): void => {
    const newOnValue = !on;
    setOn(newOnValue);
    updateSitesForBlock(blockName, {...site, blocked: newOnValue});
  };

  return (
    <button
      type="button"
      className="site"
      style={{
        backgroundColor: on ? 'antiquewhite' : '#fff5f2',
        color: on ? 'black' : 'rgba(0,0,0,0.5)',
      }}
      onClick={(): void => clickHandler()}
    >
      {site.name}
    </button>
  );
};

export const sites = [guardian, twitter];
