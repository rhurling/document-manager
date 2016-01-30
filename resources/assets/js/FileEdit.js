import React from 'react';
import TagSelect from './TagSelect';

class FileEdit extends React.Component {

    static propTypes = {
        onSave: React.PropTypes.func.isRequired
    };

    defaultState = {
        opened: false,
        item: {},
        title: {},
        tags: [],
        options: []
    };

    constructor() {
        super();
        this.state = this.defaultState;

        this.open = this.open.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleSave = this.handleSave.bind(this);
        this.handleTitleChange = this.handleTitleChange.bind(this);
        this.handleTagChange = this.handleTagChange.bind(this);
    }

    open(item) {
        var tags = [];
        item.tagged.forEach(function (item) {
            tags.push({value: item.tag_name, label: item.tag_name});
        });

        this.setState({
            opened: true,
            item: item,
            title: item.title,
            tags: tags
        });
    }

    handleClose() {
        var options = this.state.options;
        this.setState(this.defaultState);
        this.setState({
            options: options
        });
    }

    handleSave(evt) {
        evt.preventDefault();
        var tags = [];
        this.state.tags.forEach(function (item) {
            tags.push(item.value);
        });

        fetch('/file/' + this.state.item.uuid, {
            method: 'PUT',
            credentials: 'same-origin',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: this.state.title,
                tags: tags.join(',')
            })
        })
            .then((response) => response.json())
            .then((responseData) => {
                this.props.onSave();
                this.setState(this.defaultState)
            });
    }

    handleTitleChange() {
        this.setState({title: this.refs.titleInput.value});
    }

    handleTagChange(tags) {
        if (tags === null) {
            tags = [];
        }

        this.setState({
            tags: tags
        });
    }

    render() {
        let style = {display: this.state.opened ? 'block' : 'none'};
        var fileEditWindow;
        if (this.state.opened) {
            fileEditWindow = <div className="fileEditWindow">
                <iframe className="fileEditPreview" src={'/file/' + this.state.item.uuid + '/pdf'}></iframe>
                <form acceptCharset="utf-8" className="fileEditForm" onSubmit={this.handleSave}>
                    <div className="form-group">
                        <label htmlFor="titleInput">Titel:</label>
                        <input type="text" className="form-control" ref="titleInput" id="titleInput"
                               value={this.state.title} onChange={this.handleTitleChange}/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="tagsInput">Tags:</label>
                        <TagSelect tags={this.state.tags} allowCreate={true} onTagChange={this.handleTagChange}/>
                    </div>
                    <button type="submit" className="btn btn-primary">Speichern</button>
                </form>
            </div>;
        }

        return <div className="fileEditContainer" style={style}>
            <div className="fileEditBackground" onClick={this.handleClose}></div>
            {fileEditWindow}
        </div>
    }

}

export default FileEdit;