/// <reference path="../../../../../../node_modules/reflect-metadata/reflect-metadata.d.ts"/>
/// <reference path="../../../../../../src/ngsham.ts"/>

// import {Component} from 'ngsham'
var Component = NgSham.decorators.Component;

@Component({
  selector: 'hoge/[piyo]'
})
class Piyo {
  public fuga = 'These words are the value of the "fuga" property on Piyo\'s controller.'
  constructor () {

  }
  private activate () {
    console.log('piyo', this);
  }
}

bootstrap(Piyo);
