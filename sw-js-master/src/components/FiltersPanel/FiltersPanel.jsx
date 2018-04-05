import React, { Component } from 'react';
import { translate } from 'react-polyglot';
import PropTypes from 'prop-types';
import { flatMap, pick } from 'lodash';

import Button from '../Button';
import ButtonGroup from '../ButtonGroup';
import FloatingButton from '../FloatingButton';
import Modal from '../Modal';
import Picklist from '../Picklist';
import RadioGroup from '../RadioGroup';
import Tab from '../Tab';
import Tabs from '../Tabs';
import ToggleSwitch from '../ToggleSwitch';

import './FiltersPanel.scss';

@translate()
class FiltersPanel extends Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false,
      showFilters: true
    };
  }

  openPanel = () => {
    this.setState({
      open: true
    });
  }

  closePanel = () => {
    this.setState({
      open: false
    });
  }

  handleToggle = val => {
    this.setState({
      showFilters: !val
    });
  }

  handlePicklistChange = (type, value, checked) => {
    const {
      applyFilter,
      removeFilter,
    } = this.props;

    if (checked) {
      applyFilter(type, value);
    } else {
      removeFilter(type, value);
    }
  }

  render() {
    const baseClassName = 'pb-filters-panel';
    const classNames = [baseClassName];

    const {
      t,
      filters,
      levelSearchValue,
      publisherSearchValue,
      categorySearchValue,
      languageSearchValue,
      styleSearchValue,
      updateLevelSearchValue,
      updateCategorySearchValue,
      updatePublisherSearchValue,
      updateLanguageSearchValue,
      updateStyleSearchValue,
      appliedFilters,
      viewport,
      sortOptions,
      applySortOption,
      appliedSortOption,
      bulkDownloadOptions,
      resultsCount,
      itemTypeLabel,
    } = this.props;


    const { publisher, category, level, language, style } = filters;

    const shouldDisplayLevelSelector = (
      typeof appliedFilters.level !== 'undefined' &&
      typeof filters.level !== 'undefined'
    );
    let levelOptions = [];
    if (level) {
      levelOptions = level.queryValues;
    }

    levelOptions = levelOptions.map(levelOption => {
      return (
        {
          name: levelOption.name,
          legend: levelOption.description,
          queryValue: levelOption.queryValue
        }
      )
    });

    const shouldDisplayPublisherSelector = (
      typeof appliedFilters.publisher !== 'undefined' &&
      typeof filters.publisher !== 'undefined'
    );
    let publisherOptions = [];
    if (publisher) {
      publisherOptions = publisher.queryValues;
    }

    const shouldDisplayCategorySelector = (
      typeof appliedFilters.category !== 'undefined' &&
      typeof filters.category !== 'undefined'
    );
    let categoryOptions = [];
    if (category) {
      categoryOptions = category.queryValues;
    }

    const shouldDisplayLanguagesSelector = (
      typeof appliedFilters.language !== 'undefined' &&
      typeof filters.language !== 'undefined'
    );
    let languageOptions = [];
    if (language) {
      languageOptions = language.queryValues;
    }

    const shouldDisplayStyleSelector = (
      typeof appliedFilters.style !== 'undefined' &&
      typeof filters.style !== 'undefined'
    );
    let styleOptions = [];
    if (style) {
      styleOptions = style.queryValues;
    }

    const userVisibleFilters = ['publisher', 'category', 'level', 'language', 'style'];
    const filtersCount = flatMap(pick(appliedFilters, userVisibleFilters), f => f).length;
    let panelEl = <FloatingButton count={filtersCount} icon="filter" onClick={this.openPanel}/>;
    if (this.state.open) {
      const modalFooterEl = (
        <ButtonGroup mergeTop mergeBottom={!viewport.large} mergeSides>
          <Button fullWidth label="Close" variant="primary" onClick={this.closePanel}/>
        </ButtonGroup>
      );

      const modalHeaderEl = <ToggleSwitch
        id="filters-panel-toggle"
        defaultOn={!this.state.showFilters}
        offLabel={t("global.filter", 1)}
        onChange={this.handleToggle}
        onLabel={t("global.sort")}/>;

      const filtersPane = (
        <div className={`${baseClassName}__filters`}>
          <Tabs
            parentClassName={`${baseClassName}__filter-tabs`}
            fitHeight>
            {
              shouldDisplayLevelSelector
              ?
              <Tab title={t("global.level", 2)}>
                <Picklist
                  id="storybook-picklist"
                  searchValue={levelSearchValue}
                  onSearchChange={updateLevelSearchValue}
                  options={levelOptions}
                  onChange={this.handlePicklistChange.bind(this, 'level')}
                  checkedValues={appliedFilters.level}
                  fontWeight='bold'
                />
              </Tab>
              :
              null
            }
            {
              shouldDisplayPublisherSelector
              ?
              <Tab title={t("global.publisher", 2)}>
                <Picklist
                  id="storybook-picklist"
                  searchValue={publisherSearchValue}
                  onSearchChange={updatePublisherSearchValue}
                  options={publisherOptions}
                  onChange={this.handlePicklistChange.bind(this, 'publisher')}
                  checkedValues={appliedFilters.publisher}
                />
              </Tab>
              :
              null
            }
            {
              shouldDisplayCategorySelector
              ?
              <Tab title={t("global.category", 2)}>
                <Picklist
                  id="storybook-picklist"
                  searchValue={categorySearchValue}
                  onSearchChange={updateCategorySearchValue}
                  options={categoryOptions}
                  onChange={this.handlePicklistChange.bind(this, 'category')}
                  checkedValues={appliedFilters.category}
                />
              </Tab>
              :
              null
            }
            {
              shouldDisplayLanguagesSelector
              ?
              <Tab title={t("global.language", 2)}>
                <Picklist
                  id="storybook-picklist"
                  searchValue={languageSearchValue}
                  onSearchChange={updateLanguageSearchValue}
                  options={languageOptions}
                  onChange={this.handlePicklistChange.bind(this, 'language')}
                  checkedValues={appliedFilters.language}
                />
              </Tab>
              :
              null
            }
            {
              shouldDisplayStyleSelector
              ?
              <Tab title={t("global.style", 2)}>
                <Picklist
                  id="storybook-picklist"
                  searchValue={styleSearchValue}
                  onSearchChange={updateStyleSearchValue}
                  options={styleOptions}
                  onChange={this.handlePicklistChange.bind(this, 'style')}
                  checkedValues={appliedFilters.style}
                />
              </Tab>
              :
              null
            }
            {
              bulkDownloadOptions
              ?
              <Tab title={t("global.bulk-download")}>
                <Picklist
                  id="storybook-picklist"
                  options={bulkDownloadOptions}
                  onChange={this.handlePicklistChange.bind(this, 'bulk_download')}
                  checkedValues={appliedFilters.bulk_download}
                  multiplePicks={false}
                />
              </Tab>
              :
              null
            }
          </Tabs>
        </div>
      );

      const sortPane = (
        <RadioGroup
          defaultValue={appliedSortOption}
          id="filters-panel-sort-by"
          name="filters-panel-sort-by"
          onChange={applySortOption}
          radios={sortOptions}
        />
      );

      panelEl = (
        <Modal
          footer={modalFooterEl}
          header={modalHeaderEl}
          noContentPadding={this.state.showFilters}
          noContentScroll
          fillViewport>
          {
            this.state.showFilters
            ?
            filtersPane
            :
            sortPane
          }
        </Modal>
      );
    }

    return (
      <div className={classNames.join(' ')}>
        <div className={`${baseClassName}__status`}>
          <span className={`${baseClassName}__count`}>
            {`${resultsCount} ${itemTypeLabel}`}
          </span>
        </div>
        {panelEl}
      </div>
    );
  }
}

FiltersPanel.propTypes = {
  viewport: PropTypes.object.isRequired
};

export default FiltersPanel;