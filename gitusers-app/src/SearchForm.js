import { Component } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

class SearchForm extends Component {
  
  constructor(props) {
    super(props);
    //this.state = {formChange : props.formChange, formSubmit : props.formSubmit, };
  }


  render() {
        return (
        <Row>
        <Col className="p-5 ps-2" md = {4} >
        <Form onSubmit={this.props.formSubmit}>  
        <Form.Group controlId="formUserName">
            <Form.Label>GitHub Username</Form.Label>
            <Form.Control 
            type="text" 
            placeholder="Enter GitHub username" 
            onChange={this.props.formChange}/>
        </Form.Group>
        <Button className="mt-2" variant="primary" type="submit">
            Search
        </Button>
        </Form>
        </Col>
        </Row>
        );
    }
}

export default SearchForm;