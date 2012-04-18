/**
   * Sets up the event listeners so we
   * can click and drag the cube around
   */
function addEventListeners() {
    
    /*
     * Set up the callbacks
     */
    callbacks = {
      
        /**
       * When the mouse is depressed
       */
        onMouseDown: function(event) {
            mouseDown = true;
            lastMouseX = event.clientX;
            lastMouseY = event.clientY;
        },
      
        /**
       * When the mouse has cheered up
       */  
        onMouseUp: function(event) {
            mouseDown = false;
        },
  
        /**
       * When the mouse gets his boogie on
       */
        onMouseMove: function(event) {
        
            if(mouseDown) {
                var thisMouseX = event.clientX;
                var thisMouseY = event.clientY;
                particleSystem.rotation.x += (thisMouseY - lastMouseY) * 0.01;
                particleSystem.rotation.y += (thisMouseX - lastMouseX) * 0.01;
          
                lastMouseY = thisMouseY;
                lastMouseX = thisMouseX;
            }
        },
        
        onWindowResize: function() {
            
            width         = $container.width();
            height        = $container.height();
            aspect        = width / height;
            
            renderer.resize(width, height);
            camera.projectionMatrix.perspective(VIEW_ANGLE, aspect, NEAR, FAR);
            
        },
          
        onKeyDown: function(event)    {
//            console.log(event.keyCode);
            switch(event.keyCode)   {
                case(82): //r
                    settings.run = settings.run ? false : true;
                    break;
                case(77): //m
                    settings.move = settings.move ? false : true;
                    break;
                case(67): //c   
                    settings.collide = settings.collide ? false : true;
                    break;
                case(65): //a
                    settings.animate = settings.animate ? false : true;
                    break;
            }
            
            for (var i in gui.__controllers) {
                gui.__controllers[i].updateDisplay();
            }
        }
           
    }
    $container = $('#container');
    $container.mousedown(callbacks.onMouseDown);
    $container.mouseup(callbacks.onMouseUp);
    $container.mousemove(callbacks.onMouseMove);
//    $(window).resize(callbacks.onWindowResize);
    $(document).keydown(callbacks.onKeyDown);
}