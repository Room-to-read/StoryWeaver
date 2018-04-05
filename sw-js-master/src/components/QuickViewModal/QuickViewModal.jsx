import React, { Component } from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-polyglot';
import { push } from 'react-router-redux';

import Modal from '../Modal';
import Button from '../Button';
import ButtonGroup from '../ButtonGroup';
import Stat from '../Stat';
import Link from '../Link';

import { arrayToI18nList } from '../../lib/textUtils.js';
import { links, linkType, profileTypes, gaEventCategories, gaEventActions, sectionClicked } from '../../lib/constants';
import {
  fetchBookAssetsWorkflow,
  openGlobalBookReader,
} from '../../redux/bookActions';
import { recordGaEvents } from '../../redux/googleAnalyticsActions';

import './QuickViewModal.scss';

const makeProfileLinks = (collection, linkType, onClick) => {
  if (!collection) {
    return [];
  }
  
  return collection.map((item, i) =>
    <Link
      isInternal
      key={item.slug}
      href={links.userProfile(item.slug)}
      onClick={onClick.bind(this,item.slug, linkType)}
    >
      {item.name}
    </Link>
  );
};


const mapStateToProps = ({ book: { isFetchingAssets }, user: { profile }}) => ({
  isFetchingAssets,
  userEmail: profile.email,
});

const mapDispatchToProps = {
  push,
  fetchBookAssetsWorkflow,
  openGlobalBookReader,
  recordGaEvents
};

@translate()
@connect(mapStateToProps, mapDispatchToProps)
class QuickViewModal extends Component {
  onReadClicked = () => {
    const {
      book,
      fetchBookAssetsWorkflow,
      openGlobalBookReader,
      recordGaEvents,
      userEmail,
      onCloseClicked
    } = this.props;
    fetchBookAssetsWorkflow(book.slug)
        .then(() => {
          onCloseClicked();
          openGlobalBookReader();
        });
    recordGaEvents({
      eventCategory: gaEventCategories.book,
      eventAction: gaEventActions.read,
      userEmail: userEmail,
      dimension2: book.level,
      dimension3: book.language,
      dimension5: book.slug,
      metric2: 1,
      eventLabel: sectionClicked.quickViewModal
    });
      
  }

  onViewBookDetailsClicked = () => {
    this.props.onCloseClicked();
    this.props.push(links.bookDetails(this.props.book.slug));
  }

  onProfileLinkClicked = (profileSlug, linkType, e) => {
    const {
      recordGaEvents,
      userEmail,
      onCloseClicked
    } = this.props;
  
    recordGaEvents({
      eventCategory: gaEventCategories.profile,
      eventAction: gaEventActions.opened,
      eventLabel: `${sectionClicked.quickViewModal} ${linkType}`,
      userEmail: userEmail,
      dimension5: profileSlug
    });
    onCloseClicked();
  }
  
  render() {
    const baseClassName = 'pb-quick-view-modal';
    let { viewport, t, book, onCloseClicked, isFetchingAssets } = this.props;

    const footer = (
      <ButtonGroup mergeTop mergeBottom={!viewport.large} mergeSides>
        <Button
          variant="primary"
          fullWidth
          label={t('Book.read-now')}
          onClick={this.onReadClicked}
          loading={isFetchingAssets}
        />
        <Button
          fullWidth
          label={t('global.view-details')}
          onClick={this.onViewBookDetailsClicked}
        />
      </ButtonGroup>
    );

    const authorLinks = makeProfileLinks(book.authors, linkType.writtenBy, this.onProfileLinkClicked);
    const illustratorLinks = makeProfileLinks(book.illustrators, linkType.illustratedBy, this.onProfileLinkClicked);

    const authorsEl = <span>{t('Book.written-by')} {arrayToI18nList(authorLinks)}</span>;

    const illustratorEl = illustratorLinks.length > 0 ?
      <span>{t('Book.illustrated-by')} {arrayToI18nList(illustratorLinks)}</span>
      :
      null;

    return (
      <Modal
        onClose={onCloseClicked}
        footer={footer}
      >
        <h2 className={`${baseClassName}__title`}>{book.title}</h2>
        <p className={`${baseClassName}__credits`}>{ authorsEl } { illustratorEl }</p>
        { book.description ? <p>{book.description}</p> : null }
        <div className={`${baseClassName}__footer`}>
          <div>
            { book.readsCount ? <Stat icon="book" value={book.readsCount} /> : null }
            { book.likesCount ? <Stat icon="heart" value={book.likesCount} /> : null }
          </div>
          <div>
            {
              book.publisher
              ?
              <Link
                href={links.profile(profileTypes.PUBLISHER, book.publisher.slug)}
                isInternal
                onClick={() => this.props.onCloseClicked()}
              >
                <img
                  className={`${baseClassName}__publisher-logo`}
                  src={book.publisher.logo}
                  alt={`${t("global.logo-of")} ${book.publisher.name}`}
                />
              </Link>
              :
              null
            }
          </div>
        </div>
      </Modal>
    );
  }
}

QuickViewModal.propTypes = {
};

export default QuickViewModal;
