import {
  faChartBar,
  faComment,
  faEllipsisH,
  faHeart,
  faRetweet,
  faUpload,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";

export function Tweet({ tweet }) {
  const [comments, setComments] = useState(0);
  const [likes, setLikes] = useState(0);
  const [retweets, setRetweets] = useState(0);
  function handleAction(action) {
    switch (action) {
      case "like":
        setLikes((likes) => likes + 1);
        break;
      case "retweet":
        setRetweets((retweets) => retweets + 1);
        break;

      default:
        setComments((comments) => comments + 1);
        break;
    }
  }
  return (
    <div className="border-b border-gray-800 p-4 hover:bg-gray-800 transition duration-200ms">
      <div className="flex space-x-3">
        <img
          src={tweet.avatar}
          alt="user avatar"
          className="rounded-full w-12 h-12"
        />
        <div className="flex-1">
          <div className="flex items-center  justify-between">
            <div>
              <span className="font-bold">{tweet.name}</span>
              <span className="text-gray-500 ml-2">@{tweet.username}</span>
              <span className="text-gray-500 ml-2">{tweet.time}</span>
            </div>
            <FontAwesomeIcon icon={faEllipsisH} className="text-gray-500" />
          </div>
          <p className="mt-2">{tweet.content}</p>
          {tweet.image && (
            <img
              src={tweet.image}
              className="mt-3 rounded-2xl max-w-full h-auto"
              alt="use image content"
            />
          )}
          <div className="flex justify-between mt-4 text-gray-500 ">
            <div className="flex items-center cursor-pointer hover:text-blue-400">
              <FontAwesomeIcon
                icon={faComment}
                onClick={() => handleAction("comment")}
              />
              <span className="ml-2">{comments}</span>
            </div>
            <div className="flex items-center cursor-pointer hover:text-green-400">
              <FontAwesomeIcon
                icon={faRetweet}
                onClick={() => handleAction("retweet")}
              />
              <span className="ml-2">{retweets}</span>
            </div>
            <div className="flex items-center cursor-pointer hover:text-red-400">
              <FontAwesomeIcon
                icon={faHeart}
                onClick={() => handleAction("like")}
              />
              <span className="ml-2">{likes}</span>
            </div>
            <div className="flex items-center cursor-pointer hover:text-blue-400">
              <FontAwesomeIcon icon={faChartBar} />
            </div>
            <div className="flex items-center cursor-pointer hover:text-blue-400">
              <FontAwesomeIcon icon={faUpload} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
