let animationHelper = {};

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
    record.image.clipPath = record.clipPath;
    canvas.insertAt(record.image);
    record.isAnimating = false;
  }

  let backwardsAnimations = animations.reverse();
  let animationFunctions = [finishAnimation];
  for (let i=0; i < animations.length; i++) {
    let animation = animations[i];
    let scopedOnComplete = animationFunctions[animationFunctions.length -1];
    let a = function() {
      let options = {
        onChange: canvas.renderAll.bind(canvas),
        duration: animation.duration,
        onComplete: scopedOnComplete
      }
      record.isAnimating = true;
      record.image.animate(animation.target, animation.change, options)
    }

    animationFunctions.push(a);
  }

  return animationFunctions[animationFunctions.length - 1];
}

animationHelper.makeBounce = function(record) {
  let durations = [getRandomInt(75, 150), getRandomInt(75, 150), getRandomInt(35, 75)]
  let possibleChanges = [
    ['+=10', '-=15', '+=5'],
    ['+=11', '-=16', '+=5'],
    ['+=8', '-=14', '+=6'],
    ['-=12', '+=15', '-=3'],
    ['-=9', '+=15', '-=6'],
    ['-=10', '+=17', '-=7'],
  ];
  let possibleTargets = ['left', 'top'];
  let change = possibleChanges[Math.floor(Math.random() * possibleChanges.length)];
  let changeTarget = possibleTargets[Math.floor(Math.random() * possibleTargets.length)];

  bounces = [
    {target: changeTarget, change: change[0], duration: durations[0]},
    {target: changeTarget, change: change[1], duration: durations[1]},
    {target: changeTarget, change: change[2], duration: durations[2]}
  ]
  return animationHelper.setupAnimationChain(record, bounces);
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
