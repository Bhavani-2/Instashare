import './index.css'

import {withRouter} from 'react-router-dom'

const NotFound = props => {
  const onClickHomePage = () => {
    const {history} = props

    history.replace('/')
  }
  return (
    <div className="not-found-container">
      <img
        src="https://res.cloudinary.com/dadzmnign/image/upload/v1688632541/erroring_1_t9e5rf.png"
        alt="page not found"
        className="not-found-img"
      />
      <h1 className="notfound-head">Page Not Found</h1>
      <p className="notfound-para">
        we are sorry, the page you requested could not be found.Please go back
        to the homepage.
      </p>
      <button
        onClick={onClickHomePage}
        type="button"
        className="notfound-button"
      >
        Home Page
      </button>
    </div>
  )
}

export default withRouter(NotFound)
