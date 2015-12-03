(function() {
  ngshambles('hoge/fuga', function() {
    this.___ = function() {
      return console.log('fuga');
    };
    return this;
  });

}).call(this);
