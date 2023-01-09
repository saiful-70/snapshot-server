import User from "../models/User.js";
import Post from "../models/Post.js";

// read
export const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getUserFriends = async (req, res) => {
  try {
    const { id } = req.params;
    const userFriends = await User.findById(id).populate("friends");

    const formattedFriends = await userFriends.friends.map(
      ({ _id, firstName, lastName, occupation, location, picturePath }) => {
        return { _id, firstName, lastName, occupation, location, picturePath };
      }
    );
    res.status(200).json(formattedFriends);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getUserBySearch = async (req, res) => {
  try {
    const searchText = req.body.searchText.trim();
    // console.log(searchText);
    if (searchText.length > 0) {
      const results = await User.find({
        firstName: { $regex: new RegExp("^" + searchText + ".*", "i") },
        // lastName: { $regex: new RegExp("^" + searchText + ".*", "i") },
      }).exec();
      // results = results.slice(0, 10);
      // console.log(results);
      // res.send({payload : results})

      res.status(200).json(results.slice(0, 10));
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// update
export const addRemoveFriends = async (req, res) => {
  try {
    const { id, friendId } = req.params;
    if (id === friendId) {
      return res.status(500).json({ error: "You can't make you as a friend!" });
    }

    const user = await User.findById(id);
    const friend = await User.findById(friendId);

    const count = await User.countDocuments({
      _id: user._id,
      friends: friend._id,
    });

    console.log(count, "line 71");
    if (count > 0) {
      await User.updateOne({ _id: friendId }, { $pull: { friends: id } });
      await User.updateOne({ _id: id }, { $pull: { friends: friendId } });
    } else {
      await User.updateOne({ _id: friendId }, { $push: { friends: id } });
      await User.updateOne({ _id: id }, { $push: { friends: friendId } });
    }

    const userFriends = await User.findById(id).populate("friends");
    const formattedFriends = userFriends.friends.map(
      ({ _id, firstName, lastName, occupation, location, picturePath }) => {
        return {
          _id,
          firstName,
          lastName,
          occupation,
          location,
          picturePath,
        };
      }
    );
    res.status(200).json(formattedFriends);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const editProfile = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      location,
      occupation,
      school,
      facebook,
      twitter,
      linkedIn,
      website,
    } = req.body;
    const { id } = req.params;
    const user = User.findById(id);
    let picturePath;
    if (req.file) {
      picturePath = req.file.path;
      const post = await Post.updateMany(
        { userId: id },
        { userPicturePath: picturePath }
      );
      // res.status(200).json(post);
      // return;
    } else {
      picturePath = user.picturePath;
    }

    await User.updateOne(
      { _id: id },
      {
        firstName,
        lastName,
        location,
        occupation,
        school,
        facebook,
        twitter,
        linkedIn,
        website,
        picturePath,
      }
    );
    const updatedUser = await User.findById({ _id: id });
    res.status(200).json(updatedUser);
  } catch (err) {
    console.log("error");
    res.status(500).json({ err: err.message });
  }
};
