import React from 'react';
import Dropdown from "../Dropdown";
import LoginDropdown from '../LoginDropdown';

const AuthDropdown = ({ t, openAuthModal, toggleEl, baseClassName, loginText }) => (
  <div className={`${baseClassName}__auth-dropdown`}>
    <Dropdown toggleEl = {toggleEl}>
      <LoginDropdown LoginText={loginText} onClickLogin={ openAuthModal } />
    </Dropdown>
  </div>
);

export default AuthDropdown;