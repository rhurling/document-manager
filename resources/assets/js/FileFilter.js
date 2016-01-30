import React from 'react';

import Select from 'react-select';
import TagSelect from './TagSelect';

class FileFilter extends React.Component {

    static propTypes = {
        filter: React.PropTypes.object.isRequired,
        onFilterChange: React.PropTypes.func.isRequired
    };

    constructor() {
        super();

        this.handleChange = this.handleChange.bind(this);
        this.handleTagChange = this.handleTagChange.bind(this);
    }

    handleChange() {
        this.props.onFilterChange({
            tags: this.props.filter.tags,
            text: this.refs.textInput.value
        });
    }

    handleTagChange(tags) {
        if (tags === null) {
            tags = [];
        }

        this.props.onFilterChange({
            tags: tags,
            text: this.refs.textInput.value
        });
    }

    render() {
        return <form className="filterForm">
            <TagSelect className="tagsFilter" placeholder="Filtern..." tags={this.props.filter.tags}
                       onTagChange={this.handleTagChange}/>
            <input type="text" placeholder="Suchen..." ref="textInput" className="textFilter form-control"
                   value={this.props.filter.text} onChange={this.handleChange}/>
        </form>
    }

}

export default FileFilter;