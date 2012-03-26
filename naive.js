//            if(exhausted[pCount])
//                continue;

            //collision detection
//            for(cellIndex in cellcube.activeCells)  {
//                console.log(cellcueb.activeCells[cellIndex]);
//            }
//            while(pcCount--) {
//                if(pCount == pcCount || exhausted[pcCount])
//                    continue;
//                collisionCandidate = particles.vertices[POPULLUTION.plebs[pcCount].particle];
//                var distance = particle.position.distanceTo(collisionCandidate.position);
//                if(distance <1)  {
////                       console.log("collision: ",pCount,pcCount,distance);
//                    if(POPULLUTION.plebs[pCount].spawns > 0 && POPULLUTION.plebs[pcCount].spawns > 0)   {
//                        POPULLUTION.plebs[pCount].spawns--;
//                        POPULLUTION.plebs[pcCount].spawns--;
//                        exhausted[pCount] = true    ;
//                        exhausted[pcCount] = true;  
//                        particleIndex = Pool.get();
//                        childParticle = particles.vertices[particleIndex];
//                        childParticle.position.set(
//                            particle.position.x+(Math.random()*settings.spawningAreaSize*2-settings.spawningAreaSize),
//                            particle.position.y+(Math.random()*settings.spawningAreaSize*2-settings.spawningAreaSize),
//                            particle.position.z+(Math.random()*settings.spawningAreaSize*2-settings.spawningAreaSize));
//                        pleb = new POPULLUTION.pleb();
//                        pleb.particle = particleIndex;
//                        pleb.generation = POPULLUTION.plebs[pCount].generation+1;
//                        p=pleb.generation;
//                        pRed = (p%colorWrap+1)/colorWrap;
//                        pGreen = (colorWrap-(p%colorWrap))/colorWrap;
//                        pYellow = (p%30)/30;
//                        colors[ particleIndex ].setRGB( pRed, pGreen, pYellow);
////                            console.log(pRed,pGreen,pYellow);
//                        POPULLUTION.plebs.push(pleb);
//                    }
//                }
//            }