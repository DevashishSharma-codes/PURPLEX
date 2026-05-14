export const sendMessage = (req, res) => {
  const { message } = req.body;
  console.log("Received message:", message);
  return res.status(200).json({
    success: true,
    message: "Message received",
  });
};