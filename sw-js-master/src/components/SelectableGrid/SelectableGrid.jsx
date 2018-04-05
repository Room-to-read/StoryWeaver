import React, { Component } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { isEqual } from 'lodash';

import Grid from '../Grid';
import SvgIcon from '../SvgIcon';

import './SelectableGrid.scss';

class SelectableGridItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      checked: props.defaultChecked
    };

    this.onChange = this.onChange.bind(this);
  }

  // Add option for all selected / deselected
  componentWillReceiveProps(nextProps) {
    if (!isEqual(this.props.allSelected, nextProps.allSelected)) {
      this.setState({ checked: nextProps.allSelected });
      if (typeof this.props.onChange === 'function' && this.state.checked !== nextProps.allSelected) {
        this.props.onChange({
          checked: nextProps.allSelected,
          value: nextProps.id }
        );
      }
    }
  }

  onChange(e) {
    const target = e.target;
    //Toggling the value of the element on checking/unchecking it to avoid duplicate values in checkedValues state of SelectableGrid
    const checked = !this.state.checked;
    const value = target.id;

    this.setState({
      checked 
    });

    if (typeof this.props.onChange === 'function') {
      this.props.onChange({
        checked,
        value
      });
    }
  }

  render() {
    const baseClassName = 'pb-selectable-grid-item';

    const {
      children,
      id,
      value,
      label,
      roundedCorners,
      rotateOnActive,
      theme
    } = this.props;

    const {
      checked
    } = this.state;

    const classes = {
      [baseClassName]: true,
      [`${baseClassName}--rounded-corners`]: roundedCorners,
      [`${baseClassName}--rotate-on-active`]: rotateOnActive,
      [`${baseClassName}--checked`]: checked,
      [`${baseClassName}--${theme}`]: theme
    };

    return (
      <div className={classNames(classes)}>
        {children}
        <div className={`${baseClassName}__wrapper`}>
          <SvgIcon
            parentClassName={`${baseClassName}__icon`}
            name={`checkbox-${checked ? 'on' : 'off'}`}
            pushRight
            size="m" />
          <label className={`${baseClassName}__label`} htmlFor={id}>
            {label}
            <input
              className={`${baseClassName}__input`}
              type="checkbox"
              id={id}
              value={value}
              onClick={this.onChange}
            />
          </label>
        </div>
      </div>
    );
  }
}

SelectableGridItem.propTypes = {
  children: PropTypes.node,
  id: PropTypes.string.isRequired,
  rotateOnActive: PropTypes.bool,
  roundedCorners: PropTypes.bool,
  defaultChecked: PropTypes.bool,
  label: PropTypes.string,
  theme: PropTypes.string
};

class SelectableGrid extends Component {
  constructor(props) {
    super(props);

    this.checkedValues = [];

    this.onChange = this.onChange.bind(this);
  }

  onChange(changedItem) {
    const value = parseInt(changedItem.value, 10)
    if (changedItem.checked) {
      this.checkedValues.push(value);
    } else {
      this.checkedValues = this.checkedValues.filter(val => val !== value);
    }

    if (typeof this.props.onChange === 'function') {
      this.props.onChange(this.checkedValues);
    }
  }

  renderChildren(baseClassName) {
    const {
      children,
      rotateOnActive,
      roundedCorners,
      label,
      theme,
      allSelected
    } = this.props;

    return React.Children.toArray(children)
      .map((child, i) => {
        return <SelectableGridItem
          id={child.props.id}
          key={i}
          label={label}
          rotateOnActive={rotateOnActive}
          roundedCorners={roundedCorners}
          theme={theme}
          value={child.props.value}
          onChange={this.onChange}
          allSelected={allSelected}>
          {child}
        </SelectableGridItem>
      });
  }

  render() {
    const baseClassName = 'pb-selectable-grid';
    const {
      variant
    } = this.props;

    const classes = {
      [baseClassName]: true,
      [`${baseClassName}--${variant}`]: variant
    };

    return (
      <div className={classNames(classes)}>
        <Grid variant={variant}>
          {this.renderChildren(baseClassName)}
        </Grid>
      </div>
    );
  }
}

SelectableGrid.propTypes = {
  children: PropTypes.node,
  variant: Grid.propTypes.variant,
  id: PropTypes.string.isRequired,
  rotateOnActive: PropTypes.bool,
  roundedCorners: PropTypes.bool,
  label: PropTypes.string,
  theme: PropTypes.string
};

export default SelectableGrid;
