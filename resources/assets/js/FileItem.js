import React from 'react';

class FileItem extends React.Component {

    static propTypes = {
        item: React.PropTypes.object.isRequired,
        onEditRequest: React.PropTypes.func.isRequired,
        onDelete: React.PropTypes.func.isRequired
    };

    constructor() {
        super();

        this.handleEditRequest = this.handleEditRequest.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
    }

    handleEditRequest(evt) {
        evt.preventDefault();
        evt.stopPropagation();

        this.props.onEditRequest(this.props.item);
    }

    handleDelete(evt) {
        evt.preventDefault();
        evt.stopPropagation();

        fetch('/file/' + this.props.item.uuid, {method: 'DELETE', credentials: 'same-origin'})
            .then((response) => response.json())
            .then((responseData) => {
                this.props.onDelete();
            })
    }

    render() {
        return <div className="thumbnail">
            <a href={'/file/' + this.props.item.uuid + '/pdf'} className="link">
                <img src={'/file/' + this.props.item.uuid + '/image'} alt={this.props.item.title}/>
            </a>
            <div className="caption">
                <div className="actions">
                    <a className="edit glyphicon glyphicon-edit" onClick={this.handleEditRequest}></a>
                    <a className="delete glyphicon glyphicon-remove-sign" onClick={this.handleDelete}></a>
                </div>
                <div className="title" title={this.props.item.title}>{this.props.item.title}</div>
                <ul className="tags">
                    {this.props.item.tagged.map(function (tag) {
                        return <li key={tag.id}>{tag.tag_name}</li>;
                    })}
                </ul>
            </div>
        </div>
    }

}

export default FileItem;