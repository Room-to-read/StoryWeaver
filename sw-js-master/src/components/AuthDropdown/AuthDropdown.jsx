import React from 'react';
import Dropdown from "../Dropdown";
import LoginDropdown from '../LoginDropdown';

const AuthDropdown = ({ t, openAuthModal, toggleEl, baseClassName }) => (
  <div className={`${baseClassName}__auth-dropdown`}>
    <Dropdown toggleEl = {toggleEl}>
      <LoginDropdown LoginText={t('LikeDropdown.please-log-in')} 
        onClickLogin={ openAuthModal } />
    </Dropdown>
  </div>
);

export default AuthDropdown;