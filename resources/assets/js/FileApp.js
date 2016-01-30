import React from 'react';

import FileFilter from './FileFilter';
import FileUpload from './FileUpload';
import FileItem from './FileItem';
import FilePagination from './FilePagination';
import FileEdit from './FileEdit';
import FileMultiEdit from './FileMultiEdit';

class FileApp extends React.Component {

    state = {
        items: [],
        selection: [],
        current_page: 1,
        last_page: 1,
        filter: {
            text: '',
            tags: []
        }
    };

    constructor() {
        super();

        if (window.history.state) {
            let state = window.history.state || {};
            this.state.current_page = state.page || 1;
            this.state.filter.text = state.filter_text || '';
            this.state.filter.tags = state.filter_tags || [];
        }

        this.handleFilterChange = this.handleFilterChange.bind(this);
        this.handlePageChange = this.handlePageChange.bind(this);
        this.handleChangedData = this.handleChangedData.bind(this);
        this.handleSelect = this.handleSelect.bind(this);
        this.handleEditRequest = this.handleEditRequest.bind(this);
        this.handleSave = this.handleSave.bind(this);
        this.handleClearSelection = this.handleClearSelection.bind(this);
    }

    componentDidMount() {
        this.fetchData();

        window.addEventListener('popstate', (evt) => {
            if (!evt.state) {
                evt.state = {}
            }

            this.setState({
                current_page: evt.state.page || 1,
                filter: {
                    text: evt.state.filter_text || '',
                    tags: evt.state.filter_tags || []
                }
            }, () => {
                this.fetchData();
                this.refs.FileFilter.forceUpdate();
            });
        })
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

        window.history.pushState({
            page: this.state.current_page,
            filter_text: this.state.filter.text,
            filter_tags: this.state.filter.tags
        }, null, args);

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
            current_page: page,
            selection: []
        }, this.fetchData);
    }

    handleChangedData() {
        this.fetchData();
    }

    handleSelect(uuid) {
        var selection = this.state.selection,
            index = selection.indexOf(uuid);
        if (index === -1) {
            selection.push(uuid);
        } else {
            selection.splice(index, 1);
        }

        this.setState({
            selection: selection
        });
    }

    handleEditRequest(item) {
        this.refs.FileEdit.open(item);
    }

    handleSave() {
        this.fetchData();
    }

    handleClearSelection() {
        this.setState({
            selection: []
        });
    }

    render() {
        return <div className="container">
            <FileFilter ref="FileFilter" onFilterChange={this.handleFilterChange} filter={this.state.filter}/>

            <FileMultiEdit selection={this.state.selection} onChange={this.handleChangedData}
                           onClearSelection={this.handleClearSelection}/>

            <div className="fileList">
                <FileUpload tags={this.state.filter.tags} onUpload={this.handleChangedData}/>

                {this.state.items.map((item) => {
                    return <FileItem key={item.uuid} item={item} selection={this.state.selection}
                                     onSelect={this.handleSelect} onEditRequest={this.handleEditRequest}
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