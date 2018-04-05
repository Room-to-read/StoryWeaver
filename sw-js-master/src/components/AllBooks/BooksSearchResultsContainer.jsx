import React, { Component } from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-polyglot';
import u from 'updeep';
import { isEqual } from 'lodash';

import LoaderBlock from '../LoaderBlock';
import Pagination from '../Pagination';
import BookCard from '../BookCard';
import Grid from '../Grid';
import FiltersBar from '../FiltersBar';
import FiltersPanel from '../FiltersPanel';
import Button from '../Button';
import Checkbox from '../Checkbox';
import Columnizer from '../Columnizer';
import SelectableGrid from '../SelectableGrid';

import {
  fetchAllBooksFiltersWorkflow,
  fetchAllBooksWorkflow,
} from '../../redux/allBooksActions';
import { fetchMeWorkflow } from '../../redux/userActions'
import {  fetchBookAssetsWorkflow } from '../../redux/bookActions';
import { recordGaEvents } from '../../redux/googleAnalyticsActions';
import { sortOptions, links, bulkDownloadOptions, sectionClicked, gaEventCategories, gaEventActions } from '../../lib/constants';

import './BooksSearchResultsContainer.scss';


const BookGridEl = ({ books, onReadClicked, isFetchingAssets, t }) => {
  const bookEls = books.map(book => {
    return (
      <BookCard
        key={book.slug}
        book={book}
        sectionClicked={sectionClicked.allStories}
      />
    )
  });

  return <Grid variant="2up-6up">{bookEls}</Grid>
};


const NoResults = translate()(({ t }) => (
  <span>
    <p>{t("Books.no-result-warning-1")}</p>
    <p>{t("Books.no-result-warning-2")}</p>
    <ul>
      <li>{t("Books.no-result-warning-3")}</li>
      <li>{t("Books.no-result-warning-4")}</li>
      <li>{t("Books.no-result-warning-5")}</li>
      <li>{t("Books.no-result-warning-6")}</li>
    </ul>
  </span>
));


const mapDispatchToProps = {
  fetchAllBooksFiltersWorkflow,
  fetchAllBooksWorkflow,
  fetchBookAssetsWorkflow,
  fetchMeWorkflow,
  recordGaEvents
};

const mapStateToProps = ({ allBooks, viewport, book: { assets, isFetchingAssets }, user: { profile }, allFilters: { readFilters }}) => ({
  ...allBooks,
  viewport,
  assets,
  isFetchingAssets,
  isOrganisationMember: profile.isOrganisationMember,
  appliedFilters: readFilters,
  userEmail: profile.email
});

@translate()
@connect(mapStateToProps, mapDispatchToProps)
class BooksSearchResultsContainer extends Component {
  constructor(props) {
    super(props);

    const { t } = props;

    this.state = {
      // The filters bar allows searching through available
      // filter values. We store that search text here.
      filtersSearchText: {
        category: '',
        publisher: '',
        level: '',
        language: ''
      },
      isBulkDownloadTabClicked: false,
      checkedValues: [],
      allChecked: false
    }

    this.filtersBarSortOptions = [
      {
        name: t('sort.relevance'),
        queryValue: sortOptions.relevance
      },
      {
        name: t('sort.new-arrivals'),
        queryValue: sortOptions.newArrivals
      },
      {
        name: t('sort.most-read'),
        queryValue: sortOptions.mostRead
      },
      {
        name: t('sort.most-liked'),
        queryValue: sortOptions.mostLiked
      },
      {
        name: t('sort.editors-picks'),
        queryValue: sortOptions.editorsPicks
      }
    ];

    // FiltersBar uses a SelectBox to display sort options, whereas
    // FiltersPanel uses a RadioGroup. Both these components expect
    // different props to display options. We do the transformation
    // here, before passing the props down.
    this.filtersPanelSortOptions = this.props.translateFiltersBarSortOptionsToFiltersPanelSortOptions(this.filtersBarSortOptions);

    this.filtersBarBulkDownloadOptions = [
      {
        name: t('BulkDownload.all-stories'),
        queryValue: bulkDownloadOptions.allStories
      },
      {
        name: t('BulkDownload.not-downloaded'),
        queryValue: bulkDownloadOptions.notDownloaded
      }
    ];

  
}

  // Updates filter bar search text for a specified filter.
  updateFiltersSearchText = (key, text) => {
    this.setState(u({
      filtersSearchText: {
        [key]: text
      }
    }, this.state));
  };


