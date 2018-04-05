import React, { Component } from 'react';
import { translate } from 'react-polyglot';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Book from '../Book';
import LoaderBlock from '../LoaderBlock';
import {
  fetchBookWorkflow,
  addBookToListWorkflow,
  removeBookFromListWorkflow,
  postFlagBookWorkflow,
  fetchBookAssetsWorkflow,
  addToEditorsPicksWorkflow,
  removeFromEditorsPicksWorkflow,
  likeBookWorkflow,
  openGlobalBookReader,
} from '../../redux/bookActions';
import { recordGaEvents, recordBookDownload, recordBookDownloadPopUpOpened, recordBookDownloadPopUpFormOpened } from '../../redux/googleAnalyticsActions';
import { fetchUserListsWorkflow, openAuthModal } from '../../redux/userActions';
import { saveOfflineWorkflow, unsaveOffline, isAvailableOffline } from '../../redux/offlineBooksActions';
import { createReadingListWorkflow } from '../../redux/readingListsActions';
import { addNotification, removeNotification } from '../../redux/notificationActions';
import { addOfflineBookModal } from '../../redux/offlineBookModalAction';
import { links, gaEventCategories, gaEventActions } from '../../lib/constants';

import './BookContainer.scss';

const mapStateToProps = ({ book, viewport, user, readingLists, offlineBooks, network,notification }) => ({
  isFetchingBook: book.isFetchingBook,
  book: book.book,
  isAddingOrRemovingFromList: book.isAddingOrRemovingFromList,
  isFetchingUserLists: user.isFetchingLists,
  userLists: user.lists,
  isLoggedIn: user.isLoggedIn,
  roles: user.profile.roles,
  viewport,
  isFetchingBookAssets: book.isFetchingAssets,
  assets: book.assets,
  isAddingToOrRemovingFromEditorsPicks: book.isAddingToOrRemovingFromEditorsPicks,
  isCreatingReadingList: readingLists.isCreatingReadingList,
  offlineBooks,
  isSavingOffline: offlineBooks.isSavingOffline,
  online: network.online,
  isFlaggingBook: book.isFlaggingBook,
  userEmail: user.profile.email,
  offlineBookPopupSeen: user.profile.offlineBookPopupSeen,
  notifications: notification.notifications
});

const mapDispatchToProps = {
  fetchBookWorkflow,
  fetchUserListsWorkflow,
  addBookToListWorkflow,
  removeBookFromListWorkflow,
  postFlagBookWorkflow,
  fetchBookAssetsWorkflow,
  saveOfflineWorkflow,
  unsaveOffline,
  createReadingListWorkflow,
  addToEditorsPicksWorkflow,
  removeFromEditorsPicksWorkflow,
  likeBookWorkflow,
  openGlobalBookReader,
  openAuthModal,
  addNotification,
  addOfflineBookModal,
  recordGaEvents,
  removeNotification,
  recordBookDownload,
  recordBookDownloadPopUpOpened,
  recordBookDownloadPopUpFormOpened
};

