import { Sidebar } from "./components/sidebar";
import { Tweet } from "./components/tweet";
import { TwitterForm } from "./components/twitterForm";
import { v4 } from "uuid";
import { GetAvatar, GetRandomImage } from "./utils/genereteimage";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

function App() {
  const [Tweets, setTweets] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      addNewRandomTweet();
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const addNewRandomTweet = () => {
    const randomTweetsArr = [
      "Just had an amazing day at the beach! #sunnydays",
      "Learning React is so much fun! #coding",
      "Can't wait for the new season of my favorite show! #excited",
      "Just cooked a delicious meal! #foodie",
    ];
    const randomTweet =
      randomTweetsArr[Math.floor(Math.random() * randomTweetsArr.length)];
    addNewTweet(randomTweet, Math.random() > 0.7);
  };

  const addNewTweet = (content, includeImage = false) => {
    const newTweet = {
      id: v4(),
      name: "User",
      username: `user${Math.floor(Math.random() * 1000)}`,
      avatar: GetAvatar(`user${Math.floor(Math.random() * 1000)}@email.com`),
      content,
      time: new Date().toLocaleDateString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      image: includeImage ? GetRandomImage() : null,
      likes: 0,
      retweets: 0,
      comments: 0,
    };

    setTweets((prevTweets) => [newTweet, ...prevTweets]);
  };

  return (
    <div className="flex mx-auto max-w-7xl">
      <Sidebar />
      <main className="flex-1 border-l border-r border-gray-700 max-w-xl overflow-y-auto">
        <header className="sticky top-0 z-10 bg-twitter-background bg-opacity-80 backdrop-blur-sm ">
          <h2 className="px-4 py-3 text-xl font-bold"> para você </h2>
        </header>
        <TwitterForm
          onTweet={(content) => addNewTweet(content, Math.random() > 0.6)}
        />
        <div>
          {Tweets.map((tweet) => (
            <Tweet key={tweet.id} tweet={tweet} />
          ))}
        </div>
      </main>
      <aside className="hidden xl:block w-80 px-4">
        <div className="sticky top-0 pt-2">
          <div className="relative ">
            <FontAwesomeIcon icon={ faSearch }/>
          </div>
        </div>
      </aside>
    </div>
  );
}

export default App;
