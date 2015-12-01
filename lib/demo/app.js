(function() {
  ngshim('app', 1.4, 'components');

  ngshambles('hoge/[piyo]', function() {
    return console.log('hogepiyo!');
  });

}).call(this);
