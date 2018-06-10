import React, { Component } from 'react'
import moment from 'moment'
import { newJob } from '../actions'
import { JobDetails } from '../components/JobDetails'

export class NewJob extends Component {
  state = {
    job : {
      start: moment(),
      end: moment(),
      employees:  [''],
      customer: '',
      title:  '',
      latLng: {
        lat: 37.7749295,
        lng: -122.41941550000001 
      },
    },
    exit: false,
  }

  onSave = (job) => {
    const jobClone = {...job};
    jobClone.start = new Date(jobClone.start);
    jobClone.end = new Date(jobClone.end);
    newJob(jobClone);

    this.setState({exit: true});
  }
  render() {
    return (
      <JobDetails job={this.state.job} onSave={this.onSave}  exit={this.state.exit}/>
    )
  }  
}