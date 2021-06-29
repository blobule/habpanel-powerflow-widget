(function() {
  'use strict';

  /**
   * Usage pattern
   * <ui-power-flow house= bat= p1= p2= p3= p4=></ui-power-flow>
   */

  angular.module('ui.powerflow', [])
    .directive('uiPowerFlow', ['$interval', '$filter',
      function($interval, $filter) {
        return powerflowDirective($interval, $filter);
      }
    ]);

	// return length of dashing, for smooth animation
	// need testing when path does not have dashing...
  function dottedLen(path) {
	  var s=path.style['stroke-dasharray'];
	  var r=s.split(",");
	  return parseFloat(r[0])+parseFloat(r[1]);
  }

  function adjustAnimation(a,value,direction) {
	var vals;
	  if( a.type=='move' )         vals=(value*direction<0)?(a.len+';0'):('0;'+a.len);
	  else if( a.type=='pulse' )   vals='0;'+a.len+';0';
	  else if( a.type=='opacity' ) vals='0;1;0';
	var dur=(value==0)?"indefinite":((10/Math.abs(value))+"s");
	var color=(value==0)?"#000000":((value*direction<0)?"#f00000":"#00f000");
	a.animate.parentElement.style.stroke=color;
	a.animate.setAttribute("values",vals);
	a.animate.setAttribute("dur",dur);
	a.animate.beginElement();
  }

  // add an animation to a specific path
  // find a path with pathID inside the svg, then add an animation element.
  // return enough info to get the animation going later
  // type is 'move', 'pulse', or 'opacity'
  function setupPath(svg,pathId,type) {
      var path=svg.getElementById(pathId);
      var len;
      var animate = document.createElementNS("http://www.w3.org/2000/svg", 'animate');
	  
      if( type=='move' ) {
		animate.setAttribute('attributeName',"stroke-dashoffset"); // default is 'move'
		len=dottedLen(path);
	        if( isNaN(len) ) {
		      // no dashing! add some by default
	  	      path.style['stroke-dasharray']="4,2";
		      len=dottedLen(path);
	        }
      }else if( type=='pulse' ) {
	      len=path.style['stroke-width'];
	      animate.setAttribute('attributeName',"stroke-width");
	      path.style['stroke-dasharray']="none"; // no dashing!
      }else if( type=='opacity' ) {
	      animate.setAttribute('attributeName',"stroke-opacity");
	      path.style['stroke-dasharray']="none"; // no dashing!
      }

      //animate.setAttribute('values',"0;"+len);
      //animate.setAttribute('dur',"2s");
      animate.setAttribute('repeatCount',"indefinite");
      path.appendChild(animate);
      return {'animate':animate, 'len':len, 'type':type};  
  }

	//
	//
	// define the directive  <ui-power-flow>
	//
	//

  function powerflowDirective($interval, $filter) {
    return {
      restrict: 'E',
      scope: {
	house: '=',
	bat: '=',
	p1: '=',
	p2: '=',
	p3: '=',
	p4: '=',
	options: '='
      },
      templateUrl: "/static/powerFlow/solarenergy.svg",		// <<<< put your svg here
      link: function(scope, element, attrs) {
	      var el=element[0];
	      var elP=el.parentElement; // for size info, use elP.clientWidth and elP.clientHeight
	      //console.log("size of parent "+elP.clientWidth+" , "+elP.clientHeight);
	      //console.log("size of us     "+el.clientWidth+" , "+el.clientHeight);

	      // find the svg inside the templateURL
	      //var svg=el.children[0]; // assuming the templateURL is a single svg
	      var svg=document.getElementById('svg8'); // get the svg with this id. (inkscape use svg8 by default)
	      //console.log("size of svg     "+svg.clientWidth+" , "+svg.clientHeight);

	      //console.log("ccc "+scope.options.p1animation);
	      //console.log("scope is "+JSON.stringify(Object.keys(scope),null,4));
	      //console.log("scope.options is "+JSON.stringify(Object.keys(scope['options']),null,4));

	      var animType1=((scope.options && scope.options.p1animation) || 'pulse');
	      var animType2=((scope.options && scope.options.p2animation) || 'opacity');
	      var animType3=((scope.options && scope.options.p3animation) || 'move');
	      var animType4=((scope.options && scope.options.p4animation) || 'move');

	      // locate each path to animate, keep some info to update the animation
	      // each path is found by its id, so it must be set properly in inkscape or manually.
	      var path1 = setupPath(svg,'pathP1',animType1);
	      var path2 = setupPath(svg,'pathP2',animType2);
	      var path3 = setupPath(svg,'pathP3',animType3);
	      var path4 = setupPath(svg,'pathP4',animType4);

	// directive parameters, initialized to 0
        scope.house=0;
        scope.bat=0;
	scope.p1=0;
	scope.p2=0;
	scope.p3=0;
	scope.p4=0;

        // if you ever need to get called every second, uncomment this:
        //var tick = function() { /* called every second */ };
        //var stopTime = $interval(tick, 1000);

	//
	// parameter watching...
	// if any of p1 to p4 change, we adjust the animation accordingly
	// ( we don't watch 'house' or 'bat' because they are directly inside the svg as {{house}} and {{bat}} )
	//

        scope.$watch('p1', function(value, old) { adjustAnimation(path1,value,-1); });
        scope.$watch('p2', function(value, old) { adjustAnimation(path2,value,1); });
        scope.$watch('p3', function(value, old) { adjustAnimation(path3,value,-1); });
        scope.$watch('p4', function(value, old) { adjustAnimation(path4,value,1); });

        // listen on DOM destroy (removal) event, and cancel the next UI update
        // to prevent updating time after the DOM element was removed.
        element.on('$destroy', function() {
	  // if you use the $interval timer, uncomment this.
          //$interval.cancel(stopTime);
          //stopTime = null;
        });

      }
    };
  }


})();
