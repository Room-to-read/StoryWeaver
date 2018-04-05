import React, { Component } from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-polyglot';
import { isEqual } from 'lodash';

import LoaderBlock from '../LoaderBlock';
import Pagination from '../Pagination';
import ProfileCard from '../ProfileCard';
import Grid from '../Grid';

import { fetchPeopleWorkflow } from '../../redux/peopleSearchActions';
import { profileTypes } from '../../lib/constants';

import './PeopleSearchResultsContainer.scss';


const PeopleGridEl = ({ people }) => {
  const peopleEls = people.map(person => {
    return (
      <ProfileCard
        key={person.slug}
        type={person.type}
        title={person.name}
        imageUrl={person.profileImage}
        slug={person.slug}
      />
    );
  });

  return <Grid variant="2up">{peopleEls}</Grid>
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
    fetchPeopleWorkflow,
};

const mapStateToProps = ({ people, viewport, allFilters }) => ({
  ...people,
  viewport,
  appliedFilters: allFilters[ allFilters.filterType ] // people/organisation different filters select from redux
});

@translate()
@connect(mapStateToProps, mapDispatchToProps)
class PeopleSearchResultsContainer extends Component {
  static defaultProps = {
    variant: profileTypes.USER
  }

  onLoadMore = () => this.props.fetchPeopleWorkflow(
    this.props.variant,
    this.props.appliedFilters,
    this.props.loadedPages + 1
  );

  componentWillReceiveProps(nextProps) {
    if (!isEqual(this.props.appliedFilters, nextProps.appliedFilters)) {
      this.props.fetchPeopleWorkflow(nextProps.variant, nextProps.appliedFilters);
    }
  }

  componentDidMount() {
    const {
      fetchPeopleWorkflow,
      appliedFilters,
      variant,
    } = this.props;

    fetchPeopleWorkflow(variant, appliedFilters);
  }

  render() {
    const {
      t,
      isFetchingPeople,
      people,
      totalPeopleCount,
      variant,
    } = this.props;

    const baseClassName = 'pb-people-search-results';

    // TODO: nested ternary operators are BAD!
    const shouldShowLoadMore = people && people.length !== 0 ? (people.length < totalPeopleCount ? true : false) : false;

    let countLabel = totalPeopleCount;
    if (variant === profileTypes.USER) {
      countLabel += ` ${t('global.person', totalPeopleCount)}`;
    } else if (variant === profileTypes.ORGANISATION) {
      countLabel += ` ${t('global.organisation', totalPeopleCount)}`;
    }

    return (
      <div>
        {
          isFetchingPeople || !people
          ?
          <LoaderBlock />
          :
          <div>
            <div className={`${baseClassName}__status`}>
              <div className={`${baseClassName}__count`}>
                { countLabel }
              </div>
            </div>
            <PeopleGridEl people={people}/>
            {
              shouldShowLoadMore
              ?
              <Pagination
                onClick={this.onLoadMore}
                loading={this.props.isFetchingMorePeople}
              />
              :
              null
            }
            {
              totalPeopleCount
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

PeopleSearchResultsContainer.propTypes = {
};

export default PeopleSearchResultsContainer;
