import React, { Component } from 'react';
import { translate } from 'react-polyglot';

import Link from '../Link';
import SvgIcon from '../SvgIcon';
import Loader from '../Loader';

import { links, sectionClicked, gaEventCategories, gaEventActions } from '../../lib/constants';

const getisAddingOrRemovingFromList = (bookSlug, listSlug, isAddingOrRemovingFromList) => {
  if (!isAddingOrRemovingFromList[bookSlug]) {
    return false;
  }

  return isAddingOrRemovingFromList[bookSlug].includes(listSlug);
};

const getIsAddedToList = (listMemberships, listSlug) => {
  return listMemberships.find(lm => lm.slug === listSlug);
};

const findMyBookshelfSlug = (lists) => {
  const myBookshelf = lists.find(l => l.title === 'My Bookshelf');

  if (!myBookshelf) {
    return null;
  }

  return myBookshelf.slug;
}


class AddToMyLibraryLink extends Component {

  onClickLogin = () => {
    if (process.env.REACT_APP_FEATURE_AUTH) {
      this.props.openAuthModal()
    }
    else {
    window.location.href = links.login()
    }
    // Remove notification after opening Signin/SignUp modal/ Redirecting to old sign-in/sign-up
    this.props.removeNotification(this.props.notifications.length - 1)

  }

  onAddToMyLibrary = () => {
    const {
      isLoggedIn,
      lists,
      listMemberships,
      slug,
      onAddToList,
      onRemoveFromList,
      addNotification,
      userEmail,
      recordGaEvents,
      t
    } = this.props;

    // If user is not logged in, show a notification.
    if (!isLoggedIn) {
      return addNotification({
        type: 'error',
        id: 'Book.anonymous-add-notification',
        dedup: true,
        title: t('Book.anonymous-add-notification-title'),
        content: t('Book.anonymous-add-notification-text'),
        additionalActions: [{
          label: t('global.log-in'),
          primary: true,
          onClick: this.onClickLogin
        }]
      });
    }

    // Find the slug for this user's My Library in the list of lists.
    const myBookshelfSlug = findMyBookshelfSlug(lists);

    // Toggle list membership.
    if (getIsAddedToList(listMemberships, myBookshelfSlug)) {
      onRemoveFromList(slug, myBookshelfSlug).then(() => addNotification({
        type: 'info',
        id: 'Book.book-removed-notification',
        dedup: true,
        title: t('Book.book-removed-notification-title'),
        content: t('Book.book-removed-notification-text')
      }))
      .then(() => recordGaEvents({
        eventCategory: gaEventCategories.bookShelf,
        eventAction: gaEventActions.delete,
        userEmail: userEmail,
        dimension5: slug,
        eventLabel: sectionClicked.bookDetails
      }));
    } else {
      onAddToList(slug, myBookshelfSlug).then(() => addNotification({
        type: 'info',
        id: 'Book.book-added-notification',
        dedup: true,
        title: t('Book.book-added-notification-title'),
        content: t('Book.book-added-notification-text')
      }))
      .then(() => recordGaEvents({
        eventCategory: gaEventCategories.bookShelf,
        eventAction: gaEventActions.add,
        userEmail: userEmail,
        dimension5: slug,
        eventLabel: sectionClicked.bookDetails
      }));
    }
  }

  render() {
    const {
      slug,
      isFetchingUserLists,
      isAddingOrRemovingFromList,
      lists,
      listMemberships,
      t
    } = this.props;

    if (isFetchingUserLists) {
      return (
        <span><Loader size="m" /> {t('global.loading')}</span>
      );
    }

    const myBookshelfSlug = findMyBookshelfSlug(lists);

    const isAddingToMyBookshelf = getisAddingOrRemovingFromList(
      slug,
      myBookshelfSlug,
      isAddingOrRemovingFromList
    );
    const isAddedToMyBookshelf = getIsAddedToList(
      listMemberships,
      myBookshelfSlug
    );
    const icon = isAddedToMyBookshelf ? 'bin' : 'plus-circle';

    return (
      <Link onClick={this.onAddToMyLibrary} theme={isAddedToMyBookshelf ? 'danger' : null}>
        { isAddingToMyBookshelf ? <Loader size="m" /> : <SvgIcon name={icon} />}
        {' '}
        {isAddedToMyBookshelf ? t('Book.remove-from-my-bookshelf') : t('Book.add-to-my-bookshelf')}
      </Link>
    );
  }
};

export default translate()(AddToMyLibraryLink);

