import React from 'react';
import { translate } from 'react-polyglot';

import Link from '../Link';
import Dropdown from '../Dropdown';
import SvgIcon from '../SvgIcon';
import List from '../List';
import { links } from '../../lib/constants';

const DownloadsDropdown = ({
  downloadLinks,
  isLoggedIn,
  t,
  openAuthModal,
  userEmail,
  slug,
  recordIllustrationDownload }) => {
  let listEl = null;
  
  if (!isLoggedIn) {
    listEl = (
      <Link
        fullWidth
        legend={t('illustrationDownloadsDropdown.please-log-in')}
        onClick={process.env.REACT_APP_FEATURE_AUTH ? openAuthModal : () => window.location.href = links.login() }
      >
        <SvgIcon name="user"/> {t('global.log-in')}
      </Link>
    );
  } else {
    const items = downloadLinks.map((downloadLink, i) => {
      return (
        <Link fullWidth
              href={downloadLink.href}
              shouldOpenNewPage={true}
              key={`download-link.${i}`}
              onClick={() => {
                recordIllustrationDownload({slug, userEmail, resolution: downloadLink.type})
              }} >
          {downloadLink.type}
        </Link>
      );
    });
    
    listEl = <List nowrap>{items}</List>;
  }

  return (
    <Dropdown
      toggleEl={<Link><SvgIcon name="download" size="m" pushRight/>{t('global.download', 1)}</Link>}
    >
      {listEl}
    </Dropdown>
  );
};

export default translate()(DownloadsDropdown);
