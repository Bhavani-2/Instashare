import {Link, withRouter} from 'react-router-dom'

import {Component} from 'react'

import Cookies from 'js-cookie'

import {FaSearch} from 'react-icons/fa'

import './index.css'

class Header extends Component {
  state = {
    searchText: '',
  }

  onClickLogout = () => {
    const {history} = this.props
    Cookies.remove('jwt_token')
    history.replace('/login')
  }

  performSearchAction = () => {
    const {onClickSearchIcon} = this.props
    const {searchText} = this.state

    if (searchText !== undefined) {
      onClickSearchIcon(searchText)
    }
  }

  onChangeSearch = event => {
    this.setState({searchText: event.target.value}, this.performSearchAction)
  }

  onClickSearch = () => {
    const {onClickSearchIcon} = this.props
    const {searchText} = this.state

    if (searchText !== undefined) {
      onClickSearchIcon(searchText)
    }
  }

  render() {
    const {searchText} = this.state
    return (
      <>
        <nav className="nav-container">
          <div className="nav-image-container">
            <Link to="/">
              <img
                alt="website logo"
                className="header-logo"
                src="https://res.cloudinary.com/dadzmnign/image/upload/v1688191202/Group_omqen2.png"
              />
            </Link>
            <h1 className="header-head">Insta Share</h1>
          </div>
          <div className="nav-inner-container">
            <div className="search-container">
              <input
                className="search-input"
                type="search"
                placeholder="Search Caption"
                value={searchText}
                onChange={this.onChangeSearch}
              />
              <button
                type="button"
                className="search-imagebtn"
                onClick={this.onClickSearch}
              >
                <FaSearch
                  testid="searchIcon"
                  className="search-img"
                  alt="searchIcon"
                />
              </button>
            </div>
            <Link to="/" className="nav-link">
              Home
            </Link>
            <Link to="/my-profile" className="nav-link">
              Profile
            </Link>

            <button
              type="button"
              className="button1"
              onClick={this.onClickLogout}
            >
              Logout
            </button>
          </div>
        </nav>
      </>
    )
  }
}

export default withRouter(Header)
