import React, { PropTypes } from 'react'
import { formatTimestamp } from 'helpers/utils'
import { baseDuckContainer, baseAvatar, clickable } from 'sharedStyles/styles.css'
import { duckContainer, contentContainer, avatar, actionContainer, header, text, likeReplyContainer, icon, likedIcon, author } from './styles.css'
import Reply from 'react-icons/lib/fa/mail-reply'
import Star from 'react-icons/lib/fa/star'
import { Map } from 'immutable'

Duck.propTypes = {
  duck: PropTypes.instanceOf(Map),
  onClick: PropTypes.func,
  isLiked: PropTypes.bool.isRequired,
  addAndHandleLike: PropTypes.func.isRequired,
  handleDeleteLike: PropTypes.func.isRequired,
  numberOfLikes: PropTypes.number,
  hideReplyBtn: PropTypes.bool.isRequired,
  hideLikeCount: PropTypes.bool.isRequired,
  goToProfile: PropTypes.func.isRequired
}

export default function Duck (props) {
  const starIcon = props.isLiked ? likedIcon : icon
  const starFn = props.isLiked ? props.handleDeleteLike : props.addAndHandleLike

  return (
    <div 
      className={duckContainer}
      style={{cursor: props.hideReplyBtn ? 'default' : 'pointer'}}
      onClick={props.onClick}
    >
      <img src={props.duck.get('avatar')} className={avatar} />
      <div className={contentContainer}>
        <div className={header}>
          <div onClick={props.goToProfile} className={author}> {props.duck.get('name')} </div>
          <div> {formatTimestamp(props.duck.get('timestamp'))} </div>
        </div>
        <div className={text}> {props.duck.get('text')} </div>
        <div className={likeReplyContainer}>
          {
            props.hideReplyBtn
            ? null
            : <Reply className={icon}/>
          }
          <div className={actionContainer}>
            <Star className={starIcon} onClick={(e) => starFn(props.duck.get('duckId'), e)}/>
            {
              props.hideLikeCount
              ? null
              : <div> {props.numberOfLikes} </div>
            }
          </div>
        </div>
      </div>
    </div>
  )
}