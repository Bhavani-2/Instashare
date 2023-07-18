import {Component} from 'react'

import './index.css'

import Cookies from 'js-cookie'

import Loader from 'react-loader-spinner'

import Header from '../Header'

import UserProfileDetailsCard from '../UserProfileDetailsCard'

const apiStatusConst = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class UserProfile extends Component {
  state = {
    apiStatus: apiStatusConst.initial,
    details: {},
  }

  componentDidMount() {
    this.getPostDetails()
  }

  getFormattedData = each => ({
    followersCount: each.followers_count,
    followingCount: each.following_count,
    id: each.id,
    posts: each.posts,
    postId: each.post_id,
    postsCount: each.posts_count,
    profilePicture: each.profile_pic,
    stories: each.stories.map(seach => ({
      id: seach.id,
      image: seach.image,
    })),
    userBio: each.user_bio,
    userId: each.user_id,
    userName: each.user_name,
  })

  getPostDetails = async () => {
    const {match} = this.props
    const {params} = match
    const {id} = params
    this.setState({apiStatus: apiStatusConst.inProgress})
    const token = Cookies.get('jwt_token')
    const url = `https://apis.ccbp.in/insta-share/users/${id}`

    const options = {
      method: 'GET',
      headers: {
        Authorization: `Barer ${token}`,
      },
    }

    const response = await fetch(url, options)

    if (response.ok) {
      const data = await response.json()

      const updatedData = this.getFormattedData(data.user_details)

      this.setState({
        details: updatedData,
        apiStatus: apiStatusConst.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConst.failure})
    }
  }

  renderLoadingView = () => (
    <div className="loader-container " data-testid="loader">
      <Loader type="TailSpin" color="#4094EF" height={50} width={50} />
    </div>
  )

  renderDetailsView = () => {
    const {details} = this.state

    return (
      <div>
        <UserProfileDetailsCard profiledetails={details} />
      </div>
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
        onClick={this.getPostDetails}
      >
        Try again
      </button>
    </div>
  )

  renderUserDetails = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConst.success:
        return this.renderDetailsView()
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
        <Header />
        <div className="user-main-section"> {this.renderUserDetails()}</div>
      </>
    )
  }
}

export default UserProfile
