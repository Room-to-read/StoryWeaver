import React, { Component } from 'react';
import { translate } from 'react-polyglot';
import PropTypes from 'prop-types';
import DocumentTitle from 'react-document-title';

import PageHeader from '../PageHeader';
import Block from '../Block';
import ContentStyler from '../ContentStyler';
import Stuffer from '../Stuffer';
import BookCard from '../BookCard';
import Grid from '../Grid';
import Pagination from '../Pagination';
import SectionBlock from '../SectionBlock';
import Columnizer from '../Columnizer';
import SelectField from '../SelectField';
import SearchableSelectField from '../SearchableSelectField';
import TranslateFiltersContainer from '../TranslateFiltersContainer';

import { links } from '../../lib/constants';

import './AllTranslateListing.scss';

@translate()
class AllTranslateListing extends Component {
  static defaultProps = {}

  render() {
    const baseClassName = 'pb-all-translate-listing';
    const classNames = [baseClassName];

    const {
      t,
      viewport,
      books,
      metadata,
      appliedFilters,
      sourceLanguage,
      targetLanguage,
      changeSourceLanguage,
      changeTargetLanguage,
      loadMore,
      filters,
      isFetchingMore
    } = this.props;

    const breadcrumbPaths = [{
      title: t('global.home'),
      href: links.home(),
      isInternal: true
    }];

    const bookEls = books.map(book => {
      return (
        <BookCard key={book.slug} book={book} />
      )
    });

    const { language } = filters;
    let sourceOptions;
    let targetOptions;
    if (language) {
      sourceOptions = [{ name: `${t('Translate.choose-language')}`, queryValue: '' }, ...language.sourceQueryValues];
      targetOptions = [{ name: `${t('Translate.choose-language')}`, queryValue: '' }, ...(language.targetQueryValues.filter(language => language.name !== sourceLanguage))];
    } else {
      sourceOptions = [{ name: `${t('Translate.choose-language')}`, queryValue: '' }];
      targetOptions = [{ name: `${t('Translate.choose-language')}`, queryValue: '' }];
    }

    return (
      <div className={classNames.join(' ')}>
        <DocumentTitle title={`${t('AllTranslateListing.page-title')} - ${t('global.site-title')}`} />
        <PageHeader title={t("AllTranslateListing.page-title")} breadcrumbPaths={breadcrumbPaths} />
        <Block>
          <Stuffer horizontalSpacing={viewport.large ? 'xl' : null}>
            <ContentStyler>
              <h2>{t("AllTranslateListing.title")}</h2>
              <p className="pb-center">{t("AllTranslateListing.introduction")}</p>
            </ContentStyler>
          </Stuffer>
        </Block>

        <SectionBlock>
          <Stuffer horizontalSpacing={viewport.large ? 'xl' : null}>
            <Columnizer>
              <div>
                {
                  viewport.medium
                  ?
                  <SearchableSelectField
                    id="pb-translate-landing-from-lang"
                    label={t('global.from')}
                    value={sourceLanguage}
                    options={sourceOptions}
                    onChange={changeSourceLanguage}
                    />
                  :
                  <SelectField
                    id="pb-translate-landing-from-lang"
                    label={t('global.from')}
                    value={sourceLanguage}
                    options={sourceOptions}
                    onChange={changeSourceLanguage}
                    />
                }
              </div>
              <div>
                {
                  viewport.medium
                  ?
                  <SearchableSelectField
                    id="pb-translate-landing-to-lang"
                    label={t('global.to')}
                    value={targetLanguage}
                    options={targetOptions}
                    onChange={changeTargetLanguage}
                    />
                  :
                  <SelectField
                    id="pb-translate-landing-to-lang"
                    label={t('global.to')}
                    value={targetLanguage}
                    options={targetOptions}
                    onChange={changeTargetLanguage}
                    />
                }
              </div>
            </Columnizer>
          </Stuffer>
        </SectionBlock>

        <TranslateFiltersContainer />

        <Block>
          <Grid variant="2up-6up">{bookEls}</Grid>
          {
            (metadata.page < metadata.totalPages)
            ?
            <Pagination loading={isFetchingMore} onClick={loadMore.bind(this, sourceLanguage, targetLanguage, appliedFilters, metadata.page + 1, void 0)} />
            :
            null
          }
        </Block>
      </div>
    );
  }
}

AllTranslateListing.propTypes = {
  t: PropTypes.func.isRequired,
  viewport: PropTypes.object.isRequired,
  books: PropTypes.arrayOf(PropTypes.shape(BookCard.propTypes)),
};

export default AllTranslateListing;
