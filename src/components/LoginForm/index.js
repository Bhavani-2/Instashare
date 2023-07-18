import {Component} from 'react'

import {Redirect} from 'react-router-dom'

import Cookies from 'js-cookie'

import './index.css'

class LoginForm extends Component {
  state = {
    username: '',
    password: '',
    showSubmitError: false,
    errorMsg: '',
  }

  onSubmitSuccess = jwtToken => {
    const {history} = this.props
    Cookies.set('jwt_token', jwtToken, {expires: 30, path: '/'})
    history.replace('/')
  }

  onSubmitFailure = errorMsg => {
    this.setState({showSubmitError: true, errorMsg})
  }

  submitFrom = async event => {
    event.preventDefault()
    const {username, password} = this.state
    const userDetails = {username, password}

    const url = 'https://apis.ccbp.in/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }

    const response = await fetch(url, options)
    const data = await response.json()

    if (response.ok === true) {
      this.onSubmitSuccess(data.jwt_token)
    } else {
      this.onSubmitFailure(data.error_msg)
    }
  }

  onChangePass = event => {
    this.setState({password: event.target.value})
  }

  onChangeInputele = event => {
    this.setState({username: event.target.value})
  }

  renderPasswordElement = () => {
    const {password} = this.state
    return (
      <>
        <label className="label-ele" htmlFor="pass-label">
          PASSWORD
        </label>
        <input
          id="pass-label"
          className="input-ele"
          type="password"
          value={password}
          onChange={this.onChangePass}
        />
      </>
    )
  }

  renderInputElement = () => {
    const {username} = this.state
    return (
      <>
        <label className="label-ele" htmlFor="input-label">
          USERNAME
        </label>
        <input
          id="input-label"
          className="input-ele"
          type="text"
          value={username}
          onChange={this.onChangeInputele}
        />
      </>
    )
  }

  render() {
    const {showSubmitError, errorMsg} = this.state

    const jwtToken = Cookies.get('jwt_token')

    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }

    return (
      <div className="loginform">
        <img
          className="website-login"
          alt="website login"
          src="https://res.cloudinary.com/dadzmnign/image/upload/v1688190663/Layer_2_apt1r2.png"
        />
        <form className="form" onSubmit={this.submitFrom}>
          <img
            className="website-logo"
            alt="website logo"
            src="https://res.cloudinary.com/dadzmnign/image/upload/v1688191202/Group_omqen2.png"
          />
          <h1 className="heading">Insta Share</h1>
          <div className="input-container"> {this.renderInputElement()}</div>
          <div className="input-container">{this.renderPasswordElement()}</div>
          <button type="submit" className="login-button">
            Login
          </button>
          {showSubmitError && <p className="errorMsg">{errorMsg}</p>}
        </form>
      </div>
    )
  }
}

export default LoginForm
