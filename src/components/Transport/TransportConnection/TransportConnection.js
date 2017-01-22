import React, { Component, PropTypes } from 'react';
import Table, { TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table';

import style from './TransportConnection.less';

export default class TransportConnection extends Component {

  static propTypes = {
    data: PropTypes.shape({
      connections: PropTypes.shape({
        from: PropTypes.shape({
          departure: PropTypes.string,
          platfrom: PropTypes.string,
        }),
        duration: PropTypes.string,
        products_count: PropTypes.string,
      }),
    }),
  };

  state = {
  };

  render() {
    const result = this.props.data.connections;
    const connectionsArray = result.map(c => (
      <TableRow>
        <TableRowColumn className="departure">{c.from.departure}</TableRowColumn>
        <TableRowColumn className="lane">{c.from.platform}</TableRowColumn>
        <TableRowColumn className="duration">{c.duration}</TableRowColumn>
        <TableRowColumn className="nbrChanges">{c.products_count}</TableRowColumn>
        <TableRowColumn className="typeChanges">{c.products.join(', ')}</TableRowColumn>
      </TableRow>
    ));
    return (
      <div className={style.container}>
        <h2>Travel Connection</h2>
        <Table>
          <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
            <TableRow>
              <TableHeaderColumn tooltip="Departure Hour">Departure</TableHeaderColumn>
              <TableHeaderColumn tooltip="Lane of the departure">Lane</TableHeaderColumn>
              <TableHeaderColumn tooltip="Duration of the travel">Duration</TableHeaderColumn>
              <TableHeaderColumn tooltip="Nomber of changes during the travel">Nbr changes</TableHeaderColumn>
              <TableHeaderColumn tooltip="All Type of train">Type of train</TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody displayRowCheckbox={false} >
            {connectionsArray}
          </TableBody>
        </Table>

      </div>
    );
  }
}
