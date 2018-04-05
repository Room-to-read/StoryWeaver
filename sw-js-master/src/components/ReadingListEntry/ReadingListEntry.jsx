import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-polyglot';
import classNames from 'classnames';

import ActionBar, { ActionBarSection } from '../ActionBar';
import BookCard from '../BookCard';
import Link from '../Link';
import List from '../List';
import SvgIcon from '../SvgIcon';
import TextField from '../TextField';

import {
  gaEventCategories,
  gaEventActions
} from '../../lib/constants';

import './ReadingListEntry.scss';

class ReadingListEntry extends Component {
  hasUsageInstructions(field) {
    const { book } = this.props;
    return book.usageInstructions &&
           book.usageInstructions[field] !== null &&
           typeof book.usageInstructions[field] !== 'undefined';
  }
  
  hasUsageInstructionsTxt() {
    return this.hasUsageInstructions('txt');
  }
  
  hasUsageInstructionsHtml() {
    return this.hasUsageInstructions('html');
  }

  onBookClicked = (bookPath) => {
    const {
      recordGaEvents,
      userEmail,
      listTitle,
      book,
      readingListCategories
    } = this.props;

    recordGaEvents({
      eventCategory: gaEventCategories.list,
      eventAction: gaEventActions.bookPageOpenedFromList,
      userEmail: userEmail,
      eventLabel: listTitle,
      dimension2: book.level,
      dimension3: book.language,
      dimension4: 'Online',
      dimension5: book.slug,
      dimension6: readingListCategories
    })
    if (bookPath) {
      window.location.href = bookPath;
    }
  }
  
  renderActionBarEl(baseClassName) {
    const {
      editActive,
      index,
      first,
      last,
      t,
    } = this.props;

    if (!editActive) {
      return null;
    }

    return (
      <div className={`${baseClassName}__footer`}>
        <ActionBar
          noSectionSeparators
          noBottomBorder>
          <ActionBarSection>
            <List inline>
              <Link onClick={() => this.props.onDeleteBook(index)} theme="danger">
                <SvgIcon name="bin" />
                {t('global.delete')}
              </Link>
              {
                this.hasUsageInstructionsTxt()
                ?
                <Link onClick={() => this.props.onRemoveHowToUse(index)} theme="danger">
                  <SvgIcon name="close-circle" />
                  {t('global.remove')} ‘{t('ReadingList.how-to-use')}’
                </Link>
                :
                <Link onClick={() => this.props.onAddHowToUse(index)}>
                  <SvgIcon name="plus-circle" />
                  {t('global.add')} ‘{t('ReadingList.how-to-use')}’
                </Link>
              }
            </List>
          </ActionBarSection>
          {
            first && last && this.hasUsageInstructionsTxt()
            ?
            null
            :
            (
              <ActionBarSection>
                <List inline>
                  {
                    !first
                    ?
                    <Link onClick={() => this.props.onMoveBook(index, -1)} title={t('ReadingList.move-up')}>
                      <SvgIcon name="arrow-up" /> {t('ReadingList.move-up')}
                    </Link>
                    :
                    null
                  }
                  {
                    !last
                    ?
                    <Link onClick={() => this.props.onMoveBook(index, 1)} title={t('ReadingList.move-down')}>
                      <SvgIcon name="arrow-down" /> {t('ReadingList.move-down')}
                    </Link>
                    :
                    null
                  }
                </List>
              </ActionBarSection>
            )
          }
        </ActionBar>
      </div>
    );
  }

  renderUsageInstructionEl(baseClassName) {
    const {
      editActive,
      book,
      t,
      onFieldFocus,
      onFieldBlur
    } = this.props;

    if (editActive) {
      return (
        <div className={`${baseClassName}__desc`}>
          {
            this.hasUsageInstructionsTxt()
            ?
            <TextField
              id={`reading-list-entry-usage-instructions-input-{book.id}`}
              label={t('ReadingList.how-to-use')}
              defaultValue={book.usageInstructions.txt}
              type="multiline"
              onChange={e => this.props.onFieldChange('usageInstructions.txt', e.target.value)}
              onFocus={onFieldFocus}
              onBlur={onFieldBlur}
              />
            :
            <div>{book.synopsis}</div>
          }
        </div>
      );
    } else {
      return (
        this.hasUsageInstructionsHtml()
        ?
        <div className={`${baseClassName}__desc`}>
          <h3 className={`${baseClassName}__desc-title`}>{t('ReadingList.how-to-use')}:</h3>
          <div dangerouslySetInnerHTML={{__html: book.usageInstructions.html}}></div>
        </div>
        :
        <div className={`${baseClassName}__desc`}>{book.synopsis}</div>
      );
    }
  }

  render() {
    const baseClassName = 'pb-reading-list-entry';
    const variations = 3;

    const {
      index,
      book,
      editActive,
      active
    } = this.props;

    const bookPath = `/stories/${book.slug}`;

    const classes = {
      [baseClassName]: true,
      [`${baseClassName}--indexed`]: typeof index === 'number',
      [`${baseClassName}--index-${(index + 1) % variations}`]: typeof index === 'number',
      [`${baseClassName}--edit-active`]: editActive,
      [`${baseClassName}--active`]: active,
    };

    return (
      <div className={classNames(classes)}>
        <div className={`${baseClassName}__content`}>
          <div className={`${baseClassName}__col-1`}>
            {
              typeof index === 'number'
              ?
              <span className={`${baseClassName}__index`}>{index + 1}</span>
              :
              null
            }
            <div className={`${baseClassName}__book-card`}>
              <BookCard book={book} shouldDisplayMenu={false} onClick={() => this.onBookClicked(bookPath)}/>
            </div>
          </div>
          <div className={`${baseClassName}__col-2`}>
            <h3 className={`${baseClassName}__title`}>
              <Link parentClassName={`${baseClassName}__link`} href={bookPath} onClick={this.onBookClicked} isInternal>{book.title}</Link>
            </h3>
            {this.renderUsageInstructionEl(baseClassName)}
          </div>
        </div>
        {this.renderActionBarEl(baseClassName)}
      </div>
    );
  }
}

ReadingListEntry.propTypes = {
  index: PropTypes.number,
  book: PropTypes.shape(BookCard.propTypes),
  editActive: PropTypes.bool,
  active: PropTypes.bool,
  onFieldChange: PropTypes.func,
  onAddHowToUse: PropTypes.func,
  onRemoveHowToUse: PropTypes.func,
  onDeleteBook: PropTypes.func,
  onMoveBook: PropTypes.func,
  onFieldFocus: PropTypes.func,
  onFieldBlur: PropTypes.func,
};

export default translate()(ReadingListEntry);
