import React, { Component, PropTypes } from 'react';
import $ from 'jquery';
import AutoComplete from 'material-ui/AutoComplete';
import 'jquery-ui/themes/base/core.css';
import 'jquery-ui/themes/base/menu.css';
import 'jquery-ui/themes/base/theme.css';
import 'jquery-ui/themes/base/autocomplete.css';
import 'jquery-ui/ui/widgets/autocomplete';


// import style from './app.css';

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
      <div className="transport-form">
        <h2>Search Travel</h2>
        <form onSubmit={this.onSubmit}>
          <div>
            <AutoComplete
              hintText="From"
              dataSource={this.state.dataSource}
              onUpdateInput={this.handleUpdateInput}
              ref={(from) => { this.from = from; }}
            />
          </div>
          <div>
            <AutoComplete
              hintText="To"
              dataSource={this.state.dataSource}
              onUpdateInput={this.handleUpdateInput}
              ref={(to) => { this.to = to; }}
            />
          </div>
          <div>
            <AutoComplete
              hintText="Via"
              dataSource={this.state.dataSource}
              onUpdateInput={this.handleUpdateInput}
              ref={(via) => { this.via = via; }}
            />
          </div>

          <label htmlFor="datetime">Time:</label>
          <input type="datetime-local" ref={(datetime) => { this.datetime = datetime; }} defaultValue={this.state.datetime} />

          <button type="submit" id="getTravel">Travel</button>
        </form>
      </div>
    );
  }
}