@translate()
@connect(mapStateToProps, mapDispatchToProps)
class BookContainer extends Component {
  componentWillMount() {
    this.props.fetchBookWorkflow(this.props.match.params.slug);
    this.props.fetchUserListsWorkflow();
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.match.params.slug !== nextProps.match.params.slug) {
      this.props.fetchBookWorkflow(nextProps.match.params.slug);
    }
  }

  onBeforeEditor = (slug, urlCreator) => {
    const { viewport, addNotification, t } = this.props;

    if (viewport.medium) {
      window.location.href = urlCreator(slug)
    } else {
      addNotification({
        type: 'warning',
        id: 'Book.mobile-editor-notification',
        dedup: true,
        title: t('Book.mobile-editor-notification-title'),
        content: t('Book.mobile-editor-notification-text'),
      });
    }
  }

  onTranslateClicked = (slug) => {
    this.onBeforeEditor(slug, links.translateBook);
  }

  onRelevelClicked = (slug) => {
    this.onBeforeEditor(slug, links.relevelBook);
  }

  onEditDraft = () => {
    this.onBeforeEditor(this.props.book.slug, links.editor);
  };

  onEditPublished = () => {
    this.onBeforeEditor(this.props.book.slug, links.editPublishedStory);
  }

  onReadClicked = (slug, sectionClicked) => {
    const {
      fetchBookAssetsWorkflow,
      openGlobalBookReader,
      recordGaEvents,
      userEmail,
      book,
      online
    } = this.props;
    fetchBookAssetsWorkflow(slug)
      .then(openGlobalBookReader)

    recordGaEvents({
      eventCategory: gaEventCategories.book,
      eventAction: gaEventActions.read,
      userEmail: userEmail,
      dimension2: book.level,
      dimension3: book.language,
      dimension4: online ? 'Online' : 'Offline' ,
      dimension5: book.slug,
      metric1: 1,
      eventLabel: sectionClicked
    })
  }

  onLikeClicked = (slug) => {
    const {
      likeBookWorkflow,
      userEmail,
      book,
      online,
      recordGaEvents
    } = this.props;
    likeBookWorkflow(slug);

    recordGaEvents({
      eventCategory: gaEventCategories.book,
      eventAction: gaEventActions.liked,
      userEmail: userEmail,
      dimension2: book.level,
      dimension3: book.language,
      dimension4: online ? 'Online' : 'Offline' ,
      dimension5: book.slug
    });
  }

  render() {
    const {
      isFetchingBook,
      book,
      isLoggedIn,
      isFetchingUserLists,
      isAddingOrRemovingFromList,
      userLists,
      viewport,
      addBookToListWorkflow,
      removeBookFromListWorkflow,
      postFlagBookWorkflow,
      isFetchingBookAssets,
      assets,
      saveOfflineWorkflow,
      createReadingListWorkflow,
      roles,
      addToEditorsPicksWorkflow,
      removeFromEditorsPicksWorkflow,
      isAddingToOrRemovingFromEditorsPicks,
      isCreatingReadingList,
      offlineBooks,
      unsaveOffline,
      online,
      isFlaggingBook,
      isSavingOffline,
      openAuthModal,
      addNotification,
      addOfflineBookModal,
      userEmail,
      offlineBookPopupSeen,
      recordGaEvents,
      notifications,
      removeNotification,
      recordBookDownload,
      recordBookDownloadPopUpOpened,
      recordBookDownloadPopUpFormOpened
    } = this.props;

    if (isFetchingBook || !book) {
      return <LoaderBlock />;
    }

    const isFlaggingCurrentBook = isFlaggingBook[book.slug];

    return (
      <Book
        book={book}
        isLoggedIn={isLoggedIn}
        isFetchingUserLists={isFetchingUserLists}
        userLists={userLists}
        isAddingOrRemovingFromList={isAddingOrRemovingFromList}
        viewport={viewport}
        onAddToList={addBookToListWorkflow}
        onRemoveFromList={removeBookFromListWorkflow}
        onFlagClicked={postFlagBookWorkflow}
        onReadClicked={this.onReadClicked}
        isFetchingAssets={isFetchingBookAssets}
        assets={assets}
        availableOffline={isAvailableOffline(book.id, offlineBooks)}
        offlineBooksCount={offlineBooks.books.length}
        onClickAddToOffline={saveOfflineWorkflow.bind(this, book)}
        onClickRemoveFromOffline={unsaveOffline.bind(this, book.id)}
        onEdit={book.status === "published" ? this.onEditPublished : this.onEditDraft}
        online={online}
        onCreateList={createReadingListWorkflow}
        roles={roles}
        onAddToEditorsPicks={addToEditorsPicksWorkflow}
        onRemoveFromEditorsPicks={removeFromEditorsPicksWorkflow}
        isAddingToOrRemovingFromEditorsPicks={isAddingToOrRemovingFromEditorsPicks}
        isCreatingReadingList={isCreatingReadingList}
        onLikeClicked={this.onLikeClicked}
        isFlaggingBook={isFlaggingCurrentBook}
        isSavingOffline={isSavingOffline}
        openAuthModal={openAuthModal}
        addNotification={addNotification}
        onTranslateClicked={this.onTranslateClicked}
        onRelevelClicked={this.onRelevelClicked}
        addOfflineBookModal={addOfflineBookModal}
        userEmail={userEmail}
        offlineBookPopupSeen={offlineBookPopupSeen}
        recordGaEvents={recordGaEvents}
        notifications={notifications}
        removeNotification={removeNotification}
        recordBookDownload={recordBookDownload}
        recordBookDownloadPopUpOpened={recordBookDownloadPopUpOpened}
        recordBookDownloadPopUpFormOpened={recordBookDownloadPopUpFormOpened}
      />
    );
  }
}

BookContainer.propTypes = {
  fetchBookWorkflow: PropTypes.func.isRequired
};

export default BookContainer;
