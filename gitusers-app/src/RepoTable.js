import { Component } from 'react';
import Table from 'react-bootstrap/Table';

class RepoTable extends Component {

    renderRepo(repo, index) {
        return (
          <tr key={index}>
            <td>{repo.name}</td>
            <td><a href = {repo.git_url}>{repo.git_url}</a></td>
            <td><a href = {repo.downloads_url}>{repo.downloads_url}</a></td>
            <td>{repo.created_at}</td>
          </tr>
        )
    }

    render() {
        return (
        <Table striped bordered hover>
        <thead>
            <tr>
            <th>Name</th>
            <th>Git URL</th>
            <th>Downloads URL</th>
            <th>Created At</th>
            </tr>
        </thead>
        <tbody>
            {this.props.repoArray.map(this.renderRepo)}
        </tbody>
        </Table>
    );
  }
}

export default RepoTable;