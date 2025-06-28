import { useEffect, useState } from "react";
import service from "../service";

const UserPage = ({ userId }) => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    async function fetchPosts() {
      const res = await service.getPosts(userId);
      setPosts(res.documents);
    }
    fetchPosts();
  }, [userId]);

  return (
    <div className="flex justify-center  items-center min-h-screen w-full bg-neutral-800 ">
      {posts.map(post => (
        <div key={post.$id}>
          <h2>{post.title}</h2>
          <img src={post.imgurl} alt="Post Image"/>
          <p>{post.description}</p>
        </div>
      ))}

      <hr></hr>
      <div>Make a new entry</div>
    </div>
  );
};

export default UserPage;
