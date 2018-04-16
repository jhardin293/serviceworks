import React, { Component } from 'react';
// import Modal from 'react-modal';
import './App.css';
import {
  addSupply, 
  getSupplies, 
  updateSupply, 
  deleteSupply, 
  updateSupplyCost,
  uploadImage,
  getWishList,
} from '../helpers/api.js';


class Supply extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cost:0,
    }
    this.state.cost = props.supply.cost === undefined ?  0 : props.supply.cost;
    this.handleCost = this.handleCost.bind(this)
  }
  toggle () {
    this.props.togglePackedSupply(this.props.supply);
  }
  remove () {
    this.props.removeSupply(this.props.supply);
  }
  updateCost (e) {
    this.props.updateCost(this.props.supply.id,e.target.value);
  }
  handleUpload (e) {
    this.props.handleUpload(e, this.props.supply.id)
  }
  handleCost (e) {
    this.setState({cost: e.target.value});
  }
  render() {
    let supply = this.props.supply;
    if (supply.cost === undefined) {
      supply.cost = 0;
    }
    return (
      <li>
        <img src={supply.img} alt=""/>
        <h3>{supply.name}</h3>
        <input type="file" onChange={this.handleUpload.bind(this)}/>
        <div className="supply-container">
          <div className="cost">
            <label>$</label>
            <input type="text" value={this.state.cost} onChange={this.handleCost.bind(this)} onBlur={this.updateCost.bind(this)}/>
          </div>
          <input type="checkbox" checked={supply.packed} name="" id="" onChange={this.toggle.bind(this)}/>
          <span className="remove" onClick={this.remove.bind(this)}>Delete</span>
        </div>
      </li>
    )
  }
}

class SupplyList extends Component {
  render() {
  let supplies = this.props.supplies;
    return (
      <div className="list-container">
        <ul className="list">
          {
            supplies.map((supply,i) => 
              <Supply 
                key={i}
                supply={supply}  
                {...this.props}
              />
            )}
        </ul>
      </div>
    )
  }
}

class NewSupply extends Component {
  create(e) {
    e.preventDefault();
    let name = this.refs.name.value;
    if (name) {
      this.props.createSupply(name);
      this.refs.name.value = '';
    }
  }
  render() {
    return (
      <form className="add-new" onSubmit={this.create.bind(this)}>
        <input type="text" name="" id="" ref="name" />
        <button type="submit">New</button>
      </form>
    )
  }
}

class WishList extends Component {
  render() {
    let list = this.props.list;
    console.log(list, 'list');
    return (
      <div className="list-container">
        <ul className="list">
          {
            list.map((item,idx) => 
              <li key={idx}>
                <img src={item.img} alt=""/>
                <h3>{item.title.substring(0,40)}</h3>

                <div className="supply-container">
                  <div className="cost">
                    <label>$</label>
                    <input type="text" value={item.cost} readOnly/>
                  </div>
                </div>
              </li>
            )}
        </ul>
      </div>
    )
  }
}


class App extends Component {
  constructor () {
    super();

    this.state = {
      supplies: [],
      filterBy: 'all',
      totalCost: 0,
      wishList: []
    }

  }

  componentWillMount () {
    getSupplies().onSnapshot((snap) => {
      let supplies = [];
      let totalCost = 0;
      snap.forEach((supply)=> {
        let id = supply.id;
        supplies.push({id, ...supply.data()});
      });
      if (supplies.length > 1) {
        totalCost = supplies.reduce((prev,curr)=> {
          let prevVal = prev.cost ? parseInt(prev.cost,10) : prev;
          console.log(prevVal, curr.cost);
          return prevVal + parseInt(curr.cost,10);
        });
      }
      this.setState({supplies: supplies, totalCost: totalCost});
    })
    getWishList().then((data)=>{
      this.setState({wishList: data})
    });
  }

  createSupply(name) {
    addSupply({name, packed: false, cost: 0});
  }

  removeSupply(supply) {
    let id = supply.id;
    deleteSupply(id);
  }

  togglePackedSupply(supply) {
    let id = supply.id
    supply.packed = !supply.packed;
    updateSupply(id, supply);
  }
  
  handleFilter(e) {
    if (e.target.id) {
      this.setState({filterBy: e.target.id});
    }
  }

  updateCost(id,cost) {
    if (id) {
      updateSupplyCost(id,cost);
    }
  }
  handleUpload (e, id) {
    let file = e.target.files[0];
    if (file) {
      uploadImage(file, id);
    }
  }


  render() {
    let supplies = this.state.supplies;
    if (this.state.filterBy !== 'all') {
      supplies = this.state.supplies.filter((s) => {
        if (this.state.filterBy === 'checked') {
          return !s.packed; 
        }else {
          return s.packed;
        }
      }); 
    }
    
    return (
      <div>
        <header>
          <div className="header-container">
            <h1>Serviceworks</h1>
          </div>
        </header>
        <section className="main">
          <NewSupply createSupply={this.createSupply.bind(this)} /> 
          <div className="filters" onClick={this.handleFilter.bind(this)}>
            <button id="all">All</button>
            <button id="packed">Packed</button>
          </div>
          <h2>${this.state.totalCost}</h2>
          <SupplyList 
            supplies={supplies} 
            togglePackedSupply={this.togglePackedSupply.bind(this)}
            removeSupply={this.removeSupply.bind(this)}
            updateCost={this.updateCost.bind(this)}
            handleUpload={this.handleUpload.bind(this)}
            /> 
          <br/>
          <WishList list={this.state.wishList} />
        </section>
      </div>
    );
  }
}

export default App;
