import PropTypes from "prop-types";

export function FollowItem({ name, username, avatar, onFollow, isFollowing }) {
    return (
        <div className="flex items-center justify-between py-3 hover:bg-gray-800 transition duration-200">
            <div className="flex items-center">
                <img src={avatar || "/default-avatar.png"} alt="user avatar" className="w-12 h-12 rounded-full mr-3"/>
                <div>
                    <p className="font-bold">{name}</p>
                    <p className="text-gray-500">@{username}</p>
                </div>
            </div>
            {onFollow && (
                <div>
                    <button
                        onClick={onFollow}
                        className={`font-bold px-4 py-2 rounded-full transition duration-200 ${
                            isFollowing
                                ? "bg-gray-600 text-white hover:bg-gray-700"
                                : "bg-white text-black hover:bg-gray-300"
                        }`}
                    >
                        {isFollowing ? "Seguindo" : "Seguir"}
                    </button>
                </div>
            )}
        </div>
    )
}

FollowItem.propTypes = {
    name: PropTypes.string,
    username: PropTypes.string,
    avatar: PropTypes.string,
    onFollow: PropTypes.func,
    isFollowing: PropTypes.bool,
}
