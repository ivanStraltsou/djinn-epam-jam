/**
 * Stroop Task Script
 * Copyright (c) 2009, Manas Tungare.
 * Licensed under the Creative Commons Attribution Non-commercial Share-Alike license 3.0
 * You retain the freedom to examine and modify this script, subject to the condition
 * that you must attribute it to the original author, and all modifications must be
 * shared under the same license.
 *
 * Thanks to the jQuery developers for sharing their library for public use!
 */
    
    // All colors in this list should be HTML colors.
    // http://en.wikipedia.org/wiki/Web_colors
var COLORS = new Array(
    "red",
    "blue",
    "green",
    "yellow",
    "white",
    "pink",
    "brown",
    "orange",
    "purple",
    "gray"
    );

// Text can be anything.
var TEXT = new Array(
    "RED",
    "BLUE",
    "GREEN",
    "YELLOW",
    "WHITE",
    "PINK",
    "BROWN",
    "ORANGE",
    "PURPLE",
    "GRAY"
);

var countSoFar = 0;
var maxCount = 30;
var intervalMillisec = 750;
var timeoutId;

var lastColorIndex = -1;
var lastTextIndex = -1;

$(document).ready(function(){
  // $('#start').click(start);
  // start();
  // reset();
  $('#content').click(reset);
  // $('#content').hide();
  start()
});

function start() {
  // maxCount = $('#maxCount').val();
  // intervalMillisec = $('#intervalMillisec').val();
  $('#content').show();
  $('#startstop').hide();
  next();
}

function next() {
  countSoFar++;
  
  // Do not repeat last color.
  var colorIndex = Math.floor(COLORS.length * Math.random());
  while (colorIndex == lastColorIndex) {
    colorIndex = Math.floor(COLORS.length * Math.random());
  }
  
  // Do not repeat last text.
  var textIndex = Math.floor(TEXT.length * Math.random());
  while (textIndex == lastTextIndex) {
    textIndex = Math.floor(TEXT.length * Math.random());
  }
  
  $('#content').css('color', COLORS[colorIndex]);
  $('#content').html(TEXT[textIndex]);
  
  // Save these values globally so they aren't repeated next time.
  var lastColorIndex = colorIndex;
  var lastTextIndex = textIndex;
  
  if (countSoFar <= maxCount) {
    timeoutId = window.setTimeout(next, intervalMillisec);
  } else {
    end();
  }
}

function end() {
  $('#content').html("");
}

function reset() {
  $('#content').hide();
  start()
  countSoFar = 0;
  clearTimeout(timeoutId);
}
