let animationHelper = {};

const bounceChanges = [
    ['+=10', '-=15', '+=5'],
    ['+=11', '-=16', '+=5'],
    ['+=8', '-=14', '+=6'],
    ['-=12', '+=15', '-=3'],
    ['-=9', '+=15', '-=6'],
    ['-=10', '+=17', '-=7'],
  ];
const smallBounceChanges = [
    ['+=4', '-=8', '+=4'],
    ['+=3', '-=5', '+=2'],
    ['+=3', '-=8', '+=5'],
    ['-=5', '+=7', '-=2'],
    ['-=3', '+=6', '-=3'],
    ['-=4', '+=7', '-=3'],
];

/*
 Some complexity here, as Fabric is not great at animation chains:
 We take a list of animations, in the order we want them to happen:  [go left, then go right]
 We make our "finisher", finishAnimation
 We reverse the animations
 Then, for each animation, we set it up to onComplete the "previous" animation –
 which is actually the _next_ animation, because we reversed it!
 We continue to connect the previous animation to the next via onComplete ...
 After we've done everything, we return the "first" animation function, so we can run it!
*/ 
animationHelper.setupAnimationChain = function(record, animations) {
  let finishAnimation = function () {
    record.isAnimating = false;
  }
  animations.reverse();

  let animationFunctions = [finishAnimation];
  for (let i = 0; i < animations.length; i++) {
    let animation = animations[i];
    let scopedOnComplete = animationFunctions[animationFunctions.length - 1];
    let a = function() {
      let options = {
        onChange: canvas.renderAll.bind(canvas),
        duration: animation.duration,
        onComplete: scopedOnComplete
      }
      record.isAnimating = true;
      record.image.animate(animation.target, animation.change, options);
    }
    animationFunctions.push(a);
  }

  return animationFunctions[animationFunctions.length - 1];
}

function setUpBounces(possibleChanges) {
  let durations = [getRandomInt(75, 150), getRandomInt(75, 150), getRandomInt(35, 75)]
  let possibleTargets = ['left', 'top'];
  let change = possibleChanges[Math.floor(Math.random() * possibleChanges.length)];
  let changeTarget = possibleTargets[Math.floor(Math.random() * possibleTargets.length)];

  let bounces = [
    {target: changeTarget, change: change[0], duration: durations[0]},
    {target: changeTarget, change: change[1], duration: durations[1]},
    {target: changeTarget, change: change[2], duration: durations[2]}
  ]
  return bounces;
}

function setUpFades() {
  const fadeDuration = getRandomInt(400, 600);
  let fades = [
    {target: 'opacity', change: '0', duration: fadeDuration},
    {target: 'opacity', change: '1', duration: fadeDuration}
  ]
  return fades;
}

animationHelper.makeBounce = function(record) {
  const bounces = setUpBounces(bounceChanges);
  return animationHelper.setupAnimationChain(record, bounces);
}

animationHelper.makeSmallBounce = function(record) {
  const bounces = setUpBounces(smallBounceChanges);
  return animationHelper.setupAnimationChain(record, bounces);
}

animationHelper.makeFade = function(record) {
  const fades = setUpFades();
  return animationHelper.setupAnimationChain(record, fades);
}

function setUpWalkabout() {
  const walkOutDuration = getRandomInt(750, 1250);
  const walkBackDuration = getRandomInt(750, 1250);
  const distance = getRandomInt(200, 750);
  let outChange = "";
  let backCHange = "";
  if (Math.random() > 0.5) {
    outChange = "+=" + distance;
    backChange = "-=" + distance;
  } else {
    outChange = "-=" + distance;
    backChange = "+=" + distance;
  }

  let possibleTargets = ['left', 'top'];
  let changeTarget = possibleTargets[Math.floor(Math.random() * possibleTargets.length)];

  let walk = [
    {target: changeTarget, change: outChange, duration: walkOutDuration},
    {target: changeTarget, change: backChange, duration: walkBackDuration},
  ]
  return walk;
}

animationHelper.makeWalkabout = function(record) {
  const walk = setUpWalkabout();
  return animationHelper.setupAnimationChain(record, walk);
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
