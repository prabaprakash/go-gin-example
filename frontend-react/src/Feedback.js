import React from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';
import * as api from "./api";
import ReactStars from 'react-stars'
import _ from 'lodash';

import { Button, Row, Container, Form } from 'react-bootstrap';
export default class Feedback extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      form: {
        "name": "",
        "rating": "",
        "feedback": ""
      }
    };
    this.handleChange = this.handleChange.bind(this);
    this.validateForm = this.validateForm.bind(this);
  }
  handleChange(e) {
    let form = this.state.form;
    form[e.target.name] = e.target.value;
    this.setState({ form: form });
  }

  async validateForm(state) {
    for (var key in state) {
      if (_.isEmpty(state[key].toString()))
        return;
    };
    const res = await api.callPost("/db/feedbacks", this.state.form);
    console.log(res);
    if (typeof res.response !== undefined) {
      this.setState({
        form: {
          "name": "",
          "rating": "",
          "feedback": ""
        }
      });
    }
    return;
  }
  render() {
    console.log(this.state)
    return (<Container>
      <Form>
        <Form.Group controlId="exampleForm.ControlInput1">
          <Form.Label>Name</Form.Label>
          <Form.Control value={this.state.form.name} type="text" name="name" placeholder="name" onChange={this.handleChange}
          />
        </Form.Group>
        <Form.Group controlId="exampleForm.ControlTextarea1">
          <Form.Label>Rating</Form.Label>
          <ReactStars
            count={5}
            value={this.state.form.rating}
            onChange={(x) => this.handleChange({ target: { name: "rating", value: x } })}
            size={24}
            color2={'#ffd700'} />
        </Form.Group>
        <Form.Group controlId="exampleForm.ControlTextarea1">
          <Form.Label>Feedback</Form.Label>
          <Form.Control value={this.state.form.feedback} as="textarea" name='feedback' rows="3" onChange={this.handleChange}
          />
        </Form.Group>
        <Button onClick={() => this.validateForm(this.state.form)}>
          Submit
      </Button>
      </Form>
    </Container>
    );
  }
}

Feedback.propTypes = {
};