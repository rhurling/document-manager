import React from 'react';

import TagSelect from './TagSelect';

class FileMultiEdit extends React.Component {

    static propTypes = {
        selection: React.PropTypes.array.isRequired,
        onChange: React.PropTypes.func.isRequired,
        onClearSelection: React.PropTypes.func.isRequired
    };

    defaultState = {
        tags: []
    };

    constructor() {
        super();
        this.state = this.defaultState;

        this.handleTagChange = this.handleTagChange.bind(this);
        this.handleAddTags = this.handleAddTags.bind(this);
        this.handleRemoveTags = this.handleRemoveTags.bind(this);
        this.handleClearSelection = this.handleClearSelection.bind(this);
    }

    handleTagChange(tags) {
        if (tags === null) {
            tags = [];
        }

        this.setState({
            tags: tags
        });
    }

    handleAddTags(evt) {
        this.doAction(evt, 'add')
    }

    handleRemoveTags(evt) {
        this.doAction(evt, 'remove')
    }

    doAction(evt, type) {
        evt.preventDefault();
        evt.stopPropagation();

        var tags = [];
        this.state.tags.forEach(function (item) {
            tags.push(item.value);
        });

        fetch('/tags/multi/' + type, {
            method: 'PUT',
            credentials: 'same-origin',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                files: this.props.selection,
                tags: tags.join(',')
            })
        })
            .then(() => {
                this.props.onChange();
                this.setState(this.defaultState)
            });
    }

    handleClearSelection(evt) {
        evt.preventDefault();
        evt.stopPropagation();

        this.props.onClearSelection();
    }

    render() {
        if (this.props.selection.length > 0) {
            return <form className="multiEditForm">
                <TagSelect placeholder="Tags von Auswahl hinzufügen oder entfernen" tags={this.state.tags}
                           allowCreate={true} onTagChange={this.handleTagChange}/>
                <button className="btn btn-default" onClick={this.handleAddTags}>Tags hinzufügen</button>
                <button className="btn btn-default" onClick={this.handleRemoveTags}>Tags entfernen</button>
                <button className="btn btn-default" onClick={this.handleClearSelection}>Auswahl aufheben</button>
            </form>
        } else {
            return <div></div>
        }
    }

}

export default FileMultiEdit