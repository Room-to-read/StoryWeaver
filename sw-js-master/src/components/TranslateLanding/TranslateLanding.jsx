import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-polyglot';
import DocumentTitle from 'react-document-title';

import Link from '../Link';
import Stuffer from '../Stuffer';
import Block from '../Block';
import Grid from '../Grid';
import BookShelf from '../BookShelf';
import ContentStyler from '../ContentStyler';
import VideoEmbed from '../VideoEmbed';
import PageHeader from '../PageHeader';
import SectionBlock from '../SectionBlock';
import SectionCallToAction from '../SectionCallToAction';
import BookCard from '../BookCard';
import SelectField from '../SelectField';
import SearchableSelectField from '../SearchableSelectField';
import Columnizer from '../Columnizer';
import TranslateFiltersContainer from '../TranslateFiltersContainer';

import { links } from '../../lib/constants';

import './TranslateLanding.scss';

@translate()
class TranslateLanding extends Component {
  render() {
    const baseClassName = 'pb-translate-landing';
    const classNames = [baseClassName];
    const {
      t,
      viewport,
      books,
      sourceLanguage,
      targetLanguage,
      changeSourceLanguage,
      changeTargetLanguage,
      filters
    } = this.props;

    const breadcrumbPaths = [{
      title: t('global.home'),
      href: links.home(),
      isInternal: true
    }];

    const bookEls = books.map(book => {
      return (
        <BookCard key={book.id} book={book} sectionClicked='Translate Page'/>
      );
    });
    let booksHolderEl;

    if (viewport.medium) {
      booksHolderEl = <Grid variant="2up-6up">{bookEls}</Grid>;
    } else {
      booksHolderEl = <BookShelf books={books} viewport={viewport} />;
    }

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
        <DocumentTitle title={`${t('global.translate')} - ${t('global.site-title')}`} />
        <PageHeader title={t("global.translate")} breadcrumbPaths={breadcrumbPaths} />
        <Block>
          <Stuffer horizontalSpacing={viewport.large ? 'xl' : null}>
            <ContentStyler>
              <h2>{t("TranslateLanding.title")}</h2>
              <p className="pb-center">{t("TranslateLanding.introduction")}</p>
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

        <SectionBlock
          noContentHorizontalPadding={viewport.medium ? false : true}>
          {booksHolderEl}
          {
            books.length
            ?
            <SectionCallToAction
              label={t("TranslateLanding.view-all-translation-suggestions")}
              href={links.allTranslate()}
              isInternal
              borderBottom
            />
            :
            null
          }
        </SectionBlock>

        <Block>
          <ContentStyler>
            <h2>{t("TranslateLanding.translating-with-storyweaver")}</h2>
          </ContentStyler>

          <Grid variant="2up">
            <div>
              <VideoEmbed
                aspectRatio="16-by-9"
                src="https://www.youtube.com/watch?v=M6djrUgemp8"
              />
            </div>
            <ContentStyler>
              <p>{t("TranslateLanding.translating-with-storyweaver-content-p01")}</p>
              <p>{t("TranslateLanding.translating-with-storyweaver-content-p02")}</p>
            </ContentStyler>
          </Grid>

          <Stuffer horizontalSpacing={viewport.large ? 'xl' : null}>
            <ContentStyler>
              <h2>{t("TranslateLanding.translating-tips")}</h2>
              <ol>
                <li>{t("TranslateLanding.translating-tip-1-pre-link")} <Link href="https://storyweaver.org.in/reading_levels">{t("global.reading-level", 1)}</Link> {t("TranslateLanding.translating-tip-1-post-link")}</li>
                <li>{t("TranslateLanding.translating-tip-2")}</li>
                <li>{t("TranslateLanding.translating-tip-3")}</li>
                <li>{t("TranslateLanding.translating-tip-4")}</li>
              </ol>
              <p className="pb-center">{t("TranslateLanding.for-more-tips")}, <Link href="#translation">{t("global.click-here")}</Link></p>
            </ContentStyler>
          </Stuffer>
        </Block>
      </div>
    );
  }
}

TranslateLanding.propTypes = {
  viewport: PropTypes.object.isRequired,
  books: PropTypes.arrayOf(PropTypes.shape(BookCard.propTypes)),
};

export default TranslateLanding;
