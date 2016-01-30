import React from 'react';

import Select from 'react-select';
import TagSelect from './TagSelect';

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

    render() {
        return <form className="filterForm">
            <TagSelect className="tagsFilter" placeholder="Filtern..." tags={this.state.tags}
                       onTagChange={this.handleTagChange}/>
            <input type="text" placeholder="Suchen..." ref="textInput" className="textFilter form-control"
                   value={this.props.filter.text} onChange={this.handleChange}/>
        </form>
    }

}

export default FileFilter;