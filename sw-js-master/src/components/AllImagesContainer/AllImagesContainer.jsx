import React, { Component } from 'react';
import { connect } from 'react-redux';
import { replace } from 'react-router-redux';
import AllImages from '../AllImages';
import FiltersBar from '../FiltersBar';
import FiltersPanel from '../FiltersPanel';
import { translate } from 'react-polyglot';
import { cloneDeep } from 'lodash';
import u from 'updeep';
import { openAuthModal } from '../../redux/userActions';
import { sortOptions } from '../../lib/constants';
import queryString from 'query-string';
import LoaderBlock from '../LoaderBlock';

import { fetchAllIllustrationsFiltersWorkflow, 
         fetchAllIllustrationsWorkflow,
         initializeIllustrations } from '../../redux/allIllustrationsActions';

import { uploadIllustrationWorkflow, 
         autocompleteTagsWorkflow,
         autocompleteIllustratorsWorkflow,
         fetchNewIllustrationFormDataWorkflow } from '../../redux/illustrationActions';

import { recordGaEvents } from '../../redux/googleAnalyticsActions';

const defaultFilters = {
  category: [],
  publisher: [],
  illustrator: [],
  style: [],
  sort: sortOptions.relevance,
  tags: [],
  query: ''
};

const mapStateToProps = ({ allImages, viewport, illustration, user }) => ({
  ...allImages,
  isUploadingIllustration: illustration.isUploadingIllustration,
  isLoggedIn: user.isLoggedIn,
  firstName: user.profile.first_name,
  userRoles: user.profile.roles,
  userEmail: user.profile.email,
  organizationRoles: user.profile.organizationRoles,
  tags: illustration.tags,
  newFormData: illustration.formData,
  illustratorSuggestions: illustration.illustratorSuggestions,
  viewport
});

const mapDispatchToProps = {
  openAuthModal,
  fetchAllIllustrationsFiltersWorkflow,
  fetchAllIllustrationsWorkflow,
  initializeIllustrations,
  replace,
  uploadIllustrationWorkflow,
  autocompleteTagsWorkflow,
  autocompleteIllustratorsWorkflow,
  fetchNewIllustrationFormDataWorkflow,
  recordGaEvents
};

@translate()
@connect(mapStateToProps, mapDispatchToProps)

class AllImagesContainer extends Component {

    constructor(props) {
    super(props);
    const { t } = props;

    this.state = {
      filtersSearchText: {
        category: '',
        publisher: '',
        style: '',
        illustrator: '',
      }
    };
    
    this.filtersBarSortOptions = [
      {
        name: t('sort.relevance'),
        queryValue: sortOptions.relevance
      },
      {
        name: t('sort.new-arrivals-images'),
        queryValue: sortOptions.newArrivals
      },
      {
        name: t('sort.most-viewed'),
        queryValue: sortOptions.mostViewed
      },
      {
        name: t('sort.most-liked'),
        queryValue: sortOptions.mostLiked
      }
    ];

    this.filtersPanelSortOptions = this.filtersBarSortOptions.map(
      so => ({ label: so.name, value: so.queryValue })
    );
  }

  componentDidMount() {
    const {
      initializeIllustrations,
      fetchAllIllustrationsFiltersWorkflow,
      fetchAllIllustrationsWorkflow,
    } = this.props;

    initializeIllustrations();

    fetchAllIllustrationsFiltersWorkflow().then(
      () => fetchAllIllustrationsWorkflow(this.getAppliedFilters())
    );
  }


  updateFiltersSearchText = (key, text) => {
    this.setState(u({
      filtersSearchText: {
        [key]: text
      }
    }, this.state));
  };

  updateStyleSearchText = e => this.updateFiltersSearchText('style', e.target.value);
  updateIllustratorSearchText = e => this.updateFiltersSearchText('illustrator', e.target.value);
  updatePublisherSearchText = e => this.updateFiltersSearchText('publisher', e.target.value);
  updateCategorySearchText = e => this.updateFiltersSearchText('category', e.target.value);
  
  loadMore = () => this.props.fetchAllIllustrationsWorkflow(this.getAppliedFilters(),this.props.loadedPages + 1);


  getAppliedFilters = (props = this.props) => {
    const parsedFilters = queryString.parse(props.location.search);
    Object.entries(parsedFilters).forEach(([ k, v ]) => {
      if (Array.isArray(defaultFilters[k]) && !Array.isArray(v)) {
        parsedFilters[k] = [v];
      }
    });
    
    return ({
      ...defaultFilters,
      ...parsedFilters
    });
  }

  applyFilter = (type, value) => {
    const appliedFilters = cloneDeep(this.getAppliedFilters());
    const filterIsArray = Array.isArray(appliedFilters[type]);

    if (filterIsArray) {
      appliedFilters[type].push(value);
    } else {
      appliedFilters[type] = value;
    }

    this.props.replace({
      search: queryString.stringify(appliedFilters)
    });
    this.props.initializeIllustrations();
    this.props.fetchAllIllustrationsWorkflow(appliedFilters);
  }

