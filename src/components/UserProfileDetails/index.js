import {Link} from 'react-router-dom'

import {BsHeart} from 'react-icons/bs'

import {FcLike} from 'react-icons/fc'

import {FaRegComment} from 'react-icons/fa'
import {BiShareAlt} from 'react-icons/bi'

import './index.css'

/* class UserProfileDetails extends Component {
  state = {
    isLiked: false,
  }

  const postLikeApi = () => {
        initiateSearchPostLikeApi(postId, true)
      }

      const postUnLikeApi = () => {
        initiateSearchPostLikeApi(postId, false)
      }

  toggleLike = async () => {
    await this.setState(prevState => ({isLiked: !prevState.isLiked}))

    const {details} = this.props
    const {postId} = details
    const {isLiked} = this.state

    const jwtToken = Cookies.get('jwt_token')

    const likedRequestBody = {
      like_status: isLiked,
    }

    const likedPostUrl = `https://apis.ccbp.in/insta-share/posts/${postId}/like`

    const options = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'POST',
      body: JSON.stringify(likedRequestBody),
    }

    const response = await fetch(likedPostUrl, options)
    const fetchedData = await response.json()

    console.log(fetchedData)
  } */
const UserProfileDetails = props => {
  const {details, initiatePostLikeApi} = props
  const {
    comments,
    createdAt,
    likeCount,
    postDetails,
    profilePic,
    postId,
    userName,
    userId,
    message,
  } = details

  const isLiked = message === 'Post has been liked'

  const postLikeApi = () => {
    initiatePostLikeApi(postId, true)
  }

  const postUnLikeApi = () => {
    initiatePostLikeApi(postId, false)
  }

  const {imageUrl, caption} = postDetails

  return (
    <li className="post-details-list">
      <div className="profile-section">
        <img
          src={profilePic}
          alt="post author profile"
          className="profile-pic"
        />
        <Link className="link" to={`/users/${userId}`}>
          <p className="profile-name">{userName}</p>
        </Link>
      </div>
      <img src={imageUrl} alt="post" className="post-image" />
      <div className="like-container">
        {isLiked ? (
          <button type="button" onClick={postUnLikeApi} className="like-button">
            <FcLike testid="unLikeIcon" />
          </button>
        ) : (
          <button type="button" onClick={postLikeApi} className="like-button">
            <BsHeart testid="likeIcon" />
          </button>
        )}

        <FaRegComment className="comment" />
        <BiShareAlt className="search" />
      </div>
      <p className="like-count">{likeCount} likes</p>
      <p className="caption">{caption}</p>
      <ul>
        {comments.map(each => (
          <div className="unorder-list">
            <h1 className="comment-head">{each.userName}</h1>
            <p className="comment-para">{each.comment}</p>
          </div>
        ))}
      </ul>
      <p className="created-para">{createdAt}</p>
    </li>
  )
}

export default UserProfileDetails
