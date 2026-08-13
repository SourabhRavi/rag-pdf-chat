const { z } = require("zod");

const chatSchema = z.object({
  conversationId: z.uuid(),
  question: z.string().trim().min(1).max(2000),
  documentIds: z.array(z.uuid()).min(1).max(3),
});

module.exports = {
  chatSchema,
};
