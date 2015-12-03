var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var Component = NgSham.decorators.Component;
var Piyo = (function () {
    function Piyo() {
        this.fuga = 'These words are the value of the "fuga" property on Piyo\'s controller.';
    }
    Piyo.prototype.activate = function () {
        console.log('piyo', this);
    };
    Piyo = __decorate([
        Component({
            selector: 'hoge/[piyo]'
        }), 
        __metadata('design:paramtypes', [])
    ], Piyo);
    return Piyo;
})();
bootstrap(Piyo);
