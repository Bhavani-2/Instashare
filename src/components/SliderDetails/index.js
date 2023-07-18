import {Component} from 'react'

import Cookies from 'js-cookie'

import Loader from 'react-loader-spinner'

import ReactSlick from '../ReactSlick'

const apiStatusConst = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class SliderDetails extends Component {
  state = {
    apiState: apiStatusConst.initial,
    data: [],
  }

  componentDidMount() {
    this.getSliderData()
  }

  getSliderData = async () => {
    this.setState({apiState: apiStatusConst.inProgress})

    const token = Cookies.get('jwt_token')
    const url = 'https://apis.ccbp.in/insta-share/stories'

    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }

    const response = await fetch(url, options)

    if (response.ok === true) {
      const fetchData = await response.json()
      const updatedData = fetchData.users_stories.map(each => ({
        storyUrl: each.story_url,
        userId: each.user_id,
        userName: each.user_name,
      }))

      this.setState({
        apiState: apiStatusConst.success,
        data: updatedData,
      })
    } else {
      this.setState({
        apiState: apiStatusConst.failure,
      })
    }
  }

  renderLoadingView = () => (
    <div className="loader-container">
      <Loader type="TailSpin" color="#4094EF" height={50} width={50} />
    </div>
  )

  renderSliderView = () => {
    const {data} = this.state
    const {userId} = data

    return (
      <>
        <ul>
          <ReactSlick details={data} key={userId} />
        </ul>
      </>
    )
  }

  renderFailureView = () => (
    <div className="failure-container">
      <img
        className="failure-img"
        alt="failure view"
        src="https://res.cloudinary.com/dadzmnign/image/upload/v1688677175/alert-triangle_sj4oin.png"
      />
      <p className="failure-para">Something went wrong. Please try again</p>
      <button
        className="failure-btn"
        type="button"
        onClick={this.getSliderData}
      >
        Try again
      </button>
    </div>
  )

  renderSliderDetails = () => {
    const {apiState} = this.state

    switch (apiState) {
      case apiStatusConst.success:
        return this.renderSliderView()
      case apiStatusConst.failure:
        return this.renderFailureView()
      case apiStatusConst.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <div className="slider-container">{this.renderSliderDetails()}</div>
      </>
    )
  }
}

export default SliderDetails
