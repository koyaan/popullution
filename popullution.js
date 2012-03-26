// set the scene size
var WIDTH = $('#container').width(),//1100,
    HEIGHT = $('#container').height();//600;    

var initialCameraPosition = 200;

var scene, camera, renderer, particleSystem, particles;
var container;
var mouseDown = false;
var colorWrap = 5;

var particleCount= 100;
var particleStartAreaSize = 30;
var stepsize = 0.1;
var particleMeta = new Array(1);
var colors = new Array();

var pMaterial;
var lifespan = 200;
var Pool;

var POPULLUTION = {};
POPULLUTION.pleb = function() {
    this.energy =15000;//Number.POSITIVE_INFINITY;
    this.spawns = 3;
    this.generation = 1;
    this.particle = undefined;
}

function normalizePosition(particle)    {
//    return true;
        if(Math.abs(particle.position.x > 0 ? Math.floor(particle.position.x) : Math.ceil(particle.position.x)) > cellcube.normalizer)  {
            if(particle.position.x > 0) {
                particle.position.x = cellcube.normalizer;
            } else {
                particle.position.x = -cellcube.normalizer;
            }
        }

        if(Math.abs(particle.position.y > 0 ? Math.floor(particle.position.y) : Math.ceil(particle.position.y)) > cellcube.normalizer)  {
            if(particle.position.y > 0) {
                particle.position.y = cellcube.normalizer;
            } else {
                particle.position.y = -cellcube.normalizer;
            }
        }

        if(Math.abs(particle.position.z > 0 ? Math.floor(particle.position.z) : Math.ceil(particle.position.z)) > cellcube.normalizer)  {
            if(particle.position.z > 0) {
                particle.position.z = cellcube.normalizer;
            } else {
                particle.position.z = -cellcube.normalizer;
            }
        }
}

POPULLUTION.plebs = new Array();

// used to store settings changeable through GUI
var Settings = function() {
    this.stepsize = 0.2;
    this.movementMatrix = randomWalkMatrix(this.stepsize);
    this.run = false;
    this.cameraPosition = initialCameraPosition;
    this.spawningAreaSize = 6;
    this.maxPop = 10000;
}

init();

// add GUI
var settings = new Settings();
var gui = new dat.GUI();
var stepsizecontroller = gui.add(settings, 'stepsize', 0, 2);
gui.add(settings, 'run'); // no boolean love
var cameracontroller = gui.add(settings, 'cameraPosition', 0, 1000);

stepsizecontroller.onFinishChange(function(value) {
    settings.movementMatrix = randomWalkMatrix(value);
});

cameracontroller.onFinishChange(function(value) {
    camera.position.z = value;
});

gui.add(settings, 'spawningAreaSize', 1, 100);
gui.add(settings, 'maxPop', 1000, 40000);

animate();

function randomWalkMatrix(stepsize) {
    return Array(
        new THREE.Vector3(stepsize  ,0          ,0),
        new THREE.Vector3(-stepsize ,0          ,0),
        new THREE.Vector3(0         ,stepsize   ,0),
        new THREE.Vector3(0         ,-stepsize  ,0),
        new THREE.Vector3(0         ,0          ,stepsize),
        new THREE.Vector3(0         ,0          ,-stepsize)
    );
}

var cellcube;

