import React, { Component } from 'react'
import PropTypes from 'prop-types'
import PlacesAutocomplete from 'react-places-autocomplete'

export class LocationSearchInput extends Component {
  static propTypes = {
    address: PropTypes.string,
    getLocation: PropTypes.func,
    onLocationChange: PropTypes.func,
  }

  state = {
    address: this.props.address
  }
 
 
  render() {
    return (
      <PlacesAutocomplete
        value={this.props.address}
        onChange={this.props.onLocationChange}
        onSelect={this.props.getLocation}
      >
        {({ getInputProps, suggestions, getSuggestionItemProps }) => (
          <div>
            <input
              {...getInputProps({
                placeholder: 'Search Places ...',
                className: 'location-search-input'
              })}
            />
            <div className="autocomplete-dropdown-container">
              {suggestions.map(suggestion => {
                const className = 'suggestion-item';
                // inline style for demonstration purpose
                const style = suggestion.active
                            ? { backgroundColor: '#fafafa', cursor: 'pointer' }
                            : { backgroundColor: '#ffffff', cursor: 'pointer' };
                return (
                  <div {...getSuggestionItemProps(suggestion, { className, style })}>
                    <span>{suggestion.description}</span>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </PlacesAutocomplete>
    );
  }
}
