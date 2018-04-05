import React, { Component } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { translate } from 'react-polyglot';
import DocumentTitle from 'react-document-title';
import u from 'updeep';

import Block from '../Block';
import BookCard from '../BookCard';
import Button from '../Button';
import DocumentClass from '../DocumentClass';
import Stat from '../Stat';
import Rowifier from '../Rowifier';

import AuthDropdown from './AuthDropdown';
import Credits from './Credits';
import EmbedModal from './EmbedModal';
import RelevelModal from './RelevelModal';
import NoSpaceForMoreOfflineBooksModal from './NoSpaceForMoreOfflineBooksModal';
import BookBreadcrumbs from './BookBreadcrumbs';
import FlagModal from './FlagModal';
import DeleteModal from './DeleteModal';
import DownloadModal from './DownloadModal';
import Translations from './Translations';
import BookActions from './BookActions';
import Tags from './Tags';
import OfflineActions from './OfflineActions';
import SimilarBooks from './SimilarBooks';
import ConfirmModal from '../ConfirmModal';
import CreateListModal from './CreateListModal';
import Publisher from '../Publisher';
import FloatingActionsBar from '../FloatingActionsBar';
import Link from '../Link';
import CollapsibleSection from '../CollapsibleSection';
import List from '../List';
import Sizer from '../Sizer';

import { MAX_OFFLINE_BOOKS_COUNT, links, gaEventCategories, gaEventActions, sectionClicked } from '../../lib/constants';

import './Book.scss';

const baseClassName = 'pb-book';

class Book extends Component {
  static defaultProps = {
    illustrators: [],
    authors: [],
    originalAuthors: [],
    tags: [],
    userLists: []
  }

  constructor(props) {
    super(props);

    this.state = {
      isModalVisible: {
        embed: false,
        flag: false,
        relevel: false,
        confirmEdit: false,
        createList: false,
        noSpaceForMoreOfflineBooks: false,
        delete: false,
        download: false
      }
    };

    this.onOpenModal = this.onOpenModal.bind(this);
    this.onCloseModal = this.onCloseModal.bind(this);
  }

