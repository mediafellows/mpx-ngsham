/// <reference path="../../../../../../node_modules/reflect-metadata/reflect-metadata.d.ts"/>
/// <reference path="../../../../../../src/ngsham.ts"/>

// import {Component} from 'ngsham'
var Component = NgSham.decorators.Component;

@Component('hoge/[piyo]')
class Piyo {
  constructor () {
    console.log('hogehogehoge!');
  }
}

bootstrap(Piyo);
