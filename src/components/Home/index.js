import './index.css'

import {Component} from 'react'

import Cookies from 'js-cookie'

import Loader from 'react-loader-spinner'

import UserProfileDetails from '../UserProfileDetails'

import SliderDetails from '../SliderDetails'

import Header from '../Header'

const apiStatusConst = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class Home extends Component {
  state = {
    apiStatus: apiStatusConst.initial,
    searchDetails: {},
    isSearchButtonClicked: false,
    searchInputHome: '',
  }

  componentDidMount() {
    this.getSearchData()
  }

  getFormattedData = each => ({
    caption: each.caption,
    imageUrl: each.image_url,
  })

  getSearchData = async () => {
    const {searchInputHome} = this.state
    console.log(searchInputHome)
    this.setState({
      apiStatus: apiStatusConst.inProgress,
    })
    let url
    if (searchInputHome === '') {
      url = 'https://apis.ccbp.in/insta-share/posts'
    } else {
      url = `https://apis.ccbp.in/insta-share/posts?search=${searchInputHome}`
    }

    const token = Cookies.get('jwt_token')
    console.log(url)

    const options = {
      method: 'GET',
      headers: {
        Authorization: `Barer ${token}`,
      },
    }

    const response = await fetch(url, options)
    console.log(response)
    if (response.ok) {
      const data = await response.json()
      console.log(data)
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
        searchDetails: updatedData,
      })
    } else {
      this.setState({apiStatus: apiStatusConst.failure})
    }
  }

  renderLoadingView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="TailSpin" color="#4094EF" height={50} width={50} />
    </div>
  )

  renderSearchFailureView = () => (
    <div className="failure-container">
      <img
        src="https://res.cloudinary.com/dziwdneks/image/upload/v1675513323/SearchNotFound_ntqrqa.png"
        className="search-failure-image"
        alt="search not found"
      />
      <h1 className="failure-head">Search Not Found</h1>
      <p className="failure-para">Try different keyword or search again</p>
    </div>
  )

  renderPostFailureView = () => (
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
        onClick={this.getSearchData}
      >
        Try Again
      </button>
    </div>
  )

  initiatePostLikeApi = async (postId, likeStatus) => {
    const {searchDetails} = this.state
    const jwtToken = Cookies.get('jwt_token')
    const likeDetails = {
      like_status: likeStatus,
    }
    const apiUrl = `https://apis.ccbp.in/insta-share/posts/${postId}/like`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'POST',
      body: JSON.stringify(likeDetails),
    }

    const response = await fetch(apiUrl, options)
    const data = await response.json()
    let userPostsData = searchDetails
    userPostsData = userPostsData.map(eachObject => {
      if (eachObject.postId === postId && likeStatus) {
        return {
          ...eachObject,
          message: data.message,
          likeCount: eachObject.likeCount + 1,
        }
      }
      if (eachObject.postId === postId && !likeStatus) {
        return {
          ...eachObject,
          message: data.message,
          likeCount: eachObject.likeCount - 1,
        }
      }

      return eachObject
    })
    this.setState({searchDetails: userPostsData})
  }

  renderSearchDetailsView = () => {
    const {searchDetails} = this.state
    console.log(searchDetails)
    if (searchDetails.length === 0) {
      return this.renderSearchFailureView()
    }
    return (
      <div>
        <ul className="post-Details-section">
          {searchDetails.map(each => (
            <UserProfileDetails
              details={each}
              key={each.postId}
              initiatePostLikeApi={this.initiatePostLikeApi}
            />
          ))}
        </ul>
      </div>
    )
  }

  renderSearchDetails = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConst.success:
        return this.renderSearchDetailsView()
      case apiStatusConst.failure:
        return this.renderPostFailureView()
      case apiStatusConst.inProgress:
        return this.renderLoadingView()

      default:
        return null
    }
  }

  onClickSearchIcon = searchText => {
    this.setState({apiStatus: apiStatusConst.initial})
    let searchingStatus
    if (searchText === '') {
      searchingStatus = false
    } else {
      searchingStatus = true
    }

    this.setState(
      {
        searchInputHome: searchText,
        isSearchButtonClicked: searchingStatus,
      },
      this.getSearchData,
    )
  }

  render() {
    const {isSearchButtonClicked, searchDetails} = this.state
    console.log(searchDetails)
    return (
      <>
        <Header onClickSearchIcon={this.onClickSearchIcon} />
        {!isSearchButtonClicked && <SliderDetails />}
        {isSearchButtonClicked && (
          <>
            <div>
              <h1>Search Results</h1>
            </div>
          </>
        )}
        {this.renderSearchDetails()}
      </>
    )
  }
}

export default Home
