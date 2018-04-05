import React from 'react';
import Link from '../Link';
import Dropdown from '../Dropdown';
import SvgIcon from '../SvgIcon';
import Stat from '../Stat';
import { translate } from 'react-polyglot';

const Likes= ( {t , isliked, likesCount, onLike, isLoggedIn, openAuthModal, logInMsg} ) => {

  const likeEl = likesCount === 0? 
                    <Link onClick={isLoggedIn ? onLike: null}>
                      <SvgIcon name="heart-outline" size="m" pushRight/>
                      {t("global.like", 1)}
                    </Link>
                    :
                    <Stat
                      iconVariant="accent"
                      icon={isliked ? 'heart': 'heart-outline'}
                      value={likesCount}
                      onClick={isLoggedIn ? (!isliked ? onLike : null) : () => {}}/>
  
  if(isLoggedIn){
    return likeEl;
  } else {
    return (<Dropdown toggleEl={likeEl}>
              <Link fullWidth legend={logInMsg} onClick={openAuthModal}>
                <SvgIcon name="user"/> {t('global.log-in')}
              </Link>
            </Dropdown>);
  }

}

export default translate()(Likes);
