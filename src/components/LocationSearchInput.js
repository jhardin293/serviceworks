import React, { Component } from 'react'
import PlacesAutocomplete from 'react-places-autocomplete'

export class LocationSearchInput extends Component {
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