  removeFilter = (type, value) => {
    const appliedFilters = cloneDeep(this.getAppliedFilters());

    if (!appliedFilters[type]) {
      return;
    }

    if (Array.isArray(appliedFilters[type])) {
      const index = appliedFilters[type].indexOf(value);
      if (index !== -1 ) {
        appliedFilters[type].splice(index, 1);
      }
    } else {
      delete appliedFilters[type];
    }
    
    this.props.initializeIllustrations();
    this.props.replace({ search: queryString.stringify(appliedFilters) });
    this.props.fetchAllIllustrationsWorkflow(appliedFilters);
  }

  getAppliedFilters = (props = this.props) => {
    const parsedFilters = queryString.parse(props.location.search);
    Object.entries(parsedFilters).forEach(([ k, v ]) => {
      if (Array.isArray(defaultFilters[k]) && !Array.isArray(v)) {
        parsedFilters[k] = [v];
      }
    });
    
    return ({
      ...defaultFilters,
      ...parsedFilters
    });
  }

  onSortOptionChanged = (option) => this.applyFilter('sort', option)

  render() {

    const {
      t,
      viewport,
      isLoggedIn,
      filters,
      isFetchingFilters,
      isFetchingAllIllustrations,
      illustrations,
      illustrationsInfo,
      isFirstPage,
      uploadIllustrationWorkflow,
      fetchAllIllustrationsWorkflow,
      initializeIllustrations,
      isUploadingIllustration,
      openAuthModal,
      firstName,
      userRoles,
      autocompleteTagsWorkflow,
      tags,
      autocompleteIllustratorsWorkflow,
      illustratorSuggestions,
      newFormData,
      fetchNewIllustrationFormDataWorkflow,
      recordGaEvents,
      userEmail,
      organizationRoles
    } = this.props;

    const { filtersSearchText } = this.state;
    const appliedFilters = this.getAppliedFilters();

    if (!filters || isFetchingFilters) {
      return <LoaderBlock />;
    }

    let filtersComponent = null;
    const illustrationsCount = illustrationsInfo.hits;

    if (viewport.medium) {
      filtersComponent = (
        <FiltersBar
          noTopBorder
          pullUp
          filters={filters}
          applyFilter={this.applyFilter}
          removeFilter={this.removeFilter}
          appliedFilters={appliedFilters}
          styleSearchValue={filtersSearchText.style}
          updateStyleSearchValue={this.updateStyleSearchText}
          illustratorSearchValue={filtersSearchText.illustrator}
          updateIllustratorSearchValue={this.updateIllustratorSearchText}
          categorySearchValue={filtersSearchText.category}
          updateCategorySearchValue={this.updateCategorySearchText}
          publisherSearchValue={filtersSearchText.publisher}
          updatePublisherSearchValue={this.updatePublisherSearchText}
          resultsCount={illustrationsCount}
          itemTypeLabel={t('global.image', illustrationsCount)}
          sortOptions={this.filtersBarSortOptions}
          applySortOption={this.onSortOptionChanged}
          appliedSortOption={appliedFilters.sort}
        />  
      );
    } else {
      filtersComponent = (
        <FiltersPanel
              filters={filters}
              applyFilter={this.applyFilter}
              removeFilter={this.removeFilter}
              appliedFilters={appliedFilters}
              viewport={viewport}
              styleSearchValue={filtersSearchText.style}
              updateStyleSearchValue={this.updateStyleSearchText}
              illustratorSearchValue={filtersSearchText.illustrator}
              updateIllustratorSearchValue={this.updateIllustratorSearchText}
              categorySearchValue={filtersSearchText.category}
              updateCategorySearchValue={this.updateCategorySearchText}
              publisherSearchValue={filtersSearchText.publisher}
              updatePublisherSearchValue={this.updatePublisherSearchText}
              resultsCount={illustrationsCount}
              itemTypeLabel={t('global.image', illustrationsCount)}
              sortOptions={this.filtersPanelSortOptions}
              applySortOption={this.onSortOptionChanged}
              appliedSortOption={appliedFilters.sort}
        />
      );
    }

    return (<AllImages
        isLoggedIn={isLoggedIn}
        isFetchingAllIllustrations={isFetchingAllIllustrations}
        images={illustrations}
        illustrationsInfo={illustrationsInfo}
        isFirstPage={isFirstPage}
        loadMore={this.loadMore}
        filtersComponent={filtersComponent}
        uploadIllustration={uploadIllustrationWorkflow}
        fetchAllIllustrations={fetchAllIllustrationsWorkflow}
        appliedFilters={this.getAppliedFilters}
        initializeIllustrations={initializeIllustrations}
        isUploadingIllustration={isUploadingIllustration}
        openAuthModal={openAuthModal}
        firstName={firstName}
        userRoles={userRoles}
        autocompleteTags={autocompleteTagsWorkflow}
        tags={tags}
        autocompleteIllustrators={autocompleteIllustratorsWorkflow}
        illustratorSuggestions={illustratorSuggestions}
        newFormData={newFormData}
        fetchNewIllustrationFormData={fetchNewIllustrationFormDataWorkflow}
        recordGaEvents={recordGaEvents}
        userEmail={userEmail}
        organizationRoles={organizationRoles}
        />
      );
  }

} 

AllImagesContainer.propTypes = {};

export default AllImagesContainer;
