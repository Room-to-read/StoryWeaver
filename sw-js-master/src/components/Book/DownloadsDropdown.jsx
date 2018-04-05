import React from 'react';
import { translate } from 'react-polyglot';

import Link from '../Link';
import Dropdown from '../Dropdown';
import SvgIcon from '../SvgIcon';
import List from '../List';
import LoginDropdown from '../LoginDropdown';


const DownloadsDropdown = ({
  slug,
  level,
  language,
  userEmail,
  downloadLinks,
  isLoggedIn,
  onOpenModal,
  t,
  openAuthModal,
  recordBookDownload,
  recordBookDownloadPopUpOpened }) => {

  let listEl = null;
  
  if (!isLoggedIn) {
    listEl = <LoginDropdown LoginText={t('DownloadsDropdown.please-log-in')} 
                onClickLogin={() => openAuthModal()}
                />
  } else {
    const items = downloadLinks.map((downloadLink, i) => {
      // From Backend the download href comes only for Low-res download or if logged in user is content manager
      // If no download link comes from API(like in case of hi-res download for normal users), we will show Google Form pop up
      if (downloadLink.href)
      {return (
        <Link fullWidth
              href={downloadLink.href}
              shouldOpenNewPage={true}
              key={`download-link.${i}`}
              onClick={() => {
                recordBookDownload({slug, userEmail, level, language})
              }}
              >
          {downloadLink.type}
        </Link>
      );}
      else
      {
        return (
        <Link fullWidth onClick={() => {
          recordBookDownloadPopUpOpened({slug, userEmail, level, language})
          onOpenModal('download')
        }} key={`download-pop-up.${i}`} >
          {downloadLink.type}
        </Link>
      );
      }
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
