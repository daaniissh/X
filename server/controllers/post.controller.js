import Post from "../models/post.model.js";
import Notification from "../models/notification.model.js";
import User from "../models/user.model.js";
import { v2 as cloudinary } from "cloudinary";

export const createPost = async (req, res) => {
  try {
    const { text } = req.body;
    console.log(text, "text from post controller");
    let { img } = req.body;
    const userId = req.user._id.toString();
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (!text && !img) {
      return res.status(400).json({ error: "Post must have text or image" });
    }
    if (img) {
      const uploadedResponse = await cloudinary.uploader.upload(img);
      img = uploadedResponse.secure_url;
    }
    const newPost = new Post({
      user: userId,
      text,
      img,
    });

    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};
export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.user.toString() !== req.user._id.toString()) {
      return res
        .status(400)
        .json({ error: "user not authorized for to delete this post" });
    }
    if (post.img) {
      const imgId = post.img.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(imgId);
    }
    await Post.findByIdAndDelete(req.params.id);
    res.json({ message: "deleted successfully" });
  } catch (error) {
    res.json({ error: error.message });
  }
};

export const commentOnPost = async (req, res) => {
  try {
    const { text } = req.body;
    const postId = req.params.id;
    const userId = req.user._id.toString();
    if (!text) {
      return res.status(400).json({ error: "Text field is required" });
    }

    // Find the post and populate existing comments
    const post = await Post.findById(postId).populate("comments.user");

    // Add the new comment
    const comment = { user: userId, text };
    post.comments.push(comment);

    // Save the post with the new comment
    await post.save();

    // Repopulate the new comment's user details
    const updatedPost = await Post.findById(postId).populate("comments.user");
    const notification = new Notification({
      from: userId,
      to: post.user._id,
      type: "comment",
    });
    await notification.save();
    // Return the updated post with populated comments
    return res.status(200).json(updatedPost);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const likeUnlikePost = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id: postId } = req.params;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    const userLikedPost = post.likes.includes(userId);

    if (userLikedPost) {
      // Unlike post
      await Post.updateOne({ _id: postId }, { $pull: { likes: userId } });
      await User.updateOne({ _id: userId }, { $pull: { likedPosts: postId } });

      const updatedLikes = post.likes.filter(
        (id) => id.toString() !== userId.toString()
      );
      res.status(200).json(updatedLikes);
    } else {
      // Like post
      post.likes.push(userId);
      await User.updateOne({ _id: userId }, { $push: { likedPosts: postId } });
      await post.save();

      const notification = new Notification({
        from: userId,
        to: post.user,
        type: "like",
      });
      await notification.save();

      const updatedLikes = post.likes;
      res.status(200).json(updatedLikes);
    }
  } catch (error) {
    console.log("Error in likeUnlikePost controller: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getAllPost = async (req, res) => {
  console.log("get");
  try {
    const post = await Post.find()
      .sort({ createdAt: -1 })
      .populate({ path: "user", select: "-password" })
      .populate({
        path: "comments.user",
        select: "-password",
      });
    if (post.length === 0) {
      return res.status(404).json([]);
    }
    res.json(post);
  } catch (error) {
    res.json(error.message);
  }
};

export const getLikedPosts = async (req, res) => {
  const userId = req.params.id;
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });
    const likedPosts = await Post.find({ _id: { $in: user.likedPosts } })
      .populate({
        path: "user",
        select: "-password",
      })
      .populate({
        path: "comments.user",
        select: "-password",
      });
    res.json(likedPosts);
  } catch (error) {
    res.json(error);
  }
};

export const getFollowingPosts = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    const following = user.following;
    const feedPosts = await Post.find({ user: { $in: following } })
      .sort({
        createdAt: -1,
      })
      .populate({
        path: "user",
        select: "-password",
      });

    res.json(feedPosts);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
export const getUserPosts = async (req, res) => {
  try {
    const { username } = req.params;
    const user = await User.findOne({ username });
    const posts = await Post.find({ user: user._id })
      .sort({ createdAt: -1 })
      .populate({
        path: "user",
        select: "-password",
      })
      .populate({
        path: "comments.user",
        select: "-password",
      });
    return res.json(posts);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
