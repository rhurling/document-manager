import React from 'react';

import Select from 'react-select';

class TagSelect extends React.Component {

    static propTypes = {
        allowCreate: React.PropTypes.bool,
        tags: React.PropTypes.array.isRequired,
        onTagChange: React.PropTypes.func.isRequired
    };

    state = {
        options: []
    };

    constructor() {
        super();

        this.filterOptions = this.filterOptions.bind(this);
        this.loadOptions = this.loadOptions.bind(this);

        this.loadOptions();
    }

    filterOptions(options, filter, values) {
        var filtered_options = [],
            filter_in_options = false;
        values = values.map(function (item) {
            return item.value;
        });
        options.forEach(function (item) {
            if (values.indexOf(item.value) !== -1) {
                return;
            }
            if (item.value === filter) {
                filter_in_options = true;
            }

            if (item.value.indexOf(filter) !== -1) {
                filtered_options.push(item);
            }
        });

        if (filter.trim().length > 0 && !filter_in_options) {
            filtered_options.push({value: filter, label: filter});
        }
        return filtered_options;
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
        if (this.props.allowCreate) {
            return <Select {...this.props} value={this.props.tags} multi={true} delimiter=","
                                           options={this.state.options} filterOptions={this.filterOptions}
                                           onChange={this.props.onTagChange}/>
        } else {
            return <Select {...this.props} value={this.props.tags} multi={true} delimiter=","
                                           options={this.state.options} onChange={this.props.onTagChange}/>
        }
    }

}

export default TagSelect;