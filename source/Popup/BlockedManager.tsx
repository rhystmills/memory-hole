import React, {ReactElement} from 'react';
import type {Block, SiteSetting} from './Popup';
import {Site, sites} from './Sites';

const CloseIcon = (): ReactElement => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
    <path d="M12.65 43.25q-2 0-3.375-1.35T7.9 38.55V10.9H5V6.2h11.55V3.8H31.4v2.4H43v4.7h-2.9v27.65q0 1.95-1.4 3.325-1.4 1.375-3.35 1.375Zm22.7-32.35h-22.7v27.65h22.7ZM17.7 34.65h3.85V14.7H17.7Zm8.75 0h3.9V14.7h-3.9ZM12.65 10.9v27.65Z" />
  </svg>
);

export const BlockedManager = ({
  blocked,
  updateSitesForBlock,
  removeBlock,
}: {
  blocked: Block[];
  updateSitesForBlock: (blockName: string, siteSetting: SiteSetting) => void;
  removeBlock: (blockName: string) => void;
}): ReactElement => {
  console.log(blocked);
  return (
    <section className="blocked">
      {blocked.map((block) => (
        <div key={block.name} className="block">
          <header>
            <h2>&quot;{block.name}&quot;</h2>
            <button
              type="button"
              onClick={(): void => {
                removeBlock(block.name);
              }}
            >
              <CloseIcon />
            </button>
          </header>
          <table>
            <tbody>
              <tr>
                <th>Websites</th>
                <td>
                  {block.sites.map((site) => (
                    <Site
                      site={site}
                      key={site.key}
                      updateSitesForBlock={updateSitesForBlock}
                      blockName={block.name}
                    />
                  ))}
                </td>
              </tr>
              <tr>
                <th>Text replace</th>
                <td>Input to replace the match</td>
              </tr>
              <tr>
                <th>Replace images</th>
                <td>tickbox</td>
              </tr>
            </tbody>
          </table>
        </div>
      ))}
    </section>
  );
};
