import './index.css'

import {BsGrid3X3} from 'react-icons/bs'
import {BiCamera} from 'react-icons/bi'

const UserProfileDetailsCard = props => {
  const {profiledetails} = props
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
  } = profiledetails

  return (
    <>
      <div className="user-profile-section">
        <div className="user-profile-details">
          <img
            src={profilePicture}
            className="user-profile-pic"
            alt="user profile"
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
              <img className="story-image" src={each.image} alt="user story" />
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
                <img className="posts-image" src={each.image} alt="user post" />
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  )
}

export default UserProfileDetailsCard
