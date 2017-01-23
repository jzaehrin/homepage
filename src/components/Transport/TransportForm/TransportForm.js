import React, { Component, PropTypes } from 'react';
import $ from 'jquery';
import _ from 'lodash';
import AutoComplete from 'material-ui/AutoComplete';
import RaisedButton from 'material-ui/RaisedButton';
import 'jquery-ui/themes/base/core.css';
import 'jquery-ui/themes/base/menu.css';
import 'jquery-ui/themes/base/theme.css';
import 'jquery-ui/themes/base/autocomplete.css';
import 'jquery-ui/ui/widgets/autocomplete';

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

    const data = {
      from: this.from.state.searchText,
      to: this.to.state.searchText,
      via: this.via.state.searchText,
      datetime: this.datetime.value,
    };

    this.setState(data);

    this.props.onSubmit(data);
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
    return (
      <div className={style.container}>
        <h2 className={style.title}>Search Travel</h2>
        <form onSubmit={this.onSubmit} className={style.form}>
          <div>
            <AutoComplete
              floatingLabelText="From"
              dataSource={this.state.dataSource}
              onUpdateInput={
                _.debounce((value) => { this.handleUpdateInput(value); }, 100)
              }
              ref={(from) => { this.from = from; }}
              fullWidth
            />
          </div>
          <div>
            <AutoComplete
              floatingLabelText="To"
              dataSource={this.state.dataSource}
              onUpdateInput={
                _.debounce((value) => { this.handleUpdateInput(value); }, 100)
              }
              ref={(to) => { this.to = to; }}
              fullWidth
            />
          </div>
          <div>
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
