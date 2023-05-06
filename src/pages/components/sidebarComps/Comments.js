import { useState } from "react";
const Comments = () => {
  const [commentlist, setcommentlist] = useState([]);
  const [comment, setComment] = useState("");
  const delComment = (index) => {
    const newCommentList = commentlist.filter((comment, i) => i !== index);
    setcommentlist(newCommentList);
  };

  return (
    <>
      <h3>Comments</h3>
      <div className="commentlist">
        {commentlist.map((comment, index) => (
          <li key={index} className="comment">
            {comment}
            <button
              className="deletebtn"
              onClick={() => {
                delComment(index);
              }}
            >
              X
            </button>
          </li>
        ))}
      </div>
      <input
        type="textarea"
        className="commentbox"
        placeholder="Enter your comments here..."
        onChange={(e) => {
          setComment(e.target.value);
        }}
        value={comment}
      ></input>
      <button
        className="commentbtn"
        style={{hover:"cursor"}}
        onClick={() => {
          setcommentlist([...commentlist, comment]);
          setComment("");
        }}
      >
        Add Comment
      </button>
    </>
  );
};

export default Comments;
