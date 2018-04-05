import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { translate } from 'react-polyglot';
import u from 'updeep';

import Dropdown from '../Dropdown';
import Img from '../Img';
import Link from '../Link';
import Menu from '../Menu';
import SvgIcon from '../SvgIcon';
import LazyFontLoader from '../LazyFontLoader';
import MenuLink from '../MenuLink';
import NoSpaceForMoreOfflineBooksModal from '../Book/NoSpaceForMoreOfflineBooksModal';

import {
  fetchBookAssetsWorkflow,
  openGlobalBookReader,
  openGlobalQuickView,
  addBookToBookshelfWorkflow,
  removeBookFromBookshelfWorkflow,
} from '../../redux/bookActions';
import { saveOfflineWorkflow, unsaveOffline, isAvailableOffline } from '../../redux/offlineBooksActions';
import { recordGaEvents } from '../../redux/googleAnalyticsActions';
import { openAuthModal } from '../../redux/userActions';
import { imageSrcsetSizes, MAX_OFFLINE_BOOKS_COUNT, links, sectionClicked, gaEventCategories, gaEventActions } from '../../lib/constants';
import { addNotification, removeNotification } from '../../redux/notificationActions';
import { addOfflineBookModal } from '../../redux/offlineBookModalAction';

import './BookCard.scss';


const getIsAddedToBookshelf = (slug, profile) => {
  if (!profile || !profile.bookshelf) {
    return false;
  }

  return Boolean(profile.bookshelf.books.find(b => b.slug === slug));
};


const getIsAddingToBookshelf = (slug, isAddingOrRemovingFromBookshelf) => {
  return isAddingOrRemovingFromBookshelf.includes(slug);
};


const MenuEl = ({baseClassName, menu, disabled}) => {
  if (menu) {
    const menuLinkEl = (
      <Link
        parentClassName={`${baseClassName}__dropdown-link`}
        theme="light"
      >
        <SvgIcon name="dots" />
      </Link>
    );

    return (
      <Dropdown
        parentClassName={`${baseClassName}__dropdown`}
        toggleEl={menuLinkEl}
        noPadding
        disabled={disabled}
        >
        {menu}
      </Dropdown>
    );
  }

  return null;
};


const mapStateToProps = ({ book, offlineBooks, user: { isLoggedIn, profile }, viewport, notification }) => ({
  isFetchingAssets: book.isFetchingAssets,
  isAddingOrRemovingFromBookshelf: book.isAddingOrRemovingFromBookshelf,
  offlineBooks,
  isSavingOffline: offlineBooks.isSavingOffline,
  userEmail: profile.email,
  isLoggedIn,
  profile,
  viewport,
  notifications: notification.notifications
});

const mapDispatchToProps = {
  fetchBookAssetsWorkflow,
  openGlobalBookReader,
  openGlobalQuickView,
  saveOfflineWorkflow,
  unsaveOffline,
  openAuthModal,
  addBookToBookshelfWorkflow,
  removeBookFromBookshelfWorkflow,
  addNotification,
  addOfflineBookModal,
  recordGaEvents,
  removeNotification
};

@translate()
@connect(mapStateToProps, mapDispatchToProps)
class BookCard extends Component {
  static defaultProps = {
    shouldDisplayMenu: true
  }

  constructor(props){
    super(props);
    this.state = {
      isModalVisible: {
        noSpaceForMoreOfflineBooks: false,
      }
    };
  }

  handleClick = (e) => {
    if (this.props.disabled || this.props.loading) {
      e.preventDefault();
      e.stopPropagation();
    } else {
      if (this.props.onClick) {
        // Since 'href' will be always be there for the card
        // disabled the defaults when onClick prop is present.
        e.preventDefault();
        this.props.onClick(e);
      }
    }
  }

  onReadClicked = () => {
    const {
      book,
      fetchBookAssetsWorkflow,
      openGlobalBookReader,
      recordGaEvents,
      profile,
      sectionClicked,
      offline
    } = this.props;
    fetchBookAssetsWorkflow(book.slug)
      .then(openGlobalBookReader)

    recordGaEvents({
      eventCategory: gaEventCategories.book,
      eventAction: gaEventActions.read,
      userEmail: profile.email,
      offline: offline,
      dimension2: book.level,
      dimension3: book.language,
      dimension4: offline ? 'Offline' : 'Online' ,
      dimension5: book.slug,
      eventLabel: sectionClicked,
      metric1: 1
    });
  }

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

