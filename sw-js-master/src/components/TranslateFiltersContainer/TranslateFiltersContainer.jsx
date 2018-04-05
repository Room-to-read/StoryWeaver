import React, { Component } from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-polyglot';

import FiltersBar from '../FiltersBar';
import FiltersPanel from '../FiltersPanel';
import Block from '../Block';

import { applyFilter, removeFilter } from '../../redux/translateActions'

const mapStateToProps = state => {
  return {
    appliedFilters: state.translate.appliedFilters,
    filters: state.translate.filters,
    viewport: state.viewport,
    metadata: state.translate.metadata
  }
}

const mapDispatchToProps = {
  applyFilter,
  removeFilter
}

@translate()
@connect(mapStateToProps, mapDispatchToProps)
class TranslateFiltersContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      levelSearchValue: '',
      publisherSearchValue: '',
      categorySearchValue: ''
    };
  }

  updateLevelSearchValue = (event) => {
    this.setState({
      levelSearchValue: event.target.value
    })
  }

  updatePublisherSearchValue = (event) => {
    this.setState({
      publisherSearchValue: event.target.value
    })
  }

  updateCategorySearchValue = (event) => {
    this.setState({
      categorySearchValue: event.target.value
    })
  }

  render() {
    const { filters, viewport, applyFilter, removeFilter, appliedFilters, metadata, t } = this.props;
    const { levelSearchValue, publisherSearchValue, categorySearchValue } = this.state;

    return (
      <Block>
        {
          viewport.medium
          ?
          <FiltersBar
            noTopBorder={true}
            filters={filters}
            levelSearchValue={levelSearchValue}
            publisherSearchValue={publisherSearchValue}
            categorySearchValue={categorySearchValue}
            updateLevelSearchValue={this.updateLevelSearchValue}
            updateCategorySearchValue={this.updateCategorySearchValue}
            updatePublisherSearchValue={this.updatePublisherSearchValue}
            applyFilter={applyFilter}
            removeFilter={removeFilter}
            appliedFilters={appliedFilters}
            resultsCount={metadata.hits}
            itemTypeLabel={t('global.story', metadata.hits)}
          />
          :

          <FiltersPanel
            viewport={viewport}
            filters={filters}
            levelSearchValue={levelSearchValue}
            publisherSearchValue={publisherSearchValue}
            categorySearchValue={categorySearchValue}
            updateLevelSearchValue={this.updateLevelSearchValue}
            updateCategorySearchValue={this.updateCategorySearchValue}
            updatePublisherSearchValue={this.updatePublisherSearchValue}
            applyFilter={applyFilter}
            removeFilter={removeFilter}
            appliedFilters={appliedFilters}
            resultsCount={metadata.hits}
            itemTypeLabel={t('global.story', metadata.hits)}
          />
        }
      </Block>
    );
  }
}

export default TranslateFiltersContainer;
