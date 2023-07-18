import {Component} from 'react'

import Loader from 'react-loader-spinner'

import Cookies from 'js-cookie'

import {BsGrid3X3} from 'react-icons/bs'
import {BiCamera} from 'react-icons/bi'

import Header from '../Header'

const apiStatusConst = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class MyProfile extends Component {
  state = {
    apiStatus: apiStatusConst.initial,
    profileDetails: {},
  }

  componentDidMount() {
    this.getMyProfileDetails()
  }

  getFormattedData = each => ({
    followersCount: each.followers_count,
    followingCount: each.following_count,
    id: each.id,
    posts: each.posts,
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

  getMyProfileDetails = async () => {
    this.setState({apiStatus: apiStatusConst.inProgress})
    const token = Cookies.get('jwt_token')
    const url = 'https://apis.ccbp.in/insta-share/my-profile'

    const options = {
      method: 'GET',
      headers: {
        Authorization: `Barer ${token}`,
      },
    }
    const response = await fetch(url, options)

    if (response.ok) {
      const data = await response.json()

      console.log(data)

      const updatedData = this.getFormattedData(data.profile)

      this.setState({
        profileDetails: updatedData,
        apiStatus: apiStatusConst.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConst.failure})
    }
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
        className="failure-button"
        type="button"
        onClick={this.getMyProfileDetails}
      >
        Try again
      </button>
    </div>
  )

  renderDetailsView = () => {
    const {profileDetails} = this.state
    const {
      followersCount,
      followingCount,

      posts,
      postsCount,
      profilePicture,
      stories,
      userBio,
      userId,
      userName,
    } = profileDetails

    console.log(stories, posts)
    console.log(posts.length)

    return (
      <>
        <div className="user-profile-section">
          <div className="user-profile-details">
            <img
              src={profilePicture}
              className="user-profile-pic"
              alt="my profile"
            />
            <div className="user-details">
              <h1 className="user-head">{userName}</h1>
              <div className="user-details-inner">
                <p className="para1">
                  {postsCount} <span className="span">Posts</span>
                </p>
                <p className="para1">
                  {followersCount} <span className="span">Followers</span>
                </p>
                <p className="para1">
                  {followingCount} <span className="span">Following</span>
                </p>
              </div>
              <p className="userid">{userId}</p>
              <p className="userbio">{userBio}</p>
            </div>
          </div>
          <ul className="story-container">
            {stories.map(each => (
              <li className="list" key={each.id}>
                <img className="story-image" src={each.image} alt="my story" />
              </li>
            ))}
          </ul>
          <hr className="hr" />
          <div className="grid-container">
            <BsGrid3X3 className="grid" />
            <h1 className="posts">Posts</h1>
          </div>
          {posts.length === 0 ? (
            <div className="no-post-container">
              <BiCamera className="camera" />
              <h1>No Posts</h1>
            </div>
          ) : (
            <ul className="post-container">
              {posts.map(each => (
                <li className="list" key={each.id}>
                  <img className="posts-image" src={each.image} alt="my post" />
                </li>
              ))}
            </ul>
          )}
        </div>
      </>
    )
  }

  renderLoadingView = () => (
    <div className="loader-container">
      <Loader type="TailSpin" color="#4094EF" height={50} width={50} />
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

export default MyProfile