  onAddToMyBookshelf = () => {
    const {
      isLoggedIn,
      addBookToBookshelfWorkflow,
      book: { slug },
      profile,
      addNotification,
      t,
      recordGaEvents
    } = this.props;

    if (!isLoggedIn || !profile || !profile.bookshelf) {
      return addNotification({
        type: 'warning',
        id: 'BookCard.please-log-in-notification',
        dedup: true,
        title: t('BookCard.please-log-in-notification-title'),
        content: t('BookCard.please-log-in-notification-text'),
        additionalActions: [{
          label: t('global.log-in-or-sign-up'),
          primary: true,
          onClick: this.onClickLogin
                         
        }]
      });
    }

    addBookToBookshelfWorkflow(slug, profile.bookshelf.slug)
      .then(() => addNotification({
        type: 'info',
        id: 'BookCard.added-to-bookshelf-notification',
        dedup: true,
        title: t('BookCard.added-to-bookshelf-notification-title'),
        content: t('BookCard.added-to-bookshelf-notification-text'),
      }))
      .then(() => recordGaEvents({
        eventCategory: gaEventCategories.bookShelf,
        eventAction: gaEventActions.add,
        userEmail: profile.email,
        dimension5: slug,
        eventLabel: sectionClicked.bookCard
      }));
  }

  onRemoveFromMyBookshelf = () => {
    const {
      removeBookFromBookshelfWorkflow,
      book: { slug },
      profile,
      addNotification,
      t,
      recordGaEvents
    } = this.props;

    removeBookFromBookshelfWorkflow(slug, profile.bookshelf.slug)
      .then(() => addNotification({
        type: 'info',
        id: 'BookCard.removed-from-bookshelf-notification',
        dedup: true,
        title: t('BookCard.removed-from-bookshelf-notification-title'),
        content: t('BookCard.removed-from-bookshelf-notification-text'),
      }))
      .then(() => recordGaEvents({
        eventCategory: gaEventCategories.bookShelf,
        eventAction: gaEventActions.delete,
        userEmail: profile.email,
        dimension5: slug,
        eventLabel: sectionClicked.bookCard
      }));
  }

  onAddToOfflineClicked = (book) => {
    const {
      saveOfflineWorkflow,
      profile,
      addOfflineBookModal,
      recordGaEvents,
      userEmail,
    } = this.props;

    if(!profile.offlineBookPopupSeen) {
      addOfflineBookModal(userEmail);
    }
    saveOfflineWorkflow(book).then(
      () => recordGaEvents({
          eventCategory: gaEventCategories.offline,
          eventAction: gaEventActions.add,
          userEmail: userEmail,
          dimension2: book.level,
          dimension3: book.language,
          dimension5: book.slug,
          metric2: 1
        })
    );
  }

  onOpenModal = (modalName) => {
    this.setState(u({
      isModalVisible: {
        [modalName]: true
      }
    }, this.state));
  }

  onCloseModal(modalName) {
    this.setState(u({
      isModalVisible: {
        [modalName]: false
      }
    }, this.state));
  }

