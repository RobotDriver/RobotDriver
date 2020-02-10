var mouseDownSource = null;

function createFireButton(buttonEl, stateCallback) {
	buttonEl.addEventListener('touchstart', function(){
		buttonEl.classList.add("pressed");
		event.preventDefault();
	  	event.stopPropagation();
        stateCallback('down');
	});
	buttonEl.addEventListener('touchend', function(){
		buttonEl.classList.remove("pressed");
		event.preventDefault();
	  	event.stopPropagation();
            stateCallback('up');
	});
	buttonEl.addEventListener('mousedown', function(){
		buttonEl.classList.add("pressed");
		event.preventDefault();
	  	event.stopPropagation();
	  	mouseDownSource = buttonEl;
        stateCallback('down');
	});
	document.addEventListener('mouseup', function(){
	  	if(mouseDownSource === buttonEl){
			buttonEl.classList.remove("pressed");
	  		mouseDownSource = null;
            stateCallback('up');
	  	}
	});
}

function stickScaleCoords(val){
	return Number(Math.round((val/stickRange)+'e3')+'e-3');
}
function stickFormatCoords(xy){
	return {
		x:stickScaleCoords(xy.x),
		y:stickScaleCoords(xy.y)
	};
}

function createStick(parent, maxRange, stickName, moveCallback) {

  var stick = document.createElement('div');
  stick.classList.add('joystick');

  stick.addEventListener('mousedown', handleMouseDown);
    
  stick.addEventListener('mousemove', handleMouseMove);
  stick.addEventListener('mouseup', handleMouseUp);
  document.addEventListener('mousemove', handleMouseMove);
  document.addEventListener('mouseup', handleMouseUp);


  stick.addEventListener('touchstart', handleMouseDown);
  stick.addEventListener('touchmove', handleMouseMove);
  stick.addEventListener('touchend', handleMouseUp);

  let dragStart = null;
  let currentPos = { x: 0, y: 0 };

  function handleMouseDown(event) {
  	event.preventDefault();
  	event.stopPropagation();

  	if(event.type==='mousedown'){
  		mouseDownSource = stick;
  	}
    stick.style.transition = '0s';
    if (event.changedTouches) {
      dragStart = {
        x: event.changedTouches[0].clientX,
        y: event.changedTouches[0].clientY,
      };
      return;
    }
    
    dragStart = {
      x: event.clientX,
      y: event.clientY,
    };
  }

  function handleMouseMove(event) {
  	if(event.type==='mousemove' && mouseDownSource !== stick){
  		return;
  	}
  	event.preventDefault();
  	event.stopPropagation();
    if (dragStart === null) return;

    if (event.changedTouches) {
      event.clientX = event.changedTouches[0].clientX;
      event.clientY = event.changedTouches[0].clientY;
      console.log(event.changedTouches[0].clientX);
      console.log(event.changedTouches[0].clientY);
    }
    const xDiff = event.clientX - dragStart.x;
    const yDiff = event.clientY - dragStart.y;
    const angle = Math.atan2(yDiff, xDiff);
	const distance = Math.min(maxRange, Math.hypot(xDiff, yDiff));
	const xNew = distance * Math.cos(angle);
	const yNew = distance * Math.sin(angle);
    stick.style.transform = `translate3d(${xNew}px, ${yNew}px, 0px)`;
    currentPos = { x: xNew, y: yNew };
    moveCallback(currentPos);
  }

  function handleMouseUp(event) {
      
  	if(event.type==='mouseup' && mouseDownSource !== stick){
  		return;
  	}
  	mouseDownSource = null;
      
  	event.preventDefault();
  	event.stopPropagation();
      
  	
    if (dragStart === null) return;
    stick.style.transition = '.2s';
    stick.style.transform = `translate3d(0px, 0px, 0px)`;
    dragStart = null;
    currentPos = { x: 0, y: 0 };
    moveCallback(currentPos);
  }

  parent.appendChild(stick);

// var lastPos = currentPos;
// setInterval(() => {
// 	if(currentPos.x !== lastPos.x || currentPos.y !== lastPos.y){
// 		lastPos = currentPos;
// 		console.log(stickName, ' : ', currentPos);
// 	}
// }, 150);

  return {
    getPosition: () => currentPos,
    stick: stick
  };
}
