import React, { Component } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import Illustration from '../Illustration';
import Block from '../Block';
import LoaderBlock from '../LoaderBlock';
import {
  fetchIllustrationWorkflow,
  likeIllustrationWorkflow,
  postFlagIllustrationWorkflow,
} from '../../redux/illustrationActions';
import { recordGaEvents, recordIllustrationDownload } from '../../redux/googleAnalyticsActions';
import { openAuthModal } from '../../redux/userActions';
import { links, gaEventCategories, gaEventActions, sectionClicked } from '../../lib/constants';

const mapStateToProps = ({ illustration, viewport, user, network }) => ({
  isFetchingIllustration: illustration.isFetchingIllustration,
  illustration: illustration.illustration,
  viewport,
  isLoggedIn: user.isLoggedIn,
  online: network.online,
  userEmail: user.profile.email,
 });


 const mapDispatchToProps = {
  fetchIllustrationWorkflow,
  likeIllustrationWorkflow,
  postFlagIllustrationWorkflow,
  openAuthModal,
  recordGaEvents,
  recordIllustrationDownload
};

@connect(mapStateToProps, mapDispatchToProps)

class IllustrationContainer extends Component {
  // static defaultProps = {}
  componentWillMount() {
    this.props.fetchIllustrationWorkflow(this.props.match.params.slug);
  }

  onClickCreateStory = () => {
    const {
      isLoggedIn,
      openAuthModal
    } = this.props;
    
    if (isLoggedIn) {
      window.location.href = links.createStoryFromIllustration(this.props.illustration.slug);
    } else {
      process.env.REACT_APP_FEATURE_AUTH
      ?
      openAuthModal()
      :
      window.location.href = links.login();
    }
  };

  onClickFlag =(slug,reasons) => {
    this.props.postFlagIllustrationWorkflow(slug,reasons);
  }

  onLikeClicked = (slug) => {
    const {
      likeIllustrationWorkflow,
      userEmail,
      illustration,
      recordGaEvents
    } = this.props;
    likeIllustrationWorkflow(slug);

    recordGaEvents({
      eventCategory: gaEventCategories.illustration,
      eventAction: gaEventActions.liked,
      userEmail: userEmail,
      dimension5: illustration.slug
    });
    
  }

  onProfileLinkClicked = (profileSlug, linkType) => {
    const {
      recordGaEvents,
      userEmail,
    } = this.props;
  
    recordGaEvents({
      eventCategory: gaEventCategories.profile,
      eventAction: gaEventActions.opened,
      eventLabel: `${sectionClicked.illustrationDetails} ${linkType}`,
      userEmail: userEmail,
      dimension5: profileSlug
    });
  }

  render() {
    const baseClassName = 'pb-illustration-container';
    const {
      online,
      isLoggedIn,
      isFetchingIllustration,
      illustration,
      viewport,
      parentClassName,
      openAuthModal,
      userEmail,
      recordIllustrationDownload
    } = this.props;

    const classes = {
      [baseClassName]: true,
      [parentClassName]: parentClassName
    };

    if (isFetchingIllustration || !illustration ) {
      return <LoaderBlock />;
    }


    if (!isFetchingIllustration && !illustration) {
      return <Block><h1>Error fetching Image.</h1></Block>;
    }

    return (
      <div className={classNames(classes)}>
        <Illustration
          online={online}
          slug={illustration.slug}
          title={illustration.title}
          author={illustration.illustrators}
          image={illustration.imageUrls[0]}
          tags={illustration.tags}
          description={illustration.attribution_text}
          usedIn={illustration.usedIn}
          viewport={viewport}
          onClickCreateStory={this.onClickCreateStory}
          readsCount={illustration.readsCount}
          likesCount={illustration.likesCount}
          liked={illustration.liked}
          isLoggedIn={isLoggedIn}
          downloadLinks={illustration.downloadLinks}
          onLikeClicked={this.onLikeClicked}
          onClickFlag={this.onClickFlag}
          isFlagged={illustration.isFlagged}
          similarImages={illustration.similarillustrations}
          openAuthModal={openAuthModal}
          publisher={illustration.publisher}
          recordIllustrationDownload={recordIllustrationDownload}
          userEmail={userEmail}
          onProfileLinkClicked={this.onProfileLinkClicked}
        />
      </div>
    );
  }
}

IllustrationContainer.propTypes = {
  parentClassName: PropTypes.string
};

export default IllustrationContainer;
