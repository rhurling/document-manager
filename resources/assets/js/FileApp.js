import React from 'react';

import FileFilter from './FileFilter';
import FileUpload from './FileUpload';
import FileItem from './FileItem';
import FilePagination from './FilePagination';
import FileEdit from './FileEdit';

class FileApp extends React.Component {

    state = {
        items: [],
        current_page: 1,
        last_page: 1,
        filter: {
            text: '',
            tags: []
        }
    };

    constructor() {
        super();

        this.handleFilterChange = this.handleFilterChange.bind(this);
        this.handlePageChange = this.handlePageChange.bind(this);
        this.handleChangedData = this.handleChangedData.bind(this);
        this.handleEditRequest = this.handleEditRequest.bind(this);
        this.handleSave = this.handleSave.bind(this);
    }

    componentDidMount() {
        this.fetchData();
    }

    fetchData() {
        var args = '?';

        if (parseInt(this.state.current_page) > 1) {
            args += 'page=' + parseInt(this.state.current_page) + '&';
        }

        if (this.state.filter.text) {
            args += 's=' + encodeURIComponent(this.state.filter.text.trim()) + '&';
        }

        if (this.state.filter.tags.length > 0) {
            var tags = [];
            this.state.filter.tags.forEach(function (item) {
                tags.push(item.value);
            });
            args += 'tags=' + encodeURIComponent(tags.join(',')) + '&';
        }

        fetch(
            '/file' + args,
            {credentials: 'same-origin'}
        )
            .then((response) => response.json())
            .then((responseData) => {
                this.setState({
                    items: responseData.data,
                    current_page: responseData.current_page,
                    last_page: responseData.last_page
                });
            })
    }

    handleFilterChange(filter) {
        this.setState({
            filter: filter
        }, this.fetchData);
    }

    handlePageChange(page) {
        this.setState({
            current_page: page
        }, this.fetchData);
    }

    handleChangedData() {
        this.fetchData();
    }

    handleEditRequest(item) {
        this.refs.FileEdit.open(item);
    }

    handleSave() {
        this.refs.FileFilter.loadOptions();
        this.refs.FileEdit.loadOptions();
        this.fetchData();
    }

    render() {
        return <div className="container">
            <FileFilter ref="FileFilter" onFilterChange={this.handleFilterChange} filter={this.state.filter}/>

            <div className="fileList">
                <FileUpload tags={this.state.filter.tags} onUpload={this.handleChangedData}/>

                {this.state.items.map((item) => {
                    return <FileItem key={item.uuid} item={item} onEditRequest={this.handleEditRequest}
                                     onDelete={this.handleChangedData}/>;
                })}
            </div>

            <FilePagination currentPage={this.state.current_page} lastPage={this.state.last_page}
                            onPageChange={this.handlePageChange}/>

            <FileEdit ref="FileEdit" onSave={this.handleSave}/>
        </div>
    }
}

export default FileApp