  onChangeCheckedValues = (checkedValues) => {
    this.setState(
      {checkedValues: checkedValues});
  }

  openBulkStoriesDownload = () => {
    this.setState({isBulkDownloadTabClicked: true});
    //Adding filter All Stories as default whenever DOWNNLOAD MULTIPLE BOOKS button is clicked
    this.props.applyFilter('bulk_download', bulkDownloadOptions.allStories);
  }

  closeBulkStoriesDownload = () => {
    this.setState(u(
      {isBulkDownloadTabClicked: false, checkedValues: [], allChecked: false}, this.state));
    //Removing bulkDownload filter whenever CANCEL button is clicked
    this.props.removeFilter('bulk_download', this.props.appliedFilters.bulk_download);
  }

  allCheckedChange = (allChecked) => {
    this.setState({ allChecked: allChecked.checked });
  }

  downloadBulkStoriesDownload= () => {
    if(this.state.checkedValues.length > 0 ) {
      window.open(links.bulkStoriesDownload(this.state.checkedValues));
      this.props.recordGaEvents({
        eventCategory: gaEventCategories.bulkDownload,
        eventAction: gaEventActions.download,
        userEmail: this.props.userEmail,
        metric4: this.state.checkedValues.length
      });
    }
  }

  // Convenience methods for updating filter bar search text for
  // our current list of filters.
  updateCategorySearchText = e => this.updateFiltersSearchText('category', e.target.value);
  updatePublisherSearchText = e => this.updateFiltersSearchText('publisher', e.target.value);
  updateLevelSearchText = e => this.updateFiltersSearchText('level', e.target.value);
  updateLanguageSearchText = e => this.updateFiltersSearchText('language', e.target.value);

  onLoadMore = () => this.props.fetchAllBooksWorkflow(
    this.props.appliedFilters,
    this.props.loadedPages + 1
  );

  componentWillReceiveProps(nextProps) {
    if (!isEqual(this.props.appliedFilters, nextProps.appliedFilters)) {
      this.props.fetchAllBooksWorkflow(nextProps.appliedFilters);
      // Reset all checked books on changing /applying new filters
      if(this.state.isBulkDownloadTabClicked) {
        this.setState({checkedValues: [], allChecked: false})
      }
    }
  }

  renderBookEls() {
    const { books } = this.props;

    return books.map(book => {
      return (
        <BookCard
          key={book.slug}
          id={book.id}
          book={book}
          faded={book.storyDownloaded}
        />
      );
    });
  }

  componentDidMount() {
    const {
      fetchAllBooksFiltersWorkflow,
      fetchAllBooksWorkflow,
      appliedFilters,
    } = this.props;
    
    // First fetch available filters, then fetch the books.
    fetchAllBooksFiltersWorkflow().then(
      () => fetchAllBooksWorkflow(appliedFilters)
    );
  }

