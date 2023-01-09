import Message from "../models/Message.js";

export const addMessage = async (req, res) => {
  const { chatId, senderId, text } = req.body;
  console.log(req.body);
  const message = new Message({
    chatId,
    senderId,
    text,
  });
  try {
    const result = await message.save();
    // console.log(result);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const getMessages = async (req, res) => {
  const { chatId } = req.params;
  console.log(req.params);
  try {
    const result = await Message.find({ chatId });
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json(error);
  }
};
