(function() {
  ngshim('app', 1.4, 'components');

  ngsham('hoge/[piyo]', function() {
    return console.log('hogepiyo!');
  });

}).call(this);
