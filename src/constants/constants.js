const statusFlow = {
  pending: ["shipped", "cancelled", "failed"],
  shipped: ["delivered", "cancelled"],
  delivered: [],
  cancelled: [],
  failed: []
};

module.exports = { statusFlow };
