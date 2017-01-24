import React, { Component, PropTypes } from 'react';
import $ from 'jquery';
import _ from 'lodash';
import AutoComplete from 'material-ui/AutoComplete';
import RaisedButton from 'material-ui/RaisedButton';

import style from './TransportForm.less';

export default class TransportForm extends Component {

  static propTypes = {
    onSubmit: PropTypes.func.isRequired,
  };

  constructor() {
    super();

    this.onSubmit = this.onSubmit.bind(this);
    this.handleUpdateInput = this.handleUpdateInput.bind(this);
  }

  state = {
    from: '',
    to: '',
    via: '',
    datetime: '',
    isMissing: {
      from: false,
      to: false,
      datetime: false,
    },
    dataSource: [],
  };

  componentDidMount() {
    $([this.from, this.to, this.via]).autocomplete({
      source: this.getLocationList,
      select: this.onSelectLocation,
    });
  }

  onSubmit(e) {
    e.preventDefault();

    let error = false;
    const isMissing = {
      from: false,
      to: false,
      datetime: false,
    };
    if (!this.from.state.searchText) {
      error = true;
      isMissing.from = true;
    }
    if (!this.to.state.searchText) {
      error = true;
      isMissing.to = true;
    }
    if (!this.datetime.value) {
      error = true;
      isMissing.datetime = true;
    }

    const data = {
      from: this.from.state.searchText,
      to: this.to.state.searchText,
      via: this.via.state.searchText,
      datetime: this.datetime.value,
      isMissing,
    };

    this.setState(data);

    if (!error) {
      this.props.onSubmit(data);
    }
  }

  handleUpdateInput(value) {
    $.get('http://transport.opendata.ch/v1/locations',
      { query: value, type: 'station' }, (data) => {
        const array = [];
        $.map($(data.stations), (s) => {
          array.push(s.name);
        });

        this.setState({
          dataSource: array,
        });
      }, 'json');
  }

  render() {
    let toIsRequired = '';
    let fromIsRequired = '';
    let datetimeIsRequired = '';

    if (this.state.isMissing.from) {
      fromIsRequired = (<p>This field is required</p>);
    }

    if (this.state.isMissing.to) {
      toIsRequired = (<p>This field is required</p>);
    }

    if (this.state.isMissing.datetime) {
      datetimeIsRequired = (<p className={style.datetimeError}>This field is required</p>);
    }

    return (
      <div className={style.container}>
        <h2 className={style.title}>Search Travel</h2>
        <form onSubmit={this.onSubmit} className={style.form}>
          <div className={style.autoComplete}>
            <AutoComplete
              floatingLabelText="From"
              dataSource={this.state.dataSource}
              onUpdateInput={
                _.debounce((value) => { this.handleUpdateInput(value); }, 100)
              }
              ref={(from) => { this.from = from; }}
              fullWidth
              errorText={fromIsRequired}
            />
          </div>
          <div className={style.autoComplete}>
            <AutoComplete
              floatingLabelText="To"
              dataSource={this.state.dataSource}
              onUpdateInput={
                _.debounce((value) => { this.handleUpdateInput(value); }, 100)
              }
              ref={(to) => { this.to = to; }}
              fullWidth
              errorText={toIsRequired}
            />
          </div>
          <div className={style.autoComplete}>
            <AutoComplete
              floatingLabelText="Via"
              dataSource={this.state.dataSource}
              onUpdateInput={
                _.debounce((value) => { this.handleUpdateInput(value); }, 100)
              }
              ref={(via) => { this.via = via; }}
              fullWidth
            />
          </div>

          <div className={style.datatimePicker}>
            <label htmlFor="datetime">Time:</label>
            <input type="datetime-local" ref={(datetime) => { this.datetime = datetime; }} defaultValue={this.state.datetime} />
            {datetimeIsRequired}
          </div>
          <RaisedButton
            type="submit"
            label="Find"
            primary
            fullWidth
          />
        </form>
      </div>
    );
  }
}
