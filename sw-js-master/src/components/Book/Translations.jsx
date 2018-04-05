import React from 'react';
import { uniq } from 'lodash';

import CollapsibleSection from '../CollapsibleSection';
import Link from '../Link';
import List from '../List';
import Sizer from '../Sizer';
import LazyFontLoader from '../LazyFontLoader';

import { links } from '../../lib/constants';


export default ({ translations, versionCount, languageCount, offline, t }) => {
  let el = null;

    if (!offline && (translations && translations.length)) {
      const uniqueLanguages = uniq(translations.map(t => t.language));
      
      el = (
        <CollapsibleSection title={`${t('Book.available-in-version',versionCount)} ${t('Book.available-in-language',languageCount)}`}>
          <LazyFontLoader languages={uniqueLanguages} />
          <Sizer
            maxHeight="l"
            scrollY
          >
            <List>
              {
                translations.map((l, i) => {
                  return <Link
                           isInternal={true}
                           key={i}
                           href={links.bookDetails(l.slug)}
                         >
                           {i + 1}. {l.title} ({l.language} - L{l.level})
                        </Link>
                })
              }
            </List>
          </Sizer>
        </CollapsibleSection>
      );
    }

    return el;
};