  onOpenModal(modalName) {
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

  onReadClicked(slug, sectionClicked) {
    this.props.onReadClicked(slug, sectionClicked);
  }

  onFormLinkClicked = () => {
    const {
      userEmail,
      book,
      recordBookDownloadPopUpFormOpened
    } = this.props;

    recordBookDownloadPopUpFormOpened({userEmail, book})
    window.open(book.googleFormDownloadLink);
  }

  onAddToOfflineClicked = () => {
    const {
      onClickAddToOffline,
      offlineBookPopupSeen,
      addOfflineBookModal,
      userEmail,
      book,
      recordGaEvents
    } = this.props;

    onClickAddToOffline()
      .then(() => {
        if(!offlineBookPopupSeen) {
          addOfflineBookModal(userEmail);
        }
        recordGaEvents({
          eventCategory: gaEventCategories.offline,
          eventAction: gaEventActions.add,
          userEmail: userEmail,
          dimension2: book.level,
          dimension3: book.language,
          dimension5: book.slug,
          metric2: 1
        })
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
      eventLabel: `${sectionClicked.bookDetails} ${linkType}`,
      userEmail: userEmail,
      dimension5: profileSlug
    });
  }

  render() {
    const {
      book,
      t,
      viewport,
      online,
      onFlagClicked,
      isFetchingUserLists,
      userLists,
      onAddToList,
      onRemoveFromList,
      isLoggedIn,
      isAddingOrRemovingFromList,
      isFetchingAssets,
      onClickRemoveFromOffline,
      availableOffline,
      onEdit,
      onCreateList,
      roles,
      onAddToEditorsPicks,
      onRemoveFromEditorsPicks,
      isAddingToOrRemovingFromEditorsPicks,
      isCreatingReadingList,
      onLikeClicked,
      isFlaggingBook,
      isSavingOffline,
      offlineBooksCount,
      openAuthModal,
      addNotification,
      onTranslateClicked,
      onRelevelClicked,
      userEmail,
      recordGaEvents,
      notifications,
      removeNotification,
      recordBookDownload,
      recordBookDownloadPopUpOpened
    } = this.props;

    const {
      name: title,
      status,
      description,
      slug,
      authors,
      illustrators,
      photographers,
      tags,
      similarBooks,
      translations,
      readsCount,
      likesCount,
      liked,
      downloadLinks,
      isTranslation,
      isRelevelled,
      lists: listMemberships,
      copyrightNotice,
      orientation,
      canEdit: isEditable,
      editorsPick: isEditorsPick,
      publisher,
      isFlagged,
      level,
      language,
      isContestStory,
      showOptions
    } = book;

    const { originalStory : { 
        name: originalTitle, 
        slug: originalSlug, 
        authors: originalAuthors
    }} = book;

    const classes = {
      [baseClassName]: true,
      [`${baseClassName}--floated-cta`]: !viewport.large,
      [`${baseClassName}--offline`]: !online
    }

    const titleClasses = {
      [`${baseClassName}__title`]: true,
      [`${baseClassName}__title--bhoti`]: book.language === 'Bhoti'
    }

    let likeStat = <Stat
        iconVariant="accent"
        icon={liked ? 'heart': 'heart-outline'}
        value={likesCount}
        label={!likesCount ? "Like" : null}
        onClick={ online && !liked && isLoggedIn ? () => onLikeClicked(slug) : null }
      />;

    
    const authProps = { t, openAuthModal, baseClassName };
    if ( !isLoggedIn )
      likeStat = <AuthDropdown { ...authProps } toggleEl = { likeStat } loginText = {t('LikeDropdown.please-log-in')} />;
    
    return (
      <div className={classNames(classes)}>
        <DocumentTitle title={`${title} - ${t('global.site-title')}`} />
        <DocumentClass className={`${baseClassName}-document--offline`} remove={online} />
        <Block>
          <div className={`${baseClassName}__wrapper`}>
            <BookBreadcrumbs offline={!online} t={t} />
            <div className={`${baseClassName}__cover-wrapper`}>
              <div className={`${baseClassName}__cover`}>
                <BookCard
                  book={book}
                  fontSize="l"
                  disabled={isFetchingAssets}
                  loading={isFetchingAssets}
                  onClick={() => this.onReadClicked(slug, 'Book Card')}
                  shouldDisplayMenu={false}
                  noSrcSet={!online}
                />
              </div>
              <div className={`${baseClassName}__stats`}>
                  {likeStat}
                  <Stat
                    icon="book"
                    value={readsCount} />
              </div>
            </div>
            <div className={`${baseClassName}__content`}>
              <h1 className={classNames(titleClasses)}>{title}</h1>
              <Credits
                isTranslation={isTranslation}
                isRelevelled={isRelevelled}
                authors={authors}
                illustrators={illustrators}
                photographers={photographers}
                originalTitle={originalTitle}
                originalSlug={originalSlug}
                originalAuthors={originalAuthors}
                offline={!online}
                t={t}
                onProfileLinkClicked={this.onProfileLinkClicked}
                />
              <Publisher
                publisher={publisher}
                offline={!online}
                />
              <div>{description}</div>
                <FloatingActionsBar float={!viewport.large}>
                  <div className={`${baseClassName}__cta-wrapper`}>
                  <Button
                    fullWidth
                    label={t('Book.read')}
                    variant="primary"
                    loading={isFetchingAssets}
                    onClick={() => this.onReadClicked(slug, 'Read Button')}
                  />
                </div>
                </FloatingActionsBar>
                {
                  (book.externalLink)
                  ?
                  <p>{book.externalLink.text} <Link isInternal={true} href={book.externalLink.link}>{t('Book.externalLink')}</Link></p>
                  :
                  null
                }
              <Rowifier separator borderTop>
                {
                  (!online || (isContestStory && !showOptions))
                  ?
                  null
                  :
                  <BookActions
                    title={title}
                    offline={!online}
                    downloadLinks={downloadLinks}
                    isFetchingUserLists={isFetchingUserLists}
                    userLists={userLists}
                    onAddToList={onAddToList}
                    onCreateList={() => this.onOpenModal('createList')}
                    onRemoveFromList={onRemoveFromList}
                    slug={slug}
                    isLoggedIn={isLoggedIn}
                    authProps={authProps}
                    isFlagged={isFlagged}
                    isAddingOrRemovingFromList={isAddingOrRemovingFromList}
                    listMemberships={listMemberships}
                    baseClassName={baseClassName}
                    onOpenModal={this.onOpenModal}
                    isEditable={isEditable}
                    onEdit={() => status === "published" ? this.onOpenModal('confirmEdit') : onEdit()}
                    roles={roles}
                    isEditorsPick={isEditorsPick}
                    onAddToEditorsPicks={onAddToEditorsPicks}
                    onRemoveFromEditorsPicks={onRemoveFromEditorsPicks}
                    isAddingToOrRemovingFromEditorsPicks={isAddingToOrRemovingFromEditorsPicks}
                    openAuthModal={openAuthModal}
                    onTranslateClicked={onTranslateClicked}
                    onRelevelClicked={onRelevelClicked}
                    addNotification={addNotification}
                    notifications={notifications}
                    removeNotification={removeNotification}
                    userEmail={userEmail}
                    level={level}
                    language={language}
                    recordGaEvents={recordGaEvents}
                    recordBookDownload={recordBookDownload}
                    recordBookDownloadPopUpOpened={recordBookDownloadPopUpOpened}
                  />
                }
                {
                  online && translations && translations.length
                  ?
                  <Translations translations={translations} versionCount={book.versionCount} languageCount={book.languageCount} offline={!online} t={t} />
                  :
                  null
                }
                {
                  process.env.REACT_APP_FEATURE_OFFLINE
                  ?
                  <OfflineActions
                    availableOffline={availableOffline}
                    onClickAddToOffline={() => { offlineBooksCount < MAX_OFFLINE_BOOKS_COUNT ? this.onAddToOfflineClicked() : this.onOpenModal('noSpaceForMoreOfflineBooks') }}
                    onClickRemoveFromOffline={() => this.onOpenModal('delete')}
                    disabled={!('serviceWorker' in navigator)}
                    isLoggedIn={isLoggedIn}
                    isSavingOffline={isSavingOffline}
                    t={t}
                    openAuthModal={openAuthModal}
                  />
                  :
                  null
                }

                {
                  (!online || !tags || !tags.length)
                  ?
                  null
                  :
                  <Tags tags={tags} baseClassName={baseClassName} />
                }

                {
                  online && book.readingListMembershipCount
                  ?
                  <CollapsibleSection title={t('Book.story-is-part-of', book.readingListMembershipCount)}>
                    <Sizer
                      maxHeight="l"
                      scrollY
                    >
                      <List>
                        {
                          (book.lists.map((list, i) => {
                            return <Link isInternal={true} key={i} href={links.list(list.slug)} >
                                    {i + 1}. {list.title}
                                  </Link>
                          }))
                        }
                      </List>
                    </Sizer>
                  </CollapsibleSection>
                  :
                  null
                }


                {
                  copyrightNotice
                  ?
                  <p>{copyrightNotice}</p>
                  :
                  null
                }
              </Rowifier>
            </div>
          </div>
        </Block>
        <SimilarBooks offline={!online} similarBooks={similarBooks} t={t} viewport={viewport} />
        <EmbedModal
          isVisible={this.state.isModalVisible.embed}
          onCloseClick={() => this.onCloseModal('embed')}
          orientation={orientation}
          slug={slug}
          viewport={viewport}
        />
        <FlagModal
          isVisible={this.state.isModalVisible.flag}
          onCloseClicked={() => this.onCloseModal('flag')}
          onFlagClicked={reasons => onFlagClicked(slug, reasons)}
          viewport={viewport}
          isFlaggingBook={isFlaggingBook}
        />
        <RelevelModal
          isVisible={this.state.isModalVisible.relevel}
          onCloseClicked={() => this.onCloseModal('relevel')}
          viewport={viewport}
        />
        <DownloadModal
          isVisible={this.state.isModalVisible.download}
          onCloseClicked={() => this.onCloseModal('download')}
          onFormLinkClicked={this.onFormLinkClicked}
        />
        {
          this.state.isModalVisible.confirmEdit
          ?
          <ConfirmModal
            text={t('Book.confirm-edit')}
            onConfirm={() => { this.onCloseModal('confirmEdit'); onEdit(); }}
            onClose={() => this.onCloseModal('confirmEdit')}
            viewport={viewport}
          />
          :
          null
        }
        {
          this.state.isModalVisible.createList
          ?
          <CreateListModal
            viewport={viewport}
            isCreatingReadingList={isCreatingReadingList}
            onClose={() => this.onCloseModal('createList')}
            onCreate={onCreateList}
            bookSlug={slug}
          />
          :
          null
        }
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
        {
          this.state.isModalVisible.delete
          ?
          <DeleteModal
            onConfirm={onClickRemoveFromOffline}
            onClose={() => this.onCloseModal('delete')}
            viewport={viewport}
            count={1}
            books={[book]}
            userEmail={userEmail}
            recordGaEvents={recordGaEvents}
            baseClassName={baseClassName}
          />
          :
          null
        }
      </div>
    );
  }
}

Book.propTypes = {
  title: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
  language: PropTypes.string.isRequired,
  level: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  slug: PropTypes.string.isRequired,
  coverImage: PropTypes.object.isRequired,
  recommended: PropTypes.bool,
  online: PropTypes.bool,
  avilableOffline: PropTypes.bool,
  authors: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    slug: PropTypes.string.isRequired
  })),
  publisher: PropTypes.object,
  likesCount: PropTypes.number,
  readsCount: PropTypes.number,
  tags: PropTypes.array,
  translations: PropTypes.arrayOf(PropTypes.shape({
    language: PropTypes.string.isRequired,
    level: PropTypes.string.isRequired,
    slug: PropTypes.string.isRequired
  })),
  downloadLinks: PropTypes.arrayOf(PropTypes.shape({
    type: PropTypes.string.isRequired,
    href: PropTypes.string.isRequired
  })),
  similarBooks: PropTypes.arrayOf(PropTypes.shape(BookCard.propTypes)),
  onReadClicked: PropTypes.func,
  onClickAddToOffline: PropTypes.func,
  onClickRemoveFromOffline: PropTypes.func,
  viewport: PropTypes.object,
  isEditable: PropTypes.bool,
  onEdit: PropTypes.func,
  isSavingOffline: PropTypes.bool,
  offlineBooksCount: PropTypes.number,
  externalLink: PropTypes.object
};

export default translate()(Book);
