import React, { Component } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { translate } from 'react-polyglot';

import Block from '../Block';
import Button from '../Button';
import Grid from '../Grid';
import ImageCard from '../ImageCard';
import PageHeader from '../PageHeader';
import Pagination from '../Pagination';
import LoaderBlock from '../LoaderBlock';
import Notification from '../Notification';
import IllustrationUploadModal from '../IllustrationUploadModal';
import Link from '../Link';
import { links, gaEventCategories, gaEventActions, sectionClicked } from '../../lib/constants';

import './AllImages.scss';

const ImageCardsGridEl = ({images, onProfileLinkClicked}) => {
  const imageCardEls = images.map((image, i) => {
      return <ImageCard
                key={i}
                title={image.title}
                subTitle={image.subTitle}
                slug={image.slug}
                artists={image.illustrators}
                image={image.imageUrls[0]}
                onProfileLinkClicked={onProfileLinkClicked}
                />;
  });

  return <Grid variant="4up">{imageCardEls}</Grid>
};

@translate()
class AllImages extends Component {

  constructor(props) {
    super(props);

    this.state = {
      isUploadNotificationVisible: false,
      isUploadFormOpen: false,
    };

  }

  openUploadNotification = () => {
    this.setState({isUploadNotificationVisible: true});
  }

  closeUploadNotification = () => {
    this.setState({isUploadNotificationVisible: false});
  }

  openUploadForm = () => {
    this.setState({isUploadFormOpen: true});
  }

  closeUploadForm = () => {
    this.setState({isUploadFormOpen: false});
  }

  onConfirmNotification = () => {
    this.openUploadForm();
    this.closeUploadNotification();
  }

  onLoginClicked = () => {
    process.env.REACT_APP_FEATURE_AUTH
    ?
    this.props.openAuthModal()
    :
    window.location.href = links.login();
    this.closeUploadNotification();
  }

  onProfileLinkClicked = (profileSlug) => {
    const {
      recordGaEvents,
      userEmail,
    } = this.props;
  
    recordGaEvents({
      eventCategory: gaEventCategories.profile,
      eventAction: gaEventActions.opened,
      eventLabel: sectionClicked.allImagesPage,
      userEmail: userEmail,
      dimension5: profileSlug
    });
  }
  

  render() {
    const baseClassName = 'pb-all-images';

    const {
      t,
      isLoggedIn,
      images,
      isFetchingAllIllustrations,
      illustrationsInfo,
      isFirstPage,
      loadMore,
      filtersComponent,
      uploadIllustration,
      fetchAllIllustrations,
      appliedFilters,
      initializeIllustrations,
      isUploadingIllustration,
      firstName,
      userRoles,
      autocompleteTags,
      tags,
      autocompleteIllustrators,
      illustratorSuggestions,
      fetchNewIllustrationFormData,
      newFormData,
      organizationRoles
    } = this.props;

    const breadcrumbPaths = [{
      title: t('global.home'),
      href: '/'
    }];

    const classes = {
      [baseClassName]: true
    };
    const notificationContent = [t("Illustration.upload-msg-2"),
      <Link href={links.ccLicense()} shouldOpenNewPage normal>{t("Illustration.upload-msg-3")}</Link>];

    return (
      <div className={classNames(classes)}>
        {
          this.state.isUploadNotificationVisible
          ?
            (
            isLoggedIn
            ?
              <Notification
                confirmLabel={t("global.yes")}
                content={notificationContent}
                dismissLabel={t("global.no")}
                title={t("Illustration.upload-msg-1")}
                type="warning"
                onConfirm={this.onConfirmNotification}
                onDismiss={this.closeUploadNotification}
              />
            :
              <Notification
                confirmLabel={t("global.log-in")}
                dismissLabel={t("global.dismiss")}
                title={t("global.log-in")}
                content={t("Illustration.upload-msg-no-login")}
                iconName="user"
                onConfirm={this.onLoginClicked}
                onDismiss={this.closeUploadNotification}
              />
            )
          
          :
          null
        }

        <PageHeader
          title={t("global.all-images")}
          breadcrumbPaths={breadcrumbPaths}
          actions={<Button fullWidth label={t("AllImages.cta-upload")} variant="primary" onClick={this.openUploadNotification}/>}
          />
        <Block>
          {filtersComponent}
          <ImageCardsGridEl images={images} onProfileLinkClicked={this.onProfileLinkClicked}/>
          { 
             isFirstPage ? <LoaderBlock /> : null
          }
          {
           (images.length < illustrationsInfo.hits) && !isFirstPage?  
              <Pagination 
                onClick={loadMore}
                loading={isFetchingAllIllustrations} />
            :
            null
          }  
        </Block>
        {
          this.state.isUploadFormOpen
          ?
          <IllustrationUploadModal 
            onClose={this.closeUploadForm}
            uploadIllustration={uploadIllustration}
            fetchAllIllustrations={fetchAllIllustrations}
            appliedFilters={appliedFilters}
            initializeIllustrations={initializeIllustrations}
            isUploadingIllustration={isUploadingIllustration}
            firstName={firstName}
            userRoles={userRoles}
            organizationRoles={organizationRoles}
            autocompleteTags={autocompleteTags}
            tags={tags}
            autocompleteIllustrators={autocompleteIllustrators}
            illustratorSuggestions={illustratorSuggestions}
            fetchNewIllustrationFormData={fetchNewIllustrationFormData}
            newFormData={newFormData}
          />
          :
          null
        }
      </div>
    );
  }
}

AllImages.propTypes = {
  //images: PropTypes.arrayOf(PropTypes.shape(ImageCard.propTypes)),
  onClickUpload: PropTypes.func
};

export default AllImages;
