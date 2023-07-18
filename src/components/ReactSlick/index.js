import './index.css'

import {Component} from 'react'

import Slider from 'react-slick'

const settings = {
  dots: false,
  infinite: false,
  speed: 500,
  slidesToShow: 7,
  slidesToScroll: 1,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 4,
        slidesToScroll: 1,
      },
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 1,
      },
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1,
      },
    },
  ],
}

class ReactSlick extends Component {
  renderSlider = () => {
    const {details} = this.props
    return (
      <Slider {...settings}>
        {details.map(eachLogo => {
          const {userName, storyUrl, userId} = eachLogo
          return (
            <li className="slick-item" key={userId}>
              <img className="logo-image" src={storyUrl} alt="user story" />
              <p className="para">{userName}</p>
            </li>
          )
        })}
      </Slider>
    )
  }

  render() {
    return (
      <div className="main-container">
        <div className="slick-container">{this.renderSlider()}</div>
      </div>
    )
  }
}

export default ReactSlick
