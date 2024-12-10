import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { CREATE_POST, GET_POSTS } from "./Queries";
import { Button, Modal } from "react-bootstrap";
import PostForm from "./PostForm";

interface PostsProps {
  userId: number;
}

const Posts: React.FC<PostsProps> = ({ userId }) => {
  const [createPost] = useMutation(CREATE_POST, { refetchQueries: [{ query: GET_POSTS, variables: { userId } }] });
  const [showPostModal, setShowPostModal] = useState(false); 
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationVariant, setNotificationVariant] = useState<"success" | "danger">("success");

  const handleCreatePost = async (title: string, body: string) => {
    try {
      await createPost({ variables: { title, body, userId } });
      setNotificationMessage("Post created successfully!");
      setNotificationVariant("success");
    } catch (error: any) {
      setNotificationMessage(`Error creating post: ${error.message}`);
      setNotificationVariant("danger");
    } finally {
      setShowPostModal(false); 
      setShowNotificationModal(true);
    }
  };

  const openCreateModal = () => {
    setShowPostModal(true);
  };

  return (
    <div className="posts-container">
      <h3>Posts</h3>

      {/* Button to open Create Post Modal */}
      <Button variant="primary" className="mb-4" onClick={openCreateModal}>
        Create Post
      </Button>

      {/* Notification Modal */}
      <Modal show={showNotificationModal} onHide={() => setShowNotificationModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{notificationVariant === "success" ? "Success" : "Error"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>{notificationMessage}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowNotificationModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Create Post Modal */}
      <Modal show={showPostModal} onHide={() => setShowPostModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Create Post</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <PostForm
            onSubmit={handleCreatePost}
            buttonLabel="Create Post"
          />
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Posts;

