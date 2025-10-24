import {
  faChartBar,
  faComment,
  faEllipsisH,
  faHeart,
  faRetweet,
  faUpload,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, useEffect } from "react";
import api from "../../services/api";

export function Tweet({ tweet, onViewProfile }) {
  const [likes, setLikes] = useState(tweet.likes || 0);
  const [comments, setComments] = useState(tweet.comments || 0);
  const [isLiked, setIsLiked] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [commentList, setCommentList] = useState([]);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    // Carregar comentários quando o componente montar
    loadComments();
  }, [tweet.id]);

  const loadComments = async () => {
    try {
      const response = await api.getCommentsByPost(tweet.id);
      setCommentList(response);
      setComments(response.length);
    } catch (error) {
      console.error("Erro ao carregar comentários:", error);
    }
  };

  const handleLike = async () => {
    try {
      if (isLiked) {
        await api.unlikePost(tweet.id);
        setLikes(likes - 1);
      } else {
        await api.likePost(tweet.id);
        setLikes(likes + 1);
      }
      setIsLiked(!isLiked);
    } catch (error) {
      console.error("Erro ao curtir:", error);
    }
  };

  const handleComment = async () => {
    if (!newComment.trim()) return;

    try {
      await api.createComment({
        texto: newComment,
        post_id: tweet.id,
      });
      setNewComment("");
      loadComments();
    } catch (error) {
      console.error("Erro ao comentar:", error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="border-b border-gray-800 p-4 hover:bg-gray-800 transition duration-200ms">
      <div className="flex space-x-3">
        <img
          src={tweet.avatar || "/default-avatar.png"}
          alt="user avatar"
          className="rounded-full w-12 h-12"
        />
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div>
              <button
                onClick={() => onViewProfile && onViewProfile(tweet.autor_id)}
                className="font-bold hover:underline cursor-pointer"
              >
                {tweet.autor_nome || tweet.nome || tweet.name}
              </button>
              <span className="text-gray-500 ml-2">@{tweet.email?.split('@')[0] || tweet.username}</span>
              <span className="text-gray-500 ml-2">• {tweet.categoria_nome}</span>
              <span className="text-gray-500 ml-2">{formatDate(tweet.data_postagem || tweet.time)}</span>
            </div>
            <FontAwesomeIcon icon={faEllipsisH} className="text-gray-500" />
          </div>
          <p className="mt-2">{tweet.conteudo || tweet.content}</p>
          {tweet.imagem && (
            <img
              src={tweet.imagem}
              className="mt-3 rounded-2xl max-w-full h-auto"
              alt="conteúdo da imagem"
            />
          )}
          <div className="flex justify-between mt-4 text-gray-500">
            <div
              className="flex items-center cursor-pointer hover:text-blue-400"
              onClick={() => setShowComments(!showComments)}
            >
              <FontAwesomeIcon icon={faComment} />
              <span className="ml-2">{comments}</span>
            </div>
            <div className="flex items-center cursor-pointer hover:text-green-400">
              <FontAwesomeIcon icon={faRetweet} />
              <span className="ml-2">{tweet.retweets || 0}</span>
            </div>
            <div
              className="flex items-center cursor-pointer hover:text-red-400"
              onClick={handleLike}
            >
              <FontAwesomeIcon icon={faHeart} className={isLiked ? "text-red-500" : ""} />
              <span className="ml-2">{likes}</span>
            </div>
            <div className="flex items-center cursor-pointer hover:text-blue-400">
              <FontAwesomeIcon icon={faChartBar} />
            </div>
            <div className="flex items-center cursor-pointer hover:text-blue-400">
              <FontAwesomeIcon icon={faUpload} />
            </div>
          </div>

          {showComments && (
            <div className="mt-4 border-t border-gray-700 pt-4">
              <div className="flex space-x-2 mb-4">
                <input
                  type="text"
                  placeholder="Escreva um comentário..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="flex-1 bg-gray-700 text-white rounded-full px-4 py-2 outline-none"
                  onKeyPress={(e) => e.key === 'Enter' && handleComment()}
                />
                <button
                  onClick={handleComment}
                  className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600"
                >
                  Comentar
                </button>
              </div>
              <div className="space-y-3">
                {commentList.map((comment) => (
                  <div key={comment.id} className="flex space-x-2">
                    <img
                      src={comment.avatar || "/default-avatar.png"}
                      alt="commenter avatar"
                      className="rounded-full w-8 h-8"
                    />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-sm">{comment.nome}</span>
                        <span className="text-gray-500 text-sm">{formatDate(comment.data)}</span>
                      </div>
                      <p className="text-sm">{comment.texto}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
