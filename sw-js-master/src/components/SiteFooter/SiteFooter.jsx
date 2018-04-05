/* eslint-disable jsx-a11y/alt-text */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-polyglot';

import SvgIcon from '../SvgIcon';
import Grid from '../Grid';
import List from '../List';
import Link from '../Link';
import CollapsibleSection from '../CollapsibleSection';
import SocialLinks from '../SocialLinks';
import Columnizer from '../Columnizer';
import TextField from '../TextField';
import Button from '../Button';
import SelectField from '../SelectField';
import Sizer from '../Sizer';

import './SiteFooter.scss';

// The keys of this object will be used fetch corresponding
// i18n translation string
const staticLinks = {
  "global.about": {
    "global.about-us": "/about",
    "global.story-weaver-and-you": "/story_weaver_and_you",
    "global.our-supporters": "/our_supporters",
    "global.blog": "/blog",
    "global.campaigns": "/campaign",
    "global.pratham-books": "/prathambooks"
  },
  "global.help": {
    "global.faqs": "/faqs",
    "global.tutorials": "/tutorials",
    "global.translation-tools-and-tips": "/translation_tools_and_tips",
    "global.dos-and-donts": "/dos_and_donts",
    "global.reading-levels": "/reading_levels"
  },
  "global.legal": {
    "global.open-content": "/open_content",
    "global.terms-and-conditions": "/terms_and_conditions",
    "global.privacy-policy": "/privacy_policy"
  },
  "global.contact": {
    "global.contact-us": "/contact",
    "global.careers": "/careers",
    "global.volunteering-and-internships": "/volunteer",
  }
}

function validateEmail(email) {
    // First check if any value was actually set
    if (email.length === 0) return false;
    // Now validate the email format using Regex
    // eslint-disable-next-line
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i;
    return re.test(email);
}


@translate()
class SiteFooter extends Component {
  static defaultProps = {}
  constructor(props) {
    super(props);
    this.onEmailChange = this.onEmailChange.bind(this);
    this.onSubscribe = this.onSubscribe.bind(this);
    this.state = {
      email: '',
      isValid: false
    };
  }
  onEmailChange(event) {
    this.setState({
      email: event.target.value,
      isValid: validateEmail(event.target.value)
    })
  }
  onSubscribe() {
    this.props.subscribe(this.state.email)
  }
  render() {
    const { t, shouldShowLanguageSelector, isLoggedIn, isSubscribed, isFetchingSubscribe, offline } = this.props;

    if (offline) {
      return null
    }

    let bgEl;

    if (this.props.bgUrl) {
      bgEl = (
        <div className="pb-site-footer-bg-img-wrapper">
          <div className="pb-site-footer__bg-img" style={{ backgroundImage: `url(${this.props.bgUrl})` }}></div>
        </div>
      );
    }

    const staticLinkEls = [];

    Object.keys(staticLinks).forEach(section => {
      const linkEls = [];

      Object.keys(staticLinks[section]).forEach(link => {
        linkEls.push(<Link key={link} theme="light" href={staticLinks[section][link]}>{t(link)}</Link>);
      });

      staticLinkEls.push(
        <CollapsibleSection upperCaseTitle key={section} title={t(section)} expandOnMediumViewport theme="light">
          {linkEls.length ? (<List>{linkEls}</List>) : null}
        </CollapsibleSection>
      );
    });

    return (
      <div className="pb-site-footer">
        <div className="pb-site-footer__container">
          <Grid variant="2up">
            <div>
              <CollapsibleSection upperCaseTitle title={t("global.site-title")} disableCollapse theme="light">
                <p>{t("global.about-storyweaver")}</p>
              </CollapsibleSection>
              {
                isLoggedIn
                ?
                null
                :
                <CollapsibleSection upperCaseTitle title={t("global.subscribe-to-our-newsletter")} disableCollapse theme="light">
                  {
                    isSubscribed
                    ?
                    <p>{t("global.thank-you-for-subscribing")}</p>
                    :
                    <Columnizer columns={['70%', '30%']}>
                      <TextField name="email" value={this.state.email} onChange={this.onEmailChange} id="subscribe-to-our-newsletter" label={t("global.email-address-field")} theme="light" />
                      <Button disabled={!this.state.isValid} onClick={this.onSubscribe} loading={isFetchingSubscribe} label={t("global.subscribe")} fullWidth matchInputFields/>
                    </Columnizer>
                  }
                </CollapsibleSection>
              }
              <CollapsibleSection upperCaseTitle title={t("global.follow-us")} disableCollapse theme="light">
                <SocialLinks links={{ facebook: "https://www.facebook.com/pbstoryweaver", rss: "/blog", twitter: "https://www.twitter.com/pbstoryweaver", youtube: "https://www.youtube.com/channel/UCH9_ahl5Vu8P9tElauPWahg", instagram: "https://www.instagram.com/pbstoryweaver" }} theme="light"/>
              </CollapsibleSection>
              {
                shouldShowLanguageSelector
                ?
                <CollapsibleSection upperCaseTitle expandOnMediumViewport title={t("global.language", 1)} theme="light">
                  <Sizer
                    maxWidth="m">
                    <SelectField
                      theme="light"
                      options={[ { name: 'English', queryValue: 'en' }, { name: 'हिंदी', queryValue: 'hi' }]}
                      onChange={this.props.changeLanguage}
                      value={localStorage.getItem('locale') || 'en'}
                    />
                  </Sizer>
                </CollapsibleSection>
                :
                null
              }
            </div>

            <Grid variant="3up">
              {staticLinkEls}
            </Grid>
          </Grid>

          <div className="pb-site-footer__center">
            <div>
              <SvgIcon name="cc" size="l"/>
            </div>

            <p>{t("global.license-text")}</p>

            <span className="pb-site-footer__heart-icon">
              <SvgIcon name="heart" size="m"/>
            </span>
          </div>
        </div>
        <div className="pb-site-footer__bg">
          {bgEl}
        </div>
      </div>
    );
  }
}

SiteFooter.propTypes = {
  bgUrl: PropTypes.string,
  shouldShowLanguageSelector: PropTypes.bool.isRequired,
  offline: PropTypes.bool
};

export default SiteFooter;
