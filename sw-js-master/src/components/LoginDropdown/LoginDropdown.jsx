import React, { Component } from 'react';
import { translate } from 'react-polyglot';

import Link from '../Link';
import SvgIcon from '../SvgIcon';
import { links } from '../../lib/constants';

@translate()
class LoginDropdown extends Component {

  render() {
   const {
    t,    
    LoginText,
    onClickLogin,
   }= this.props;
   const loginDropdown = (
      process.env.REACT_APP_FEATURE_AUTH
      ?
      <Link fullWidth legend={LoginText} onClick={onClickLogin}>
        <SvgIcon name="user"/> {t('global.log-in')}
      </Link>
      :
      <Link fullWidth legend={LoginText} href={links.login()}>
        <SvgIcon name="user"/> {t('global.log-in')}
      </Link>
    );
    return loginDropdown
 }
}

export default LoginDropdown;
