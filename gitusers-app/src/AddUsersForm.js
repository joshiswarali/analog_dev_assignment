import { Component } from "react";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import React from 'react'
import { WithContext as ReactTags } from 'react-tag-input';
import './style.css';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';


const KeyCodes = {
  comma: 188,
  enter: 13
};

const delimiters = [KeyCodes.comma, KeyCodes.enter];

class AddUsersForm extends Component {
  

  constructor(props) {
    super(props);
  }
  

  render(){
  return (
    <Row>
    <Col className="p-5 ps-2" md = {4} >
    <Form onSubmit={this.props.formSubmit}>
      <Form.Label> Add new users to database </Form.Label>
      <div>
        <ReactTags
          tags={this.props.tags}
          delimiters={delimiters}
          handleDelete={this.props.handleDelete}
          handleAddition={this.props.handleAddition}
          handleDrag={this.props.drag}
          handleClick={this.props.click}
          inputFieldPosition="bottom"
          placeholder="Press ENTER after each username"
        />
      </div>
    <Button className="mt-2" variant="primary" type="submit">
    Add Users
    </Button>
    </Form>
    </Col>
    </Row>
    );
  }
}

export default AddUsersForm;