function init() {

    var VIEW_ANGLE = 45,
    ASPECT = WIDTH / HEIGHT,
    NEAR = 0.1,
    FAR = 10000;

    renderer = new THREE.WebGLRenderer();
    camera =
    new THREE.PerspectiveCamera(
        VIEW_ANGLE,
        ASPECT,
        NEAR,
        FAR);

    scene = new THREE.Scene();

    camera.position.z = initialCameraPosition;

    scene.add(camera);


    particles = new THREE.Geometry();

    pMaterial =
    new THREE.ParticleBasicMaterial({
    color: 0xFFFFFF,
    size: 1,
    opacity: 0.9,
    vertexColors:  true,
    blending: THREE.AdditiveBlending
  });

//// PARTICLE POOL
function newpos(x, y, z) {
            return new THREE.Vertex(
            new THREE.Vector3(x, y, z)
        );
}

Pool = {
        __pools: [],

        // Get a new particle
        get: function() {
            if (this.__pools.length>0) {
                return this.__pools.pop();
            }

            //console.log("pool ran out!")
            return null;

        },

        // Release a particle back into the pool
        add: function(v) {
            this.__pools.push(v);
        }


    };

   for ( i = 0; i < 40000; i++ ) {
            particles.vertices.push(newpos(Number.POSITIVE_INFINITY,Number.POSITIVE_INFINITY,Number.POSITIVE_INFINITY));
            colors.push(new THREE.Color( 0xffffff ));
            Pool.add(i);
    }

    // now create the individual particles
    for(var p = 0; p < particleCount; p++) {
        var pX = Math.random() * particleStartAreaSize - particleStartAreaSize/2,
        pY = Math.random() * particleStartAreaSize - particleStartAreaSize/2,
        pZ = Math.random() * particleStartAreaSize - particleStartAreaSize/2,
        particleIndex = Pool.get();
        particle = particles.vertices[particleIndex];
        particle.position.set(pX, pY, pZ);
//        particle.position.set(p, p, p);
        pRed = 1;
        pGreen = 1;
        pYellow = 1;
        colors[ particleIndex ].setRGB(pRed, pGreen, pYellow);
        pleb = new POPULLUTION.pleb();
        pleb.particle = particleIndex;
        POPULLUTION.plebs.push(pleb);
//        console.log(pX,pY,pZ);
    }
    
    particles.colors = colors;
    
    // create the particle system
    particleSystem =
    new THREE.ParticleSystem(
        particles,
        pMaterial);
    
    // helper function to compute bounding sphere igoring particles at position Infinity
    particleSystem.geometry.computeFiniteBoundingSphere = function (){for(var a,b=0,c=0,d=this.vertices.length;c<d;c++)a=this.vertices[c].position.length(),(a != Number.POSITIVE_INFINITY && a>b)&&(b=a);this.finiteBoundingSphere={radius:b}}
    
    particleSystem.sortParticles = false;
    
    // space partioning 
    cellcube = new CELLLIST.Cube(100);
    cellcube.computeNeighbors();
    
    for(p = 0; p < particleCount; p++) {
        position = particles.vertices[POPULLUTION.plebs[p].particle].position;
        cX = position.x > 0 ? Math.floor(position.x) : Math.ceil(position.x);
        cY = position.y > 0 ? Math.floor(position.y) : Math.ceil(position.y);
        cZ = position.z > 0 ? Math.floor(position.z) : Math.ceil(position.z);
        
        cellcube.add(cX,cY,cZ,POPULLUTION.plebs[p]);
//        cellcube.add(cX,cY,cZ,POPULLUTION.plebs[p])
    }
    
    scene.add(particleSystem);

    renderer.setSize(WIDTH, HEIGHT);

    // attach the render-supplied DOM element
    container = document.getElementById( 'container' );
    container.style.width = WIDTH+"px";
    container.style.height = HEIGHT+"px";
    container.appendChild( renderer.domElement );
        
    addEventListeners();
    
    // add stats widget 
    var stats = new Stats();
    statsContainer = document.getElementById( 'statsContainer' );
    statsContainer.appendChild( stats.getDomElement() );

    setInterval( function () {
        stats.update();
    }, 1000 / 60 );
    
    $('#census').text(POPULLUTION.plebs.length);
    
    renderer.render(scene, camera);
}

