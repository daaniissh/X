import Post from "../models/post.model.js";
import Notification from "../models/notification.model.js";
import User from "../models/user.model.js";
import { v2 as cloudinary } from "cloudinary";

export const createPost = async (req, res) => {
  console.log("why man");
  try {
    const { text } = req.body;
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
    const post = await Post.findById(postId);
    const comment = { user: userId, text };
    post.comments.push(comment);
    await post.save();
    return res.status(200).json(post);
  } catch (error) {
    res.json({ error: error.message });
  }
};

export const likeUnlikePost = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id: postId } = req.params;

    const post = await Post.findById(postId);
    const userLikedPost = post.likes.includes(userId);
    if (userLikedPost) {
      await Post.updateOne({ _id: postId }, { $pull: { likes: userId } });
      await User.updateOne({ _id: userId }, { $pull: { likedPosts: postId } });
      res.status(200).json("unLiked");
    } else {
      post.likes.push(userId);
      await User.updateOne({ _id: userId }, { $push: { likedPosts: postId } });
      await post.save();
      const notification = new Notification({
        from: userId,
        to: post.user,
        type: "like",
      });
      await notification.save();
      res.status(200).json("Liked");
    }
  } catch (error) {}
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
        path: "commenst.user",
        select: "-pwassword",
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
