import React from 'react';

import Select from 'react-select';

class FileFilter extends React.Component {

    static propTypes = {
        filter: React.PropTypes.object.isRequired,
        onFilterChange: React.PropTypes.func.isRequired
    };

    state = {
        tags: [],
        options: []
    };

    constructor() {
        super();

        this.handleChange = this.handleChange.bind(this);
        this.handleTagChange = this.handleTagChange.bind(this);
        this.loadOptions = this.loadOptions.bind(this);

        this.loadOptions();
    }

    componentDidMount() {
        this.setState({
            tags: this.props.filter.tags
        });
    }

    handleChange() {
        this.props.onFilterChange({
            tags: this.state.tags,
            text: this.refs.textInput.value
        });
    }

    handleTagChange(tags) {
        if (tags === null) {
            tags = [];
        }

        this.setState({
            tags: tags
        }, this.handleChange);
    }

    loadOptions() {
        return fetch(
            '/tags',
            {credentials: 'same-origin'}
        )
            .then((response) => response.json())
            .then((responseData) => {
                var options = responseData.map(function (item) {
                    return {value: item.name, label: item.name};
                });
                this.setState({
                    options: options
                });
            })
    }

    render() {
        return <form className="filterForm">
            <Select name="tags" value={this.state.tags} className="tagsFilter" multi={true} delimiter=","
                    options={this.state.options} onChange={this.handleTagChange}/>
            <input type="text" placeholder="Suchen..." ref="textInput" className="textFilter form-control"
                   value={this.props.filter.text} onChange={this.handleChange}/>
        </form>
    }

}

export default FileFilter;