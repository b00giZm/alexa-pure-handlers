module.exports = function pureHandler(handlerFunc) {
  return function() {
    const self = this;
    const ctx = Object
      .keys(self)
      .reduce((acc, key) => {
        let value = self[key];
        if ('function' === typeof value) {
          value = value.bind(self);
        }

        return Object.assign(acc, { [key]: value });
      }, {});

    const result = handlerFunc(ctx);

    if (result) {
      self.attributes = Object.assign({}, self.attributes, result.attributes);
    }

    if (result && result.emit) {
      self.emit(...result.emit);
    }
  };
};
