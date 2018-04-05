import React from 'react';
import { translate } from 'react-polyglot';

import Link from '../Link';
import './Publisher.scss';


const Publisher = ({ publisher, t, offline }) => {
  const {
    slug,
    name,
    logo
  } = publisher;
const baseClassName = 'pb-publisher';

  // When the story is published by StoryWeaver Community then the slug will be null.
  let publisherLogo;
  let publisherName;
  let imageTag = <img
                  className={`${baseClassName}__publisher-logo`}
                  src={logo} 
                  alt={`${t("global.logo-of")} ${name}`}
                  disabled={offline}
                  />
  if (slug) {
    publisherLogo = <Link isInternal href={`/publishers/${slug}`}>
                     {imageTag}
                    </Link>
    publisherName = <p>{t('global.published-by')} <Link isInternal disabled={offline} href={`/publishers/${slug}`}>{name}</Link></p>
  } else {
    publisherLogo = imageTag
    publisherName = <p>{t('global.published-by')} {name}</p>
  }
  return (
    <div className={`${baseClassName}`}>
      {publisherLogo}
      {publisherName}
    </div>
    );
};

export default translate()(Publisher);
