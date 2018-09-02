import React, { Component } from 'react'
import { InvoiceDetails } from '../components/InvoiceDetails'
import moment from 'moment'
import { connect } from 'react-redux'
import { newInvoice, getInvoiceCount } from '../actions/'
import isEqual from 'lodash.isequal'

export class NewInvoiceComp extends Component {
  state = {
    invoice: {
      id: '',
      title: '',
      customer: '',
      dueDate: moment(),
      invoiceNumber: '',
      total: 0,
      footer: '',
      labor: {
        0: {
          item: '',
          rate: '',
          billing: {
            label: 'Hourly',
            value: 'hourly'
          },
          hours: '',
          total: 0
        }
      },
      parts: {
        0: {
          item: '',
          price: '',
          quantity: 1,
          total: 0
        }
      }
    },
    exit: false,
    openExitModal: false,
  }
  componentWillMount() {
    this.props.getInvoiceCount();
    if (this.props.location.state) {
      this.setState({redirect: this.props.location.state.redirect})
    }else {
      this.setState({redirect: {path: '/invoices'}})
    }
  }

  handleCloseModal = () => {
    this.setState({openExitModal: false});
  }

  onCancel = (currentState) => {
    if(isEqual(this.state.invoice, currentState)) {
      this.setState({exit: true});
    }else {
      this.setState({openExitModal: true});
    }
  }

  onSave = (invoice) => {
    const invoiceClone = {...invoice};
    invoiceClone.dueDate = new Date(invoiceClone.dueDate);
    invoiceClone.invoiceNumber = this.props.invoicesCount.invoicesCount +1;
    newInvoice(invoiceClone);
    this.setState({exit: true});
  }


  render() {
    return (
      <InvoiceDetails
        invoice={this.state.invoice}
        onSave={this.onSave}
        exit={this.state.exit}
        onCancel={this.onCancel}
        redirect={this.state.redirect}
        openExitModal={this.state.openExitModal}
        handleCloseModal={this.handleCloseModal}
      />
    )
  }
}

const mapStateToProps = state => ({
  invoicesCount: state.invoicesCount
});

export const NewInvoice = connect(mapStateToProps,
  { getInvoiceCount })(NewInvoiceComp);