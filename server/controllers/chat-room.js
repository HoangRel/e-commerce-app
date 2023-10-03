const ChatRoom = require('../models/chat-room');
const io = require('../socket');

exports.postMessage = (req, res, next) => {
  const textValue = req.body.text;
  const roomId = req.body.roomId || null;

  ChatRoom.findById(roomId)
    .then(room => {
      if (!room) {
        const newRoom = new ChatRoom({
          userId: req.user._id,
          messages: {
            text: textValue,
          },
        });

        return newRoom
          .save()
          .then(result => {
            io.getIo().emit('send_message', {
              roomId: result._id,
              message: { text: textValue, isClient: true },
            });

            res.json({ message: 'send', roomId: result._id });
          })
          .catch(err => {
            next(new Error(err));
          });
        //
      }

      return room.pushMessage(textValue, true).then(result => {
        io.getIo().emit('send_message', {
          roomId: result._id,
          message: { text: textValue, isClient: true },
        });

        res.json({ message: 'send', roomId: result._id });
      });
    })
    .catch(err => {
      next(new Error(err));
    });
};