  render() {
    const {
      t,
      isFetchingBooks,
      books,
      isFetchingAssets,
      totalBooksCount,
      viewport,
      filters,
      isFetchingFilters,
      appliedFilters,
      applyFilter,
      removeFilter,
      onSortOptionChanged,
      isOrganisationMember
    } = this.props;

    let isBulkDownloadTabClicked = this.state.isBulkDownloadTabClicked
    const baseClassName = 'pb-books-search-results';

    if (!filters || isFetchingFilters) {
      return <LoaderBlock />;
    }

    let filtersComponent = null;
    if (viewport.medium) {
      filtersComponent = (
        <FiltersBar
          noTopBorder
          pullUp
          filters={filters}
          applyFilter={applyFilter}
          removeFilter={removeFilter}
          appliedFilters={appliedFilters}
          categorySearchValue={this.state.filtersSearchText.category}
          updateCategorySearchValue={this.updateCategorySearchText}
          publisherSearchValue={this.state.filtersSearchText.publisher}
          updatePublisherSearchValue={this.updatePublisherSearchText}
          levelSearchValue={this.state.filtersSearchText.level}
          updateLevelSearchValue={this.updateLevelSearchText}
          languageSearchValue={this.state.filtersSearchText.language}
          updateLanguageSearchValue={this.updateLanguageSearchText}
          resultsCount={totalBooksCount}
          itemTypeLabel={t('global.story', totalBooksCount)}
          sortOptions={this.filtersBarSortOptions}
          applySortOption={onSortOptionChanged}
          appliedSortOption={appliedFilters.sort}
          bulkDownloadOptions={isBulkDownloadTabClicked ? this.filtersBarBulkDownloadOptions : null}
        />
      );
    } else {
      filtersComponent = (
        <FiltersPanel
          filters={filters}
          applyFilter={applyFilter}
          removeFilter={removeFilter}
          appliedFilters={appliedFilters}
          viewport={viewport}
          categorySearchValue={this.state.filtersSearchText.category}
          updateCategorySearchValue={this.updateCategorySearchText}
          publisherSearchValue={this.state.filtersSearchText.publisher}
          updatePublisherSearchValue={this.updatePublisherSearchText}
          levelSearchValue={this.state.filtersSearchText.level}
          updateLevelSearchValue={this.updateLevelSearchText}
          languageSearchValue={this.state.filtersSearchText.language}
          updateLanguageSearchValue={this.updateLanguageSearchText}
          resultsCount={totalBooksCount}
          itemTypeLabel={t('global.story', totalBooksCount)}
          sortOptions={this.filtersPanelSortOptions}
          applySortOption={onSortOptionChanged}
          appliedSortOption={appliedFilters.sort}
          bulkDownloadOptions={isBulkDownloadTabClicked ? this.filtersBarBulkDownloadOptions : null}
        />
      );
    }

    let bulkDownloadComponent = null;

    if (isOrganisationMember) {
      if (isBulkDownloadTabClicked) {
        bulkDownloadComponent = (
          <div className={`${baseClassName}`} >
            <div className={`${baseClassName}__bulk-download-bar`} >
              <Columnizer>
                <div className={`${baseClassName}__bulk-download-select-all`} >
                  <Checkbox
                    label={t('global.bulk-download-select-all')}
                    id="auth-modal-remember-me"
                    onChange={this.allCheckedChange}
                    checked={this.state.allChecked}
                    inline
                  />
                </div>
                <div className={`${baseClassName}__bulk-download-cancel`} >
                  <Button
                    label={t("global.bulk-download-all")}
                    variant="primary"
                    onClick={this.downloadBulkStoriesDownload}
                    disabled={this.state.checkedValues.length === 0}
                  />
                  <Button
                    label={t("global.cancel")}
                    onClick={this.closeBulkStoriesDownload}
                  />
                </div>
              </Columnizer>
            </div>
            <div className={`${baseClassName}__bulk-download-count`}>
              <span className={`${baseClassName}__count`}>
                {`${t('Book.bulk-download-stories-count', {stories_selected: this.state.checkedValues.length, total_stories: books.length })} `}
              </span>
            </div>
          </div>
        );
      }
      else
      {
        bulkDownloadComponent = (
          <div className={`${baseClassName}__bulk-download-bar`} >
            <Columnizer>
              <div className={`${baseClassName}__bulk-download`} >
                <Button
                  label={t("global.bulk-download-button")}
                  variant="primary"
                  onClick={this.openBulkStoriesDownload}
                />
              </div>
            </Columnizer>
          </div>
        );
      }
    }



    const shouldShowLoadMore = books && books.length < totalBooksCount;

    return (
      <div>
        { filtersComponent }
        { bulkDownloadComponent }
        {
          isFetchingBooks || !books
          ?
          <LoaderBlock />
          :
          (
            isBulkDownloadTabClicked
            ?
            <div>
              <SelectableGrid
                id="offline-book-selectable-grid"
                variant="2up-6up"
                roundedCorners
                onChange={this.onChangeCheckedValues}
                allSelected={this.state.allChecked}
                theme="primary"
              >
                {this.renderBookEls()}
              </SelectableGrid>

              {
                shouldShowLoadMore
                ?
                <Pagination
                  onClick={this.onLoadMore}
                  loading={this.props.isFetchingMoreBooks}
                />
                :
                null
              }
              {
                totalBooksCount
                ?
                null
                :
                <NoResults />
              }
            </div>
            :
            <div>
              <BookGridEl
                books={books}
                onReadClicked={this.onReadClicked}
                isFetchingAssets={isFetchingAssets}
                t={t}
              />
              {
                shouldShowLoadMore
                ?
                <Pagination
                  onClick={this.onLoadMore}
                  loading={this.props.isFetchingMoreBooks}
                />
                :
                null
              }
              {
                totalBooksCount
                ?
                null
                :
                <NoResults />
              }
            </div>
          )
        }
      </div>
    );
  }
}

BooksSearchResultsContainer.propTypes = {
};

export default BooksSearchResultsContainer;
