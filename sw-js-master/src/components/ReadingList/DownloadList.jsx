import React from 'react';
import { translate } from 'react-polyglot';

import Link from '../Link';
import Dropdown from '../Dropdown';
import SvgIcon from '../SvgIcon';

import { links } from '../../lib/constants';

const DownloadList = ({ isLoggedIn, t, slug, openAuthModal, onClick }) => {
  
  if (!isLoggedIn) {
    return ( 
      <Dropdown toggleEl={<Link><SvgIcon name="download" size="m" pushRight/>{t('global.download', 1)}</Link>} >
        <Link
          fullWidth
          legend={t('DownloadsDropdown.please-log-in')}
          onClick={process.env.REACT_APP_FEATURE_AUTH ? openAuthModal : () => window.location.href = links.login() }
        >
          <SvgIcon name="user"/> {t('global.log-in')}
        </Link>
      </Dropdown> 
    );
  } else {
    return (
      <Link 
        href={links.downloadList(slug)}
        shouldOpenNewPage 
        onClick={onClick}>
        <SvgIcon name="download" size="m" pushRight/>{t('global.download', 1)}
      </Link>
    );
  }

}

export default translate()(DownloadList);
