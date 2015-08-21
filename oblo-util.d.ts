// This file is a copy of oblo-util/oblo-util.d.ts on https://github.com/borisyankov/DefinitelyTyped,
// but has an extra ../typings in the jQuery reference path, so it can be used from the node_modules/oblo-util
// directory where it is installed by npm.
//
// The condition for this to work is that the jQuery typings are in a directory 'typings' that is at the same 
// level as node_modules (which is normally the case.)

// Type definitions for oblo-util v0.6.4
// Project: https://github.com/Oblosys/oblo-util
// Definitions by: Martijn Schrage <https://github.com/Oblosys/>
// Definitions: https://github.com/borisyankov/DefinitelyTyped


/// <reference path="../../typings/jquery/jquery.d.ts" />

interface ObloUtilStatic {
  debug : boolean;
  
  log(...args: any[]) : void;
  error(...args: any[]) : void;
  clip(min : number, max : number, x : number) : number;
  square(x : number) : number;
  replicate<X>(n : number, x : X) : X[];
  pad(c : string, l : number, str : any) : string;
  padZero(l : number, n : number) : string;
  addslashes(str : string) : string;
  showJSON(json : any, indentStr? : string, maxDepth? : number) : string;
  showTime(date : Date) : string;
  showDate(date : Date) : string;
  readDate(dateStr : string) : Date;
  setAttr($elt : JQuery, attrName : string, isSet : boolean) : void;
}

declare var util: ObloUtilStatic;

declare module "oblo-util" {
	export = util;
}
