import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {db, auth} from "../../firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

export default function RecipeCard({ props }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  const handleCommentChange = (e) => {
    setNewComment(e.target.value);
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (newComment.trim()) {
      try {
        // Add the comment to the RecipeComments collection
        const commentData = {
          userId: auth.currentUser.uid, // Replace with the current user's ID
          commentBody: newComment,
          recipeId: props.id,
          TimecreatedAt: serverTimestamp(),
        };
        const docRef = await addDoc(collection(db, "RecipeComments"), commentData);
        console.log("Comment written with ID: ", docRef.id);

        // Update the UI by adding the new comment
        setComments([...comments, commentData]);
        setNewComment("");
      } catch (error) {
        console.error("Error adding document: ", error);
      }
    }
  };

  return (
    <div className="me-3 mt-3">
      <Link className="text-decoration-none" href={"/recipes/" + props.id}>
        <div className="card" style={{ width: "18rem" }}>
          <Image
            width={250}
            height={250}
            src={props.imageUrl}
            className="card-img-top"
            alt="..."
          />
          <div className="card-body">
            <h5 className="card-title">{props.title}</h5>
            <p className="card-text overflow-y-auto" style={{ height: "150px" }}>
              {props.instructions}
            </p>
          </div>
        </div>
      </Link>

      <div className="mt-3">
        <h6>Comments</h6>
        <ul>
          {comments.map((comment, index) => (
            <li key={index}>{comment.commentBody}</li>
          ))}
        </ul>
        <form onSubmit={handleCommentSubmit}>
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Add a comment"
              value={newComment}
              onChange={handleCommentChange}
            />
          </div>
          <button type="submit" className="btn btn-primary">Submit</button>
        </form>
      </div>
    </div>
  );
}
