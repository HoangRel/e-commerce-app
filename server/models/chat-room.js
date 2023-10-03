const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const roomChatSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    messages: [
      {
        text: {
          type: String,
          require: true,
        },
        isClient: {
          type: Boolean,
          default: true,
          required: true,
        },
      },
    ],

    ended: {
      type: Boolean,
      default: false,
      require: true,
    },
  },
  { timestamps: true }
);

roomChatSchema.methods.pushMessage = function (textValue, isClient) {
  const updateMessages = [...this.messages];

  const message = {
    text: textValue,
    isClient,
  };

  updateMessages.push(message);

  this.messages = updateMessages;

  return this.save();
};

module.exports = mongoose.model('RoomChat', roomChatSchema);
