import React from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';
import * as api from "./api";
import _ from 'lodash';


import { Container, Table } from 'react-bootstrap';
export default class Feedbacks extends React.Component {
  constructor(props) {
    super(props);
    this.state = { feedbacks: [] };
    this.loadFeedbacks = this.loadFeedbacks.bind(this);
    this.loadFeedbacks();
  }
  async loadFeedbacks () {
    const res = await api.callFetch("/db/feedbacks");
    this.setState({ feedbacks: res.response });
  }
  renderTableRows(feedbacks) {
      return _.map(feedbacks, feedback=>
      <tr><td>{feedback._id}</td>
        <td>{feedback.name}</td>
        <td>{feedback.rating}</td>
        <td>{feedback.feedback}</td></tr>
      )
  }
  render() {
    return (<Container>
     <Table striped bordered hover>
  <thead>
    <tr>
      <th>_id</th>
      <th>Name</th>
      <th>Rating</th>
      <th>Feedback</th>
    </tr>
  </thead>
  <tbody>
    {this.renderTableRows(this.state.feedbacks)}
  </tbody>
</Table>
    </Container>
    );
  }
}

Feedbacks.propTypes = {
};