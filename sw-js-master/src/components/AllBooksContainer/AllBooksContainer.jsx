import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';
import { replace } from 'react-router-redux';
import queryString from 'query-string';

import AllBooks from '../AllBooks';

import {
  fetchCategoryHeaderImageWorkflow
} from '../../redux/allBooksActions';
import {
  applyFilter, resetFilters
} from "../../redux/allFiltersActions";
import { sortOptions, bulkDownloadOptions } from '../../lib/constants';

import './AllBooksContainer.scss';


const defaultFilterValues = {
  category: [],
  publisher: [],
  level: [],
  language: [],
  sort: sortOptions.relevance,
  tags: [],
  query: '',
  style: [],
  bulk_download: bulkDownloadOptions.allStories
};

// Tabs list in search page
const tabFilters = { 
  'books': 'readFilters',
  'lists': 'listsFilters',
  'images': 'imagesFilters',
  'people': 'peopleFilters',
  'organisations': 'organisationsFilters'
};

const mapStateToProps = ({ allBooks, allFilters }) => ({
  headerImage: allBooks.headerImage,
  appliedFilters: allFilters[allFilters.filterType],
  filterType: allFilters.filterType,
  allFilters
});

const mapDispatchToProps = {
  fetchCategoryHeaderImageWorkflow,
  applyFilter,
  resetFilters,
  replace
};

// We use this to map category names to category icons.
// E.g "Activity Books" becomes "activity-books".
// TODO: move to utilities, since this is used in other
// places across the code.
function toDashCase(str) {
  return str.replace(/[^A-Z0-9]+/ig, "-").toLowerCase();
}

@connect(mapStateToProps, mapDispatchToProps)
class AllBooksContainer extends Component {

  // Set Query filters from url
  componentWillMount() {
    const { location, allFilters, applyFilter, fetchCategoryHeaderImageWorkflow } = this.props;
    // Find tab value from URL, set other filters to queryAppliedFilters
    const { tab, item, ...queryAppliedFilters} = queryString.parse( location.search );
    
    // to update Filter type to redux state, from tab map it to filterType
    const filterType = tabFilters[tab] || tabFilters[item] || this.props.filterType;
    const appliedFilters = allFilters[filterType];
    const updatedFilters = { ...appliedFilters, ...queryAppliedFilters };
    
    Object.entries(updatedFilters).forEach(([ k, v ]) => {
      if (Array.isArray(defaultFilterValues[k]) && !Array.isArray(v)) {
        updatedFilters[k] = [v];
      }
    });
    
    // if isStoryCategory field set and category present in filters category, get category image
    // with category title. If not by default set query present in url
    if ( updatedFilters.isStoryCategory === "true" && updatedFilters.category.length === 1 ) {
      fetchCategoryHeaderImageWorkflow(updatedFilters.category[0]);
      applyFilter({ filter: { ...updatedFilters, ...{ 
        categoryHeaderTitle: updatedFilters.category[0] 
      }}, filterType: filterType });
    } else {
      applyFilter({ filterType: filterType, filter: updatedFilters });
    }
  }
  
  getTab = () => {
    const { location } = this.props;
    return queryString.parse( location.search )['tab'];
  }

  getItem = () => {
    const { location } = this.props;
    return queryString.parse( location.search )['item'];
  }

  // We use the URL bar as a single source of truth for applied filters.
  // The applyFilter, removeFilter, and getAppliedFilters are convenience
  // methods to store, remove, and retrieve filters from the URL bar.
  
  applyFilter = (type, value) => {
    const { appliedFilters, replace, filterType, applyFilter } = this.props;
    const filterIsArray = Array.isArray(appliedFilters[type]);
    if (filterIsArray) {
      value = appliedFilters[type].concat(value);
    }
    let updatedField = { [type]: value };
    const newFilters = queryString.stringify({ ...appliedFilters, ...updatedField, tab: this.getTab() });
    
    replace({ search: newFilters });
    applyFilter({ filter: updatedField, filterType: filterType });
  }

  removeFilter = (type, value) => {
    const { appliedFilters, replace, filterType, applyFilter } = this.props;
    if (!appliedFilters[type]) {
      return;
    }
    if (Array.isArray(appliedFilters[type])) {
      const index = appliedFilters[type].indexOf(value);
      value = [...appliedFilters[type]];
      if (index !== -1 ) {
        value.splice(index, 1);
      }
    } else {
      value = "";
    }
    let updatedField = { [type]: value };
    
    replace({search: queryString.stringify({ ...appliedFilters, ...updatedField, tab: this.getTab() })});
    applyFilter({ filter: updatedField, filterType: filterType });
  }
  
  componentWillUnmount() {
    this.props.resetFilters()
  }

  onSortOptionChanged = (option) => this.applyFilter('sort', option)

  onTabChange = (newTab) => {
    const { appliedFilters: { query, tags }, applyFilter, replace } = this.props;
    const filterType = tabFilters[newTab];
    const filters = { query: query, tags: tags};
    applyFilter({ filterType: filterType, filter: filters });
    // push filters and tab to URL
    replace({
      search: queryString.stringify({ ...this.props.allFilters[filterType], ...filters, tab: newTab })
    });
  }

  render() {
    const {
      isSearchVariant,
      headerImage,
      appliedFilters
    } = this.props;

    // If this is the search variant of the all books page, but we don't have a query
    // or tags, redirect to all books.
    if (isSearchVariant && !(appliedFilters.query || appliedFilters.tags)) {
      return <Redirect to='/stories' />;
    }
    
    // Fetch tab from URL. to initialize default tab
    const tab = this.getTab();

    const item = this.getItem();
    
    return (
      <AllBooks
        applyFilter={this.applyFilter}
        removeFilter={this.removeFilter}
        appliedFilters={{...appliedFilters, tab: tab}}
        item={item}
        isSearchVariant={isSearchVariant}
        searchQuery={appliedFilters.query}
        tags={appliedFilters.tags}
        headerBgUrl={appliedFilters.isStoryCategory ? headerImage : 'https://storage.googleapis.com/storyweaver-sw2-full/illustrations/2136/large/Illustration-7.jpg?1443543843' }
        headerTitle={appliedFilters.isStoryCategory ? appliedFilters.categoryHeaderTitle : null }
        icon={appliedFilters.isStoryCategory ? toDashCase(appliedFilters.categoryHeaderTitle) : 'book-alt' }
        onSortOptionChanged={this.onSortOptionChanged}
        onTabChange={this.onTabChange}
      />
    );
  }
}

export default AllBooksContainer;