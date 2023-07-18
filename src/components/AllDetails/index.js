import './index.css'
import {Component} from 'react'

import Cookies from 'js-cookie'

import Loader from 'react-loader-spinner'
import UserProfileDetails from '../UserProfileDetails'

const apiStatusConst = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class AllDetails extends Component {
  state = {
    apiStatus: apiStatusConst.initial,
    postDetails: [],
    isLike: false,
  }

  componentDidMount() {
    this.getProfileDetails()
  }

  getFormattedData = each => ({
    caption: each.caption,
    imageUrl: each.image_url,
  })

  getProfileDetails = async () => {
    this.setState({apiStatus: apiStatusConst.inProgress})

    const token = Cookies.get('jwt_token')
    const url = 'https://apis.ccbp.in/insta-share/posts'
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Barer ${token}`,
      },
    }
    const response = await fetch(url, options)
    if (response.ok) {
      const data = await response.json()
      const updatedData = data.posts.map(each => ({
        comments: each.comments.map(cdetails => ({
          comment: cdetails.comment,
          userId: cdetails.user_id,
          userName: cdetails.user_name,
        })),
        createdAt: each.created_at,
        likeCount: each.likes_count,
        postDetails: this.getFormattedData(each.post_details),
        postId: each.post_id,
        profilePic: each.profile_pic,
        userId: each.user_id,
        userName: each.user_name,
      }))
      this.setState({
        apiStatus: apiStatusConst.success,
        postDetails: updatedData,
      })
    }
    if (response.status === 404) {
      this.setState({apiStatus: apiStatusConst.failure})
    }
  }

  renderLoadingView = () => {
    ;<div className="loader-container">
      <Loader type="TailSpin" color="#4094EF" height={50} width={50} />
    </div>
  }

  renderFailureView = () => (
    <div className="failure-container">
      <img
        src="https://res.cloudinary.com/dadzmnign/image/upload/v1688677175/alert-triangle_sj4oin.png"
        className="failure-image"
        alt="failure view"
      />
      <p className="failure-para">Something went wrong. Please try again</p>
      <button
        className="failure-button"
        type="button"
        onClick={this.getProfileDetails}
      >
        Try Again
      </button>
    </div>
  )

  onClickLike = async id => {
    const {isLike} = this.state

    this.setState(prevState => ({
      isLike: !prevState.isLike,
    }))

    console.log(id)

    console.log(isLike)
    const token = Cookies.get('jwt_token')
    const url = `https://apis.ccbp.in/insta-share/posts/${id}/like`

    const userDetails = {like_status: isLike}

    const options = {
      method: 'POST',
      headers: {
        Authorization: `Barer ${token}`,
      },
      body: JSON.stringify(userDetails),
    }
    const response = await fetch(url, options)
    console.log(response)
    const data = await response.json()
    console.log(data)

    // const value = data.message

    // this.setState({isLikeData: value})
  }

  renderDetailsView = () => {
    const {postDetails, isLike} = this.state

    return (
      <div>
        <ul className="post-Details-section">
          {postDetails.map(each => (
            <UserProfileDetails
              details={each}
              key={each.postId}
              onClick={this.onClickLike}
              isLike={isLike}
            />
          ))}
        </ul>
      </div>
    )
  }

  renderPostDetails = () => {
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
    return <>{this.renderPostDetails()}</>
  }
}

export default AllDetails
