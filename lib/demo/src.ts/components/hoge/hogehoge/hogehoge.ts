import {Component} from 'ngsham'

@Component('hoge/hogehoge');

class Hoge {
  constructor () {
    console.log('hogehogehoge!');
  }
}

bootstrap(Hoge);