  render() {
    const {
      book,
      t,
      fontSize,
      disabled,
      onClick,
      loading,
      shouldDisplayMenu,
      isFetchingAssets,
      offline,
      openGlobalQuickView,
      isSavingOffline,
      unsaveOffline,
      offlineBooks,
      isLoggedIn,
      profile,
      openAuthModal,
      isAddingOrRemovingFromBookshelf,
      userEmail,
      recordGaEvents,
      viewport,
      faded
    } = this.props;

    const {
      language,
      level,
      slug,
      coverImage,
      authors,
      recommended,
      contest,
    } = book;

    const title = book.name ? book.name : book.title;

    const availableOffline = isAvailableOffline(book.id, offlineBooks)

    const baseClassName = 'pb-book-card';

    const isAddedToBookshelf = getIsAddedToBookshelf(slug, profile);
    const isAddingToBookshelf = getIsAddingToBookshelf(slug, isAddingOrRemovingFromBookshelf);

    let menu = null;
    if (shouldDisplayMenu) {
      menu = (
        <Menu>
          <MenuLink
            leftIcon="book"
            onClick={this.onReadClicked}
            label={t("Book.read")}
            loading={isFetchingAssets}
          />
          <MenuLink
            leftIcon="eye"
            onClick={() => openGlobalQuickView(book)}
            label={t("Book.quick-view")}
          />
          {
            (!isAddedToBookshelf && isLoggedIn) || !isLoggedIn
            ?
            <MenuLink
              leftIcon="plus-circle"
              onClick={this.onAddToMyBookshelf}
              label={t("global.add-to-my-bookshelf")}
              loading={isAddingToBookshelf}
            />
            :
            <MenuLink
              leftIcon="bin"
              onClick={this.onRemoveFromMyBookshelf}
              label={t("Book.remove-from-my-bookshelf")}
              loading={isAddingToBookshelf}
              theme="danger"
            />
          }
          {
            ('serviceWorker' in navigator) && process.env.REACT_APP_FEATURE_OFFLINE
            ?
            <MenuLink
              leftIcon={availableOffline ? "bin" : "offline"}
              onClick={() => {
                return availableOffline
                  ? 
                  (
                    unsaveOffline(book.id),
                    recordGaEvents({
                      eventCategory: gaEventCategories.offline,
                      eventAction: gaEventActions.delete,
                      userEmail: userEmail,
                      dimension2: book.level,
                      dimension3: book.language,
                      dimension5: book.slug,
                      metric2: -1
                    })
                  )
                  : isLoggedIn
                    ? offlineBooks.books.length < MAX_OFFLINE_BOOKS_COUNT
                      ? this.onAddToOfflineClicked(book)
                      : this.onOpenModal('noSpaceForMoreOfflineBooks')
                    : process.env.REACT_APP_FEATURE_AUTH
                      ?
                      openAuthModal()
                      :
                      window.location.href = links.login()
              }}
              label={availableOffline ? t("Book.remove-from-offline") : t("Book.add-to-offline")}
              loading={isSavingOffline}
              theme={availableOffline ? "danger" : null}
              legend={
                availableOffline
                  ? null
                  : isLoggedIn
                    ? offlineBooks.books.length < MAX_OFFLINE_BOOKS_COUNT
                      ? null
                      : t("Books.no-space-save-to-offline")
                    : t("Books.anonymous-save-to-offline")
              }
            />
            :
            null
          }
        </Menu>
      )
    }

    let authorEls = [];
    authors.forEach(author => {
      authorEls.push(
        <span
          key={author.slug}
          className={`${baseClassName}__author`}>
          {author.name}
        </span>
      )
    })

    let contestIconEl;
    if (contest && contest.won) {
      contestIconEl = <SvgIcon parentClassName={`${baseClassName}__contest-icon`} name="badge"/>
    }

    let recommendationEl;
    if (recommended) {
      recommendationEl = <div className={`${baseClassName}__recommendation`}><SvgIcon parentClassName={`${baseClassName}__recommendation-icon`} size={fontSize === 'l' ? 'm' : 's'} name="thumbs-up"/> {t("global.recommended")}</div>
    }

    const bookPath = `/stories/${slug}`;

    const classes = {
      [baseClassName]: true,
      [`${baseClassName}--level-${level}`]: level,
      [`${baseClassName}--font-size-${fontSize}`]: fontSize,
      [`${baseClassName}--disabled`]: disabled || loading,
      [`${baseClassName}--loading`]: loading,
      [`${baseClassName}--recommended`]: recommended,
      [`${baseClassName}--menu`]: menu,
      [`${baseClassName}--faded`]: faded
    }
    const titleClasses = {
      [`${baseClassName}__title`]: true,
      [`${baseClassName}__title--bhoti`]: book.language === 'Bhoti'
    }

    return (
      <div className={classNames(classes)}>
        <LazyFontLoader languages={[language]} />
        <div className={`${baseClassName}__container`}>
          <div className={`${baseClassName}__wrapper`}>
            <div className={`${baseClassName}__image-wrapper`} href={bookPath}>
              <div className={`${baseClassName}__image`}>
                <Img
                  image={coverImage}
                  alt={title}
                  lazyLoad
                  sizes={imageSrcsetSizes.grid2up6up}
                  offline={offline} />
              </div>
              {
                contestIconEl || shouldDisplayMenu
                ?
                <div className={`${baseClassName}__image-overlay`}></div>
                :
                null
              }
              {contestIconEl}
            </div>

            <div className={`${baseClassName}__meta-wrapper`}>
              <div className={`${baseClassName}__level-strip`} href={bookPath}>
                {
                  language
                  ?
                  (<span className={`${baseClassName}__language`}>{language}</span>)
                  :
                  null
                }
                <span className={`${baseClassName}__level`}>{t("global.level", 1)} {level}</span>
              </div>
              <div className={`${baseClassName}__meta`}>
                <h3 className={classNames(titleClasses)}>{title}</h3>
                {authorEls}
                {recommendationEl}
              </div>
            </div>
            <Link
              isInternal={onClick ? false : true}
              parentClassName={`${baseClassName}__link`}
              href={bookPath}
              title={(contest && contest.won && contest.name) ? `${t("BookCard.won")}: ${contest.name}` : null }
              onClick={onClick ? this.handleClick : null}>{title}</Link>
          </div>

          <MenuEl
            baseClassName={baseClassName}
            menu={menu}
            disabled={disabled || loading}
            />

          {
            this.state.isModalVisible.noSpaceForMoreOfflineBooks
            ?
            <NoSpaceForMoreOfflineBooksModal
              viewport={viewport}
              onClose={() => this.onCloseModal('noSpaceForMoreOfflineBooks')}
              maximum={MAX_OFFLINE_BOOKS_COUNT}
            />
            :
            null
          }
        </div>
      </div>
    );
  }
}

BookCard.propTypes = {
  title: PropTypes.string.isRequired,
  language: PropTypes.string.isRequired,
  level: PropTypes.string.isRequired,
  slug: PropTypes.string.isRequired,
  coverImage: PropTypes.object.isRequired,
  recommended: PropTypes.bool,
  authors: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    slug: PropTypes.string.isRequired
  })),
  fontSize: PropTypes.oneOf([
    'm',
    'l'
  ]),
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
  shouldDisplayMenu: PropTypes.bool,
  contest: PropTypes.object,
  offline: PropTypes.bool
};

export default BookCard;
