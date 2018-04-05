import React, { Component } from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-polyglot';
import u from 'updeep';
import { isEqual } from 'lodash';

import LoaderBlock from '../LoaderBlock';
import Pagination from '../Pagination';
import ImageCard from '../ImageCard';
import Grid from '../Grid';
import FiltersBar from '../FiltersBar';
import FiltersPanel from '../FiltersPanel';

import {
    fetchImagesFiltersWorkflow,
    fetchImagesWorkflow,
} from '../../redux/imagesSearchActions';
import { recordGaEvents } from '../../redux/googleAnalyticsActions';
import { sortOptions, gaEventCategories, gaEventActions, sectionClicked } from '../../lib/constants';


const ImageGridEl = ({ images, onProfileLinkClicked }) => {
  const imageEls = images.map(image => {
    return (
      <ImageCard
        key={image.slug}
        title={image.title}
        slug={image.slug}
        image={image.imageUrls[0]}
        artists={image.illustrators}
        onProfileLinkClicked={onProfileLinkClicked}
      />
    )
  });

  return <Grid variant="2up-6up">{imageEls}</Grid>
};


// TODO: Move this out or fix it.
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
    fetchImagesFiltersWorkflow,
    fetchImagesWorkflow,
    recordGaEvents
};

const mapStateToProps = ({ images, viewport, allFilters: { imagesFilters }, user: { profile } }) => ({
  ...images,
  viewport,
  appliedFilters: imagesFilters,
  userEmail: profile.email
});

@translate()
@connect(mapStateToProps, mapDispatchToProps)
class ImagesSearchResultsContainer extends Component {
  constructor(props) {
    super(props);

    const { t } = props;

    this.state = {
      // The filters bar allows searching through available
      // filter values. We store that search text here.
      filtersSearchText: {
        category: '',
        publisher: '',
        style: '',
      },
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
        name: t('sort.most-viewed'),
        queryValue: sortOptions.mostViewed
      },
      {
        name: t('sort.most-liked'),
        queryValue: sortOptions.mostLiked
      },
    ];

    // FiltersBar uses a SelectBox to display sort options, whereas
    // FiltersPanel uses a RadioGroup. Both these components expect
    // different props to display options. We do the transformation
    // here, before passing the props down.
    this.filtersPanelSortOptions = this.props.translateFiltersBarSortOptionsToFiltersPanelSortOptions(this.filtersBarSortOptions);
  }

  // Updates filter bar search text for a specified filter.
  updateFiltersSearchText = (key, text) => {
    this.setState(u({
      filtersSearchText: {
        [key]: text
      }
    }, this.state));
  };

  // Convenience methods for updating filter bar search text for
  // our current list of filters.
  updateCategorySearchText = e => this.updateFiltersSearchText('category', e.target.value);
  updatePublisherSearchText = e => this.updateFiltersSearchText('publisher', e.target.value);
  updateStyleSearchText = e => this.updateFiltersSearchText('style', e.target.value);

  onLoadMore = () => this.props.fetchImagesWorkflow(
    this.props.appliedFilters,
    this.props.loadedPages + 1
  );

  onProfileLinkClicked = (profileSlug) => {
    const {
      recordGaEvents,
      userEmail,
    } = this.props;
  
    recordGaEvents({
      eventCategory: gaEventCategories.profile,
      eventAction: gaEventActions.opened,
      eventLabel: sectionClicked.illustrationSearchPage,
      userEmail: userEmail,
      dimension5: profileSlug
    });
  }

  componentWillReceiveProps(nextProps) {
    if (!isEqual(this.props.appliedFilters, nextProps.appliedFilters)) {
      this.props.fetchImagesWorkflow(nextProps.appliedFilters);
    }
  }

  componentDidMount() {
    const {
      fetchImagesFiltersWorkflow,
      fetchImagesWorkflow,
      appliedFilters,
    } = this.props;

    fetchImagesFiltersWorkflow().then(
      () => fetchImagesWorkflow(appliedFilters)
    );
  }
  
  render() {
    const {
      t,
      isFetchingImages,
      images,
      totalImagesCount,
      viewport,
      filters,
      isFetchingFilters,
      appliedFilters,
      applyFilter,
      removeFilter,
      onSortOptionChanged,
    } = this.props;
 
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
          styleSearchValue={this.state.filtersSearchText.style}
          updateStyleSearchValue={this.updateStyleSearchText}
          resultsCount={totalImagesCount}
          itemTypeLabel={t('global.image', totalImagesCount)}
          sortOptions={this.filtersBarSortOptions}
          applySortOption={onSortOptionChanged}
          appliedSortOption={appliedFilters.sort}
        />
      );
    } else {
      filtersComponent = (
        <FiltersPanel
          noTopBorder
          pullUp
          viewport={viewport}
          filters={filters}
          applyFilter={applyFilter}
          removeFilter={removeFilter}
          appliedFilters={appliedFilters}
          categorySearchValue={this.state.filtersSearchText.category}
          updateCategorySearchValue={this.updateCategorySearchText}
          publisherSearchValue={this.state.filtersSearchText.publisher}
          updatePublisherSearchValue={this.updatePublisherSearchText}
          styleSearchValue={this.state.filtersSearchText.style}
          updateStyleSearchValue={this.updateStyleSearchText}
          resultsCount={totalImagesCount}
          itemTypeLabel={t('global.image', totalImagesCount)}
          sortOptions={this.filtersPanelSortOptions}
          applySortOption={onSortOptionChanged}
          appliedSortOption={appliedFilters.sort}
        />
      );
    }

    // TODO: nested ternary operators are BAD!
    const shouldShowLoadMore = images && images.length !== 0 ? (images.length < totalImagesCount ? true : false) : false;
    
    return (
      <div>
        { filtersComponent }
        {
          isFetchingImages || !images
          ?
          <LoaderBlock />
          :
          <div>
            <ImageGridEl
              images={images}
              onProfileLinkClicked={this.onProfileLinkClicked}
            />
            {
              shouldShowLoadMore
              ?
              <Pagination
                onClick={this.onLoadMore}
                loading={this.props.isFetchingMoreImages}
              />
              :
              null
            }
            {
              totalImagesCount
              ?
              null
              :
              <NoResults />
            }
          </div>
        }
      </div>
    );
  }
}

ImagesSearchResultsContainer.propTypes = {
};

export default ImagesSearchResultsContainer;
