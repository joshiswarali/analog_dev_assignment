import { Component } from 'react';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import SearchForm from './SearchForm';
import axios from "axios";
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import Alert from 'react-bootstrap/Alert';
import AddUsersForm from './AddUsersForm';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';


class App extends Component {

  constructor(props) {
    super(props);
    this.state = {searchUsername : '', fetchedRepos: false, fetchError: false, repos: [],
    addUsers : [], addedUserStatus: [], addedUsers: false, addUserColumns: []};

    this.handleSearchFormChange = this.handleSearchFormChange.bind(this);
    this.handleSearchFormSubmit = this.handleSearchFormSubmit.bind(this);
    this.handleAddUsersFormSubmit = this.handleAddUsersFormSubmit.bind(this);
  }

  handleDelete = (i) => {
    console.log("delete");
    console.log(i);
    this.setState({addUsers: this.state.addUsers.filter((u, index) => index !== i)});
  };

  handleAddition = (u) => {
    console.log("called");
    this.setState({addUsers: [...this.state.addUsers, u]});
    console.log(this.state.addUsers);
  };

  handleDrag = (u, currPos, newPos) => {
    const newU = this.state.addUsers.slice();

    newU.splice(currPos, 1);
    newU.splice(newPos, 0, u);

    // re-render
    this.setState({addUsers : newU});
  };

  handleTagClick = index => {
    console.log('The tag at index ' + index + ' was clicked');
  };

  handleSearchFormChange(event) {
    console.log(this.state);
    this.setState({searchUsername: event.target.value});

    if (this.state.fetchError) {
      this.setState({...this.state, fetchError: false});
    }
  }

  handleAddUsersFormSubmit (event) {

    event.preventDefault();
    console.log(this.state.addUsers);

    const addUsersList = []

    for (let i = 0; i < this.state.addUsers.length; i++) {
      addUsersList.push(this.state.addUsers[i].text);
    }

    console.log("****");
    console.log(addUsersList);

    const columns = [
      {
        dataField: 'uname',
        text: 'Username',
      }, {
        dataField: 'status',
        text: 'Status',
      }]

    this.setState({addUserColumns: columns, addedUsers: false, addedUserStatus: []});  

    axios.post('/getpublicrepos', {"unames": addUsersList})
    .then((response)=> {
      console.log(response);

      let rps = response.data;
      let processed_rps = []
      for (let i = 0; i < rps.length; i++) {
        processed_rps.push({
          'uname': rps[i].uname, 
          'status': rps[i].status === 'SUCCESS' ? 'Success' : 'No public repos found',
        });
      }
      this.setState({addedUserStatus: processed_rps, addedUsers: true});
    }).catch((e)=> {
      console.log(e);
    });

  }

  handleSearchFormSubmit(event) {

    event.preventDefault();

    this.setState({...this.state, fetchError: false});

    axios.get('/getuser/' + this.state.searchUsername)
    .then((response)=> {
      console.log(response);

      if (response.data.status === "ERROR") {
        this.setState({...this.state, fetchError: true, fetchedRepos: false});
      } else {

      const rps = response.data.repos;

      let processed_rps = []
      for (let i = 0; i < rps.length; i++) {
        processed_rps.push({
          'name': rps[i].name, 
          'git_url': rps[i].git_url,
          'downloads_url': rps[i].downloads_url,
          'created_at': rps[i].created_at.slice(0, 10)
        });
      }

      function urlFormatter(cell) {
          return (
            <a href = {cell}>
              {cell}
            </a>
          );
        }

      const columns = [
        {
          dataField: 'name',
          text: 'Repo Name',
          sort: true
        }, {
          dataField: 'git_url',
          text: 'Git URL',
          style: { 'word-wrap': 'break-word' },
          formatter: urlFormatter,
        }, {
          dataField: 'downloads_url',
          text: 'Downloads URL',
          formatter: urlFormatter,
          style: {  'word-wrap': 'break-word' }
        }, {
          dataField: 'created_at',
          text: 'Created At',
          sort: true,
          sortFunc: (a, b, order, dataField, rowA, rowB) => {
            if (order === 'asc') {
              if (new Date(a) < new Date(b)) {
                return 1;
              } else if (new Date(a) > new Date(b)) {
                return -1;
              } else return 0;
            } else {
              if (new Date(a) < new Date(b)) {
                return -1;
              } else if (new Date(a) > new Date(b)) {
                return 1;
              } else return 0;
            }
          }
        }
      ]
      this.setState({...this.state, fetchedRepos : true, fetchErrors: false, repos : processed_rps, columns : columns});
    }
    }).catch((e)=> {
      this.setState({...this.state, fetchError: true});
      console.log(e);
    });
  }

  
  render() {

    const customTotal = (from, to, size) => (
      <span className="react-bootstrap-table-pagination-total">
        Showing { from } to { to } of { size } Results
      </span>
    );

    const options = {
      paginationSize: 4,
      pageStartIndex: 0,
      firstPageText: 'First',
      prePageText: 'Back',
      nextPageText: 'Next',
      lastPageText: 'Last',
      nextPageTitle: 'First page',
      prePageTitle: 'Pre page',
      firstPageTitle: 'Next page',
      lastPageTitle: 'Last page',
      showTotal: true,
      paginationTotalRenderer: customTotal,
      disablePageTitle: true,
      sizePerPageList: [{
        text: '3', value: 3
      }, {
        text: '10', value: 10
      }, {
        text: 'All', value: this.state.repos.length
      }] // A numeric array is also available. the purpose of above example is custom the text
    };

    return (
      <Container fluid className="p-5 pt-2">
        <Row>
        <h1>User Management System </h1>
        </Row>
      <Row>  
      <Tabs className="pt-2"
        defaultActiveKey="searchUser"
        id="app-tabs"
      >
        <Tab eventKey="searchUser" title="Search User">
          <SearchForm className="justify-md-center"
          formSubmit = {this.handleSearchFormSubmit} 
          formChange = {this.handleSearchFormChange}/>
          {this.state.fetchError && <Alert key='danger' variant='danger'>
          No public respositories found for username {this.state.searchUsername} !
          </Alert>}
          { this.state.fetchedRepos && <BootstrapTable keyField='reponum' 
          data={ this.state.repos } columns={ this.state.columns }
          pagination= {paginationFactory(options)} />}
        </Tab>
        <Tab eventKey="addUser" title="Add Users">
          <AddUsersForm 
          tags={this.state.addUsers}
          handleDelete={this.handleDelete}
          handleAddition={this.handleAddition}
          drag={this.handleDrag}
          click={this.handleTagClick}
          formSubmit={this.handleAddUsersFormSubmit}
          />
          {this.state.addedUsers && <BootstrapTable keyField='reponum'
          data={ this.state.addedUserStatus } columns={ this.state.addUserColumns }
          pagination= {paginationFactory()} />}
        </Tab>
      </Tabs>
      </Row>
      </Container>
    );
  }
}

export default App;
