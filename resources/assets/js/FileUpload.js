import React from 'react';
import DropzoneComponent from 'react-dropzone-component';

class FileUpload extends React.Component {

    static propTypes = {
        onUpload: React.PropTypes.func.isRequired,
        tags: React.PropTypes.array.isRequired
    };

    render() {
        let config = {
                postUrl: '/file',
                allowedFiletypes: ['.pdf'],
                showFiletypeIcon: true
            },
            djsConfig = {
                addRemoveLinks: true
            },
            eventHandlers = {
                complete: (file) => {
                    this.props.onUpload();
                },
                sending: (file, xhr, formData) => {
                    var tags = [];
                    this.props.tags.forEach(function (item) {
                        tags.push(item.value);
                    });
                    formData.append('tags', tags.join(','));
                }
            };

        return <DropzoneComponent config={config} djsConfig={djsConfig} eventHandlers={eventHandlers}/>
    }

}

export default FileUpload