function animate() {
    
//    particleSystem.rotation.y += 0.001;
//    particleSystem.rotation.x += 0.001;
//    particleSystem.rotation.z += 0.001;
    
    if(settings.run)    {
        var plebCount = POPULLUTION.plebs.length;
        var pCount = plebCount;
        var exhausted = new Array();
        
        if(plebCount >= settings.maxPop)    {
            settings.run = false;
            $('#message').text("overkill!");
        } else if (plebCount == 0) {
            settings.run = false;
            $('#message').text("wipeout!");
        }
        
        
        for(pCount in POPULLUTION.plebs) {
            // get the particle
            plebsParticleIndex = POPULLUTION.plebs[pCount].particle
            particle = particles.vertices[plebsParticleIndex];
            
            cX = particle.position.x > 0 ? Math.floor(particle.position.x) : Math.ceil(particle.position.x);
            cY = particle.position.y > 0 ? Math.floor(particle.position.y) : Math.ceil(particle.position.y);
            cZ = particle.position.z > 0 ? Math.floor(particle.position.z) : Math.ceil(particle.position.z);
//            cellcube.remove(cX,cY,cZ,pCount);
            cellcube.remove(cX,cY,cZ, POPULLUTION.plebs[pCount]);
            
            if(--POPULLUTION.plebs[pCount].energy <= 0)   {
                particle.position.set(Number.POSITIVE_INFINITY,Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY);
                colors[plebsParticleIndex].setRGB(0,0,0);
                Pool.add(plebsParticleIndex);
                POPULLUTION.plebs.splice(pCount,1);
                //console.log(pCount,"died");
            } else {
               // random step of size stepsize
                var choice = Math.floor(Math.random()*6);
                particle.position.addSelf(
                    settings.movementMatrix[choice]); // TODO: multiply with gauss scalar

                normalizePosition(particle);

                cX = particle.position.x > 0 ? Math.floor(particle.position.x) : Math.ceil(particle.position.x);
                cY = particle.position.y > 0 ? Math.floor(particle.position.y) : Math.ceil(particle.position.y);
                cZ = particle.position.z > 0 ? Math.floor(particle.position.z) : Math.ceil(particle.position.z);
    //            console.log(cX,cY,cZ,pCount,"add");
//                cellcube.add(cX,cY,cZ,pCount)
                cellcube.add(cX,cY,cZ, POPULLUTION.plebs[pCount])
            }
        }
        
//        pCount = POPULLUTION.plebs.length;
//        while(pCount--) {
//            plebsParticleIndex = POPULLUTION.plebs[pCount].particle
//            particle = particles.vertices[plebsParticleIndex];
//            
//            
//            cX = particle.position.x > 0 ? Math.floor(particle.position.x) : Math.ceil(particle.position.x);
//            cY = particle.position.y > 0 ? Math.floor(particle.position.y) : Math.ceil(particle.position.y);
//            cZ = particle.position.z > 0 ? Math.floor(particle.position.z) : Math.ceil(particle.position.z);
//
////            console.log(cX,cY,cZ,pCount,"remove");
//            cellcube.remove(cX,cY,cZ,pCount)
//            
//            // random step of size stepsize
//            var choice = Math.floor(Math.random()*6);
//            particle.position.addSelf(
//                settings.movementMatrix[choice]); // TODO: multiply with gauss scalar
//            
//            normalizePosition(particle);
//            
//            cX = particle.position.x > 0 ? Math.floor(particle.position.x) : Math.ceil(particle.position.x);
//            cY = particle.position.y > 0 ? Math.floor(particle.position.y) : Math.ceil(particle.position.y);
//            cZ = particle.position.z > 0 ? Math.floor(particle.position.z) : Math.ceil(particle.position.z);
////            console.log(cX,cY,cZ,pCount,"add");
//            cellcube.add(cX,cY,cZ,pCount)
//            
//        }

    for(cellIndex in cellcube.activeCells)  {
        for(plebIndex in cellcube.activeCells[cellIndex].members)  {
            plebOne = cellcube.activeCells[cellIndex].members[plebIndex];
            //pCount = cellcube.activeCells[cellIndex].members[plebIndex];
            if(exhausted[POPULLUTION.plebs.indexOf(plebOne)])
                continue;
//            particle = particles.vertices[POPULLUTION.plebs[pCount].particle];
            particle = particles.vertices[plebOne.particle];
            for( neighborIndex in cellcube.activeCells[cellIndex].neighbors)    {
                if(cellcube.activeCells[cellIndex].neighbors[neighborIndex].active) {
                    for(neighborPlebIndex in cellcube.activeCells[cellIndex].neighbors[neighborIndex].members)  {
                        //console.log(cellcube.activeCells[cellIndex].neighbors[neighborIndex].members,neighborPlebIndex);
//                        pcCount = cellcube.activeCells[cellIndex].neighbors[neighborIndex].members[neighborPlebIndex];
                        plebTwo = cellcube.activeCells[cellIndex].neighbors[neighborIndex].members[neighborPlebIndex];
//                        console.log(pcCount);
//                        if(neighborPlebIndex == plebIndex || exhausted[pcCount])
                        if(neighborPlebIndex == plebIndex || exhausted[POPULLUTION.plebs.indexOf(plebTwo)])
                            continue;
//                        CanditatePleb = POPULLUTION.plebs[pcCount];
//                        candiatePlebParticleIndex = POPULLUTION.plebs[pcCount].particle;
                        candiatePlebParticleIndex = plebTwo.particle;
                        collisionCandidate = particles.vertices[candiatePlebParticleIndex];
                        var distance = particle.position.distanceTo(collisionCandidate.position);
                        if(distance <1)  {
//                                if(POPULLUTION.plebs[pCount].spawns > 0 && POPULLUTION.plebs[pcCount].spawns > 0)   {
                                if(plebOne.spawns > 0 && plebTwo.spawns > 0)   {
//                                    POPULLUTION.plebs[pCount].spawns--;
//                                    POPULLUTION.plebs[pcCount].spawns--;
                                    plebOne.spawns--;
                                    plebTwo.spawns--;
//                                    exhausted[pCount] = true;
//                                    exhausted[pcCount] = true;  
                                    exhausted[POPULLUTION.plebs.indexOf(plebOne)] = true;
                                    exhausted[POPULLUTION.plebs.indexOf(plebOne)] = true;  
                                    particleIndex = Pool.get();
                                    childParticle = particles.vertices[particleIndex];
                                    childParticle.position.set(
                                        particle.position.x+(Math.random()*settings.spawningAreaSize*2-settings.spawningAreaSize),
                                        particle.position.y+(Math.random()*settings.spawningAreaSize*2-settings.spawningAreaSize),
                                        particle.position.z+(Math.random()*settings.spawningAreaSize*2-settings.spawningAreaSize));
                                    normalizePosition(childParticle);
                                    pleb = new POPULLUTION.pleb();
                                    pleb.particle = particleIndex;
//                                    pleb.generation = POPULLUTION.plebs[pCount].generation+1;
                                    pleb.generation = plebOne.generation+1;
                                    p=pleb.generation;
                                    pRed = (p%colorWrap+1)/colorWrap;
                                    pGreen = (colorWrap-(p%colorWrap))/colorWrap;
                                    pYellow = (p%30)/30;
                                    colors[ particleIndex ].setRGB( pRed, pGreen, pYellow);
                                    POPULLUTION.plebs.push(pleb);
                                }
                        }
                    }

                }
            }
        }
        
    }
        
        particleSystem.geometry. __dirtyVertices = true;
        particleSystem.geometry. __dirtyColors = true;
        $('#census').text(POPULLUTION.plebs.length);
        
//        particleSystem.geometry.computeFiniteBoundingSphere();
//        if(cellcube.size < particleSystem.geometry.finiteBoundingSphere.radius) {
//            settings.run = false;
//            $('#message').text("outbreak!");
//        }
//        $('#stats').text(Math.ceil(particleSystem.geometry.finiteBoundingSphere.radius));
    }

    requestAnimationFrame( animate );
    render();

}

function render() {
    renderer.clear();
    renderer.render( scene, camera );

}


