import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { initViewport } from '../../redux/viewportActions';
import { initNetwork } from '../../redux/networkActions';
import { fetchMeWorkflow, logoutWorkflow, openAuthModal } from '../../redux/userActions'
import { submitStoryNotice} from '../../redux/homeActions'
import { subscribeWorkflow } from '../../redux/newsletterActions';
import { changeLanguage } from '../../redux/userActions';
import { closeGlobalBookReader, closeGlobalQuickView } from '../../redux/bookActions';
import { addNotification } from '../../redux/notificationActions';
import { recordLocalization, recordBookReadCompleted } from '../../redux/googleAnalyticsActions';
import { translate } from 'react-polyglot';

import './AppContainer.scss';

import SiteHeader from '../SiteHeader';
import SiteFooter from '../SiteFooter';
import NotificationContainer from '../NotificationContainer';
import BookReaderModal from '../BookReaderModal';
import QuickViewModal from '../QuickViewModal';
import AuthModalContainer from '../AuthModalContainer';
import OfflineBookModal from '../OfflineBookModal';
import UserFeedbackModal from '../UserFeedbackModal';

const mapStateToProps = state => {
  return {
    viewport: state.viewport,
    isLoggedIn: state.user.isLoggedIn,
    profile: state.user.profile,
    isFetchingMe: state.user.isFetchingMe,
    isSubscribed: state.newsletter.isSubscribed,
    isFetchingSubscribe: state.newsletter.isFetchingSubscribe,
    online: state.network.online,
    bookAssets: state.book.assets,
    isGlobalBookReaderVisible: state.book.isGlobalBookReaderVisible,
    isGlobalQuickViewVisible: state.book.isGlobalQuickViewVisible,
    currentGlobalQuickViewBook: state.book.currentGlobalQuickViewBook,
    stage: state.user.stage,
    isOfflineBookModalVisible: state.offlineBookModal.isofflineModalVisible,
    isUserFeedbackModalVisible: state.userFeedbackModal.isUserFeedbackModalVisible,
    book: state.book.book
  }
}

const mapDispatchToProps = {
  initViewport,
  initNetwork,
  fetchMeWorkflow,
  submitStoryNotice,
  logoutWorkflow,
  subscribeWorkflow,
  changeLanguage,
  closeGlobalBookReader,
  closeGlobalQuickView,
  openAuthModal,
  addNotification,
  recordLocalization,
  recordBookReadCompleted
};

@translate()
@connect(mapStateToProps, mapDispatchToProps)
class AppContainer extends Component {
  static defaultProps = {
    chromeless: false
  }

  componentDidMount() {
    const {
      initViewport,
      initNetwork,
      fetchMeWorkflow,
      addNotification,
      submitStoryNotice,
      t
    } = this.props;

    initViewport();
    initNetwork();
    fetchMeWorkflow().then((response) => {
      if(response.meta && response.meta.contestStoryNotice){
        addNotification({
          content: t("Contest.notification-text")
        })
        submitStoryNotice();
      }
    });
  }

  onChangeLanguage = (newLanguage) => {
    const {
      profile,
      changeLanguage,
      recordLocalization
    } = this.props;


    changeLanguage(newLanguage).then(
      () => recordLocalization({userEmail: profile.email, newLanguage: newLanguage})
    );

  }

  render() {
    const baseClassName = 'pb-app';
    const {
      viewport,
      chromeless,
      isLoggedIn,
      profile,
      logoutWorkflow,
      isFetchingMe,
      isSubscribed,
      isFetchingSubscribe,
      subscribeWorkflow,
      online,
      bookAssets,
      isGlobalBookReaderVisible,
      closeGlobalBookReader,
      isGlobalQuickViewVisible,
      currentGlobalQuickViewBook,
      closeGlobalQuickView,
      openAuthModal,
      stage,
      addNotification,
      isOfflineBookModalVisible,
      isUserFeedbackModalVisible,
      book,
      recordBookReadCompleted
    } = this.props;

    const classes = {
      [baseClassName]: true,
      [`${baseClassName}--fill-height`]: !chromeless
    };

    return (
      <div className={classNames(classes)}>
        {
          chromeless
          ?
          null
          :
          <SiteHeader
            viewport={viewport}
            isLoggedIn={isLoggedIn}
            user={profile}
            logout={logoutWorkflow}
            isFetchingMe={isFetchingMe}
            offline={!online}
            openAuthModal={() => openAuthModal()}
            addNotification={addNotification}
          />
        }
        {chromeless ? null : <NotificationContainer /> }
        <div className={`${baseClassName}__content`}>{this.props.children}</div>
        {
          chromeless
          ?
          null
          :
          <SiteFooter
            isLoggedIn={isLoggedIn}
            isSubscribed={isSubscribed}
            isFetchingSubscribe={isFetchingSubscribe}
            subscribe={subscribeWorkflow}
            shouldShowLanguageSelector={true}
            offline={!online}
            changeLanguage={this.onChangeLanguage}
          />
        }
        {
          
          isGlobalBookReaderVisible
          ?
          <BookReaderModal
            onCloseClicked={() => closeGlobalBookReader()}
            viewport={viewport}
            assets={bookAssets}
            offline={!online}
            userEmail={profile.email}
            book={book}
            recordBookReadCompleted={recordBookReadCompleted}
          />
          :
          null
        }
        {
          isGlobalQuickViewVisible
          ?
          <QuickViewModal
            viewport={viewport}
            book={currentGlobalQuickViewBook}
            onCloseClicked={() => closeGlobalQuickView()}
          />
          :
          null
        }
        <AuthModalContainer stage={stage} />
        {
          isOfflineBookModalVisible
          ?
          <OfflineBookModal />
          :
          null
        }

        {
          isUserFeedbackModalVisible
          ?
          <UserFeedbackModal />
          :
          null
        }
      </div>
    );
  }
}

AppContainer.propTypes = {
  chromeless: PropTypes.bool
};

export default AppContainer;
